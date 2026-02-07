const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Product Catalog...');

    const products = [
        {
            sku: 'MOD-550-JINKO',
            name: 'Painel Solar Jinko 550W Mono',
            type: 'MODULE',
            costPrice: 650.00,
            supplier: 'Aldo Solar',
            specs: { power: 550, efficiency: 21.5, technology: 'Mono Perc' }
        },
        {
            sku: 'INV-DEYE-5K',
            name: 'Inversor Deye 5kW Híbrido',
            type: 'INVERTER',
            costPrice: 4200.00,
            supplier: 'Sices',
            specs: { power_ac: 5000, mppt: 2, phases: 1 }
        },
        {
            sku: 'STRUCT-SOLO-4',
            name: 'Estrutura Solo 4 Módulos',
            type: 'STRUCTURE',
            costPrice: 300.00,
            supplier: 'Romagnole',
            specs: { material: 'Galvanized Steel' }
        },
        {
            sku: 'CABO-SOLAR-6MM',
            name: 'Cabo Solar 6mm Preto (100m)',
            type: 'CABLE',
            costPrice: 450.00,
            supplier: 'Conduspar',
            specs: { gauge: '6mm', length: 100 }
        }
    ];

    for (const p of products) {
        const upserted = await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: p,
        });
        console.log(`✅ Upserted: ${upserted.sku}`);
    }

    console.log('🌱 Seeding Pricing Rules...');
    await prisma.pricingRule.upsert({
        where: { id: 'PRICING-DEFAULT' },
        update: {},
        create: {
            name: "Regra Padrão SP",
            minPower: 0,
            maxPower: 1000,
            targetMargin: 0.25,
            taxRate: 0.12
        }
    });

    console.log('🌱 Seeding Kits...');
    const pModule = await prisma.product.findUnique({ where: { sku: 'MOD-550-JINKO' } });
    const pInverter = await prisma.product.findUnique({ where: { sku: 'INV-DEYE-5K' } });

    if (pModule && pInverter) {
        const kitName = "Kit Solar 4.4 kWp (8x550W)";
        const existingKit = await prisma.kit.findFirst({ where: { name: kitName } });

        let kitId = existingKit?.id;

        if (!existingKit) {
            const newKit = await prisma.kit.create({
                data: {
                    name: kitName,
                    description: "Kit Ideal para residências médias"
                }
            });
            kitId = newKit.id;
            console.log(`✅ Created Kit: ${kitName}`);

            await prisma.kitItem.create({ data: { kitId, productId: pModule.id, quantity: 8 } });
            await prisma.kitItem.create({ data: { kitId, productId: pInverter.id, quantity: 1 } });
        } else {
            console.log(`Computed Kit exists: ${kitName}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
