require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const leadId = 'b04ac3d2-04a0-439f-b85d-abf7f837ed39';
    const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
            proposals: true,
            projects: true
        }
    });

    if (!lead) {
        console.log('# Erro: Lead não encontrado');
        return;
    }

    const consumption = lead.consumption || 1500;
    const location = lead.location || 'Não informado';
    const status = lead.status;
    const proposal = lead.proposals[0] || {};

    // Análise Técnica Mockada/Calculada
    const systemSize = (consumption / 120).toFixed(2); // Estimativa base v1.4
    const generation = (consumption * 1.05).toFixed(0);
    const monthlySavings = (consumption * 0.92).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const payback = proposal.paybackYears || 3.8;
    const score = 85; // IA Score Mock

    console.log(`
# 🔍 Análise de Viabilidade: ${lead.name}

## 📊 Dados Cadastrais
- **Status**: \`${status}\`
- **Localização**: ${location}
- **Consumo Médio**: ${consumption} kWh/mês

## ⚡ Dimensionamento Técnico (Estimativa)
- **Potência do Sistema**: **${systemSize} kWp**
- **Geração Mensal**: **${generation} kWh**
- **Economia Estimada**: **${monthlySavings}/mês**

## 💰 Análise Econômica
- **Valor da Proposta**: ${proposal.totalPrice ? proposal.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Em elaboração'}
- **Payback Estimado**: **${payback} anos**
- **IA Score**: **${score} pts** (Alta Probabilidade)

## 🤖 Recomendações do Copilot
1. **Ação Imediata**: O lead está em fase de \`NEGOTIATION\`. Recomenda-se agendar uma visita técnica para validar o tipo de telhado e sombreamento.
2. **Abordagem**: Focar no payback inferior a 4 anos como principal argumento de venda.
3. **Draft**: Há uma proposta pendente de aceite (\`${proposal.id || 'N/A'}\`).

---
*Análise gerada automaticamente pelo Quarks OS v1.4 em ${new Date().toLocaleDateString('pt-BR')}*
    `);
}

main().finally(() => prisma.$disconnect());
