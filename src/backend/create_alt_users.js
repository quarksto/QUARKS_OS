const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAltUsers() {
    console.log('Creating alternative users...');
    const users = [
        { email: 'admin@quarks.solar', pass: 'admin123', name: 'Admin Backup' },
        { email: 'integrador@quarks.solar', pass: '123456', name: 'Integrador Teste' },
        { email: 'user@quarks.solar', pass: 'quarks123', name: 'User Standard' }
    ];

    for (const u of users) {
        const hash = await bcrypt.hash(u.pass, 10);
        await prisma.user.upsert({
            where: { email: u.email },
            update: { password: hash },
            create: { email: u.email, password: hash, name: u.name, role: 'ADMIN' }
        });
        console.log(`✅ ${u.email} -> ${u.pass}`);
    }
    process.exit(0);
}
createAltUsers();
