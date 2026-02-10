const express = require('express');
const router = express.Router();
const { maestro } = require('../../orchestrator/maestro');

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const agent = maestro.agents['analytics'];
        if (!agent) throw new Error('Analytics Agent not initialized');

        const metrics = await agent.execute('GET_DASHBOARD_METRICS', {});
        res.json(metrics);
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/funnel
router.get('/funnel', async (req, res) => {
    try {
        const agent = maestro.agents['analytics'];
        if (!agent) throw new Error('Analytics Agent not initialized');

        const funnel = await agent.execute('GET_SALES_FUNNEL', {});
        res.json(funnel);
    } catch (error) {
        console.error('Funnel Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/activity
router.get('/activity', async (req, res) => {
    try {
        const agent = maestro.agents['analytics'];
        if (!agent) throw new Error('Analytics Agent not initialized');

        const activity = await agent.execute('GET_RECENT_ACTIVITY', {});
        res.json(activity);
    } catch (error) {
        console.error('Activity Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/energy-balance
router.get('/energy-balance', async (req, res) => {
    try {
        const agent = maestro.agents['analytics'];
        if (!agent) throw new Error('Analytics Agent not initialized');

        const balance = await agent.execute('GET_ENERGY_BALANCE', {});
        res.json(balance);
    } catch (error) {
        console.error('Energy Balance Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/insight - Mensagem contextual para InsightBar (LLM quando disponível, regras como fallback)
router.get('/insight', async (req, res) => {
    try {
        const agent = maestro.agents['analytics'];
        if (!agent) throw new Error('Analytics Agent not initialized');

        const useLLM = req.query.llm !== 'false'; // ?llm=false para forçar regras
        const insight = useLLM
            ? await agent.execute('GET_INSIGHT_LLM', {})
            : await agent.execute('GET_INSIGHT', {});
        res.json({ insight });
    } catch (error) {
        console.error('Insight Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
