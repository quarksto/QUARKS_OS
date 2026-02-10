const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { maestro } = require('../../orchestrator/maestro');
const { authenticate } = require('../../middleware/auth');

const prisma = new PrismaClient();

// GET /api/leads - List leads (optional status filter, e.g. status=CLOSED_WON for clients)
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        const where = {};
        if (status) where.status = status;
        if (req.user.role !== 'ADMIN') where.ownerId = req.user.id;
        const leads = await prisma.lead.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            take: Math.min(parseInt(limit, 10) || 100, 200),
            include: { proposals: { take: 1, orderBy: { createdAt: 'desc' } } }
        });
        res.json(leads);
    } catch (error) {
        console.error('List Leads Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/pipeline
router.get('/pipeline', async (req, res) => {
    try {
        const agent = maestro.agents['lead'];
        if (!agent) throw new Error('Lead Agent not initialized');

        const pipeline = await agent.execute('GET_PIPELINE', {});
        res.json(pipeline);
    } catch (error) {
        console.error('Pipeline Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/leads - Create new lead
router.post('/', async (req, res) => {
    try {
        const agent = maestro.agents['lead'];
        if (!agent) throw new Error('Lead Agent not initialized');

        const result = await agent.execute('CREATE_LEAD', req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Create Lead Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/leads/:id - Update lead (qualification fields, etc.)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = maestro.agents['lead'];
        if (!agent) throw new Error('Lead Agent not initialized');

        const result = await agent.execute('UPDATE_LEAD', { id, data: req.body });
        res.json(result);
    } catch (error) {
        console.error('Update Lead Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/leads/:id/status - Update lead status (Kanban Drag)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const agent = maestro.agents['lead'];
        if (!agent) throw new Error('Lead Agent not initialized');

        const result = await agent.execute('UPDATE_STATUS', { leadId: id, newStatus: status });
        res.json(result);
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/:id/solar - Solar insights (Google Solar API ou estimativa por consumo)
router.get('/:id/solar', async (req, res) => {
    try {
        const { id } = req.params;
        const leadAgent = maestro.agents['lead'];
        if (!leadAgent) throw new Error('Lead Agent not initialized');

        const lead = await leadAgent.execute('GET_LEAD', { id });
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        const solarService = require('../../services/solarService');
        const insights = await solarService.getLeadSolarInsights(lead);

        if (!insights) return res.status(404).json({ error: 'Insufficient data for solar estimate' });

        res.json(insights);
    } catch (error) {
        console.error('Solar Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/:id/activity - Get timeline for specific lead (must be before /:id)
router.get('/:id/activity', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = maestro.agents['analytics']; // Use Analytics agent for timeline agg
        if (!agent) throw new Error('Analytics Agent not initialized');

        const activity = await agent.execute('GET_LEAD_ACTIVITY', { leadId: id });
        res.json(activity);
    } catch (error) {
        console.error('Lead Activity Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/:id - Full lead detail (enriched + proposals + activity)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const leadAgent = maestro.agents['lead'];
        const analyticsAgent = maestro.agents['analytics'];
        if (!leadAgent || !analyticsAgent) throw new Error('Agents not initialized');

        const lead = await leadAgent.execute('GET_LEAD_FULL', { id });
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        const activity = await analyticsAgent.execute('GET_LEAD_ACTIVITY', { leadId: id });
        res.json({ ...lead, activity });
    } catch (error) {
        console.error('Lead Detail Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
