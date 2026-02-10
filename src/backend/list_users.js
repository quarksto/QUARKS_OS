const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true }
        });
        console.log('---BEGIN_EMAILS---');
        users.forEach(u => console.log(u.email));
        console.log('---END_EMAILS---');
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
