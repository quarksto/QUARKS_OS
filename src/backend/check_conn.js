const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to database');
        const users = await prisma.user.count();
        console.log('📊 Total users:', users);
    } catch (e) {
        console.error('❌ Failed to connect:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
