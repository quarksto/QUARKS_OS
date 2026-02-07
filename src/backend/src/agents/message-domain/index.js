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

        const message = await prisma.message.create({
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

        // Broadcast real-time
        const io = require('../../websocket/gateway').getIO();
        if (io) {
            io.to(`lead:${leadId}`).emit('message:new', message);
            // Notificar unread count global se necessário
        }

        return message;
    }

    async markAsRead(leadId) {
        await prisma.message.updateMany({
            where: { leadId, isRead: false },
            data: { isRead: true }
        });

        // Broadcast update for counts
        const io = require('../../websocket/gateway').getIO();
        if (io) {
            io.to('all_leads').emit('lead:unread_reset', { leadId });
        }

        return { success: true };
    }
}

module.exports = new MessageDomainAgent();
