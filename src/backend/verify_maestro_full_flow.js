const { maestro } = require('./src/orchestrator/maestro');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testMaestroFlow() {
    try {
        console.log('🧪 Testing Maestro Full Flow: Lead -> Calc -> Kit -> Pricing -> Proposal');

        // 1. Create a Lead first
        const lead = await prisma.lead.create({
            data: {
                name: "Teste Pricing Engine",
                consumption: 550,
                ownerId: (await prisma.user.findFirst()).id,
                location: "Sao Paulo - SP"
            }
        });
        console.log(`👤 Lead Created: ${lead.id}`);

        // 2. Execute Workflow
        const proposal = await maestro.execute('CREATE_PROPOSAL_WORKFLOW', { leadId: lead.id });

        console.log('✅ Workflow Execution Complete');
        console.log('📄 Proposal Created:', proposal.id);
        console.log('💰 Total Price:', proposal.totalPrice);

        // Verifying Price isn't the fallback
        // Fallback was ~4.4 * 3500 = 15400
        // Real Price with margin and tax should be higher or specific calculated value
        // Seed Kit: 8x650 (5200) + 1x4200 = 9400 Base
        // Margin 25%, Tax 12% -> 9400 * 1.25 / 0.88 = ~13352

        if (proposal.totalPrice > 0 && proposal.totalPrice !== 15400) {
            console.log('✅ SUCCESS: Dynamic Pricing Applied!');
        } else {
            console.warn('⚠️ WARNING: Check if price matches expected logic.');
        }

        // 3. Verify Kit Linkage
        if (proposal.kitId) {
            const kit = await prisma.kit.findUnique({ where: { id: proposal.kitId } });
            console.log(`🔋 Linked Kit: ${kit.name}`);
        }

    } catch (error) {
        console.error('❌ TEST FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testMaestroFlow();
