# Auditoria do Sistema QUARKS OS — O que está pronto e funcional

**Data:** 09/02/2026  
**Objetivo:** Mapear funcionalidades prontas, parcialmente funcionais e não implementadas/incompletas.

---

## Sumário executivo

| Categoria | Status | Quantidade |
|-----------|--------|------------|
| ✅ **Pronto e funcional** | Produção | 12 módulos/rotas |
| ⚠️ **Parcialmente funcional** | Requer ajustes | 8 módulos |
| ❌ **Não funcional / incompleto** | Bloqueado ou esqueleto | 6 itens |

**Build frontend:** ✅ Compila sem erros  
**Backend:** ✅ Estrutura completa com agentes e APIs  
**Testes:** 18 testes de API, 26 E2E, 7 de componentes documentados

---

## 1. O que está PRONTO e FUNCIONAL

### 1.1 Autenticação
| Item | Status | Observação |
|------|--------|------------|
| Login (`/login`) | ✅ | LoginPageAdvanced; JWT; redirect pós-login |
| Registro (`/register`) | ✅ | Página existe e rota configurada |
| Esqueci senha (`/forgot-password`) | ✅ | Página existe e rota configurada |
| ProtectedRoute | ✅ | Redireciona para `/login` se não autenticado |
| AuthContext | ✅ | Persistência de sessão |

### 1.2 Dashboard
| Item | Status | Observação |
|------|--------|------------|
| Dashboard principal (`/`, `/dashboard`) | ✅ | KpiGrid, KanbanBoard, InsightBar; conforme DS |
| KPIs dinâmicos | ✅ | useDashboardData; polling 30s |
| Pipeline de leads (Kanban) | ✅ | GET /api/leads/pipeline; drag-and-drop status |
| Busca global (Ctrl+K) | ✅ | GlobalSearch; navegação para leads/propostas |

### 1.3 Leads
| Item | Status | Observação |
|------|--------|------------|
| Lista de leads (`/leads`) | ✅ | LeadsPage; Kanban ou tabela; filtros |
| Ficha do lead (`/leads/:id`) | ✅ | LeadDetailPage; abas (Visão Geral, Dados, Qualificação, Proposta, Documentos, Histórico) |
| Criar lead | ✅ | CreateLeadModal; POST /api/leads |
| Atualizar status (Kanban) | ✅ | PATCH /api/leads/:id/status |
| Edição de lead | ✅ | PATCH /api/leads/:id; LeadBasicsEditForm |
| Qualificação | ✅ | LeadQualificationForm na ficha |
| Documentos (upload) | ✅ | No LeadDetailModal; API /documents/lead/:leadId |

**Nota:** `/funnel` redireciona para `/leads` — redundância removida.

### 1.4 Propostas
| Item | Status | Observação |
|------|--------|------------|
| Lista de propostas (`/proposals`) | ✅ | ProposalsListPage; tabela com status |
| Nova proposta (`/proposals/new`) | ✅ | ProposalPage; SalesWizard; leadId via query ou state |
| Detalhe da proposta (`/proposals/:id`) | ✅ | ProposalDetailPage |
| Visualização pública (`/view-proposal/:slug`) | ✅ | ProposalViewPublicPage; rota pública |
| Integração leadId | ✅ | Query string e location.state suportados |

### 1.5 Cadastros base
| Item | Status | Observação |
|------|--------|------------|
| Produtos/Kits (`/products`) | ✅ | ProductsPage; CRUD |
| Serviços (`/services`) | ✅ | ServicesPage; CRUD |
| Regras de preço (`/pricing-rules`) | ✅ | PricingRulesPage |
| Kits (`/kits`) | ✅ | KitsPage |

### 1.6 Backend e APIs
| Módulo | Status | Endpoints principais |
|--------|--------|----------------------|
| Auth | ✅ | POST /api/auth/login, register, etc. |
| Leads | ✅ | GET/POST /api/leads, GET pipeline, PATCH status |
| Proposals | ✅ | GET/POST/PATCH /api/proposals |
| Analytics | ✅ | GET /api/analytics/dashboard, funnel, activity |
| Inventory | ✅ | GET /api/inventory/kits |
| Pricing | ✅ | GET /api/pricing-rules |
| Documents | ✅ | GET/POST /api/documents |
| Search | ✅ | Busca global |
| Users | ✅ | GET /api/users |
| Copilot | ✅ | POST /api/copilot/chat |

### 1.7 Infraestrutura
| Item | Status |
|------|--------|
| Prisma + PostgreSQL | ✅ |
| WebSocket (RealtimeProvider) | ✅ |
| Maestro (orquestrador de agentes) | ✅ |
| Agentes (lead, calc, proposal, pricing, analytics, etc.) | ✅ |

---

## 2. O que está PARCIALMENTE FUNCIONAL

### 2.1 Workspace (`/workspace`)
| Aspecto | Status | Problema |
|---------|--------|----------|
| Layout | ⚠️ | Usa AdaptiveHeader + DashboardSidebar mas layout 3 colunas customizado (lista + painel). Não segue 100% o DS como Dashboard |
| Pipeline realtime | ✅ | usePipelineData + useLeadRealtime; WebSocket atualiza lista |
| Drawer do lead | ✅ | LeadDetailDrawer; link "Ver ficha" → /leads/:id |
| Nova proposta | ✅ | Ctrl+Shift+N; state.leadId passado corretamente |

**Conclusão:** Funciona; design visual divergente do DS (conforme RELATORIO_FINAL_AUDITORIA).

### 2.2 Clientes (`/clients`, `/clients/:id`)
| Aspecto | Status | Problema |
|---------|--------|----------|
| Rotas | ⚠️ | Existem mas **não estão no menu** da sidebar |
| Páginas | ✅ | ClientsPage, ClientDetailPage; carregam dados |

### 2.3 Chat (`/chat`)
| Aspecto | Status | Problema |
|---------|--------|----------|
| Rota | ⚠️ | Existe mas **não está no menu** |
| Página | ⚠️ | ChatPage existe; integração com Copilot |

### 2.4 Documentos do lead
| Local | Status | Problema |
|-------|--------|----------|
| LeadDetailModal | ✅ | Upload e lista via /documents/lead/:leadId |
| LeadDetailPage (aba Documentos) | ⚠️ | PDFs de propostas; "Documentos do imóvel — em breve" (placeholder) |

### 2.5 Calc Engine (Python)
| Aspecto | Status | Problema |
|---------|--------|----------|
| Serviço | ⚠️ | Backend chama `CALC_ENGINE_URL` (localhost:8000) para cálculos e preview de proposta |
| Dependência | ⚠️ | Precisa estar rodando separadamente; sem ele, funcionalidades que dependem de cálculo podem falhar |

### 2.6 Copilot
| Aspecto | Status | Problema |
|---------|--------|----------|
| Sidebar | ✅ | CopilotSidebar; barra lateral IA |
| Chat | ⚠️ | POST /api/copilot/chat; depende de configuração (chaves, etc.) |
| Contexto do lead | ⚠️ | setContext em LeadDetailPage; no modal/drawer inconsistente |

---

## 3. O que NÃO está funcional ou está incompleto

### 3.1 Rotas sem entrada no menu
| Rota | Página | Problema |
|------|--------|----------|
| `/clients` | ClientsPage | Sem link na sidebar |
| `/chat` | ChatPage | Sem link na sidebar |
| `/cronograma` | CronogramaPage | Sem link; página esqueleto |
| `/kits` | KitsPage | Sem link (Products já cobre?) |
| `/settings` | SettingsPage | Sem link |

### 3.2 Páginas esqueleto ou placeholder
| Página | Status |
|--------|--------|
| CronogramaPage | Esqueleto (placeholder) |
| DimensionamentoPage | Básica; "I.A. Dimension" — funcionalidade limitada |
| SettingsPage | Estrutura básica |

### 3.3 Código morto / legado
| Arquivo | Situação |
|---------|----------|
| LeadsListPage.jsx | **Removida** — não usada (App usa LeadsPage em /leads) |
| Dashboard.jsx | Possível legado; App usa DashboardRefactored |
| ProposalPageNew.jsx | Possível legado; App usa ProposalPage |
| LoginPage.jsx, LoginPageStitch.jsx | Legado; App usa LoginPageAdvanced |
| HybridShell | Componentes hybrid/ usados dentro de SalesWorkspace; não é rota direta |

### 3.4 Duplicações e inconsistências
| Item | Problema |
|------|----------|
| Pipeline em dois lugares | useDashboardData (Dashboard, LeadsPage) vs usePipelineData (SalesWorkspace). Realtime só no Workspace |
| Três formas de ver lead | Modal (Dashboard/Leads), Drawer (Workspace), Página (/leads/:id). Funcionalidades diferentes (ex.: documentos) |
| Sidebar colapsada | LayoutContext vs quarks-command-center-sidebar-collapsed; estados podem divergir |

---

## 4. Fluxos principais — status

| Fluxo | Status | Observação |
|-------|--------|------------|
| Login → Dashboard | ✅ | Completo |
| Dashboard → Lead (modal) → Ver ficha (/leads/:id) | ✅ | LeadModalJourneyBanner navega |
| Lead → Nova proposta | ✅ | leadId via query; ProposalPage corrigido |
| Workspace → Lead (drawer) → Ver ficha | ✅ | Link "Ver ficha" |
| Workspace → Nova proposta (Ctrl+Shift+N) | ✅ | state.leadId |
| Lista propostas → Nova proposta | ✅ | Sem leadId (proposta avulsa) |
| Lista propostas → Detalhe proposta | ✅ | Link para /proposals/:id |
| Busca global → Lead/Proposta | ✅ | GlobalSearch |
| Criar lead | ✅ | CreateLeadModal em Dashboard e Workspace |

---

## 5. Resumo de prioridades

### Para colocar tudo funcional
1. **Adicionar ao menu** as rotas úteis: Clients, Settings, Chat (se forem parte do produto)
2. **Unificar documentos do lead** — mesma API e UI na página e no modal
3. **Garantir Calc Engine** rodando quando houver fluxos de proposta/cálculo
4. **Documentar** quais páginas são placeholder (Cronograma, Dimensionamento avançado)

### Para melhorar consistência
1. Usar hook compartilhado de pipeline (useDashboardData ou usePipelineData) no Workspace para alinhar fontes de dados
2. Estender realtime (WebSocket) para Dashboard e LeadsPage, ou aceitar polling 30s
3. Refatorar Workspace para 100% conformidade com DS (conforme RELATORIO_FINAL_AUDITORIA)
4. Limpar código morto (LeadsListPage, páginas legado)

---

## 6. Checklist rápido — o que funciona hoje

- [x] Login e autenticação
- [x] Dashboard com KPIs e Kanban
- [x] Lista de leads (Kanban/tabela)
- [x] Ficha completa do lead
- [x] Criar e editar lead
- [x] Nova proposta com lead vinculado
- [x] Lista e detalhe de propostas
- [x] Visualização pública de proposta
- [x] Produtos, Serviços, Regras de preço, Kits
- [x] Workspace com pipeline realtime
- [x] Busca global
- [x] Modos (Vendas / Gestão / Projetos)
- [ ] Clientes no menu
- [ ] Chat no menu
- [ ] Configurações no menu
- [ ] Cronograma (placeholder)
- [ ] Calc Engine (serviço externo)

---

**Documentos relacionados:**  
- `AUDITORIA_FLUXOS_FRONTEND.md` — mapa de rotas e fluxos  
- `ANALISE_PROFUNDA_FLUXOS_FRONTEND.md` — fluxo de dados e bugs  
- `RELATORIO_FINAL_AUDITORIA.md` — conformidade visual com DS  
- `PLANO_TESTES_COMPLETO.md` — como rodar testes
