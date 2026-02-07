const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalyticsDomainAgent {
    constructor() {
        this.name = 'analytics';
    }

    async execute(action, payload) {
        switch (action) {
            case 'GET_DASHBOARD_METRICS':
                return await this.getDashboardMetrics(payload);
            case 'GET_SALES_FUNNEL':
                return await this.getSalesFunnel(payload);
            case 'GET_RECENT_ACTIVITY':
                return await this.getRecentActivity(payload);
            case 'GET_LEAD_ACTIVITY':
                return await this.getLeadActivity(payload.leadId);
            default:
                throw new Error(`Analytics Action ${action} not supported`);
        }
    }

    async getDashboardMetrics() {
        // 1. Leads Ativos (Not Closed)
        const activeLeadsCount = await prisma.lead.count({
            where: {
                status: {
                    in: ['NEW', 'CONTACTED', 'PROPOSAL_SENT', 'NEGOTIATION']
                }
            }
        });

        // 2. Propostas Enviadas
        const proposalsSentCount = await prisma.proposal.count({
            where: {
                status: { in: ['SENT', 'VIEWED', 'ACCEPTED'] }
            }
        });

        // 3. Taxa de Conversão (Won / Total Closed)
        const wonLeads = await prisma.lead.count({ where: { status: 'CLOSED_WON' } });
        const lostLeads = await prisma.lead.count({ where: { status: 'CLOSED_LOST' } });
        const totalClosed = wonLeads + lostLeads;
        const conversionRate = totalClosed > 0 ? ((wonLeads / totalClosed) * 100).toFixed(1) : 0;

        // 4. Receita Estimada (Pipeline Value)
        const pipelineProposals = await prisma.proposal.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                status: { in: ['SENT', 'VIEWED'] },
                lead: {
                    status: { in: ['PROPOSAL_SENT', 'NEGOTIATION'] }
                }
            }
        });

        const revenue = pipelineProposals._sum.totalPrice || 0;

        // Formatter for Currency
        const fmtRevenue = new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', maximumFractionDigits: 0
        }).format(revenue);

        // Goals (configurable via env or defaults for POC)
        const leadGoal = parseInt(process.env.DASHBOARD_LEAD_GOAL || '150', 10);
        const conversionGoal = parseFloat(process.env.DASHBOARD_CONVERSION_GOAL || '15');
        const revenueGoal = parseInt(process.env.DASHBOARD_REVENUE_GOAL || '2000000', 10);
        const goals = {
            leads: leadGoal,
            conversion: conversionGoal,
            revenue: revenueGoal
        };

        // Deltas: optional period-over-period (placeholder when no history)
        const deltas = {
            leads: null,
            conversion: null,
            revenue: null
        };

        return {
            activeLeads: activeLeadsCount,
            proposalsSent: proposalsSentCount,
            conversionRate: `${conversionRate}%`,
            revenue: fmtRevenue,
            revenueRaw: revenue,
            automations: "1.8k",
            goals,
            deltas
        };
    }

    async getSalesFunnel() {
        const [n, c, p, neg, w] = await Promise.all([
            prisma.lead.count({ where: { status: 'NEW' } }),
            prisma.lead.count({ where: { status: 'CONTACTED' } }),
            prisma.lead.count({ where: { status: 'PROPOSAL_SENT' } }),
            prisma.lead.count({ where: { status: 'NEGOTIATION' } }),
            prisma.lead.count({ where: { status: 'CLOSED_WON' } })
        ]);

        return [
            { name: 'Novos', value: n, fill: '#3b82f6' },
            { name: 'Contatados', value: c, fill: '#f59e0b' },
            { name: 'Proposta', value: p, fill: '#8b5cf6' },
            { name: 'Negociação', value: neg, fill: '#ec4899' },
            { name: 'Fechado', value: w, fill: '#10b981' }
        ];
    }

    async getRecentActivity() {
        const recentProposals = await prisma.proposal.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            include: { lead: { select: { name: true } } }
        });

        const recentLeads = await prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        const activities = [
            ...recentProposals.map(p => ({
                id: p.id,
                type: 'PROPOSAL',
                title: `Proposta: ${p.title}`,
                description: `Cliente: ${p.lead?.name || 'N/A'} - Valor: R$ ${p.totalPrice}`,
                date: p.updatedAt,
                status: p.status
            })),
            ...recentLeads.map(l => ({
                id: l.id,
                type: 'LEAD',
                title: `Novo Lead: ${l.name}`,
                description: `Consumo: ${l.consumption} kWh - ${l.location || 'N/A'}`,
                date: l.createdAt,
                status: l.status
            }))
        ];

        return activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
    }

    async getLeadActivity(leadId) {
        if (!leadId) throw new Error('Lead ID required');

        // 1. Fetch Proposals for this lead
        const proposals = await prisma.proposal.findMany({
            where: { leadId },
            orderBy: { updatedAt: 'desc' }
        });

        // 2. Fetch Lead creation event
        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        const activity = [];

        // Lead Created Event
        if (lead) {
            activity.push({
                id: `created-${lead.id}`,
                type: 'LEAD_CREATED',
                title: 'Lead Criado',
                description: 'Importado ou Cadastrado Manualmente',
                date: lead.createdAt,
                icon: 'person_add',
                color: 'gray'
            });
        }

        // Proposal Events
        proposals.forEach(p => {
            activity.push({
                id: `prop-created-${p.id}`,
                type: 'PROPOSAL_CREATED',
                title: 'Proposta Gerada',
                description: `Proposta ${p.title} criada (R$ ${p.totalPrice})`,
                date: p.createdAt,
                icon: 'description',
                color: 'blue'
            });

            if (p.status === 'SENT' || p.status === 'VIEWED' || p.status === 'ACCEPTED') {
                // Logic could be more granular with audit logs, but using p.status for now
                activity.push({
                    id: `prop-status-${p.id}`,
                    type: 'PROPOSAL_UPDATE',
                    title: `Proposta ${p.status}`,
                    description: `Status atualizado para ${p.status}`,
                    date: p.updatedAt,
                    icon: 'send',
                    color: 'solar'
                });
            }
        });

        return activity.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

module.exports = AnalyticsDomainAgent;
