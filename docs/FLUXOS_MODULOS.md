# Fluxos dos Módulos — Quarks OS

**Objetivo:** Documentar o fluxo de dados e processos de cada módulo do sistema, no mesmo método usado em [FRONTEND_BACKEND_PRISMA.md](FRONTEND_BACKEND_PRISMA.md) e nas análises (DASHBOARD_ANALYSIS, O_QUE_FALTA, ANALISE_ALTERACOES_SISTEMA).

**Base:** PRD v2.1, Technical Architecture, specs 01–03, plano *Fluxo e Jornada* ([JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md)).

**Data:** 2026-02-03

---

## Visão geral dos módulos

| Módulo | Rota(s) principal(is) | Agente/Service | Entidades Prisma |
|--------|----------------------|----------------|------------------|
| Analytics | `/api/analytics/*` | AnalyticsDomainAgent | Lead, Proposal |
| Leads (CRM) | `/api/leads/*` | LeadDomainAgent (+ Analytics para activity) | Lead |
| Copilot IA | `/api/copilot/chat` | CopilotDomainAgent (Maestro) | AgentSession, AgentMessage |
| Proposta (Orquestração) | `/orchestrate/preview-proposal`, `/orchestrate/create-proposal` | Maestro (Calc, Product, Pricing, Proposal) + calc_engine (Python) | Lead, Proposal, Kit, Product, Tariff |
| Dashboard | Frontend (consumidor) | — | Consome Analytics + Leads |
| Auth | `/auth/*` | Auth routes | User |
| Marketing | `/api/marketing/webhook/:source` | Marketing adapters → Maestro CREATE_LEAD_WORKFLOW | Lead (via LeadDomainAgent) |

**Nota:** Webhook montado em `POST /api/marketing/webhook/:source` (source: facebook, google, tiktok).

---

## 1. Módulo Analytics

**Objetivo:** Fornecer métricas de dashboard, funil de vendas e atividade recente para o frontend.

### 1.1 Fluxo de dados

```
Frontend (Dashboard, etc.)
    ↓ GET /api/analytics/dashboard | /funnel | /activity
Backend (modules/analytics/routes.js)
    ↓ maestro.agents['analytics'].execute(ACTION, {})
AnalyticsDomainAgent (agents/analytics-domain/index.js)
    ↓ Prisma Client
PostgreSQL (Lead, Proposal — count, aggregate, findMany)
```

### 1.2 Ações e rotas

| Rota (front chama) | Ação do agente | Modelos Prisma | Retorno |
|--------------------|----------------|----------------|---------|
| `GET /api/analytics/dashboard` | GET_DASHBOARD_METRICS | Lead (count por status), Proposal (count, aggregate) | activeLeads, proposalsSent, conversionRate, revenue, automations |
| `GET /api/analytics/funnel` | GET_SALES_FUNNEL | Lead (count por status) | Objeto por estágio (NEW, CONTACTED, …) |
| `GET /api/analytics/activity` | GET_RECENT_ACTIVITY | Proposal, Lead (findMany recentes) | Lista de atividades |
| `GET /api/leads/:id/activity` | GET_LEAD_ACTIVITY (via analytics) | Lead, Proposal | Timeline do lead |

### 1.3 Configuração e teste

- **Backend:** Nenhuma variável específica; usa `DATABASE_URL` do Prisma.
- **Teste:** `GET http://localhost:3001/api/analytics/dashboard` deve retornar JSON com métricas.

---

## 2. Módulo Leads (CRM)

**Objetivo:** Pipeline comercial (kanban), criação de lead, atualização de status e timeline por lead. O detalhe do lead é acessado pela **página** `/leads/:id` (LeadDetailPage); ao clicar em um card no Kanban ou em uma linha na lista de leads, o frontend navega para essa página (o modal de detalhe não é mais usado nesses fluxos).

### 2.1 Fluxo de dados

```
Frontend (Dashboard Kanban, LeadsPage, etc.)
    ↓ GET /api/leads/pipeline | POST /api/leads | PATCH /api/leads/:id/status | GET /api/leads/:id/activity
Backend (modules/leads/routes.js)
    ↓ maestro.agents['lead'] ou maestro.agents['analytics'] (activity)
LeadDomainAgent (agents/lead-domain/index.js) / AnalyticsDomainAgent (activity)
    ↓ Prisma Client
PostgreSQL (Lead)
```

### 2.2 Ações e rotas

| Rota (front chama) | Ação do agente | Modelos Prisma | Observação |
|--------------------|----------------|----------------|------------|
| `GET /api/leads/pipeline` | GET_PIPELINE | Lead (findMany, agrupado por status) | Kanban: NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION, CLOSED_* |
| `POST /api/leads` | CREATE_LEAD | Lead (create) | Body: name, email, phone, consumption, location, distributor, ownerId |
| `PATCH /api/leads/:id` | UPDATE_LEAD | Lead (update) | Atualização parcial do lead |
| `PATCH /api/leads/:id/status` | UPDATE_STATUS | Lead (update status) | Body: { status } — drag no kanban |
| `GET /api/leads/:id` | GET_LEAD | Lead | Detalhe completo do lead |
| `GET /api/leads/:id/activity` | GET_LEAD_ACTIVITY | Lead, Proposal (via Analytics) | Timeline do lead |
| `GET /api/leads/:id/solar` | (proxy) | — | Insights Solar API (Google) |

### 2.3 Configuração e teste

- **Backend:** Prisma + Lead com ownerId (User). Seed ou criar User para ownerId.
- **Teste:** `GET http://localhost:3001/api/leads/pipeline` retorna objeto com chaves de status e arrays de leads.

---

## 3. Módulo Copilot IA

**Objetivo:** Chat multimodal (texto, imagem, vídeo, áudio) com Gemini; ferramentas (tools) podem invocar Maestro (ex.: criar proposta); sessão e histórico em Prisma.

### 3.1 Fluxo de dados

```
Frontend (ChatPage, useChat.js)
    ↓ POST /api/copilot/chat (multipart: message, userId?, sessionId?, file?)
Backend (agents/copilot-domain/routes.js)
    ↓ copilotChatUpload (multer), handleMulterError
    ↓ maestro.agents['copilot'].execute('CHAT', { userId, sessionId, message, file })
CopilotDomainAgent (agents/copilot-domain/index.js)
    ↓ Gemini (GoogleGenAI), session.js (getOrCreateSession), tools.js (Maestro workflows)
    ↓ Prisma (AgentSession, AgentMessage)
PostgreSQL (agent_sessions, agent_messages)
```

### 3.2 Ações e rotas

| Rota (front chama) | Ação | Modelos Prisma | Observação |
|--------------------|------|----------------|------------|
| `POST /api/copilot/chat` | CHAT | AgentSession, AgentMessage | Body: message, userId?, sessionId?; multipart: file (opcional). Resposta: texto + sessionId. |

### 3.3 Configuração e teste

- **Backend:** `GOOGLE_API_KEY` no `.env` (lazy init: servidor sobe sem chave; erro 503 na primeira chamada ao chat se faltar).
- **Frontend:** `VITE_API_BASE`; useChat usa `${API_BASE}/api/copilot/chat` (ou path configurado no projeto).
- **Teste:** POST com `message: "Olá"` e opcionalmente `file`; verificar resposta com conteúdo e sessionId.

---

## 4. Módulo Proposta (Orquestração)

**Objetivo:** Preview e criação de proposta solar: cálculo de geração (Python calc_engine), kit, precificação e persistência da proposta (Lead, Proposal, Kit, Product).

### 4.1 Fluxo de dados — Preview

```
Frontend (ProposalPage)
    ↓ POST /orchestrate/preview-proposal
    Body: { customer?, consumption, distributor? }
Backend (server.js)
    ↓ maestro.execute('PREVIEW_PROPOSAL_WORKFLOW', req.body)
Maestro (workflowPreviewProposal)
    ↓ 1) CalcDomainAgent — CALCULATE_GENERATION (consumo → Python calc_engine)
    ↓ 2) ProductDomainAgent — FIND_BEST_KIT (systemSizeKwp)
    ↓ 3) PricingDomainAgent — CALCULATE_PRICE (kit, state)
    ↓ 4) ProposalDomainAgent — PREVIEW_HTML (calculation, kit, pricing, customer)
Python (calc_engine): geração kWh, payback, etc.
PostgreSQL (Lead, Kit, Product, Tariff indiretos; preview não persiste proposta)
```

### 4.2 Fluxo de dados — Criar proposta

```
Frontend / integração
    ↓ POST /orchestrate/create-proposal (authenticate, authorize COMERCIAL|ADMIN)
    Body: { leadId, consumption }
Backend (server.js)
    ↓ maestro.execute('CREATE_PROPOSAL_WORKFLOW', { leadId, consumption })
Maestro (workflowCreateProposal)
    ↓ 1) LeadDomainAgent — GET_LEAD(leadId)
    ↓ 2) CalcDomainAgent — CALCULATE_GENERATION (consumo ou lead.consumption)
    ↓ 3) ProductDomainAgent — FIND_BEST_KIT (systemSizeKwp)
    ↓ 4) PricingDomainAgent — CALCULATE_PRICE (kit, state do lead)
    ↓ 5) ProposalDomainAgent — CREATE_DRAFT (lead, calculation, kit, pricing)
PostgreSQL (Proposal criada; Lead, Kit, Product, Tariff usados no fluxo)
```

### 4.3 Ações e rotas

| Rota (front chama) | Workflow Maestro | Agentes envolvidos | Modelos Prisma / externo |
|--------------------|------------------|--------------------|---------------------------|
| `POST /orchestrate/preview-proposal` | PREVIEW_PROPOSAL_WORKFLOW | calc, product, pricing, proposal | Lead (opcional), Kit, Product, Tariff; Python calc_engine |
| `POST /orchestrate/create-proposal` | CREATE_PROPOSAL_WORKFLOW | lead, calc, product, pricing, proposal | Lead, Proposal, Kit, Product, Tariff; Python calc_engine |

### 4.4 Configuração e teste

- **Backend:** `DATABASE_URL`; Python calc_engine acessível (URL ou in-process conforme implementação).
- **Auth:** create-proposal exige token e role COMERCIAL ou ADMIN.
- **Teste:** POST preview com `{ consumption: 500 }`; POST create com `{ leadId, consumption }` e header de auth.

---

## 5. Módulo Dashboard (Frontend)

**Objetivo:** Tela principal com KPIs, pipeline (kanban) e barra de insight IA; consome apenas APIs (não persiste direto no banco).

### 5.1 Fluxo de dados

```
Usuário (navegador)
    ↓ Página Dashboard (Dashboard.jsx / DashboardRefactored.jsx)
useDashboardData (hook)
    ↓ GET /api/analytics/dashboard
    ↓ GET /api/leads/pipeline
Backend (Analytics + Leads)
    ↓ (ver módulos 1 e 2)
PostgreSQL
```

### 5.2 Contrato de consumo

| Dado exibido | Fonte | Endpoint |
|--------------|--------|----------|
| KPIs (leads ativos, conversão, receita, automações) | Analytics | GET /api/analytics/dashboard |
| Colunas do kanban (leads por estágio) | Leads | GET /api/leads/pipeline |
| Polling | Frontend | setInterval(loadData, 30000) |

### 5.3 Configuração e teste

- **Frontend:** `VITE_API_BASE` (api.js); rotas `/` e `/dashboard` apontam para o mesmo Dashboard.
- **Teste:** Abrir Dashboard; verificar KPIs e cards do pipeline preenchidos (ou vazios se banco sem dados).

---

## 6. Módulo Auth

**Objetivo:** Registro e login de usuários (RBAC); proteção de rotas no backend.

### 6.1 Fluxo de dados

```
Frontend (login/register)
    ↓ POST /auth/register | POST /auth/login
Backend (modules/auth/routes.js)
    ↓ (hash de senha, JWT, etc.)
Prisma (User)
PostgreSQL (users)
```

### 6.2 Rotas

| Rota | Método | Uso |
|------|--------|-----|
| `/auth/register` | POST | Registro de usuário |
| `/auth/login` | POST | Login; retorno de token para rotas protegidas |

Rotas protegidas (ex.: `POST /orchestrate/create-proposal`, `GET /leads`) usam middleware `authenticate` e `authorize(['COMERCIAL','ADMIN'])`.

### 6.3 Configuração e teste

- **Backend:** Configuração de JWT e senha (variáveis conforme implementação).
- **Teste:** POST register com email/senha; POST login; usar token no header para create-proposal.

---

## 7. Módulo Marketing

**Objetivo:** Webhook unificado para fontes de marketing (Facebook, Google, TikTok) para captação de leads. O adapter normaliza o payload; o Maestro executa `CREATE_LEAD_WORKFLOW` → LeadDomainAgent → `CREATE_LEAD`. Lead criado com status `NEW`.

**URL padronizada:** `POST /api/marketing/webhook/:source`. O script `verify_marketing_webhook.js` usa `http://localhost:3001/api/marketing/webhook/facebook_ads`.

### 7.1 Fluxo de dados

```
Fonte externa (Ads FB/Google/TikTok)
    ↓ POST /api/marketing/webhook/:source  (ex.: facebook_ads, google_ads, tiktok_ads)
Backend (modules/marketing)
    ↓ Adapter por source → normaliza { name, email, phone, city, ... }
    ↓ Maestro.execute('CREATE_LEAD_WORKFLOW', payload)
LeadDomainAgent → CREATE_LEAD
    ↓ Prisma (Lead com status NEW)
PostgreSQL (Lead)
```

**Requisitos do schema Lead:** O adapter deve fornecer `consumption` (obrigatório; usar default se ausente) e mapear `city` → `location`. Campos como `source`, `externalId`, `meta` não existem no schema Prisma atual — normalizar para apenas campos do Lead.

### 7.2 Rotas

| Rota | Método | Uso |
|------|--------|-----|
| `/api/marketing/webhook/:source` | POST | Webhook por fonte (facebook_ads, google_ads, tiktok_ads) |

### 7.3 Configuração e teste

- **Backend:** Variáveis por adapter (tokens, secrets). Garantir ao menos um User no banco para `ownerId` (seed ou bootstrap).
- **Teste:** POST para `http://localhost:3001/api/marketing/webhook/facebook_ads` (ou fonte equivalente) com payload esperado pelo adapter.

---

## 8. Tabela consolidada — Rota × Backend × Prisma

| Rota (front ou integração) | Backend / Agente | Modelos Prisma / externo |
|---------------------------|------------------|---------------------------|
| GET /api/analytics/dashboard | AnalyticsDomainAgent | Lead, Proposal |
| GET /api/analytics/funnel | AnalyticsDomainAgent | Lead |
| GET /api/analytics/activity | AnalyticsDomainAgent | Proposal, Lead |
| GET /api/leads/pipeline | LeadDomainAgent | Lead |
| POST /api/leads | LeadDomainAgent | Lead |
| PATCH /api/leads/:id/status | LeadDomainAgent | Lead |
| GET /api/leads/:id/activity | AnalyticsDomainAgent | Lead, Proposal |
| POST /api/copilot/chat | CopilotDomainAgent (Maestro) | AgentSession, AgentMessage |
| POST /orchestrate/preview-proposal | Maestro (calc, product, pricing, proposal) | Kit, Product, Tariff; Python calc_engine |
| POST /orchestrate/create-proposal | Maestro (lead, calc, product, pricing, proposal) | Lead, Proposal, Kit, Product, Tariff; Python calc_engine |
| POST /auth/register | Auth routes | User |
| POST /auth/login | Auth routes | User |
| GET /api/leads/:id | LeadDomainAgent | Lead |
| GET /api/leads/:id/solar | (proxy Solar API) | — |
| POST /api/marketing/webhook/:source | Marketing → Maestro CREATE_LEAD_WORKFLOW | Lead (via LeadDomainAgent) |

**Nota:** Rota registrada em `app.use('/api/marketing', marketingRoutes)`. Ver seção 7.

---

## 9. Referências

- [JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md) — Índice da jornada, rotas, prioridades e referência ao plano completo.
- [FRONTEND_BACKEND_PRISMA.md](FRONTEND_BACKEND_PRISMA.md) — Conexão frontend → backend → Prisma e `VITE_API_BASE`.
- [DASHBOARD_ANALYSIS.md](DASHBOARD_ANALYSIS.md) — Análise do Dashboard (requisitos, dados dinâmicos/estáticos, APIs).
- [O_QUE_FALTA.md](O_QUE_FALTA.md) — Pendências por área, fase da jornada e roadmap.
- [DOMAIN_MODEL.md](DOMAIN_MODEL.md) — Lead, Opportunity, Client; nicho e perfis de usuário.
- [ANALISE_ALTERACOES_SISTEMA.md](ANALISE_ALTERACOES_SISTEMA.md) — Estado atual e alterações.
- [gap_analysis_proposal.md](gap_analysis_proposal.md) — Gaps do motor de propostas (catálogo, pricing).
- [QUARKS_OS_PRD_v2_1.md](QUARKS_OS_PRD_v2_1.md) — Módulos do produto (CRM, Proposta, Simulador, Kit Builder, Financeiro, Copilot, Analytics).
- [specs/01-multimodal-copilot/spec.md](../specs/01-multimodal-copilot/spec.md) — User stories e requisitos do Copilot.

---

*Documento gerado com o mesmo método da documentação e processos do projeto. Nenhum arquivo de código foi modificado.*
