# Implementation Plan: Dashboard Refatorada (Agentes + MCP Stitch)

**Branch**: `02-dashboard-refactor-stitch` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)

## Summary

Refatorar a Dashboard usando agentes speckit (spec → plan → tasks → implement) e referência MCP Stitch. Nova Dashboard composta por componentes reutilizáveis, alinhada ao DS v1.4 e à estrutura do sistema (PRD, Technical Architecture). Dados via useDashboardData (APIs /analytics/dashboard e /leads/pipeline). Strangler: nova página + componentes; rota `/` passa a usar a nova Dashboard.

## Technical Context

**Language/Version**: JavaScript (React 18), Node 18+  
**Primary Dependencies**: React, React Router, Tailwind CSS, Material Symbols, useDashboardData + api service  
**Storage**: N/A (dados via API em tempo real)  
**Testing**: Manual / reprodução via navegador; testes unitários opcionais  
**Target Platform**: Web (browser)  
**Project Type**: web (frontend em src/frontend)  
**Performance Goals**: Carregamento da Dashboard < 3s com dados da API  
**Constraints**: Manter contrato useDashboardData; não alterar APIs existentes  
**Scale/Scope**: Uma página principal (/) + componentes dashboard

## Constitution Check

- Sem novas dependências além das já no projeto (React, Tailwind, api).
- Estrutura de pastas existente: src/frontend/src/pages, components; specs/02-dashboard-refactor-stitch para documentação.

## Project Structure

### Documentation (this feature)

```text
specs/02-dashboard-refactor-stitch/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/   (opcional)
```

### Source Code (repository root)

```text
src/frontend/src/
├── components/
│   └── dashboard/           # NOVO: componentes da Dashboard refatorada
│       ├── DashboardSidebar.jsx
│       ├── DashboardHeader.jsx
│       ├── InsightBar.jsx
│       ├── KpiGrid.jsx
│       └── KanbanBoard.jsx
├── pages/
│   ├── Dashboard.jsx        # Existente (legado ou substituído)
│   └── DashboardRefactored.jsx  # NOVO: página que compõe os componentes
├── hooks/
│   └── useDashboardData.js  # Existente (sem alteração de contrato)
└── services/
    └── api.js               # Existente
```

**Structure Decision**: Strangler pattern — criar DashboardRefactored.jsx e componentes em components/dashboard/; em App.jsx trocar import de Dashboard para DashboardRefactored (ou manter rota / e apontar para DashboardRefactored). Documentação Stitch em docs/DASHBOARD_STITCH_MCP.md.

## MCP Stitch Usage

- **list_projects** / **list_screens**: Referência de design (projeto Quarks OS Sales Dashboard, screens listados). Documentação em docs/DASHBOARD_STITCH_MCP.md.
- **Design**: Layout e tokens seguem DS v1.4; Stitch usado como referência visual quando fetch_screen_code/get_screen estiverem disponíveis na API.

## Data Model

Sem novo modelo de dados. Entidades já existentes:

- **Metrics**: activeLeads, conversionRate, revenue, automations (e opcionalmente proposalsSent) — retorno de GET /analytics/dashboard.
- **Pipeline**: objeto com chaves NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION; cada valor é array de leads com id, name, location, consumption — retorno de GET /leads/pipeline.

## Contracts

- **useDashboardData()**: retorna { metrics, pipeline, loading }. Sem alteração.
- **APIs**: GET /analytics/dashboard, GET /leads/pipeline. Sem alteração.
