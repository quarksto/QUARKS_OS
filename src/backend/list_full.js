const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    users.forEach(u => {
        console.log(`NAME: ${u.name} | EMAIL: ${u.email}`);
    });
}
main().finally(() => prisma.$disconnect());
