const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalyticsDomainAgent {
    constructor() {
        this._ai = null;
        this.name = 'analytics';
    }

    get ai() {
        if (this._ai) return this._ai;
        if (!process.env.GOOGLE_API_KEY) return null;
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        this._ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        return this._ai;
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
            case 'GET_ENERGY_BALANCE':
                return await this.getEnergyBalance();
            case 'GET_INSIGHT':
                return await this.getInsight(payload);
            case 'GET_INSIGHT_LLM':
                return await this.getInsightLLM(payload);
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

        // Deltas: Period over Period (Month over Month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const [leadsThisMonth, leadsLastMonth] = await Promise.all([
            prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.lead.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } })
        ]);

        const leadsDelta = leadsLastMonth > 0 ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100) : 0;

        const [wonThisMonth, wonLastMonth] = await Promise.all([
            prisma.proposal.aggregate({
                _sum: { totalPrice: true },
                where: { status: 'ACCEPTED', updatedAt: { gte: startOfMonth } }
            }),
            prisma.proposal.aggregate({
                _sum: { totalPrice: true },
                where: { status: 'ACCEPTED', updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
            })
        ]);

        const revThis = wonThisMonth._sum.totalPrice || 0;
        const revLast = wonLastMonth._sum.totalPrice || 0;
        const revenueDelta = revLast > 0 ? Math.round(((revThis - revLast) / revLast) * 100) : 0;

        const deltas = {
            leads: `${leadsDelta > 0 ? '+' : ''}${leadsDelta}%`,
            conversion: null,
            revenue: `${revenueDelta > 0 ? '+' : ''}${revenueDelta}%`
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

        return {
            leads: n,
            visita: c,
            proposta: p,
            contrato: neg,
            instalacao: w
        };
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
                text: `Proposta: ${p.title} - ${p.lead?.name || 'Cliente N/A'}`,
                timestamp: p.updatedAt,
                status: p.status
            })),
            ...recentLeads.map(l => ({
                id: l.id,
                type: 'NEW',
                text: `Novo Lead: ${l.name}`,
                timestamp: l.createdAt,
                status: l.status
            }))
        ];

        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
    }

    async getLeadActivity(leadId) {
        if (!leadId) throw new Error('Lead ID required');

        const proposals = await prisma.proposal.findMany({
            where: { leadId },
            orderBy: { updatedAt: 'desc' }
        });

        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        const activity = [];

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

    async getEnergyBalance() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const closedLeads = await prisma.lead.findMany({
            where: {
                status: 'CLOSED_WON',
                updatedAt: { gte: sixMonthsAgo }
            },
            include: {
                proposals: {
                    where: { status: 'ACCEPTED' },
                    orderBy: { updatedAt: 'desc' },
                    take: 1
                }
            }
        });

        const balance = {};
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${months[d.getMonth()]}`;
            balance[key] = { month: key, consumption: 0, generation: 0 };
        }

        closedLeads.forEach(lead => {
            const date = new Date(lead.updatedAt);
            const key = `${months[date.getMonth()]}`;

            if (balance[key]) {
                balance[key].consumption += Math.round(lead.consumption || 0);
                const proposal = lead.proposals[0];
                if (proposal) {
                    balance[key].generation += Math.round(proposal.generationKwh || 0);
                }
            }
        });

        return Object.values(balance);
    }

    async getInsight() {
        const metrics = await this.getDashboardMetrics();
        const conv = parseFloat(String(metrics.conversionRate).replace('%', '')) || 0;
        const leads = metrics.activeLeads || 0;
        const proposals = metrics.proposalsSent || 0;
        const leadsDelta = metrics.deltas?.leads ? parseFloat(metrics.deltas.leads.replace('%', '')) : 0;
        const revDelta = metrics.deltas?.revenue ? parseFloat(metrics.deltas.revenue.replace('%', '')) : 0;

        if (leads === 0 && proposals === 0) {
            return 'Comece criando leads e propostas para ver insights personalizados.';
        }
        if (conv >= 15 && revDelta > 0) {
            return `Ótima performance! Taxa de conversão em ${metrics.conversionRate} e receita subiu ${metrics.deltas?.revenue || ''}. Continue assim.`;
        }
        if (leadsDelta > 0 && leads > 5) {
            return `Leads cresceram ${metrics.deltas?.leads || ''} este mês. Foco em qualificar e converter os mais quentes.`;
        }
        if (proposals > 0 && conv < 10) {
            return `Você tem ${proposals} propostas em andamento. Aproveite para follow-up e aumentar a taxa de conversão.`;
        }
        if (leads > 0) {
            return `Você tem ${leads} leads ativos. Dê prioridade aos de maior consumo ou com CEP preenchido.`;
        }
        return 'Monitore suas métricas e use o Copilot para dimensionar propostas e tirar dúvidas técnicas.';
    }

    async getInsightLLM() {
        const fallback = await this.getInsight();
        if (!this.ai) return fallback;

        try {
            const metrics = await this.getDashboardMetrics();
            const prompt = `Você é um assistente de dashboards de vendas solares. Com base nestas métricas, escreva UMA frase curta e acionável em português (máx. 80 caracteres) para a barra de insight:
- Leads ativos: ${metrics.activeLeads}
- Propostas enviadas: ${metrics.proposalsSent}
- Taxa de conversão: ${metrics.conversionRate}
- Receita pipeline: ${metrics.revenue}
- Variação MoM leads: ${metrics.deltas?.leads || '-'}
- Variação MoM receita: ${metrics.deltas?.revenue || '-'}
Responda apenas a frase, sem aspas nem explicações.`;
            const model = this.ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            if (text && text.length > 0) return text;
        } catch (err) {
            console.warn('[Analytics] getInsightLLM failed, using rules:', err.message);
        }
        return fallback;
    }
}

module.exports = AnalyticsDomainAgent;
