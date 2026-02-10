# Dashboard e Stitch MCP — Referência

**Objetivo:** Recriar / alinhar a Dashboard com o design no Google Stitch usando o MCP.

## A utilização do MCP foi correta?

**Sim, dentro do que a API permitiu.** A regra do projeto (`.agent/rules/mcp-usage.md`) define o fluxo ideal:

1. **create_project** — iniciar escopo → ✅ usado (projeto "Quarks OS Dashboard Recreated").
2. **generate_screen_from_text** — gerar visual a partir do PRD/spec → ❌ API devolveu 400/404; não foi possível gerar ecrã.
3. **fetch_screen_code** — obter HTML/Tailwind/React do ecrã → ❌ API devolveu 400/404; não foi possível obter código.

O que **foi usado com sucesso**:

- **list_projects** — descobrir o projeto "Quarks OS Sales Dashboard" e os IDs.
- **list_screens** — obter os ecrãs e `screenId` para referência.
- **create_project** — criar projeto para futuras gerações.
- **Referência de design** — o layout (sidebar, KPIs, barra de insight IA, kanban em 4 colunas) foi alinhado ao que existe no Stitch; a UI React foi implementada manualmente seguindo o DS v1.4.

**Conclusão:** O MCP foi usado corretamente para **descoberta e referência**. O fluxo completo (gerar ecrã a partir de texto e obter código) ficou bloqueado por limitações da API Stitch; quando a API estabilizar, deve-se tentar de novo `generate_screen_from_text` e `fetch_screen_code` com os IDs documentados abaixo e adaptar o resultado ao DS.

## Uso do MCP

- **list_projects** — Listou projetos Stitch; existe **Quarks OS Sales Dashboard** no projeto `projects/7139696207493816893`.
- **list_screens** — Listou ecrãs; há ecrãs com título **"Quarks OS Sales Dashboard"** (IDs: `620c07709ffe4d77bc6d338ab9251706`, `d833e20d4d9544eaaffb1debc3789e8f`).
- **create_project** — Criado projeto **Quarks OS Dashboard Recreated** (`projects/16252448291374429293`) para futuras gerações.
- **generate_screen_from_text** / **get_screen** / **fetch_screen_code** — A API Stitch devolve 400/404 com os parâmetros usados; quando a API estabilizar, usar para obter HTML/código do ecrã e integrar.

## Referência Stitch (Dashboard)

| Recurso | Valor |
|---------|--------|
| Projeto | Quarks OS Sales Dashboard |
| Project name (API) | `projects/7139696207493816893` |
| Ecrã Dashboard (ex.) | `projects/7139696207493816893/screens/d833e20d4d9544eaaffb1debc3789e8f` |
| Screen ID curto | `d833e20d4d9544eaaffb1debc3789e8f` |

## Alinhamento com o frontend

As páginas **`Dashboard.jsx`** (legado) e **`DashboardRefactored.jsx`** (ativa em `/`) e os componentes em **`src/frontend/src/components/dashboard/`** estão alinhados com:

- **Design System** (`docs/QUARKS_OS_Design_System_v1.md`)
- **Análise** (`docs/DASHBOARD_ANALYSIS.md`)
- **Layout do Stitch** “Quarks OS Sales Dashboard” (listado via MCP): sidebar, KPIs, barra de insight IA, kanban em 4 colunas (Triagem, Qualificação, Proposta, Negociação).

Quando **fetch_screen_code** ou **get_screen** funcionarem com a API, usar o `projectId` e `screenId` acima para obter o HTML do ecrã Stitch e reutilizar ou comparar com o React.

---

## Layout único e módulos (2026-02)

Todos os módulos usam o **mesmo shell** (Sidebar + Header + main) e o **Design System v1.4**:

- **DashboardShell** (`src/frontend/src/components/dashboard/DashboardShell.jsx`) — layout reutilizável: Sidebar + DashboardHeader + main. Usado por Dashboard, Leads, Propostas, Chat IA, Projetos, Dimensionamento IA, Cronograma.
- **DashboardSidebar** — navegação com rotas reais: `/`, `/dashboard`, `/leads`, `/chat`, `/proposals`, `/projetos`, `/dimensionamento`, `/cronograma`. Estado colapsado persistido em `localStorage` (LayoutContext).
- **Referência de design por módulo:** A Dashboard é a referência principal (layout Stitch "Quarks OS Sales Dashboard"). Para novas telas (Leads, Propostas, Projetos, etc.), usar **list_projects** / **list_screens** para inspecionar projetos Stitch "Quarks OS" e alinhar estrutura (seções, cards) ao Stitch; a implementação é feita em React com classes do DS (technical-card, kpi-title, btn-pill, etc.). Opcional: quando a API permitir, **generate_screen_from_text** com prompt que inclua "light theme, petroleum and solar palette, no gradients" e adaptar o resultado ao DS.

---

## Projeto "Quarks OS - Telas do App" (gerado via MCP)

As telas do app foram geradas no Stitch com **create_project** + **generate_screen_from_text** (prompts alinhados ao DS: light theme, petroleum #0F4C5C, solar, sem gradientes).

| Recurso | Valor |
|---------|--------|
| Projeto | Quarks OS - Telas do App |
| Project name (API) | `projects/5019214678898543770` |

### Telas geradas

| Tela no app | Título Stitch | Screen name (API) |
|-------------|----------------|-------------------|
| Dashboard | Quarks OS Main Dashboard | `projects/5019214678898543770/screens/75202024479348d5b9f5dae6885283a2` |
| Leads | Leads & Clientes List View | `projects/5019214678898543770/screens/91a19bf9a13b4ecfa883b5816cdccb09` |
| Propostas | Proposal Generator Screen | `projects/5019214678898543770/screens/0e843174bc4f43fc8422c111af7416ae` |
| Chat IA | Quarks OS Chat IA Interface | `projects/5019214678898543770/screens/b5fdb03179ac4030aeff379c2bf2e2ed` |
| Projetos | Projects Under Construction Screen | `projects/5019214678898543770/screens/d9347d1f874c457d84c331b0c7140c63` |
| Dimensionamento IA | Dimensionamento IA Under Construction | `projects/5019214678898543770/screens/695052aa6f8f4e8ca3f9f58d9cd609f0` |
| Cronograma | Schedule Coming Soon Screen | `projects/5019214678898543770/screens/b0a514c6124545eaba2b3baa571baafc` |

Cada tela tem **screenshot** e **htmlCode** com `downloadUrl`. Use **get_screen** ou **fetch_screen_code** com o `name` da screen para obter código HTML/React e comparar ou integrar ao frontend.
