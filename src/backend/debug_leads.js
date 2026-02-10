const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLeads() {
    try {
        const totalLeads = await prisma.lead.count();
        console.log(`Total Leads: ${totalLeads}`);

        const leads = await prisma.lead.findMany({
            select: { id: true, name: true, status: true }
        });
        console.log('Leads found:', JSON.stringify(leads, null, 2));

        const statuses = await prisma.lead.groupBy({
            by: ['status'],
            _count: { _all: true }
        });
        console.log('Status counts:', JSON.stringify(statuses, null, 2));

    } catch (error) {
        console.error('Error checking leads:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLeads();
