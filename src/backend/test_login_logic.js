const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function test() {
    const email = 'master@quarks.solar';
    const password = 'master123';
    console.log('Testing login for:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { console.log('User not found'); return; }
    console.log('User found. Comparing...');
    const valid = await bcrypt.compare(password, user.password);
    console.log('Valid:', valid);
    process.exit(0);
}
test();
