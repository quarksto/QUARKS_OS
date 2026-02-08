const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
    const email = 'fix@quarks.solar';
    const password = '123';
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: { email, name: 'Fix User', password: hashedPassword, role: 'ADMIN' }
    });
    console.log('User fix@quarks.solar created with password 123');
    process.exit(0);
}
run();
