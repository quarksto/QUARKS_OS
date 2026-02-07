# Análise das Alterações do Sistema — Quarks OS

**Data:** 2026-02-02  
**Base:** DASHBOARD_ANALYSIS, FRONTEND_ANALYSIS, O_QUE_FALTA, gap_analysis_proposal, specs (STATUS, PRONTO_E_PENDENTE, 02/03).

---

## 1. Visão geral do estado atual

O **Quarks OS** é um sistema de CRM solar com Dashboard comercial, Copilot multimodal (texto + imagem + vídeo/áudio), motor de propostas (Python + Node) e analytics. As alterações recentes e o estado atual estão organizados por camada abaixo.

| Camada        | Estado geral                         | Principais alterações / pendências      |
|---------------|--------------------------------------|-----------------------------------------|
| **Frontend**  | 3 páginas (Dashboard, Chat, Propostas) | Navegação e DS ajustados no Dashboard; Chat/Proposals ainda parciais |
| **Backend**   | APIs analytics, leads, copilot, orquestração | Copilot registrado no Maestro; falta catálogo, pricing, CRM rico |
| **Copilot**   | Texto + imagem + upload vídeo/áudio  | ~45% feature; faltam testes E2E e File API para >20MB |
| **Proposta**  | Preview HTML funcional               | Dados “fake”; falta catálogo, kits, pricing engine |

---

## 2. Alterações já realizadas (o que mudou)

### 2.1 Dashboard

- **Navegação:** Links da sidebar e CTAs passaram de `href="#"` para `<Link to="...">` e `navigate()` — acesso a `/`, `/chat`, `/proposals`; "+ NOVO NEGÓCIO" e "Ver detalhes" levam a `/chat`.
- **Acessibilidade:** Inclusão de `aria-label` (ex.: botão colapsar), `aria-live` onde faz sentido e navegação com estado ativo por rota.
- **Design System:** Dashboard permanece 100% alinhado ao DS (petroleum/solar, `.technical-card`, `.kpi-*`, `.btn-pill`, Material Symbols, Geist).
- **Dados:** Continua consumindo `GET /api/analytics/dashboard` e `GET /api/leads/pipeline` com polling 30s; KPIs e kanban dinâmicos; vários placeholders ainda estáticos (metas, deltas, 92% Match, etc.).

### 2.2 Frontend (geral)

- **Rotas:** `/` = Dashboard, `/chat` = ChatPage, `/proposals` = ProposalPage; MainLayout usado em Chat e Proposals.
- **Componentes em uso:** Dashboard.jsx (próprio), MainLayout, InputArea, ProposalPage (Mantine), ChatPage (Tailwind), hooks useDashboardData e useChat, api.js (axios).
- **Integração:** Analytics e pipeline integrados; Chat e preview de proposta com URLs ainda hardcoded (localhost:3001).

### 2.3 Backend / Copilot

- **Multimodal Copilot (spec 01):**
  - Fases 1–3 concluídas: Gemini SDK, multer, rotas `/copilot`, Prisma AgentSession/AgentMessage, CopilotDomainAgent, tools, session, **registro no Maestro** (T009).
  - Fase 4 (imagem): POST multipart, FileHandler, inlineData base64, upload no chat — falta só teste manual (T019).
  - Fase 5 (vídeo/áudio): Frontend aceita; backend usa inline; arquivos >20MB podem exigir File API; testes T022/T023 pendentes.
- **APIs existentes:** `/api/analytics/dashboard`, `/api/analytics/funnel`, `/api/analytics/activity`, `/api/leads/pipeline`, `POST /copilot/chat`, `POST /orchestrate/preview-proposal`.

### 2.4 Documentação e specs

- **Análises:** DASHBOARD_ANALYSIS (requisitos, DS, dados estáticos vs dinâmicos, navegação, acessibilidade, achados).
- **Frontend:** FRONTEND_ANALYSIS (stack, rotas, componentes usados vs orfãos, alinhamento DS, integração backend).
- **Gaps:** O_QUE_FALTA (resumo por área); gap_analysis_proposal (catálogo, pricing, CRM).
- **Speckit:** STATUS.md (feature 01 ~45%); PRONTO_E_PENDENTE (tarefas por fase); specs 02 (dashboard refactor Stitch) e 03 (interatividade) em draft.

---

## 3. O que ainda não foi alterado (pendências)

### 3.1 Dashboard

| Pendência                    | Severidade | Descrição |
|-----------------------------|------------|-----------|
| Dados estáticos → API/rótulo | Média      | Metas, deltas, 92% Match, "5" no IA Insight fixos no JSX; trazer da API ou rotular "Exemplo". |
| Busca global (⌘K)           | Média      | Sem handler; definir fluxo (leads/propostas) e implementar. |
| Filtro do fluxo              | Baixa      | Botão existe sem ação; definir filtros (data, estágio) e conectar. |

### 3.2 Frontend (rotas e layout)

| Pendência              | Descrição |
|------------------------|-----------|
| Rota `/dashboard`      | MainLayout aponta "Dashboard" para `/dashboard`; no App só existe `/`. Unificar (ex.: rota `/dashboard` → mesmo Dashboard ou link → `/`). |
| Rotas `/leads`, `/kits`, `/settings` | Links no menu sem rotas; criar placeholders ou remover do menu. |
| Base URL API           | Usar `VITE_API_BASE` em api.js e useChat; evitar localhost fixo em produção. |

### 3.3 Design System e componentes

| Pendência        | Descrição |
|------------------|-----------|
| ChatPage         | Alinhar ao DS (petroleum/solar, `.technical-card`, `.btn-pill`) em vez de gray/blue genérico. |
| ProposalPage     | Alinhar ao DS ou manter Mantine com tokens do DS. |
| Componentes orfãos | StatsCard, PageHeader, DataTable, RecentActivity, SalesFunnelChart não usados; integrar (ex. funil + atividade no Dashboard com `/funnel` e `/activity`) ou remover/arquivar. |

### 3.4 Backend / motor de propostas

| Pendência        | Descrição |
|------------------|-----------|
| Catálogo         | Tabelas Product (Painéis, Inversores, Estruturas, Cabos) e Kit; API CRUD. |
| Pricing          | PricingRule (margem, impostos); PricingService (custo + markup = preço). Hoje preço hardcoded. |
| CRM/Lead         | Lead/User enriquecidos (CEP, histórico de contas, tipo de telhado). |

### 3.5 Copilot

| Pendência     | Descrição |
|---------------|-----------|
| T014          | Teste manual: conversa texto com Gemini (GOOGLE_API_KEY). |
| T019          | Teste manual: upload conta de luz e extração consumo/distribuidora. |
| T022 / T023   | Testes manuais: vídeo (site survey) e áudio (voice-to-proposal). |
| File API      | Arquivos >20MB (vídeo/áudio) em vez de só inline. |
| userId real   | Integrar useChat com AuthContext quando houver login. |
| RAG (US5)     | Perguntas sobre catálogo (ex.: garantia do inversor) com Product Agent ou base de conhecimento. |

### 3.6 Módulos PRD (telas/funcionalidades)

| Módulo           | Status   | Falta |
|------------------|----------|--------|
| CRM Leads        | Parcial  | Tela dedicada `/leads` (lista, filtros, score). |
| Proposta         | Parcial  | Dados reais (catálogo, preço), PDF, assinatura digital. |
| Simulador Solar  | Não      | Tela + backend (consumo → kWp, geração, ROI, payback). |
| Kit Builder      | Não      | Tela + backend (montar kit a partir do catálogo). |
| Financeiro       | Não      | Módulo/tela (margens, regras, faturamento). |
| Analytics        | Sim      | Opcional: funil e atividade recente no Dashboard. |

---

## 4. Specs de evolução (planejado vs feito)

### 01-multimodal-copilot

- **Spec/Plan:** 100%.
- **Tasks:** ~40–45% (T001–T009 e fluxo T010–T014 feitos; T015–T018 feitos; T019–T023 e File API pendentes).
- **Alteração recente:** Copilot registrado no Maestro (T009 concluído).

### 02-dashboard-refactor-stitch

- **Status:** Draft.
- **Objetivo:** Dashboard como composição de componentes (Sidebar, Header, InsightBar, KpiGrid, KanbanBoard), referência Stitch MCP e DS.
- **Alteração no código:** Ainda não aplicada; existe DashboardRefactored.jsx (possível esboço).

### 03-dashboard-interactivity

- **Status:** Draft.
- **Objetivo:** Kanban drag-and-drop, Lead Detail modal, sidebar persistente, microinterações (hover KPIs, activity, chart).
- **Alteração no código:** Ainda não aplicada.

---

## 5. Resumo executivo das alterações

- **Já feito:**  
  Dashboard com navegação real (Link/navigate), acessibilidade básica e 100% alinhado ao DS; 3 páginas (Dashboard, Chat, Propostas) integradas às APIs principais; Copilot multimodal com texto + imagem + upload de vídeo/áudio e registro no Maestro; documentação de análise (dashboard, frontend, gaps) e specs atualizadas.

- **Pendente (prioridade alta):**  
  Navegação/rotas (/, /dashboard, /leads, /kits, /settings); dados estáticos do Dashboard (API ou rótulo); centralizar API em `VITE_API_BASE`; testes manuais do Copilot (T014, T019).

- **Pendente (médio/longo prazo):**  
  Catálogo + Kits + Pricing no backend; proposta com dados reais; alinhar Chat e Proposals ao DS; componentes orfãos (integrar ou remover); specs 02 e 03 (refactor e interatividade do Dashboard); RAG e File API no Copilot; novas telas (Leads, Simulador, Kit Builder, Financeiro).

---

*Documento gerado a partir de DASHBOARD_ANALYSIS.md, FRONTEND_ANALYSIS.md, O_QUE_FALTA.md, gap_analysis_proposal.md, specs/STATUS.md, PRONTO_E_PENDENTE.md e specs 02/03. Nenhum arquivo de código foi modificado.*
