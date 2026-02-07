const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProjects() {
    console.log('🌱 Seeding Projects...');

    const leads = await prisma.lead.findMany({
        take: 3
    });

    const technician = await prisma.user.findFirst({
        where: { role: 'ENGENHARIA' }
    }) || await prisma.user.findFirst();

    if (leads.length === 0) {
        console.error('❌ No leads found to attach projects to. Run lead seed first.');
        return;
    }

    const projectData = [
        {
            name: `Sistema Residencial - ${leads[0].name}`,
            leadId: leads[0].id,
            technicianId: technician.id,
            status: 'SURVEYING',
            technicalNotes: 'Telhado com orientação Norte. Necessário verificar sombreamento da chaminé.'
        },
        {
            name: `Comercial 20kWp - ${leads[1]?.name || 'Padaria Central'}`,
            leadId: leads[1]?.id || leads[0].id,
            technicianId: technician.id,
            status: 'PLANNED',
            technicalNotes: 'Estrutura metálica. Cliente solicitou inversor híbrido.'
        },
        {
            name: `Solar Prime - ${leads[2]?.name || 'Condomínio Solar'}`,
            leadId: leads[2]?.id || leads[0].id,
            technicianId: technician.id,
            status: 'INSTALLING',
            technicalNotes: 'Módulos de 550W. Instalação iniciada em 05/02.'
        }
    ];

    for (const data of projectData) {
        const project = await prisma.project.create({
            data
        });

        await prisma.projectActivity.create({
            data: {
                projectId: project.id,
                action: 'CREATE',
                details: 'Projeto inicializado via sistema de sementeira.'
            }
        });

        console.log(`✅ Created project: ${project.name}`);
    }

    console.log('✨ Seeding complete!');
    await prisma.$disconnect();
}

seedProjects().catch(e => {
    console.error(e);
    process.exit(1);
});
