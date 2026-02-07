# Feature Specification: Dashboard Refatorada (Agentes + MCP Stitch)

**Feature Branch**: `02-dashboard-refactor-stitch`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: Refatorar a Dashboard utilizando agentes skills e MCP Stitch para criar uma nova Dashboard que atenda à estrutura do sistema, desenvolvendo outra nova utilizando nossos agentes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard alinhada ao sistema (Priority: P1)

O utilizador (Integrador/Comercial) abre a aplicação e vê uma Dashboard que reflete a estrutura do Quarks OS: CRM solar, pipeline comercial, KPIs (leads, conversão, pipeline, automações) e design system (petroleum, solar, technical-card, kanban).

**Why this priority**: Garante que a nova Dashboard é a face principal do sistema e está alinhada ao PRD e à arquitetura.

**Independent Test**: Aceder a `/` e verificar sidebar, header, barra de insight IA, grid de 4 KPIs e secção Fluxo Comercial (kanban) com dados da API.

**Acceptance Scenarios**:

1. **Given** utilizador na raiz da app, **When** a página carrega, **Then** são exibidos sidebar (petroleum), header com título Dashboard e botão + NOVO NEGÓCIO, barra de insight IA, 4 cards KPI e kanban em 4 colunas (Triagem, Qualificação, Proposta, Negociação).
2. **Given** dados da API disponíveis, **When** useDashboardData retorna, **Then** métricas e pipeline são exibidos nos componentes corretos (sem regressão de contratos).

---

### User Story 2 - Referência Stitch MCP e Design System (Priority: P1)

A nova Dashboard utiliza o MCP Stitch como referência de design (projeto/screens listados) e obedece ao Design System (DS v1): classes `.technical-card`, `.kpi-title`, `.kpi-value`, `.btn-pill`, `.section-title`, cores petroleum/solar, layout documentado em QUARKS_OS_Design_System_v1.md.

**Why this priority**: Consistência visual e rastreabilidade ao Stitch (list_projects, list_screens) e ao DS.

**Independent Test**: Verificar que nenhum componente introduz cores ou classes fora do DS; documentação DASHBOARD_STITCH_MCP.md referenciada.

**Acceptance Scenarios**:

1. **Given** a nova Dashboard, **When** inspecionada, **Then** todos os blocos visuais usam apenas tokens e classes do DS (petroleum, solar, technical-card, badge-ultra-compact, etc.).
2. **Given** documentação de integração Stitch, **When** existir, **Then** a Dashboard ou o módulo referenciam specs/02-dashboard-refactor-stitch e docs/DASHBOARD_STITCH_MCP.md.

---

### User Story 3 - Estrutura modular (agentes/speckit) (Priority: P2)

A Dashboard é construída como composição de componentes reutilizáveis (ex.: Sidebar, DashboardHeader, InsightBar, KpiGrid, KanbanBoard), permitindo manutenção e testes por parte dos fluxos speckit (spec → plan → tasks → implement).

**Why this priority**: Facilita evolução e alinhamento ao workflow dos agentes (Blast Radius, Strangler quando aplicável).

**Independent Test**: Existência de componentes em `src/frontend/src/components/dashboard/` (ou equivalente) consumidos por uma página Dashboard única.

**Acceptance Scenarios**:

1. **Given** o código da nova Dashboard, **When** analisado, **Then** existe pelo menos uma página que importa componentes dedicados (sidebar, header, KPIs, kanban) em vez de um único ficheiro monolítico.
2. **Given** uma alteração num componente (ex.: KpiGrid), **When** feita, **Then** o impacto está limitado a esse componente e à página que o usa (blast radius controlado).

---

### Edge Cases

- API `/analytics/dashboard` ou `/leads/pipeline` falha: Dashboard deve mostrar estado de loading/erro sem quebrar layout (mensagem ou fallback).
- Pipeline vazio numa coluna: coluna deve mostrar estado "Vazio" ou placeholder sem erro.
- Sidebar colapsada: layout deve manter usabilidade (ícones visíveis, expansão funcional).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A Dashboard MUST exibir sidebar colapsável com navegação Operacional (Dashboard, Funil, Leads, Chat IA, Propostas) e Engenharia (Projetos, Dimensionamento IA, Cronograma), conforme DS.
- **FR-002**: A Dashboard MUST exibir header com título "Dashboard", subtítulo de contexto, indicador Live Data/Syncing e CTA "+ NOVO NEGÓCIO" (solar).
- **FR-003**: A Dashboard MUST exibir barra de insight IA (mensagem contextual e CTA "Ver detalhes").
- **FR-004**: A Dashboard MUST exibir grid de 4 KPI cards: Leads Gerados, Conversão, Pipeline Ativo, Automações, consumindo `useDashboardData().metrics`.
- **FR-005**: A Dashboard MUST exibir secção Fluxo Comercial com kanban em 4 colunas (Triagem, Qualificação, Proposta, Negociação), consumindo `useDashboardData().pipeline`.
- **FR-006**: A Dashboard MUST usar apenas tokens e classes do Design System (docs/QUARKS_OS_Design_System_v1.md) e referenciar integração Stitch MCP (docs/DASHBOARD_STITCH_MCP.md).
- **FR-007**: A Dashboard MUST ser implementada como composição de componentes (página + componentes em pasta dedicada) para alinhamento ao workflow speckit.

### Key Entities

- **Metrics**: activeLeads, conversionRate, revenue, automations (e opcionalmente proposalsSent) — contrato da API `/analytics/dashboard`.
- **Pipeline**: objeto com chaves NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION; cada valor é array de leads com id, name, location, consumption — contrato da API `/leads/pipeline`.
- **Stitch reference**: projeto Quarks OS Sales Dashboard, screens listados via MCP (documentação apenas; código gerado por Stitch quando API permitir).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Utilizador completa visualização da Dashboard (sidebar + KPIs + kanban) em menos de 3 segundos após carregamento da app (dados da API permitindo).
- **SC-002**: Zero regressão nos contratos de API já consumidos pelo hook useDashboardData (métricas e pipeline).
- **SC-003**: Nova Dashboard substitui ou coexiste com a atual sem quebrar rotas existentes (/ e /chat, /proposals).
- **SC-004**: Código da Dashboard está organizado em componentes reutilizáveis e documentado em specs/02-dashboard-refactor-stitch.
