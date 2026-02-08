const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pricingAgent = require('./src/agents/pricing-domain');

async function verifyPricing() {
    console.log('--- Verifying Pricing Logic ---');

    // 1. Mock Data
    const mockKit = {
        name: 'Test Kit 5kWp',
        powerKwp: 5.0,
        items: [
            { product: { costPrice: 500, name: 'Panel' }, quantity: 10 }, // 5000
            { product: { costPrice: 3000, name: 'Inverter' }, quantity: 1 } // 3000
        ]
    };
    // Hardware Context: 8000

    const mockState = 'MG'; // Should trigger Installation (0.80 * 5000 = 4000)

    console.log('Context:', { kit: mockKit.name, power: mockKit.powerKwp, state: mockState });

    // 2. Execute Calculation
    try {
        const result = await pricingAgent.calculatePrice({
            kit: mockKit,
            state: mockState,
            kWp: mockKit.powerKwp
        });

        console.log('\nResult:', JSON.stringify(result, null, 2));

        // 3. Validation Logic
        const hardware = 8000;
        const installation = 0.80 * 5000; // 4000
        const engineering = 1500;
        const homologation = 500;
        const services = installation + engineering + homologation; // 6000

        const totalBase = hardware + services; // 14000
        const margin = 0.20;
        const tax = 0.12;

        const expectedPrice = (totalBase * 1.20) / 0.88;

        console.log('\n--- Validation ---');
        console.log(`Expected Base: ${totalBase}`);
        console.log(`Calculated Base: ${result.baseCost}`);

        if (Math.abs(result.baseCost - totalBase) < 1) {
            console.log('✅ Base Cost Matches');
        } else {
            console.error('❌ Base Cost Mismatch');
        }

        if (Math.abs(result.totalPrice - expectedPrice) < 5) {
            console.log('✅ Final Price Matches Logic');
        } else {
            console.error('❌ Final Price Mismatch');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyPricing();
