const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMessages() {
    try {
        const count = await prisma.message.count();
        console.log(`Total messages in DB: ${count}\n`);

        if (count > 0) {
            const leads = await prisma.lead.findMany({
                select: { id: true, name: true },
                take: 3
            });

            for (const lead of leads) {
                const messages = await prisma.message.findMany({
                    where: { leadId: lead.id },
                    orderBy: { createdAt: 'asc' }
                });

                console.log(`\n=== ${lead.name} (${lead.id.substring(0, 8)}...) ===`);
                console.log(`Messages: ${messages.length}`);

                messages.forEach((m, idx) => {
                    console.log(`  ${idx + 1}. [${m.role}] ${m.content.substring(0, 60)}...`);
                });
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkMessages();
