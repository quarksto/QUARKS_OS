# Análise de Dependências - Motor de Propostas

## Situação Atual
O sistema gera uma proposta "fake" (dados mockados) porque faltam os módulos fundamentais de suporte.

## Gaps Identificados
1.  **Catálogo de Produtos (Hardware)**:
    -   Não temos tabela de `Painéis`, `Inversores`, `Estruturas`, `Cabos`.
    -   Não temos lógica de "Kits" (Combinação de produtos compatíveis).
    -   *Impacto*: A proposta mostra "Kit Solar Premium" (texto livre) sem especificações técnicas reais.

2.  **Motor de Precificação (Pricing Engine)**:
    -   Preço atual é hardcoded (`R$ 3500 * kWp`).
    -   Falta: Custos Variáveis (Impostos, Frete, Comissão), Margem de Lucro Configurável, Custos Fixos.
    -   *Impacto*: O valor final da proposta é fictício e perigoso para uso real.

3.  **CRM / Dados do Cliente**:
    -   Tabela `Lead` e `User` (Cliente) existem no Prisma, mas estão magras.
    -   Falta: Endereço completo validados (CEP), Histórico de Contas de Energia (para média real), Tipo de Telhado.

## Plano de Correção (Novo Roadmap Sugerido)
Devemos **interromper** o frontend da Proposta e focar no **Backend Comercial**:

### Sprint 3.1 - Catálogo & Kits (Engenharia)
-   [Schema] Tabela `Product` (Type: MODULE, INVERTER, STRUCTURE).
-   [Schema] Tabela `Kit` (Composição de Products).
-   [API] CRUD de Produtos e Kits.

### Sprint 3.2 - Precificação (Comercial)
-   [Schema] Tabela `PricingRule` (Margem por Integrador, Impostos por Estado).
-   [Service] `PricingService`: Calcula Custo Base + Markup = Preço Final.

Só então voltamos para a **Proposta**.
