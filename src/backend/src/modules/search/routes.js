/**
 * Global search - leads and proposals by query string
 * GET /api/search?q=... (requires auth)
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../../middleware/auth');

const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);

        if (!q) {
            return res.json({ leads: [], proposals: [] });
        }

        const whereLead = {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } }
            ]
        };

        if (req.user.role !== 'ADMIN') {
            whereLead.ownerId = req.user.id;
        }

        const whereProposal = {
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { lead: { name: { contains: q, mode: 'insensitive' } } }
            ]
        };
        if (req.user.role !== 'ADMIN') {
            whereProposal.creatorId = req.user.id;
        }

        const [leads, proposals] = await Promise.all([
            prisma.lead.findMany({
                where: whereLead,
                select: { id: true, name: true, email: true, status: true, consumption: true },
                orderBy: { updatedAt: 'desc' },
                take: limit
            }),
            prisma.proposal.findMany({
                where: whereProposal,
                select: {
                    id: true,
                    title: true,
                    status: true,
                    totalPrice: true,
                    leadId: true,
                    lead: { select: { name: true } }
                },
                orderBy: { updatedAt: 'desc' },
                take: limit
            })
        ]);

        res.json({ leads, proposals });
    } catch (error) {
        console.error('[Search] Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
