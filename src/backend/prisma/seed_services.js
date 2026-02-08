const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Services...');

    // 1. Installation (Per Watt)
    const installService = await prisma.service.create({
        data: {
            name: 'Instalação Padrão (Telhado)',
            type: 'INSTALLATION',
            description: 'Mão de obra de instalação completa, incluindo fixação, cabeamento e comissionamento.',
            active: true
        }
    });

    console.log(`Created Service: ${installService.name}`);

    // Installation Prices (Example for MG)
    await prisma.servicePrice.create({
        data: {
            serviceId: installService.id,
            state: 'MG',
            minPower: 0,
            maxPower: 10000, // Até 10kWp
            priceType: 'PER_WATT',
            priceValue: 0.80 // R$ 0.80/Wp
        }
    });

    // 2. Engineering (Fixed)
    const engService = await prisma.service.create({
        data: {
            name: 'Engenharia e Projeto',
            type: 'ENGINEERING',
            description: 'ART, Projeto Elétrico e Responsabilidade Técnica.',
            active: true
        }
    });

    console.log(`Created Service: ${engService.name}`);

    await prisma.servicePrice.create({
        data: {
            serviceId: engService.id,
            state: null, // Nacional
            minPower: 0,
            maxPower: 99999,
            priceType: 'FIXED',
            priceValue: 1500 // R$ 1500 fixo
        }
    });

    // 3. Homologation (Fixed)
    const homoService = await prisma.service.create({
        data: {
            name: 'Homologação na Concessionária',
            type: 'HOMOLOGATION',
            description: 'Trâmites administrativos junto à distribuidora de energia.',
            active: true
        }
    });

    console.log(`Created Service: ${homoService.name}`);

    await prisma.servicePrice.create({
        data: {
            serviceId: homoService.id,
            state: null,
            minPower: 0,
            maxPower: 99999,
            priceType: 'FIXED',
            priceValue: 500 // R$ 500 fixo
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
