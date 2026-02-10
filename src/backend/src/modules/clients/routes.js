const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../../middleware/auth');

const prisma = new PrismaClient();

/** GET /api/clients - List clients (leads with projects or CLOSED_WON) */
router.get('/', authenticate, async (req, res) => {
    try {
        const where = {
            OR: [
                { projects: { some: {} } },
                { status: 'CLOSED_WON' }
            ]
        };
        if (req.user?.role !== 'ADMIN') where.ownerId = req.user.id;

        const leads = await prisma.lead.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: { projects: true }
        });

        const clients = leads.map((l) => ({
            id: l.id,
            name: l.name,
            type: 'PF',
            email: l.email,
            phone: l.phone,
            address: l.fullAddress || l.location || null,
            projectCount: l.projects?.length || 0
        }));

        res.json(clients);
    } catch (error) {
        console.error('List clients error:', error);
        res.status(500).json({ error: error.message });
    }
});

/** GET /api/clients/:id - Client detail with projects and lead history */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const where = { id };
        if (req.user?.role !== 'ADMIN') where.ownerId = req.user.id;

        const lead = await prisma.lead.findFirst({
            where,
            include: {
                projects: { include: { proposal: true } },
                proposals: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (!lead) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const projects = lead.projects.map((p) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            value: p.proposal?.totalPrice ?? null
        }));

        const client = {
            id: lead.id,
            name: lead.name,
            type: 'PF',
            email: lead.email,
            phone: lead.phone,
            address: lead.fullAddress || lead.location || null,
            projects,
            leads: lead.proposals.map((prop) => ({
                id: prop.id,
                createdAt: prop.createdAt,
                status: prop.status
            }))
        };

        res.json(client);
    } catch (error) {
        console.error('Client detail error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
