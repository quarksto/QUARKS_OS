const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createMasterUser() {
    console.log('🔑 Creating master user...');

    const email = 'master@quarks.solar';
    const password = 'master123'; // Senha conhecida
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Master Admin'
            },
            create: {
                email,
                name: 'Master Admin',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log(`\n✅ USER CREATED/UPDATED:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user.id}\n`);

    } catch (error) {
        console.error('❌ Error creating master user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createMasterUser();
