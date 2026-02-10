# Motor de Cálculo de Preços (BOM - Bill of Materials)

Este documento descreve a lógica "Bottom-Up" implementada no QUARKS_OS para o cálculo de propostas comerciais de energia solar.

## Visão Geral
Diferente de sistemas legados que usam preços fixos por kWp, o QUARKS_OS utiliza uma abordagem de **Bill of Materials (BOM)**, onde o preço final é a soma exata de todos os componentes, serviços, margens e impostos.

## Fluxo de Cálculo

O cálculo é orquestrado pelo `Maestro.js` e executado pelo `PricingDomainAgent`.

### 1. Custos Diretos (Hard Costs)
- **Módulos**: Quantidade × Preço Unitário (do catálogo de produtos).
- **Inversor**: Preço Unitário do inversor selecionado.
- **Outros Equipamentos**: Itens adicionais (cabos, estruturas, etc.).

### 2. Custos de Serviços (Soft Costs)
- Baseado em regras definidas no `PricingRulesAgent`.
- Pode incluir: Projeto de Engenharia, Instalação, Homologação e Frete.
- As regras podem ser baseadas na potência do sistema (kWp) ou em valores fixos por tipo de telhado.

### 3. Margem e Impostos (Markup)
A fórmula matemática utilizada para garantir a margem bruta desejada é:

Preço Final = (Custo Equipamentos + Custo Serviços) / (1 - Margem - Impostos)

Onde:
- **Margem**: Percentual de lucro desejado (ex: 15% -> 0.15).
- **Impostos**: Percentual de impostos sobre a nota fiscal (ex: 6% -> 0.06).

## Implementação Técnica

### Backend
- `src/backend/src/agents/pricing-domain/index.js`: Contém a lógica de agregação de custos e aplicação da fórmula de markup.
- `src/backend/src/orchestrator/maestro.js`: Mapeia os itens do kit (ou BOM customizado) para o agente de precificação.

### Frontend
- `StepFinancials.jsx`: Exibe o breakdown para o vendedor e permite ajustes de markup e descontos.
- `PricingBreakdown.jsx`: Componente visual que renderiza as categorias de custo.

## Vantagens
- **Precisão**: Margens de lucro garantidas independente da variação de preço dos fornecedores.
- **Flexibilidade**: Permite a criação de kits customizados (BOM) mantendo a mesma política de serviços e impostos.
- **Transparência**: O vendedor entende exatamente de onde vem o preço final.
