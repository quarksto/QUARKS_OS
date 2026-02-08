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
                return await this.createDraft(
                    payload.leadId || payload.lead?.id,
                    payload.calculation,
                    payload.kitId || payload.kit?.id,
                    payload.customItems,
                    payload.pricing,
                    payload.introduction,
                    payload.notes,
                    payload.paymentTerms,
                    payload.creatorId || payload.creator?.id
                );
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

    // ========== Logic ==========

    /**
     * Calculates the full pricing breakdown for a proposal.
     * @param {Object} params
     * @param {string} params.leadId - To get state/city
     * @param {string} params.kitId - If using a standard kit
     * @param {Array} params.customItems - If building a custom kit { productId, quantity }
     * @param {number} params.systemSizeKwp - Required for rule matching
     */
    async calculateProposalCosts({ leadId, kitId, customItems, systemSizeKwp }) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) throw new Error('Lead not found');

        const state = lead.state || 'SP'; // Default to SP if missing

        // 1. Calculate Equipment Cost (Kit or Items)
        let equipmentCost = 0;
        let items = [];

        if (kitId) {
            const kit = await prisma.kit.findUnique({
                where: { id: kitId },
                include: { items: { include: { product: true } } }
            });
            if (kit) {
                items = kit.items.map(i => ({
                    productId: i.productId,
                    name: i.product.name,
                    quantity: i.quantity,
                    unitCost: i.product.costPrice,
                    totalCost: i.product.costPrice * i.quantity
                }));
            }
        } else if (customItems && customItems.length > 0) {
            // Fetch products
            for (const item of customItems) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (product) {
                    items.push({
                        productId: product.id,
                        name: product.name,
                        quantity: item.quantity,
                        unitCost: product.costPrice,
                        totalCost: product.costPrice * item.quantity
                    });
                }
            }
        }

        equipmentCost = items.reduce((sum, i) => sum + i.totalCost, 0);

        // 2. Fetch Services & Calculate Service Costs
        let servicesCost = 0;
        const serviceBreakdown = [];

        // Get all active services
        const services = await prisma.service.findMany({
            where: { active: true },
            include: { prices: true } // Include prices to find matches
        });

        // Helper to find best price match
        const findPrice = (service) => {
            // Priority: State match > National match
            const statePrice = service.prices.find(p => p.state === state && p.active);
            const nationalPrice = service.prices.find(p => p.state === null && p.active);
            const priceRule = statePrice || nationalPrice;

            if (!priceRule) return null;

            // Calculate value based on type
            let cost = 0;
            switch (priceRule.priceType) {
                case 'FIXED': cost = priceRule.priceValue; break;
                case 'PER_WATT': cost = priceRule.priceValue * (systemSizeKwp * 1000); break; // $/Wp * Watts
                case 'PERCENT': cost = equipmentCost * (priceRule.priceValue / 100); break;
                // PER_KM would need distance calculation, ignoring for now or using default
                default: cost = 0;
            }
            return { cost, rule: priceRule };
        };

        for (const service of services) {
            const match = findPrice(service);
            if (match && match.cost > 0) {
                servicesCost += match.cost;
                serviceBreakdown.push({
                    serviceId: service.id,
                    name: service.name,
                    cost: match.cost,
                    type: match.rule.priceType
                });
            }
        }

        // 3. Find Pricing Rule (Margin & Tax)
        // Using existing logic from PricingDomain logic basically
        // We find the rule that fits the power range
        const pricingRule = await prisma.pricingRule.findFirst({
            where: {
                minPower: { lte: systemSizeKwp },
                maxPower: { gte: systemSizeKwp },
                active: true
            },
            orderBy: { minPower: 'desc' } // Get most specific
        });

        const targetMargin = pricingRule ? pricingRule.targetMargin : 0.20; // Default 20%
        const taxRate = pricingRule ? pricingRule.taxRate : 0.15; // Default 15%

        // 4. Final Calculation
        // Price = (Cost) / (1 - Margin - Tax)  <-- Simplified Markup Model
        // OR Price = Cost * (1 + Margin) * (1 + Tax) 
        // Let's use the robust "Divisor" model for Target Margin
        // Revenue = Cost / (1 - Margin - Tax)
        // Caution: If Margin + Tax >= 1, this breaks. 
        // Let's use a safer Markup model if denominator constitutes risk, 
        // but typically Margin is Profit Margin on GROSS sale.

        const totalCost = equipmentCost + servicesCost;
        let finalPrice = 0;

        // Safety check
        if ((targetMargin + taxRate) >= 0.9) {
            finalPrice = totalCost * 1.5; // Fallback markup
        } else {
            finalPrice = totalCost / (1 - (targetMargin + taxRate));
        }

        return {
            equipmentCost,
            servicesCost,
            totalCost,
            targetMargin,
            taxRate,
            finalPrice,
            items,
            services: serviceBreakdown,
            pricingRuleName: pricingRule?.name || 'Default'
        };
    }

    async createDraft(leadId, calculation, kitId, customItems, pricing, introduction, notes, paymentTerms, creatorId) {
        // Re-calculate based on Kit/Items to ensure data integrity
        let systemSizeKwp = calculation.systemSizeKwp || calculation.system_size || 5.0;
        let kitName = 'Custom System';

        if (kitId) {
            const kit = await prisma.kit.findUnique({ where: { id: kitId } });
            if (kit) {
                kitName = kit.name;
            }
        }

        // Perform Dynamic Pricing
        const pricingDetails = await this.calculateProposalCosts({
            leadId,
            kitId,
            customItems,
            systemSizeKwp
        });

        // Create Proposal record with the calculated results
        return await prisma.proposal.create({
            data: {
                leadId,
                kitId,
                title: `Proposta - ${kitName}`,
                status: 'DRAFT',

                // System Specs
                systemSizeKwp: parseFloat(systemSizeKwp),
                generationKwh: parseFloat(calculation.estimated_generation || calculation.generationMonthly || 0),
                savingsMonthly: parseFloat(calculation.monthly_savings || 0),

                // Stores the full financial breakdown (BOM)
                pricingDetails: pricingDetails,

                // Base Financials
                totalPrice: pricingDetails.finalPrice,

                // Text fields
                introduction: introduction,
                notes: notes,
                paymentTerms: paymentTerms,

                expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
                publicSlug: require('crypto').randomBytes(12).toString('base64url'),
                creatorId: creatorId || 'system'
            }
        });
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
            throw new Error('Failed to generate proposal preview', { cause: error });
        }
    }
}

module.exports = new ProposalDomainAgent();
