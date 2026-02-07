// verify_integration.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const proposalAgent = require('./src/agents/proposal-domain');

async function main() {
    console.log('🔍 Verifying Node.js -> Python Integration...');

    try {
        // 1. Fetch a Real Lead
        const lead = await prisma.lead.findFirst();
        if (!lead) throw new Error('No leads found in DB. Run seed first.');
        console.log('Using Lead:', lead.id, lead.name);

        // 2. Mock Calculation Data (usually comes from Calc Agent)
        const calculation = {
            systemSizeKwp: 4.5,
            generationMonthly: 550
        };

        // 3. Invoke Proposal Creation
        console.log('🚀 Calling proposalAgent.createDraft()...');

        // Mock patching removed - using real DB

        const result = await proposalAgent.createDraft(lead, calculation, null, null);

        console.log('✅ Result:', result);

        if (result.paybackYears && result.paybackYears !== 4.5) {
            console.log('🎉 SUCCESS: Payback is dynamic (' + result.paybackYears + '), meaning Python Engine was called!');
        } else if (result.paybackYears === 4.5) {
            console.warn('⚠️ WARNING: Payback is still 4.5 (default). Python Engine call might have failed or fallen back.');
        }

    } catch (error) {
        console.error('❌ Integration Failed:', error);
    }
}

main();
