const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@quarks.solar';
    const password = 'quarks2025';
    const name = 'Admin Quarks';
    const role = 'ADMIN';

    console.log(`🚀 Creating/Updating user: ${email}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: role,
                name: name
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role: role
            }
        });

        console.log('✅ User created/updated successfully!');
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`👤 Role: ${user.role}`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
