require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DB VERIFICATION ---');
    console.log('ENV DATABASE_URL:', process.env.DATABASE_URL);

    try {
        const leads = await prisma.lead.findMany({
            select: { id: true, name: true, createdAt: true }
        });
        console.log(`Total Leads: ${leads.length}`);
        leads.forEach(l => {
            console.log(`- [${l.id}] ${l.name} (Created: ${l.createdAt})`);
        });

        const targetId = 'b04ac3d2-04a0-439f-b85d-abf7f837ed39';
        const target = await prisma.lead.findUnique({ where: { id: targetId } });
        if (target) {
            console.log(`✅ FOUND TARGET LEAD: ${target.name}`);
        } else {
            console.log(`❌ Target Lead NOT FOUND.`);
        }
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
