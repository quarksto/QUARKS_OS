const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../../middleware/auth');

// List templates
router.get('/', authenticate, async (req, res) => {
    try {
        const templates = await prisma.messageTemplate.findMany({
            where: { isActive: true },
            orderBy: { usageCount: 'desc' }
        });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create template
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, content, category } = req.body;
        const template = await prisma.messageTemplate.create({
            data: {
                name,
                content,
                category,
                createdBy: req.user.id
            }
        });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Increment usage count
router.post('/:id/use', authenticate, async (req, res) => {
    try {
        await prisma.messageTemplate.update({
            where: { id: req.params.id },
            data: { usageCount: { increment: 1 } }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
