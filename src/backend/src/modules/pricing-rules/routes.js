/**
 * PricingRule Routes - CRUD de Regras de Precificação
 */

const express = require('express');
const router = express.Router();
const { maestro } = require('../../orchestrator/maestro');
const { authenticate, authorize } = require('../../middleware/auth');

// Agent Name: 'pricing'

// GET /api/pricing-rules
router.get('/', async (req, res) => {
    try {
        const rules = await maestro.agents['pricing'].execute('LIST_RULES', req.query);
        res.json(rules);
    } catch (error) {
        console.error('[PricingRules] Error listing rules:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/pricing-rules/match
router.get('/match', async (req, res) => {
    try {
        const rule = await maestro.agents['pricing'].execute('FIND_RULE', req.query);
        if (!rule) {
            return res.status(404).json({
                error: 'No matching pricing rule found',
                fallback: { targetMargin: 0.20, taxRate: 0.12 }
            });
        }
        res.json(rule);
    } catch (error) {
        console.error('[PricingRules] Error matching rule:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/pricing-rules/:id
router.get('/:id', async (req, res) => {
    try {
        // Since the agent might not have GET_RULE explicitly, we can assume LIST_RULES with filter or check agent code.
        // Checking agent code in previous step... it ONLY had LIST_RULES, FIND_RULE, CREATE... 
        // Wait, did it have GET_RULE? 
        // Step 1074: execute switch had: CREATE_RULE, UPDATE_RULE, DELETE_RULE, LIST_RULES...
        // It did NOT have GET_RULE. I should fix the agent too or just use LIST_RULES filtering here?
        // Better to add GET_RULE to agent. For now I'll assume I can add it or use Prisma directly? 
        // No, I should fix the agent. But let's check if the agent *actually* had it and I missed it.
        // Step 1074 lines 14-26: CALCULATE_PRICE, FIND_RULE, LIST_RULES, CREATE_RULE, UPDATE_RULE, DELETE_RULE.
        // No GET_RULE.
        // I will add GET_RULE to the agent in the next step.
        // For now, I'll write the route assuming it will exist.
        const rule = await maestro.agents['pricing'].execute('GET_RULE', { id: req.params.id });
        res.json(rule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/pricing-rules (ADMIN)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const rule = await maestro.agents['pricing'].execute('CREATE_RULE', req.body);
        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /api/pricing-rules/:id (ADMIN)
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const rule = await maestro.agents['pricing'].execute('UPDATE_RULE', {
            id: req.params.id,
            data: req.body
        });
        res.json(rule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/pricing-rules/:id (ADMIN)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        await maestro.agents['pricing'].execute('DELETE_RULE', { id: req.params.id });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
