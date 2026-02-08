const messageAgent = require('../../../../src/backend/src/agents/message-domain/index');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrisma = {
        user: {
            findMany: jest.fn(),
        },
        message: {
            create: jest.fn(),
            findMany: jest.fn(),
            updateMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

// Mock Socket.io gateway
jest.mock('../../../../src/backend/src/websocket/gateway', () => ({
    getIO: jest.fn(() => ({
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
    })),
}));

// Mock Notification Agent (to avoid actual event emission/logs during test)
jest.mock('../../../../src/backend/src/agents/notification-domain', () => ({
    handleMention: jest.fn(),
}));

describe('MessageDomainAgent', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    describe('sendMessage', () => {
        it('should detect simple mentions like @User', async () => {
            const content = 'Hello @User';
            const mockUsers = [{ id: 'user-id-1', name: 'User', email: 'user@example.com' }];
            prisma.user.findMany.mockResolvedValue(mockUsers);
            prisma.message.create.mockResolvedValue({ id: 'msg-1', content, mentions: ['user-id-1'] });

            const result = await messageAgent.sendMessage({ leadId: 'lead-1', content, senderId: 'sender-1' });

            expect(prisma.user.findMany).toHaveBeenCalled();
            expect(prisma.message.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    mentions: ['user-id-1']
                })
            }));
        });

        it('should detect mentions with spaces like @João Silva', async () => {
            const content = 'Hello @João Silva';
            const mockUsers = [{ id: 'user-id-2', name: 'João Silva', email: 'joao@example.com' }];
            prisma.user.findMany.mockResolvedValue(mockUsers);
            prisma.message.create.mockResolvedValue({ id: 'msg-2', content, mentions: ['user-id-2'] });

            const result = await messageAgent.sendMessage({ leadId: 'lead-1', content, senderId: 'sender-1' });

            expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
            // Check if the query included "João Silva"
            const queryArgs = prisma.user.findMany.mock.calls[0][0];
            const namesQueried = queryArgs.where.OR.find(c => c.name).name.in;
            expect(namesQueried).toContain('João Silva');
        });

        it('should handle DB errors gracefully', async () => {
            const content = 'Hello';
            prisma.message.create.mockRejectedValue(new Error('DB Connection Failed'));

            await expect(messageAgent.sendMessage({ leadId: 'lead-1', content, senderId: 'sender-1' }))
                .rejects
                .toThrow('Failed to send message. Please try again.');
        });

        it('should not crash if mention resolution fails', async () => {
            const content = 'Hello @User';
            prisma.user.findMany.mockRejectedValue(new Error('User DB Failed'));
            prisma.message.create.mockResolvedValue({ id: 'msg-3', content, mentions: [] });

            await expect(messageAgent.sendMessage({ leadId: 'lead-1', content, senderId: 'sender-1' }))
                .resolves
                .toBeDefined();

            expect(prisma.message.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ mentions: [] })
            }));
        });
    });
});
