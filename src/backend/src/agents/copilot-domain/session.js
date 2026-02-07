const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgentSessionService {
    /**
     * Creates a new session for a user or returns active one
     */
    async getOrCreateSession(userId) {
        // Ensure User Exists (Dev/POC Helper)
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            console.log(`[Session] User ${userId} not found. Creating Guest User...`);
            // Create or Find a Guest User
            // Ideally we'd valid auth, but for POC/Copilot standalone we upsert a guest
            await prisma.user.upsert({
                where: { id: userId },
                update: {},
                create: {
                    id: userId,
                    email: `guest-${userId}@quarks.os`,
                    name: 'Guest User',
                    password: 'hashed-password-placeholder', // Mock
                    role: 'COMERCIAL'
                }
            });
        }

        // Find most recent active session (e.g., created today)
        const activeSession = await prisma.agentSession.findFirst({
            where: {
                userId,
                updatedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
                }
            },
            orderBy: { updatedAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (activeSession) {
            return activeSession;
        }

        return await prisma.agentSession.create({
            data: {
                userId,
                context: {} // Empty context
            },
            include: { messages: true }
        });
    }

    /**
     * Adds a message to the session
     * @param {string} sessionId 
     * @param {string} role 'USER' | 'ASSISTANT' | 'SYSTEM'
     * @param {string} content 
     * @param {object} metadata 
     */
    async addMessage(sessionId, role, content, metadata = {}) {
        return await prisma.agentSession.update({
            where: { id: sessionId },
            data: {
                messages: {
                    create: {
                        role,
                        content,
                        metadata
                    }
                },
                // Update timestamp
                updatedAt: new Date()
            }
        });
    }

    /**
     * Updates session context (e.g. store detected entities)
     */
    async updateContext(sessionId, newContext) {
        const session = await prisma.agentSession.findUnique({ where: { id: sessionId } });
        const updatedContext = { ...session.context, ...newContext };

        return await prisma.agentSession.update({
            where: { id: sessionId },
            data: { context: updatedContext }
        });
    }

    /**
     * Retreives full history formatted for Gemini
     */
    async getHistory(sessionId) {
        const session = await prisma.agentSession.findUnique({
            where: { id: sessionId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!session) return [];

        // Map to Gemini Format { role: 'user' | 'model', parts: [{ text: ... }] }
        return session.messages.map(msg => ({
            role: msg.role === 'USER' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
    }
}

module.exports = new AgentSessionService();
