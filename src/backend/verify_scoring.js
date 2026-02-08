const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const leadAgent = require('./src/agents/lead-domain');

async function verifyScoring() {
    console.log('--- Verifying Lead Scoring ---');

    // 1. Create a "Cold" Lead (Minimum info)
    const coldLead = await leadAgent.createLead({
        name: 'Cold Lead Test',
        consumption: 500, // +10 score
        ownerId: (await prisma.user.findFirst()).id
    });
    console.log(`Cold Lead Score: ${coldLead.score} (Expected ~20: Name 10 + Cons 10)`);
    console.log(`Cold Lead Temp: ${coldLead.temperature.label}`);

    // 2. Enrich Lead to make it "Warm"
    const warmLead = await leadAgent.updateLead(coldLead.id, {
        phone: '11999999999', // +10
        email: 'test@test.com', // +10
        location: 'São Paulo - SP', // +10
        origin: 'Website' // +10
    });
    // Expected: 20 + 40 = 60
    console.log(`Warm Lead Score: ${warmLead.score} (Expected ~60)`);
    console.log(`Warm Lead Temp: ${warmLead.temperature.label}`);

    // 3. Verify color/label logic
    if (warmLead.score >= 50 && warmLead.temperature.label === 'Morno') {
        console.log('✅ Temperature logic works');
    } else {
        console.error('❌ Temperature logic failed');
    }

    // Cleanup
    await prisma.lead.delete({ where: { id: coldLead.id } });
}

verifyScoring()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
