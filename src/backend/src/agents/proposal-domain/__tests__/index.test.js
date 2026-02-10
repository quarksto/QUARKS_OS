const proposalAgent = require('../index');

// Mock Prisma
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        proposal: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
        lead: {
            findUnique: jest.fn(),
            update: jest.fn()
        },
        kit: {
            findUnique: jest.fn()
        },
        product: {
            findUnique: jest.fn()
        },
        service: {
            findMany: jest.fn()
        },
        pricingRule: {
            findFirst: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock Axios
jest.mock('axios');
const axios = require('axios');

describe('ProposalDomainAgent', () => {
    const { PrismaClient } = require('@prisma/client');
    const prismaMock = new PrismaClient();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('calculateProposalCosts', () => {
        test('should calculate valid proposal costs for a standard kit', async () => {
            // Setup Mocks
            prismaMock.lead.findUnique.mockResolvedValue({ id: 'lead-1', state: 'SP' });
            prismaMock.kit.findUnique.mockResolvedValue({
                id: 'kit-1',
                items: [
                    { productId: 'p1', quantity: 10, product: { name: 'Painel', costPrice: 500 } },
                    { productId: 'p2', quantity: 1, product: { name: 'Inversor', costPrice: 2000 } }
                ]
            });
            prismaMock.service.findMany.mockResolvedValue([
                {
                    id: 's1', name: 'Installation', active: true,
                    prices: [{ state: null, active: true, priceType: 'FIXED', priceValue: 3000 }]
                }
            ]);
            prismaMock.pricingRule.findFirst.mockResolvedValue({
                targetMargin: 0.20,
                taxRate: 0.12,
                active: true,
                name: 'Standard Rule'
            });

            const result = await proposalAgent.calculateProposalCosts({
                leadId: 'lead-1',
                kitId: 'kit-1',
                systemSizeKwp: 5.0
            });

            // Verification
            // Equipment: (10 * 500) + (1 * 2000) = 5000 + 2000 = 7000
            expect(result.equipmentCost).toBe(7000);

            // Services: 3000 (Fixed)
            expect(result.servicesCost).toBe(3000);

            // Total Cost: 10000
            expect(result.totalCost).toBe(10000);

            // Final Price: 10000 / (1 - (0.20 + 0.12)) = 10000 / 0.68 = 14705.88
            expect(result.finalPrice).toBeCloseTo(14705.88, 1);
        });
    });

    describe('createDraft', () => {
        test('should create a draft proposal successfully', async () => {
            // Reuse logic mocks implicitly via calculateProposalCosts call inside createDraft
            // We need to mock the same things again or rely on the fact that calculateProposalCosts calls them.
            // Since we mocked the agent in previous tests (partial mocking), here we are testing the class method directly.
            // The class method calls `this.calculateProposalCosts`. We can spy on it or let it run.
            // Let's let it run with mocks.

            prismaMock.lead.findUnique.mockResolvedValue({ id: 'lead-1', state: 'SP' });
            prismaMock.kit.findUnique.mockResolvedValue({
                id: 'kit-1', name: 'Kit Solar 5kWp',
                items: [{ productId: 'p1', quantity: 1, product: { costPrice: 5000 } }]
            });
            prismaMock.service.findMany.mockResolvedValue([]);
            prismaMock.pricingRule.findFirst.mockResolvedValue({ targetMargin: 0.2, taxRate: 0.1 });

            prismaMock.proposal.create.mockResolvedValue({
                id: 'prop-1',
                status: 'DRAFT',
                totalPrice: 10000
            });

            const result = await proposalAgent.createDraft(
                'lead-1',
                { systemSizeKwp: 5.0 },
                'kit-1'
            );

            expect(prismaMock.proposal.create).toHaveBeenCalled();
            expect(result.id).toBe('prop-1');
            expect(result.status).toBe('DRAFT');
        });
    });
});
