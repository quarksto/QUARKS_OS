const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const broadcaster = require('../../services/realtime/broadcaster');

class MessageDomainAgent extends BaseDomainAgent {
    constructor() {
        super('message');
    }

    async execute(action, payload) {
        switch (action) {
            case 'LIST_MESSAGES':
                return await this.listMessages(payload.leadId);
            case 'SEND_MESSAGE':
                return await this.sendMessage(payload);
            case 'MARK_READ':
                return await this.markAsRead(payload.leadId);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async listMessages(leadId) {
        return await prisma.message.findMany({
            where: { leadId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async sendMessage(data) {
        const { leadId, content, role, senderId } = data;

        // Detect mentions (Improved Regex for Names with Spaces/Accents)
        // Matches: @Name, @Name Surname, @João Silva
        const mentionRegex = /@([a-zA-Z0-9À-ÿ]+(?: [a-zA-Z0-9À-ÿ]+)*)/g;
        const matches = [...content.matchAll(mentionRegex)];
        const potentialNames = matches.map(m => m[1]);

        let mentions = [];
        if (potentialNames.length > 0) {
            try {
                const users = await prisma.user.findMany({
                    where: {
                        OR: [
                            { name: { in: potentialNames, mode: 'insensitive' } },
                            { email: { in: potentialNames, mode: 'insensitive' } }
                        ]
                    },
                    select: { id: true }
                });
                mentions = users.map(u => u.id);
            } catch (err) {
                console.error('Error resolving mentions:', err.message);
                // Non-blocking: continue sending message even if mention resolution fails
            }
        }

        let message;
        try {
            message = await prisma.message.create({
                data: {
                    content,
                    role: role || 'USER',
                    leadId,
                    senderId: senderId || null
                },
                include: {
                    sender: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
        } catch (dbError) {
            console.error('CRITICAL: Failed to save message:', dbError);
            throw new Error('Failed to send message. Please try again.', { cause: dbError });
        }

        // Broadcast real-time
        try {
            const io = require('../../websocket/gateway').getIO();
            if (io) {
                io.to(`lead:${leadId}`).emit('message:new', message);
            }
        } catch (ioError) {
            console.warn('[MessageDomainAgent] Real-time broadcast failed:', ioError.message);
        }

        // Trigger Notifications
        if (mentions.length > 0) {
            try {
                const notificationAgent = require('../notification-domain');
                notificationAgent.handleMention(message.id, mentions);
            } catch (e) {
                console.error('Failed to trigger notifications:', e.message);
            }
        }

        return message;
    }

    async markAsRead(leadId) {
        await prisma.message.updateMany({
            where: { leadId, isRead: false },
            data: { isRead: true }
        });

        // Broadcast update for counts
        try {
            const io = require('../../websocket/gateway').getIO();
            if (io) {
                io.to('all_leads').emit('lead:unread_reset', { leadId });
            }
        } catch (ioError) {
            console.warn('[MessageDomainAgent] Real-time broadcast (unread_reset) failed:', ioError.message);
        }

        return { success: true };
    }
}

module.exports = new MessageDomainAgent();
