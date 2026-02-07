/**
 * PricingRule Routes - CRUD de Regras de Precificação
 * 
 * Rotas:
 * - GET /api/pricing-rules - Listar regras (filtro por state, kWp)
 * - GET /api/pricing-rules/:id - Detalhe da regra
 * - POST /api/pricing-rules - Criar regra (ADMIN)
 * - PATCH /api/pricing-rules/:id - Atualizar regra (ADMIN)
 * - DELETE /api/pricing-rules/:id - Soft delete (ADMIN)
 * - GET /api/pricing-rules/match - Encontrar regra por state/kWp
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../../middleware/auth');

const prisma = new PrismaClient();

// GET /api/pricing-rules
router.get('/', async (req, res) => {
    try {
        const { active, minPower, maxPower } = req.query;

        const where = {};
        if (active !== undefined) {
            where.active = active !== 'false';
        }
        if (minPower) {
            where.minPower = { gte: parseFloat(minPower) };
        }
        if (maxPower) {
            where.maxPower = { lte: parseFloat(maxPower) };
        }

        const rules = await prisma.pricingRule.findMany({
            where,
            orderBy: [
                { minPower: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(rules);
    } catch (error) {
        console.error('[PricingRules] Error listing rules:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/pricing-rules/match - Encontrar regra que melhor se aplica
router.get('/match', async (req, res) => {
    try {
        const { state, kWp } = req.query;
        const power = kWp ? parseFloat(kWp) : 0;

        // Buscar regra que corresponde ao power range
        // Prioridade: regra com state específico > regra geral
        const rule = await prisma.pricingRule.findFirst({
            where: {
                active: true,
                minPower: { lte: power },
                maxPower: { gte: power }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!rule) {
            // Fallback: regra padrão (sem range específico)
            const defaultRule = await prisma.pricingRule.findFirst({
                where: { active: true },
                orderBy: { createdAt: 'desc' }
            });

            if (defaultRule) {
                return res.json({ ...defaultRule, isDefault: true });
            }

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
        const rule = await prisma.pricingRule.findUnique({
            where: { id: req.params.id }
        });

        if (!rule) {
            return res.status(404).json({ error: 'Pricing rule not found' });
        }

        res.json(rule);
    } catch (error) {
        console.error('[PricingRules] Error getting rule:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/pricing-rules (protected - ADMIN only)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const { name, minPower, maxPower, targetMargin, taxRate, state } = req.body;

        if (!name || targetMargin === undefined || taxRate === undefined) {
            return res.status(400).json({
                error: 'Missing required fields: name, targetMargin, taxRate'
            });
        }

        const rule = await prisma.pricingRule.create({
            data: {
                name,
                minPower: parseFloat(minPower) || 0,
                maxPower: parseFloat(maxPower) || 999,
                targetMargin: parseFloat(targetMargin),
                taxRate: parseFloat(taxRate),
                active: true
            }
        });

        res.status(201).json(rule);
    } catch (error) {
        console.error('[PricingRules] Error creating rule:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// PATCH /api/pricing-rules/:id (protected - ADMIN only)
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const allowed = ['name', 'minPower', 'maxPower', 'targetMargin', 'taxRate', 'active'];
        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                if (['minPower', 'maxPower', 'targetMargin', 'taxRate'].includes(key)) {
                    data[key] = parseFloat(req.body[key]);
                } else {
                    data[key] = req.body[key];
                }
            }
        }

        const rule = await prisma.pricingRule.update({
            where: { id: req.params.id },
            data
        });

        res.json(rule);
    } catch (error) {
        console.error('[PricingRules] Error updating rule:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/pricing-rules/:id (protected - ADMIN only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        // Soft delete
        await prisma.pricingRule.update({
            where: { id: req.params.id },
            data: { active: false }
        });

        res.status(204).send();
    } catch (error) {
        console.error('[PricingRules] Error deleting rule:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
