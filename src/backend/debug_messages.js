const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugMessages() {
    try {
        // Get all messages with their leadId
        const messages = await prisma.message.findMany({
            select: {
                id: true,
                leadId: true,
                role: true,
                content: true
            }
        });

        console.log('=== ALL MESSAGES ===');
        console.log(`Total: ${messages.length}\n`);

        messages.forEach((m, idx) => {
            console.log(`${idx + 1}. LeadID: ${m.leadId}`);
            console.log(`   Role: ${m.role}`);
            console.log(`   Content: ${m.content.substring(0, 50)}...\n`);
        });

        // Get all leads
        const leads = await prisma.lead.findMany({
            select: { id: true, name: true },
            take: 5
        });

        console.log('\n=== ALL LEADS ===');
        leads.forEach(l => {
            console.log(`- ${l.name}: ${l.id}`);
        });

        // Check if any message leadIds match actual lead IDs
        const leadIds = leads.map(l => l.id);
        const matchingMessages = messages.filter(m => leadIds.includes(m.leadId));

        console.log(`\n=== MATCHING ANALYSIS ===`);
        console.log(`Messages with valid leadIds: ${matchingMessages.length}/${messages.length}`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debugMessages();
