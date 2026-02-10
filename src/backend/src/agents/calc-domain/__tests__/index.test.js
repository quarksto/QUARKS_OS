const agent = require('../index');
const axios = require('axios');

jest.mock('axios');

describe('CalcDomainAgent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('calculateGeneration', () => {
        test('should calculate valid generation for standard scenario', async () => {
            const mockResponse = {
                data: {
                    system_size_kwp: 4.16,
                    estimated_generation_monthly: 500,
                    panels_count: 8,
                    area_required_m2: 29.12
                }
            };
            axios.post.mockResolvedValue(mockResponse);

            const input = {
                consumption: 500, // kWh
                state: 'MG',
                distributor: 'CEMIG'
            };

            const result = await agent.calculateGeneration(input.consumption);

            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/calculate/generation'), expect.anything());
            expect(result).toBeDefined();
            expect(result.systemSizeKwp).toBe(4.16);
            expect(result.generationMonthly).toBe(500);
        });

        test('should throw error for invalid consumption', async () => {
            axios.post.mockRejectedValue(new Error('API Error'));
            await expect(agent.calculateGeneration({})).rejects.toThrow();
        });
    });
});
