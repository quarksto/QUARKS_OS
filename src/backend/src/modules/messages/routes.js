const express = require('express');
const router = express.Router();
const messageAgent = require('../../agents/message-domain');
const { authenticate } = require('../../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// List messages for a lead
router.get('/lead/:leadId', authenticate, async (req, res) => {
    try {
        const messages = await messageAgent.execute('LIST_MESSAGES', { leadId: req.params.leadId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send a message
router.post('/', authenticate, async (req, res) => {
    try {
        const { leadId, content, role } = req.body;
        const message = await messageAgent.execute('SEND_MESSAGE', {
            leadId,
            content,
            role: role || 'USER',
            senderId: req.user.id
        });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark messages as read
router.patch('/read/:leadId', authenticate, async (req, res) => {
    try {
        await messageAgent.execute('MARK_READ', { leadId: req.params.leadId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
