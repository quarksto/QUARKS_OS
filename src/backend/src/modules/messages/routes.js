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
        console.log('[Messages API] Sending message:', { leadId: leadId?.substring(0, 8), content: content?.substring(0, 30), userId: req.user?.id });

        const message = await messageAgent.execute('SEND_MESSAGE', {
            leadId,
            content,
            role: role || 'USER',
            senderId: req.user.id
        });

        console.log('[Messages API] Message created:', message.id);
        res.json(message);
    } catch (error) {
        console.error('[Messages API] Error sending message:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Mark messages as read (best-effort: don't fail the client if DB update errors)
router.patch('/read/:leadId', authenticate, async (req, res) => {
    try {
        await messageAgent.execute('MARK_READ', { leadId: req.params.leadId });
        return res.json({ success: true });
    } catch (error) {
        console.error('[Messages API] Mark read error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
