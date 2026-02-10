# Auditoria: Arquitetura e Fluxos do Frontend

Documento para entender o que está certo, o que está confuso e o que falta no frontend do Quarks OS.

---

## 1. Mapa de rotas (App.jsx)

| Rota | Página | Layout | No menu? |
|------|--------|--------|----------|
| `/` | DashboardRefactored | ProtectedLayout | — (redirect raiz) |
| `/dashboard` | DashboardRefactored | ProtectedLayout | Sim (Dashboard) |
| `/workspace` | SalesWorkspace | ProtectedLayout | Sim (Workspace) |
| `/funnel` | LeadsPage | ProtectedLayout | Sim (Funil) |
| `/leads` | LeadsPage | ProtectedLayout | Sim (Leads) |
| `/leads/:id` | LeadDetailPage | ProtectedLayout | Não (entra por clique/link) |
| `/clients` | ClientsPage | ProtectedLayout | **Não** |
| `/clients/:id` | ClientDetailPage | ProtectedLayout | Não |
| `/proposals` | ProposalsListPage | ProtectedLayout | Sim (Propostas) |
| `/proposals/new` | ProposalPage | ProtectedLayout | Não (entra por botão) |
| `/proposals/:id` | ProposalDetailPage | ProtectedLayout | Não (entra por lista/link) |
| `/chat` | ChatPage | ProtectedLayout | **Não** |
| `/projetos` | ProjetosPage | ProtectedLayout | Sim (Projetos) |
| `/dimensionamento` | DimensionamentoPage | ProtectedLayout | Sim (I.A. Dimension) |
| `/cronograma` | CronogramaPage | ProtectedLayout | **Não** |
| `/products` | ProductsPage | ProtectedLayout | Sim (Produtos/Kits) |
| `/services` | ServicesPage | ProtectedLayout | Sim (Serviços) |
| `/pricing-rules` | PricingRulesPage | ProtectedLayout | Sim (Preços) |
| `/kits` | KitsPage | ProtectedLayout | **Não** |
| `/settings` | SettingsPage | ProtectedLayout | **Não** |
| `/login` | LoginPageAdvanced | — | Público |
| `/register` | RegisterPage | — | Público |
| `/forgot-password` | ForgotPasswordPage | — | Público |
| `/view-proposal/:slug` | ProposalViewPublicPage | — | Público |
| `*` | Navigate to `/` | — | 404 → Dashboard |

**Menu (DashboardSidebar):** Dashboard, Workspace, Funil, Leads, Propostas, Serviços, Preços, Projetos, I.A. Dimension, Produtos/Kits.  
**Fora do menu:** Clients, Chat, Cronograma, Kits (página separada), Settings.

---

## 2. O que está confuso

### 2.1 Dois “homes” de leads

- **LeadsPage** é usada em **duas rotas**: `/funnel` (Funil) e `/leads` (Leads). Mesma página, dois itens no menu → redundante e confuso.
- **SalesWorkspace** (`/workspace`) é outra forma de ver o pipeline (lista + drawer + painel). Ou seja:
  - **Dashboard** → visão geral + clique no lead abre **modal** (LeadDetailModal).
  - **Funil / Leads** → lista/kanban + clique abre **modal** (LeadDetailModal).
  - **Workspace** → lista + painel + **drawer** (LeadDetailDrawer) com link “Ver ficha” para `/leads/:id`.

Resultado: **três jeitos** de ver a lista de leads e **dois jeitos** de ver o detalhe (modal/drawer vs página cheia).

### 2.2 Detalhe do lead: modal vs página

- **LeadDetailModal** (Dashboard + LeadsPage): abre em overlay; dentro dele, LeadModalJourneyBanner navega para `/leads/:id`.
- **LeadDetailDrawer** (SalesWorkspace): drawer lateral com link para `/leads/:id`.
- **LeadDetailPage** (`/leads/:id`): página dedicada com abas (Visão Geral, Dados, Qualificação, Proposta, Documentos, Histórico).

Fluxo recomendado para o usuário não está explícito: “sempre abrir ficha em página” vs “modal rápido e link para ficha” vs “workspace com drawer”.

### 2.3 Dados do pipeline em dois lugares

- **useDashboardData** (DashboardRefactored, LeadsPage): chama `GET /leads/pipeline`, analytics, etc.; polling 30s.
- **SalesWorkspace**: faz seu próprio `GET /leads/pipeline` e gerencia estado local. Lógica duplicada, sem hook compartilhado.

### 2.4 Nova proposta e leadId

- **LeadDetailPage** navega para `/proposals/new?leadId=${lead.id}`.
- **ProposalPage** usa `useParams()` para pegar `leadId`; a rota é só `/proposals/new` (sem `:leadId`). Ou seja, **leadId nunca vem da URL** com a rota atual. O correto é ler **query string** (`useSearchParams().get('leadId')`). **Bug de fluxo**: nova proposta a partir do lead pode não carregar o lead.

### 2.5 Rotas sem entrada no menu

- `/clients`, `/chat`, `/cronograma`, `/kits`, `/settings` existem mas não aparecem na sidebar. Usuário só chega por link direto ou outro fluxo (se houver).

### 2.6 Páginas/arquivos não usados nas rotas

- **LeadsListPage**: importada no App, **nenhuma rota** usa → código morto.
- **Dashboard.jsx**: existe; App usa **DashboardRefactored** → possível legado.
- **ProposalPageNew.jsx**: existe; App usa **ProposalPage** para `/proposals/new` → duplicado/legado.
- **LoginPage.jsx** / **LoginPageStitch.jsx**: existem; App usa **LoginPageAdvanced** → legado/alternativas.
- **HybridShell**: não é rota; componentes do `hybrid/` são usados **dentro de SalesWorkspace**.

---

## 3. O que está certo

- **ProtectedRoute** + **ProtectedLayout** aplicados de forma consistente nas rotas privadas.
- **UnifiedShell** + **DashboardSidebar** + **AdaptiveHeader** reutilizados (DashboardShell) na maioria das páginas.
- **LeadDetailPage** tem fluxo documentado (carregamento GET, abas, PATCH status/lead); ver `docs/WORKFLOW_LEAD_DETAIL_PAGE.md`.
- **API centralizada** em `services/api.js` (axios + baseURL `/api` + interceptor de token).
- **useDashboardData** concentra KPIs + pipeline + activity + funnel para Dashboard e LeadsPage (evita duplicar em duas páginas, mas SalesWorkspace não usa).
- Navegação para **ficha do lead** (`/leads/:id`) existe a partir de GlobalSearch, Kanban (quando não há onLeadClick), LeadModalJourneyBanner e LeadDetailDrawer.

---

## 4. O que falta (recomendações)

### 4.1 Decisão de fluxo de leads

- **Unificar** “lista de leads” em um único conceito (ou um único entry point no menu):
  - Opção A: manter **Leads** como lista/kanban principal; **Funil** pode virar apenas um filtro/aba ou ser removido do menu.
  - Opção B: definir **Workspace** como “modo vendas” e **Leads** como “modo gestão”; deixar explícito na UI (ex.: modo no header).
- **Definir** quando usar modal/drawer vs página:
  - Ex.: “Clique no lead sempre abre a **página** `/leads/:id`” (e remover ou reduzir uso de LeadDetailModal/LeadDetailDrawer), **ou**
  - “Modal/drawer para visão rápida; botão ‘Abrir ficha’ vai para `/leads/:id`” (e garantir que esse botão exista em todos os contextos).

### 4.2 Corrigir nova proposta com leadId

- Em **ProposalPage**, ler `leadId` da **query string** (ex.: `useSearchParams().get('leadId')`) em vez de `useParams()`.
- Manter navegação atual: `/proposals/new?leadId=:id`.

### 4.3 Reaproveitar dados do pipeline no Workspace

- **SalesWorkspace** passar a usar **useDashboardData** (ou um hook compartilhado que chame `GET /leads/pipeline`) em vez de buscar pipeline sozinho. Assim: uma única fonte de verdade, menos duplicação e comportamento alinhado.

### 4.4 Menu vs rotas

- **Incluir no menu** (ou em submenu/header) as rotas que devem ser acessíveis: ex. **Clientes** (`/clients`), **Configurações** (`/settings`), **Chat** (`/chat`) se forem parte do produto.
- **Remover do menu** ou **unificar** itens redundantes (ex.: Funil vs Leads, ou Kits vs Produtos) conforme decisão de produto.

### 4.5 Limpeza de código

- **Remover import e referências a LeadsListPage** do App (ou criar rota que a use, se for o caso).
- Marcar ou remover páginas legado: **Dashboard.jsx**, **ProposalPageNew.jsx**, **LoginPage.jsx**, **LoginPageStitch.jsx** (ou documentar quando usar cada uma).

### 4.6 Documentação de fluxos

- Manter **WORKFLOW_LEAD_DETAIL_PAGE.md** para a ficha do lead.
- Adicionar um **fluxo “Nova proposta”**: entrada (onde?), query leadId, ProposalPage, SalesWizard, POST e redirect.
- Documentar **fluxo “Workspace”**: entrada, pipeline, drawer, link para `/leads/:id`.

---

## 5. Diagrama resumido (fluxos de lead)

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    ENTRADAS                              │
                    └─────────────────────────────────────────────────────────┘
                      │                │                │                │
                      ▼                ▼                ▼                ▼
              /dashboard         /funnel | /leads   /workspace    /leads/:id
                      │                │                │                │
                      ▼                ▼                ▼                │
              LeadDetailModal    LeadDetailModal   LeadDetailDrawer      │
              (modal)            (modal)           (drawer)              │
                      │                │                │                │
                      └────────────────┴────────────────┴────────────────┘
                                        │
                          "Ver ficha" / link / search
                                        │
                                        ▼
                              /leads/:id (LeadDetailPage)
                                        │
                          "Proposta" → /proposals/new?leadId=...
                                        │
                                        ▼
                              ProposalPage (leadId via query — CORRIGIR)
```

---

## 6. Checklist de ação

- [ ] Decidir: um ou dois entry points no menu para “leads” (Funil vs Leads vs Workspace).
- [ ] Decidir: detalhe do lead sempre em página ou modal/drawer + “Abrir ficha”.
- [ ] Corrigir ProposalPage: ler `leadId` de `useSearchParams()` em `/proposals/new?leadId=...`.
- [ ] SalesWorkspace usar hook compartilhado para pipeline (ex. useDashboardData ou useLeadsPipeline).
- [ ] Colocar no menu (ou documentar): Clients, Settings, Chat, Cronograma, Kits (se aplicável).
- [ ] Remover LeadsListPage do App ou adicionar rota; limpar/arquivar páginas legado (Dashboard, ProposalPageNew, logins antigos).
- [ ] Documentar fluxo “Nova proposta” e “Workspace” (como em WORKFLOW_LEAD_DETAIL_PAGE.md).

Com isso dá para entender o que está certo, o que está confuso e o que falta na arquitetura de fluxos do frontend.
