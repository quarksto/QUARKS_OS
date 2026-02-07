# Análise do Frontend — Quarks OS

**Data:** 2026-02-02  
**Escopo:** `src/frontend/` — estrutura, uso, integrações e alinhamento ao DS de referência.  
**Base:** Skills de análise (speckit.analyze / implement) + regras MCP/DS.

---

## 1. Stack e Estrutura

| Item | Valor |
|------|--------|
| **Framework** | React 19 + Vite 7 |
| **Roteamento** | react-router-dom v7 |
| **Estilos** | Tailwind CSS 3.4 + PostCSS |
| **UI (parcial)** | Mantine Core 8 + @tabler/icons-react |
| **HTTP** | Axios |
| **Gráficos** | Recharts 3.7 |
| **Fontes** | Geist, Geist Mono (index.html) |
| **Ícones (Dashboard)** | Material Symbols Outlined (Google Fonts) |

**Estrutura de pastas:**

```
src/frontend/src/
├── App.jsx, main.jsx
├── index.css          # DS: technical-card, kpi-*, btn-pill, etc.
├── theme.js           # Mantine theme (solarBlue, solarGold)
├── components/
│   ├── analytics/     # RecentActivity, SalesFunnelChart
│   ├── chat/          # InputArea
│   ├── common/        # DataTable, PageHeader, StatsCard
│   └── layout/        # MainLayout
├── hooks/             # useChat, useDashboardData
├── pages/             # Dashboard, ChatPage, ProposalPage
└── services/          # api.js (axios baseURL localhost:3001/api)
```

---

## 2. O Que Está Feito (Em Uso)

### 2.1 Rotas e páginas

| Rota | Página | Layout | Observação |
|------|--------|--------|------------|
| `/` | `Dashboard` | Nenhum (sidebar própria) | Dashboard com KPIs + kanban, dados de `/api/analytics/dashboard` e `/api/leads/pipeline` |
| `/proposals` | `ProposalPage` | MainLayout | Formulário + preview HTML via `POST /orchestrate/preview-proposal` |
| `/chat` | `ChatPage` | MainLayout | Chat Copilot; `POST /copilot/chat` (multipart, texto + arquivo) |

### 2.2 Componentes efetivamente usados

- **Dashboard.jsx** — Implementação própria (sidebar, header, KPI grid, kanban). Usa `useDashboardData`, classes do DS (`.technical-card`, `.kpi-title`, `.kpi-value`, `.btn-pill`, `.nav-item-*`, `.section-title`, `.badge-ultra-compact`), cores `petroleum`/`solar`, Material Symbols.
- **MainLayout.jsx** — Usado por `/proposals` e `/chat`. Mantine AppShell, NavLink, Tabler Icons, `Outlet` para rotas filhas.
- **InputArea.jsx** — Usado em ChatPage. Campo de texto + upload (imagem/PDF/vídeo/áudio), `accept="image/*,application/pdf,video/*,audio/*"`.
- **ProposalPage.jsx** — Mantine (Container, Grid, Paper, TextInput, NumberInput, Button, LoadingOverlay). Chama `fetch('http://localhost:3001/orchestrate/preview-proposal')`.
- **ChatPage.jsx** — Tailwind (gray/blue). Usa `useChat` e `InputArea`; exibe mensagens e mídia (imagem/vídeo) na resposta.

### 2.3 Hooks e serviços

- **useDashboardData** — `api.get('/analytics/dashboard')` e `api.get('/leads/pipeline')`; polling 30s; retorna `metrics`, `pipeline`, `loading`.
- **useChat** — `axios.post('http://localhost:3001/copilot/chat', formData)` com `message`, `sessionId`, `userId`, `file`; trata 503/413; retorna `messages`, `sendMessage`, `loading`.
- **api.js** — `baseURL: 'http://localhost:3001/api'`, timeout 5s. Usado pelo Dashboard; Chat usa URL absoluta para `/copilot/chat`.

---

## 3. Componentes Não Utilizados (Orfãos)

Estes arquivos existem mas **não são importados** em nenhuma página:

| Componente | Caminho | Estilo | Uso sugerido |
|------------|---------|--------|--------------|
| **StatsCard** | `components/common/StatsCard.jsx` | Mantine Paper, Tabler Icons | KPIs em telas secundárias |
| **PageHeader** | `components/common/PageHeader.jsx` | Mantine Group, Title, Button | Título + CTA em páginas |
| **DataTable** | `components/common/DataTable.jsx` | Mantine Table, ScrollArea | Listagens (leads, propostas) |
| **RecentActivity** | `components/analytics/RecentActivity.jsx` | Mantine Paper, Badge, Tabler Icons | Atividade recente no Dashboard |
| **SalesFunnelChart** | `components/analytics/SalesFunnelChart.jsx` | Mantine Paper + Recharts BarChart | Funil de vendas (gráfico) |

**Impacto:** Dashboard replica padrões (cards, tabelas) inline em vez de reusar esses componentes. Duplicação e possível divergência com o DS (Mantine vs Tailwind do DS de referência).

---

## 4. Alinhamento ao Design System de Referência

**Referência:** `docs/QUARKS_OS_Design_System_v1.md` (DS extraído da tela atual).

| Área | Alinhado | Observação |
|------|----------|------------|
| **Dashboard** | Sim | Usa petroleum/solar, Tailwind, classes do `index.css`, Material Symbols, Geist. É a referência do DS. |
| **ChatPage** | Parcial | Funcionalidade ok; visual em gray/blue (Tailwind genérico), não usa petroleum/solar nem classes do DS. |
| **ProposalPage** | Parcial | Mantine; não usa `.technical-card`, `.kpi-*`, petroleum/solar. |
| **MainLayout** | Parcial | Mantine + Tabler Icons; links para `/dashboard`, `/leads`, `/kits`, `/settings` — nem todas as rotas existem. |

**Resumo:** A única tela 100% alinhada ao DS de referência é o Dashboard. Chat e Proposals podem ser ajustados para usar os mesmos tokens e componentes do DS.

---

## 5. Navegação e Rotas

- **Problema:** MainLayout tem link "Dashboard" para `/dashboard`, mas no `App.jsx` o Dashboard está na rota **`/`**. Acesso a `/dashboard` resulta em 404 (não há `<Route path="dashboard" />`).
- **Problema:** Links para `/leads`, `/kits`, `/settings` não têm rotas definidas; ao clicar, a área principal fica em branco ou mostra o layout sem conteúdo.
- **Dashboard:** Sidebar própria com links `href="#"` (Dashboard, Funil de Vendas, Leads, Projetos, etc.) — não navegam para `/proposals` nem `/chat`.

**Recomendação:** Unificar navegação: ou (1) adicionar rota `/dashboard` que renderize o mesmo Dashboard e corrigir links do MainLayout, ou (2) colocar Dashboard dentro do MainLayout e usar `/` como rota do layout. E criar rotas placeholder para `/leads`, `/kits`, `/settings` ou remover do menu até existirem.

---

## 6. Integração com Backend

| Frontend | Backend | Status |
|----------|---------|--------|
| `api.get('/analytics/dashboard')` | `GET /api/analytics/dashboard` | Ok |
| `api.get('/leads/pipeline')` | `GET /api/leads/pipeline` | Ok |
| `useChat` → POST multipart | `POST /copilot/chat` | Ok (URL hardcoded 3001) |
| ProposalPage → POST JSON | `POST /orchestrate/preview-proposal` | Ok (URL hardcoded 3001) |

**Observação:** Base URL do axios é `http://localhost:3001/api`; o chat usa `http://localhost:3001/copilot/chat`. Em produção, convém centralizar em variável de ambiente (ex.: `VITE_API_BASE`).

---

## 7. Resumo Executivo

| Categoria | Status | Ação sugerida |
|-----------|--------|----------------|
| **Páginas em uso** | 3 (Dashboard, Proposals, Chat) | Manter; alinhar Chat e Proposals ao DS |
| **Componentes orfãos** | 5 (StatsCard, PageHeader, DataTable, RecentActivity, SalesFunnelChart) | Reusar no Dashboard/outras telas ou remover |
| **DS de referência** | Dashboard alinhado; demais parcial | Aplicar petroleum/solar e classes do DS em Chat e Proposals |
| **Navegação** | Inconsistente (/, /dashboard, links quebrados) | Ajustar rotas e links; unificar sidebar ou MainLayout |
| **API** | Integrada para analytics, leads, copilot, preview-proposal | Centralizar base URL em env |

---

## 8. Próximos Passos (Sugestão)

1. **Navegação:** Corrigir rota `/dashboard` (ou mover Dashboard para dentro do MainLayout) e tratar `/leads`, `/kits`, `/settings` (rotas ou esconder do menu).
2. **DS:** Aplicar tokens e classes do DS em ChatPage e ProposalPage (petroleum, solar, `.technical-card`, `.btn-pill` onde fizer sentido).
3. **Componentes:** Decidir se StatsCard, PageHeader, DataTable, RecentActivity, SalesFunnelChart entram no Dashboard/outras telas (e, se sim, adaptar ao DS) ou se são removidos/arquivados.
4. **Config:** Introduzir `VITE_API_BASE` e usar em `api.js` e no useChat para evitar URLs hardcoded.

---

*Análise gerada com base na estrutura atual do frontend e no DS de referência (QUARKS_OS_Design_System_v1.md).*
