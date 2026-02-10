const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        const leads = await prisma.lead.count();
        const proposals = await prisma.proposal.count();
        const users = await prisma.user.count();
        console.log('--- DB SUMMARY ---');
        console.log('Users:', users);
        console.log('Leads:', leads);
        console.log('Proposals:', proposals);
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
