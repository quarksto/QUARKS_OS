const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    const users = await prisma.user.findMany();
    console.log('--- USERS ---');
    users.forEach(u => {
        console.log(`Email: ${u.email} | Role: ${u.role} | ID: ${u.id.substring(0, 8)}...`);
    });
    console.log('--- END ---');
    process.exit(0);
}

listUsers();
