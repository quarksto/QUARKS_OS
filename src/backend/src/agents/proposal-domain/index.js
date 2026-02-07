const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const calcAgent = require('../calc-domain');

class ProposalDomainAgent extends BaseDomainAgent {
    constructor() {
        super('proposal');
    }

    async execute(action, payload) {
        console.log(`[ProposalDomain] Received action: ${action}`);

        switch (action) {
            // CRUD
            case 'CREATE_DRAFT':
                return await this.createDraft(payload.lead, payload.calculation, payload.kit, payload.pricing);
            case 'LIST_PROPOSALS':
                return await this.listProposals(payload);
            case 'GET_PROPOSAL':
                return await this.getProposal(payload.id);
            case 'UPDATE_PROPOSAL':
                return await this.updateProposal(payload.id, payload.data);
            case 'DELETE_PROPOSAL':
                return await this.deleteProposal(payload.id);

            // Workflow
            case 'SEND_PROPOSAL':
                return await this.sendProposal(payload.id);
            case 'MARK_AS_VIEWED':
                return await this.markAsViewed(payload.id);
            case 'ACCEPT_PROPOSAL':
                return await this.acceptProposal(payload.id);
            case 'REJECT_PROPOSAL':
                return await this.rejectProposal(payload.id, payload.reason);

            // Generation
            case 'GENERATE_PREVIEW':
                return await this.generatePreview(payload);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    // ========== CRUD ==========

    async listProposals({ leadId, status, creatorId, limit = 50 } = {}) {
        const where = {};
        if (leadId) where.leadId = leadId;
        if (status) where.status = status;
        if (creatorId) where.creatorId = creatorId;

        return await prisma.proposal.findMany({
            where,
            include: {
                lead: { select: { id: true, name: true, email: true } },
                kit: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getProposal(id) {
        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: {
                lead: true,
                kit: { include: { items: { include: { product: true } } } },
                creator: { select: { id: true, name: true, email: true } }
            }
        });
        if (!proposal) throw new Error(`Proposal not found: ${id}`);
        return proposal;
    }

    async updateProposal(id, data) {
        const allowed = ['title', 'totalPrice', 'discountPercent', 'discountAbsolute', 'notes', 'expiresAt', 'status'];
        const safe = {};

        for (const key of allowed) {
            if (data[key] !== undefined) {
                if (['totalPrice', 'discountPercent', 'discountAbsolute'].includes(key)) {
                    safe[key] = parseFloat(data[key]);
                } else if (key === 'expiresAt') {
                    safe[key] = new Date(data[key]);
                } else {
                    safe[key] = data[key];
                }
            }
        }

        // Incrementar versão se preço mudar
        if (safe.totalPrice || safe.discountPercent || safe.discountAbsolute) {
            safe.version = { increment: 1 };
        }

        return await prisma.proposal.update({
            where: { id },
            data: safe
        });
    }

    async deleteProposal(id) {
        // Soft delete via status
        return await prisma.proposal.update({
            where: { id },
            data: { status: 'EXPIRED' }
        });
    }

    // ========== Workflow ==========

    async sendProposal(id) {
        const proposal = await prisma.proposal.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date()
            }
        });
        console.log(`[ProposalDomain] Proposal ${id} sent`);
        // TODO: Send notification
        return proposal;
    }

    async markAsViewed(id) {
        return await prisma.proposal.update({
            where: { id },
            data: {
                status: 'VIEWED',
                viewedAt: new Date()
            }
        });
    }

    async acceptProposal(id) {
        const proposal = await prisma.proposal.update({
            where: { id },
            data: {
                status: 'ACCEPTED',
                acceptedAt: new Date()
            },
            include: { lead: true }
        });

        // Atualizar Lead para CLOSED_WON
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_WON' }
        });

        console.log(`[ProposalDomain] Proposal ${id} accepted, Lead ${proposal.leadId} closed won`);
        return proposal;
    }

    async rejectProposal(id, reason) {
        const proposal = await prisma.proposal.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date(),
                rejectionReason: reason || null
            },
            include: { lead: true }
        });

        // Atualizar Lead para CLOSED_LOST
        await prisma.lead.update({
            where: { id: proposal.leadId },
            data: { status: 'CLOSED_LOST' }
        });

        console.log(`[ProposalDomain] Proposal ${id} rejected`);
        return proposal;
    }

    // ========== Creation (existing) ==========

    async createDraft(lead, calculation, kit, pricing) {
        // 1. Determine Price
        let finalPrice = parseFloat(calculation.systemSizeKwp) * 3500;

        if (pricing && pricing.totalPrice) {
            finalPrice = pricing.totalPrice;
        } else if (kit) {
            finalPrice = kit.powerKwp * 3200;
        }

        // 2. Get Real Financials
        let financialData = { payback: 0, savings: 0 };
        try {
            const tariff = await calcAgent.getTariff(
                lead.distributor || 'CEMIG',
                lead.location ? lead.location.split('-')[1]?.trim() : 'MG',
                lead.consumption
            );
            const roi = await calcAgent.calculateROI(
                finalPrice,
                calculation.generationMonthly,
                tariff.price_kwh
            );
            financialData = {
                payback: roi.payback_years,
                savings: roi.monthly_savings
            };
        } catch (err) {
            console.warn('[ProposalDomain] Financial calc failed:', err.message);
            financialData = { payback: 4.5, savings: parseFloat(calculation.generationMonthly) * 0.95 };
        }

        // 3. Create proposal
        const proposal = await prisma.proposal.create({
            data: {
                title: `Proposta Solar - ${lead.name}`,
                generationKwh: parseFloat(calculation.generationMonthly),
                systemSizeKwp: parseFloat(calculation.systemSizeKwp),
                totalPrice: finalPrice,
                paybackYears: financialData.payback,
                savingsMonthly: financialData.savings,
                leadId: lead.id,
                creatorId: lead.ownerId,
                status: 'DRAFT',
                kitId: kit ? kit.id : undefined,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
            }
        });

        console.log(`[ProposalDomain] Created draft: ${proposal.id}`);
        return proposal;
    }

    // ========== Generation ==========

    async generatePreview(data) {
        try {
            console.log('[ProposalDomain] Requesting HTML from Python Engine...');
            const pythonUrl = process.env.PYTHON_ENGINE_URL || 'http://127.0.0.1:8000';
            const response = await axios.post(`${pythonUrl}/generate/proposal`, data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('[ProposalDomain] Error:', JSON.stringify(error.response.data));
            }
            console.error('[ProposalDomain] Engine Error:', error.message);
            throw new Error('Failed to generate proposal preview');
        }
    }
}

module.exports = new ProposalDomainAgent();
