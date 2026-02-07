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

module.exports = router;
