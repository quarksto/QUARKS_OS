const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const broadcaster = require('../../services/realtime/broadcaster');

function getLeadPotential(lead) {
    if (typeof lead.value === 'number') return lead.value;
    const consumption = typeof lead.consumption === 'number' ? lead.consumption : 0;
    return consumption * 4.5;
}

// --- Scoring Logic ---

function getLeadScore(lead) {
    let score = 0;

    // 1. Basic Info (Max 30)
    if (lead.name) score += 10;
    if (lead.phone) score += 10;
    if (lead.email) score += 10;

    // 2. Location & Bill (Max 40)
    if (lead.location || lead.cep) score += 10;
    if (lead.consumption && lead.consumption > 0) score += 10;
    if (lead.distributor) score += 5;
    if (lead.fullAddress) score += 5;
    if (lead.connectionType) score += 5;
    if (lead.roofType) score += 5;

    // 3. System Engagement (Max 30)
    // We check if lead has proposals or interactions (needs full lead object)
    if (lead.proposals && lead.proposals.length > 0) score += 20;
    if (lead.origin) score += 10;

    return Math.min(100, score);
}

function getTemperature(lead) {
    const score = getLeadScore(lead);
    const status = lead.status || 'NEW';

    // Temperature Logic based on Score + Status
    if (status === 'CLOSED_WON') return { label: 'Vendido', color: 'green' };
    if (status === 'CLOSED_LOST') return { label: 'Perdido', color: 'gray' };

    if (score >= 80 || status === 'NEGOTIATION') return { label: 'Quente', color: 'red' };
    if (score >= 50 || status === 'PROPOSAL_SENT') return { label: 'Morno', color: 'orange' };

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

        const currentLead = await prisma.lead.findUnique({ where: { id: leadId } });

        // Promotion Logic
        if (newStatus === 'CLOSED_WON' && currentLead.status !== 'CLOSED_WON') {
            await this.promoteToClient(leadId, currentLead);
        }

        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { status: newStatus },
        });
        const enriched = enrichLead(lead);
        broadcaster.broadcastLeadUpdate(leadId, enriched);
        return enriched;
    }

    async promoteToClient(leadId, leadData) {
        console.log(`[LeadDomain] Promoting Lead ${leadId} to Client...`);
        try {
            // 1. Check if Client exists (by Email first, assuming Document checks later)
            let client = null;
            if (leadData.email) {
                client = await prisma.client.findUnique({ where: { email: leadData.email } });
            }

            if (!client) {
                // 2. Create Client
                client = await prisma.client.create({
                    data: {
                        name: leadData.name,
                        email: leadData.email,
                        phone: leadData.phone,
                        address: leadData.fullAddress || leadData.location,
                        type: 'PF' // Default
                    }
                });
                console.log(`[LeadDomain] Created New Client: ${client.id}`);
            } else {
                console.log(`[LeadDomain] Found Existing Client: ${client.id}`);
            }

            // 3. Link Lead to Client
            await prisma.lead.update({
                where: { id: leadId },
                data: { clientId: client.id }
            });

            // 4. Create Project automatically if not exists
            const existingProject = await prisma.project.findFirst({ where: { leadId } });
            if (!existingProject) {
                await prisma.project.create({
                    data: {
                        name: `Projeto Solar - ${client.name}`,
                        status: 'PLANNED',
                        leadId: leadId,
                        clientId: client.id
                    }
                });
                console.log(`[LeadDomain] Auto-created Project for Client: ${client.name}`);
            }
        } catch (error) {
            console.error("[LeadDomain] Error promoting to client:", error);
            // Non-blocking error
        }
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
