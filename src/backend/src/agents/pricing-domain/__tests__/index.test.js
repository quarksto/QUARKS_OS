const pricingAgent = require('../index');

// Mock Prisma
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        pricingRule: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        },
        service: {
            findMany: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('PricingDomainAgent', () => {
    // Access the mocked prisma instance
    const { PrismaClient } = require('@prisma/client');
    const prismaMock = new PrismaClient();

    beforeEach(() => {
        jest.clearAllMocks();
        // Default Mock Returns
        prismaMock.pricingRule.findFirst.mockResolvedValue({
            id: 'rule-1',
            name: 'Default Rule',
            targetMargin: 0.20,
            taxRate: 0.12,
            active: true
        });
        prismaMock.service.findMany.mockResolvedValue([]);
    });

    describe('calculatePrice', () => {
        test('should calculate valid price with default margins', async () => {
            const input = {
                kit: { price: 10000 },
                state: 'SP',
                kWp: 5
            };

            const result = await pricingAgent.calculatePrice(input);

            expect(result).toBeDefined();
            expect(result.totalPrice).toBeGreaterThan(10000);

            // Validation: (10000 + 0) * 1.2 / (1 - 0.12) = 12000 / 0.88 = 13636.36
            expect(result.totalPrice).toBeCloseTo(13636.36, 1);
            expect(result.margin).toBe(0.20);
        });

        test('should apply different tax rates based on rule fetch', async () => {
            // Mock specific rule for MG
            prismaMock.pricingRule.findFirst.mockResolvedValueOnce({
                name: 'MG Rule',
                targetMargin: 0.25,
                taxRate: 0.18,
                active: true
            });

            const inputMG = { kit: { price: 10000 }, state: 'MG', kWp: 5 };
            const resultMG = await pricingAgent.calculatePrice(inputMG);

            // Validation: 10000 * 1.25 / (1 - 0.18) = 12500 / 0.82 = 15243.90
            expect(resultMG.totalPrice).toBeCloseTo(15243.90, 1);
            expect(resultMG.margin).toBe(0.25);
        });
    });
});
