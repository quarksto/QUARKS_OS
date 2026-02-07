const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'copilot_tester@example.com';

    // Upsert user to ensure it exists
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Copilot Tester',
            password: 'hashed_password', // Mock
            role: 'INTEGRADOR'
        }
    });

    console.log('Seeded User ID:', user.id);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
