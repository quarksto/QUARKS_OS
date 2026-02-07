# O que falta — Quarks OS

**Atualizado:** 2026-02-05 (auditoria)  
**Base:** Plano *Fluxo e Jornada* ([JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md)), [specs/STATUS.md](../specs/STATUS.md), PRD v2.1.

---

## Resumo rápido

| Área | Feito | Falta |
|------|--------|--------|
| **Dashboard** | Navegação, acessibilidade, dados da API (useDashboardData), Busca ⌘K (GlobalSearch + /api/search) | Filtro Kanban efetivo; revisar placeholders em KpiGrid/InsightBar |
| **Frontend** | Rotas `/`, `/dashboard`, `/leads`, `/proposals`, `/kits`, `/settings`, `/chat`; DS no Dashboard e Propostas (09) | Alinhar ChatPage e ProposalPage ao DS; componentes órfãos; documentar VITE_API_BASE |
| **Backend / Proposta** | Preview (Python), Copilot, Analytics, Leads, Catálogo (06): Products, Kits, PricingRules CRUD | Integrar catálogo no fluxo de proposta; CRM completo |
| **Marketing / Webhook** | ✅ Adapters FB/Google/TikTok refinados; CREATE_LEAD_WORKFLOW; consumption default (500 kWh); location normalizada; seed User automático | Integração com CRM completo; tracking de conversão |
| **Copilot** | Texto + imagem + vídeo + áudio; testes T014–T023 concluídos | File API >20MB; RAG; userId real (AuthContext) |
| **PRD (módulos)** | Analytics, Copilot IA, Proposta (lista/detalhe/PDF/pública), CRM Leads (telas /leads) | Simulador Solar; Kit Builder; Financeiro; Assinatura digital; Score lead |

---

## Auditoria (2026-02-05)

- **Gaps:** Dashboard usa API (useDashboardData); Busca ⌘K e `/api/search` existem; Catálogo 06 (Products/Kits/PricingRules) entregue; Copilot testes manuais concluídos; Propostas (09) com PDF e página pública alinhada ao DS.
- **Rotas:** `/`, `/dashboard`, `/leads`, `/proposals`, `/kits`, `/settings`, `/chat` — conferidas no router.
- **Busca:** GlobalSearch + backend `/api/search` (leads/proposals) — falta filtro Kanban e placeholders em KpiGrid/InsightBar.
- **Catálogo:** Spec 06 concluída; falta integrar no fluxo de criação de proposta (front + backend).
- **Checklist:** Ver [specs/VERIFICATION_CHECKLIST.md](../specs/VERIFICATION_CHECKLIST.md) para conferência antes de release.

---

## 1. Dashboard

### Já ajustado
- Navegação: Link para `/`, `/dashboard`, `/chat`, `/proposals`; CTAs "+ NOVO NEGÓCIO" e "Ver detalhes" → `/chat`.
- Acessibilidade: aria-label, aria-live, nav ativo por rota.
- **Dados da API:** useDashboardData chama `/analytics/dashboard`, `/leads/pipeline`, `/analytics/activity`, `/analytics/funnel`.
- **Busca Global (⌘K):** GlobalSearch + GET /api/search (leads e propostas); atalho registrado no ProtectedLayout.

### Ainda falta
- [ ] **Metas/deltas ou rótulo**  
  Confirmar se todos os valores em KpiGrid e InsightBar vêm da API; se restar placeholder (ex.: "+12.5%", "92% Match"), conectar à API ou rotular como "Exemplo".
- [ ] **Filtro do Kanban**  
  pipelineFilters/onFiltersChange existem; verificar se o filtro aplica de fato (data, estágio, etc.) ou só atualiza estado sem efeito visual.

---

## 2. Frontend (geral)

### Rotas e MainLayout
- **Feito:** Rotas `/`, `/dashboard`, `/leads`, `/leads/:id`, `/proposals`, `/proposals/:id`, `/chat`, `/kits`, `/settings`, `/projetos`, `/dimensionamento`, `/cronograma` existem em App.jsx. MainLayout e sidebar apontam para elas.

### Detalhe do lead
- **Feito:** O detalhe do lead é acessado pela **página** `/leads/:id` (LeadDetailPage). Ao clicar em um card no Kanban ou em uma linha na lista de leads, o usuário é redirecionado para essa página; o modal de detalhe não é mais usado nesses fluxos.

### Design System
- [ ] **ChatPage**  
  Usar petroleum/solar e classes do DS (`.technical-card`, `.btn-pill`, etc.) em vez de gray/blue genérico.
- [ ] **ProposalPage (gerador)**  
  Alinhar ao DS (petroleum, solar, classes do index.css) ou manter Mantine com tokens do DS; consistência com ProposalsListPage/ProposalDetailPage (spec 09 concluída).

### Código e config
- [ ] **Componentes órfãos**  
  StatsCard, PageHeader, DataTable (common); RecentActivity, SalesFunnelChart (analytics) não são importados. O Dashboard usa RecentActivityList e FunnelWidget. Decisão: integrar em alguma tela ou remover/arquivar.
- [ ] **VITE_API_BASE**  
  api.js já usa `import.meta.env.VITE_API_BASE || 'http://localhost:3001'`. Documentar uso em produção (README ou WINDOWS_DEVELOPMENT_SETUP.md) e validar em build.

---

## 3. Backend / Motor de Propostas

*(Auditoria 2026-02-05: spec 06-catalog-backend concluída.)*

### Catálogo e kits (entregue — spec 06)
- **Feito:** Tabelas Product, Kit (com itens); API CRUD `/api/products`, `/api/kits`, `/api/pricing-rules`; PricingService. Ver [specs/STATUS.md](../specs/STATUS.md).

### Ainda falta
- [ ] **Integração proposta ↔ catálogo**  
  Garantir que o fluxo de criação/edição de proposta (Orchestrator, ProposalPage) use Products/Kits/PricingRules em vez de "Kit Solar Premium" genérico. Verificar se frontend e orquestrador já consomem esses endpoints no fluxo de proposta.
- [ ] **Lead/User** enriquecidos: endereço (CEP), histórico de contas, tipo de telhado, etc.

---

## 4. Copilot (multimodal)

*(Fonte: specs/01-multimodal-copilot/PRONTO_E_PENDENTE.md)*

### Validação
- [x] **T014, T019, T022, T023** — Testes manuais concluídos (2026-02-05).

### Robustez
- [ ] **File API** para arquivos >20MB (vídeo/áudio) em vez de só inline.
- [ ] **userId real** no useChat (integrar com AuthContext quando houver login).

### Funcionalidade
- [ ] **RAG / catálogo (US5)** — Perguntas tipo "qual a garantia do inversor?" usando Product Agent ou base de conhecimento no fluxo do chat.

---

## 5. Módulos do PRD (telas/funcionalidades)

| Módulo PRD | Status | O que falta |
|------------|--------|-------------|
| **1. CRM Leads** | Parcial (API leads/pipeline; Dashboard kanban; rota `/leads`; LeadsListPage, LeadDetailPage) | Filtros e score na lista; integração proposta com catálogo real. |
| **2. Proposta Interativa** | Parcial (lista/detalhe/PDF/vista pública — spec 09; preview; backend 07) | Integrar catálogo/preço real no fluxo; assinatura digital. |
| **3. Simulador Solar** | Não | Tela + backend (consumo → kWp, geração, ROI, payback). |
| **4. Kit Builder** | Não | Tela + backend (montar kit a partir do catálogo). |
| **5. Financeiro** | Não | Módulo/tela (margens, regras, faturamento). |
| **6. Copilot IA** | Sim (chat texto + imagem + vídeo + áudio) | RAG; File API >20MB (backlog). |
| **7. Analytics** | Sim (Dashboard KPIs + pipeline) | Funil e Atividade recente no Dashboard (opcional); métricas adicionais. |

### Outras funcionalidades core (PRD)
- [ ] Importação de fatura (OCR consumo).
- [ ] Score de lead.
- [ ] Assinatura digital na proposta.

---

## 6. Prioridade sugerida (alinhada ao plano)

### Alta prioridade (bloqueadores)

1. ✅ **Webhook Marketing:** Adapters (FB, Google, TikTok) refinados com `consumption` (default 500 kWh), `location` normalizada, e apenas campos válidos do schema Lead.
2. ✅ **Seed de User:** Script `ensure_user_seed.js` garante ao menos um User para `ownerId` de leads vindos do webhook.
3. ✅ **URL Marketing:** Padronizada em `POST /api/marketing/webhook/:source` (código implementado e testado).

### Média prioridade (dinâmica)

1. **Dados estáticos do Dashboard:** Trazer metas/deltas da API ou rotular como "Exemplo".
2. **Navegação e CTAs:** Conectar "+ NOVO NEGÓCIO" a fluxo real (modal criar lead ou `/leads`); filtro do Kanban.
3. **VITE_API_BASE:** Centralizar base URL da API no frontend para produção.

### Baixa prioridade (capacidades)

1. **Funil e Atividade:** Integrar SalesFunnelChart e RecentActivity no Dashboard com `/api/analytics/funnel` e `/api/analytics/activity`.
2. **Módulo Clientes:** Tela `/clients` para CLOSED_WON (pós-venda).
3. **Catálogo e Pricing:** Produtos, Kits, PricingRule para propostas com dados reais.

### Curto prazo (frontend e fluxo)

- Rotas e MainLayout já possuem `/dashboard`, `/leads`, `/kits`, `/settings` (App.jsx). Documentar `VITE_API_BASE` para produção.
- Copilot: testes T014–T023 concluídos; backlog: File API >20MB, RAG, userId real.

---

## 7. Backlog (Leads / CRM)

- [ ] **Documentos do lead (upload/listagem)** — Modelo e API para anexos do lead (fotos do telhado, contrato, etc.); hoje apenas propostas têm `pdfUrl`. Na página de detalhe já existe a aba "Documentos" com listagem de PDFs de propostas e placeholder para documentos do imóvel/lead.
- [ ] **Checklist de qualificação por estágio** (opcional) — Ex.: "CEP preenchido", "Telhado definido" por estágio para guiar o usuário.

---

## 8. Gaps por fase da jornada (do plano)

| Fase | O que existe | O que falta |
|------|--------------|-------------|
| **1. Captação/Qualificação** | Webhook, adapters; Kanban; LeadDetailPage; LeadQualificationForm | Mapeamento Lead (consumption default, location); score real; checklist por estágio |
| **2. Vendas** | Calc engine Python; preview proposta; create via Maestro | Tela dimensionamento funcional; vínculo com lead; proposta interativa mobile; catálogo real; pricing engine; PDF; assinatura digital; visita técnica (agendamento, medições) |
| **3. Fechamento** | CLOSED_WON / CLOSED_LOST | Tela Clientes; transição Lead → Client; upload contrato; assinatura digital |
| **4. Projeto/Homologação** | Rota `/projetos` (placeholder) | Modelo Project; CRUD; memorial; diagrama; engenharia própria ou terceirizada; status homologação; tracking concessionária |
| **5. Instalação** | Rota `/cronograma` (placeholder) | Calendário; equipe própria/terceirizada; checklist; vistoria; ligação |
| **6. Pós-venda** | — | Fora escopo v2.1 (monitoramento IoT); garantias; manutenção |

**Infraestrutura transversal:** Proposta interativa (mobile, bidirecional, aceite/recusa, notificações); atendimento omnichannel (WhatsApp, chat, histórico unificado); Copilot/Jarvis (amplitude, RAG, tools expandidos, proatividade, memória); catálogo e formação de preços (equipamentos, serviços, regras por estado/margem).

---

## 9. Roadmap sugerido (do plano)

- **Curto prazo:** Corrigir webhook Marketing (adapter → Lead: consumption default, location/city, schema Lead); seed User; padronizar URL marketing; **integrar catálogo (06) no fluxo de proposta**; revisão Copilot (RAG, tools expandidos).
- **Médio prazo:** Tela dimensionamento funcional; proposta interativa mobile; gestão refinada (catálogo, formação de preços); visita técnica (opcional).
- **Longo prazo:** Assistente Jarvis (acesso universal, comandos naturais, sugestões contextuais); atendimento omnichannel; módulo Projetos; engenharia/instalação (própria ou terceirizada); homologação; cronograma; vistoria; ligação.

---

*Documento de referência. Atualizar conforme o projeto avança. Ver [JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md) para visão consolidada e prioridades.*
