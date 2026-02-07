const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedKits() {
    console.log('🔧 Seeding demo kits...');

    const kitsData = [
        {
            name: 'Kit 3kWp Econômico',
            description: 'Ideal para residências pequenas',
            size_kwp: 3.3,
            price: 9500,
            active: true
        },
        {
            name: 'Kit 5kWp Standard',
            description: 'Para famílias médias',
            size_kwp: 5.5,
            price: 14500,
            active: true
        },
        {
            name: 'Kit 10kWp Premium',
            description: 'Para alto consumo ou comércio',
            size_kwp: 10.0,
            price: 32000,
            active: true
        },
        {
            name: 'Kit 20kWp Comercial',
            description: 'Para empresas e indústrias',
            size_kwp: 20.0,
            price: 58000,
            active: true
        },
    ];

    for (const kit of kitsData) {
        try {
            const existing = await prisma.kit.findFirst({ where: { name: kit.name } });
            if (!existing) {
                await prisma.kit.create({ data: kit });
                console.log(`  ✅ Created: ${kit.name}`);
            } else {
                console.log(`  ⏭️  Exists: ${kit.name}`);
            }
        } catch (error) {
            console.error(`  ❌ Error with ${kit.name}:`, error.message);
        }
    }

    console.log('✅ Kits seeding complete!');
}

seedKits()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
