# Tasks: Dashboard Refatorada (Agentes + MCP Stitch)

**Input**: specs/02-dashboard-refactor-stitch/spec.md, plan.md  
**Prerequisites**: plan.md, spec.md

## Path Conventions

- Frontend: `src/frontend/src/`
- Componentes dashboard: `src/frontend/src/components/dashboard/`
- Página: `src/frontend/src/pages/DashboardRefactored.jsx`

---

## Phase 1: Setup (Estrutura)

- [x] T001 Criar pasta `src/frontend/src/components/dashboard/` para componentes da Dashboard refatorada

---

## Phase 2: Componentes (US1 + US2 — DS + Stitch)

**Goal**: Componentes reutilizáveis alinhados ao DS e referência Stitch.

- [x] T002 [P] Criar `DashboardSidebar.jsx`: sidebar colapsável (petroleum), logo, busca, menu Operacional/Engenharia, rodapé. Props: collapsed, onToggle, navItemClass. Ref.: DS v1 + docs/DASHBOARD_STITCH_MCP.md
- [x] T003 [P] Criar `DashboardHeader.jsx`: header h-16, título Dashboard, subtítulo, indicador Live Data/Syncing, botão + NOVO NEGÓCIO. Props: loading, onNewDeal. Ref.: DS v1
- [x] T004 [P] Criar `InsightBar.jsx`: barra de insight IA (petroleum/[0.02]), mensagem contextual, CTA "Ver detalhes". Props: onViewDetails. Ref.: DS v1
- [x] T005 [P] Criar `KpiGrid.jsx`: grid 4 cards (Leads Gerados, Conversão, Pipeline Ativo, Automações). Props: metrics. Classes: technical-card, kpi-title, kpi-value, badge-ultra-compact. Ref.: DS v1
- [x] T006 [P] Criar `KanbanBoard.jsx`: secção Fluxo Comercial, 4 colunas (Triagem, Qualificação, Proposta, Negociação), cards de lead. Props: pipeline, columnTitles. Classes: section-title, technical-card, support-text-sm. Ref.: DS v1

---

## Phase 3: Página e Rota (US1 + US3)

**Goal**: Nova Dashboard como composição e rota / ativa.

- [x] T007 Criar `pages/DashboardRefactored.jsx`: compor Sidebar, Header, InsightBar, KpiGrid, KanbanBoard; usar useDashboardData(); estado sidebarCollapsed; navegação (Link, useNavigate). Ref.: spec FR-001 a FR-007
- [x] T008 Em `App.jsx`, trocar import de `Dashboard` por `DashboardRefactored` na rota `/` (ou manter Dashboard e re-exportar DashboardRefactored como default em Dashboard.jsx — conforme Strangler escolhido)
- [x] T009 Adicionar comentário em DashboardRefactored.jsx e/ou spec referenciando specs/02-dashboard-refactor-stitch e docs/DASHBOARD_STITCH_MCP.md

---

## Phase 4: Verificação

- [x] T010 Verificar que useDashboardData não foi alterado (contrato mantido)
- [x] T011 Verificar que nenhum componente introduz cores ou classes fora do DS (lint/visual)

---

**Checkpoint**: Todas as tarefas [X] = Dashboard refatorada ativa em `/`, componentes modulares, DS e Stitch referenciados.
