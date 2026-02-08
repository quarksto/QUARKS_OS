const { EventEmitter } = require('events');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationDomainAgent extends EventEmitter {
    constructor() {
        super();
        this.name = 'notification';
    }

    async init() {
        console.log('Notification Domain Agent initialized');
    }

    async handleMention(messageId, mentionedUserIds) {
        console.log(`Processing mentions for message ${messageId}:`, mentionedUserIds);
        // TODO: Implement actual notification logic (WebSocket push, Email, etc.)
        // For now, we just log it.
        for (const userId of mentionedUserIds) {
            // Emit internal event for WebSocket broadcaster
            this.emit('notification:new', {
                userId,
                type: 'MENTION',
                message: `You were mentioned in a message.`,
                data: { messageId }
            });
        }
    }
}

module.exports = new NotificationDomainAgent();
