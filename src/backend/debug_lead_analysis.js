const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const leadId = process.argv[2] || 'b04ac3d2-04a0-439f-b85d-abf7f837ed39';
    console.log(`🔍 Searching for lead: ${leadId}`);

    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                proposals: true,
                projects: true,
                client: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!lead) {
            console.log('❌ Lead not found.');
            // List some IDs to help
            const others = await prisma.lead.findMany({ take: 5 });
            console.log('Available IDs:', others.map(l => l.id));
            return;
        }

        console.log('--- LEAD DATA ---');
        console.log(JSON.stringify(lead, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
