const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const broadcaster = require('../../services/realtime/broadcaster');

function getLeadPotential(lead) {
    if (typeof lead.value === 'number') return lead.value;
    const consumption = typeof lead.consumption === 'number' ? lead.consumption : 0;
    return consumption * 4.5;
}

function getLeadScore(lead) {
    const base = typeof lead.consumption === 'number' ? lead.consumption : 0;
    return Math.min(100, Math.max(45, Math.round((base / 150) + 50)));
}

function getTemperature(lead) {
    const score = getLeadScore(lead);
    if (score >= 85) return { label: 'Quente', color: 'green' };
    if (score >= 65) return { label: 'Morno', color: 'orange' };
    return { label: 'Frio', color: 'blue' };
}

function enrichLead(lead) {
    return {
        ...lead,
        score: getLeadScore(lead),
        potential: getLeadPotential(lead),
        temperature: getTemperature(lead),
        unreadCount: lead._count?.messages || 0,
    };
}

class LeadDomainAgent extends BaseDomainAgent {
    constructor() {
        super('lead');
    }

    async execute(action, payload) {
        console.log(`[LeadDomain] Received action: ${action}`);

        switch (action) {
            case 'GET_LEAD':
                return await this.getLead(payload.id);
            case 'GET_LEAD_FULL':
                return await this.getLeadFull(payload.id);
            case 'CREATE_LEAD':
                return await this.createLead(payload);
            case 'GET_PIPELINE':
                return await this.getPipeline();
            case 'UPDATE_STATUS':
                return await this.updateStatus(payload.leadId, payload.newStatus);
            case 'UPDATE_LEAD':
                return await this.updateLead(payload.id, payload.data);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async updateLead(id, data) {
        const allowed = ['name', 'email', 'phone', 'consumption', 'location', 'distributor', 'status', 'origin', 'cep', 'fullAddress', 'roofType', 'connectionType'];
        const safe = {};
        for (const k of allowed) {
            if (data[k] !== undefined) safe[k] = data[k];
        }
        const lead = await prisma.lead.update({
            where: { id },
            data: safe,
        });
        const enriched = enrichLead(lead);
        broadcaster.broadcastLeadUpdate(id, enriched);
        return enriched;
    }

    async updateStatus(leadId, newStatus) {
        const valid = ['NEW', 'CONTACTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
        if (!valid.includes(newStatus)) throw new Error(`Invalid status: ${newStatus}`);
        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { status: newStatus },
        });
        const enriched = enrichLead(lead);
        broadcaster.broadcastLeadUpdate(leadId, enriched);
        return enriched;
    }

    async getLead(id) {
        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) throw new Error(`Lead not found: ${id}`);
        return lead;
    }

    async getLeadFull(id) {
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: { proposals: { orderBy: { updatedAt: 'desc' } } },
        });
        if (!lead) return null;
        const enriched = enrichLead(lead);
        return {
            ...enriched,
            proposals: lead.proposals,
        };
    }

    /** Campos permitidos no schema Lead (Prisma) — evita erros por campos extras do webhook */
    static get leadSchemaFields() {
        return ['name', 'email', 'phone', 'consumption', 'location', 'distributor', 'status', 'origin', 'cep', 'fullAddress', 'roofType', 'connectionType', 'ownerId'];
    }

    async createLead(data) {
        const { ownerId, ...rest } = data;
        let finalOwnerId = ownerId;
        if (!finalOwnerId) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) finalOwnerId = firstUser.id;
        }
        if (!finalOwnerId) throw new Error('No owner: create a User first (seed or register)');
        const allowed = LeadDomainAgent.leadSchemaFields.filter(f => f !== 'ownerId');
        const safe = { ownerId: finalOwnerId };
        for (const k of allowed) {
            if (rest[k] !== undefined) safe[k] = rest[k];
        }
        if (typeof safe.consumption !== 'number' || safe.consumption <= 0) {
            safe.consumption = 500;
        }
        const lead = await prisma.lead.create({
            data: safe,
        });
        const enriched = enrichLead(lead);
        broadcaster.broadcastLeadCreated(enriched);
        return enriched;
    }

    async getPipeline() {
        const leads = await prisma.lead.findMany({
            include: {
                _count: {
                    select: {
                        messages: {
                            where: { isRead: false }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group explicitly for Kanban columns
        const pipeline = {
            'NEW': [],       // Triagem
            'CONTACTED': [], // Qualificação
            'PROPOSAL_SENT': [], // Proposta
            'NEGOTIATION': [],   // Negociação
            'CLOSED_WON': [],    // Fechado
            'CLOSED_LOST': []
        };

        leads.forEach(lead => {
            const enriched = enrichLead(lead);
            if (pipeline[lead.status]) {
                pipeline[lead.status].push(enriched);
            } else {
                if (!pipeline['NEW']) pipeline['NEW'] = [];
                pipeline['NEW'].push(enriched);
            }
        });

        return pipeline;
    }
}

module.exports = new LeadDomainAgent();
