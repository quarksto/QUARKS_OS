const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetMasterUser() {
    console.log('🔄 Resetting master user...');

    const email = 'master@quarks.solar';
    const password = 'master123';

    try {
        // 1. Delete if exists to ensure clean state
        try {
            await prisma.user.delete({ where: { email } });
            console.log('🗑️ Deleted existing user.');
        } catch (e) {
            // Ignore if not found
        }

        // 2. Create fresh
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Master Admin',
                role: 'ADMIN'
            }
        });

        console.log(`✅ User created successfully:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   ID: ${user.id}`);

        // 3. Verify immediately
        const verifyUser = await prisma.user.findUnique({ where: { email } });
        const isMatch = await bcrypt.compare(password, verifyUser.password);
        console.log(`🔐 Immediate password verification: ${isMatch ? 'PASSED' : 'FAILED'}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetMasterUser();
