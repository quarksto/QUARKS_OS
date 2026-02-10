# Workflow: Página de Detalhe do Lead

**URL:** `http://localhost:5173/leads/:id`  
**Exemplo:** `http://localhost:5173/leads/b04ac3d2-04a0-439f-b85d-abf7f837ed39`

Este documento descreve o fluxo completo: rota → carregamento → backend → abas e ações.

---

## 1. Entrada na página

```
Usuário acessa /leads/:id
    ↓
App.jsx (BrowserRouter)
    → Route path="/leads/:id" → ProtectedRoute → ProtectedLayout → LeadDetailPage
    ↓
ProtectedRoute: verifica useAuth() → se não autenticado, redireciona para /login
ProtectedLayout: envolve com UnifiedShell + CopilotSidebar + GlobalSearch
    ↓
LeadDetailPage monta com useParams() → id = "b04ac3d2-04a0-439f-b85d-abf7f837ed39"
```

**Origens comuns do link:**
- Lista de leads: clique na linha ou “Ver ficha”.
- Kanban: clique no card → `navigate(\`/leads/${lead.id}\`)`.
- Busca global: resultado tipo `lead` → `navigate(\`/leads/${it.id}\`)`.
- Proposta: link “Ver lead” → `Link to={\`/leads/${proposal.leadId}\`}`.
- Drawer/detalhe em outro contexto: `to={\`/leads/${lead.id}\`}`.

---

## 2. Carregamento inicial (ao montar)

```
LeadDetailPage useEffect([id, setContext])
    ↓
api.get(\`/leads/${id}\`)   ← axios (baseURL = backend, ex. http://localhost:3001/api)
    ↓
Backend: GET /api/leads/:id
    → routes/leads/routes.js
    → leadAgent.execute('GET_LEAD_FULL', { id })
    → Prisma: lead.findUnique({ where: { id }, include: { proposals } })
    → enrichLead(lead) + proposals
    → analyticsAgent.execute('GET_LEAD_ACTIVITY', { leadId: id })
    → resposta: { ...lead, activity }
    ↓
Frontend recebe res.data
    → setLead(res.data)
    → setContext({ type: 'LEAD', summary: `Lead: ${name} (${consumption} kWh, ${status})`, data })
    → setLoading(false)
```

**Dados que chegam na página:**
- Lead completo (campos do Prisma + enriquecimento).
- `lead.proposals` (lista, ordenada por `updatedAt` desc).
- `lead.activity` (timeline do analytics agent).

Se o backend retornar **404**, o frontend mostra a caixa de erro (“Lead não encontrado”) e o botão “Ver lista de leads”.

---

## 3. Estrutura da tela

```
DashboardShell (título, breadcrumbs, header com ações)
    │
    ├── Pipeline (stepper): NEW → CONTACTED → PROPOSAL_SENT → NEGOTIATION → CLOSED_WON | CLOSED_LOST
    │   └── Estado atual destacado (borda petroleum)
    │
    ├── Tabs: Visão Geral | Dados & Edição | Qualificação | Proposta | Documentos | Histórico
    │   └── Conteúdo depende de activeTab
    │
    └── Conteúdo da aba selecionada (scrollável)
```

**Header (direita):**
- Temperatura do lead (quando não está editando).
- **Select de status** (pipe do lead).
- **Editar** → alterna `isEditing`; se estava em Visão Geral, muda para “Dados & Edição”.
- **Proposta** → navega para `/proposals/new?leadId=:id`.
- Em modo edição: **Cancelar** e **Salvar Alterações**.

---

## 4. Fluxos por aba

### Aba “Visão Geral”
- Renderiza **LeadDetailCanvas** com `lead`.
- Canvas mostra: BANT, especificações técnicas, gráfico de energia, stakeholders, timeline, CTA “Criar Nova Tarefa”.
- Dados reais hoje: `lead.consumption`, `lead.activity`; BANT/specs/energia/stakeholders ainda podem ser mock.

### Aba “Dados & Edição”
- **Sem edição:** grid com LeadModalProfile, LeadModalContact, LeadModalSolar, LeadModalAddress, LeadModalSolarInsights (com botão “Dimensionar” que chama `handleNewProposal`).
- **Com edição:** LeadBasicsEditForm (editedLead) + botões Cancelar / Salvar Alterações no header.

### Aba “Qualificação”
- LeadQualificationForm.
- Ao salvar: `api.patch(\`/leads/${lead.id}\`, form)` (backend → UPDATE_LEAD) e depois `api.get(\`/leads/${id}\`)` para refrescar o lead (`handleQualificationSave`).

### Aba “Proposta”
- LeadModalProposal com a primeira proposta do lead (`lead.proposals?.[0]`) e ação “Ver detalhes” que chama `handleNewProposal` (abre Copilot ou navega para nova proposta).

### Aba “Documentos”
- Lista de PDFs das propostas (quem tiver `pdfUrl`) com botão para abrir documento.
- Bloco “Documentos do imóvel / lead” — em breve.

### Aba “Histórico”
- LeadModalTimeline com `lead.activity` (retornado no GET /leads/:id).

---

## 5. Ações que disparam requisições

| Ação | Frontend | Backend |
|------|----------|---------|
| **Carregar lead** | `GET /api/leads/:id` | GET_LEAD_FULL + GET_LEAD_ACTIVITY → `{ ...lead, activity }` |
| **Mudar status** | `PATCH /api/leads/:id/status` body `{ status }` | UPDATE_STATUS → Prisma update |
| **Salvar edição (dados básicos)** | `PATCH /api/leads/:id` body = editedLead | UPDATE_LEAD → Prisma update (campos permitidos) |
| **Salvar qualificação** | LeadQualificationForm → `PATCH /api/leads/:id` | UPDATE_LEAD |
| **Refrescar após qualificação** | `GET /api/leads/:id` | GET_LEAD_FULL + GET_LEAD_ACTIVITY |
| **Abrir proposta** | Navega para `/proposals/new?leadId=:id` ou `triggerAction('GENERATE_PROPOSAL')` + openSidebar | — |

---

## 6. Fluxo automático resumido

1. **Abrir a URL** → rota → LeadDetailPage com `id` da URL.
2. **useEffect** → GET `/api/leads/:id` → backend (Lead Agent + Analytics Agent) → Prisma + activity.
3. **Estado** → `lead` e `activity` preenchem a tela; Copilot recebe contexto do lead.
4. **Mudar status** → PATCH status → estado local atualizado.
5. **Editar e salvar** → PATCH lead → estado local atualizado.
6. **Qualificação** → PATCH lead pelo form → GET lead para refrescar.
7. **Proposta** → navega para nova proposta com `leadId` ou abre o Copilot para gerar proposta.

Não há passo manual de “conectar ao banco”: o backend usa `DATABASE_URL` (Prisma); a página só consome a API.

---

## 7. Arquivos principais

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Rota | `App.jsx` | `/leads/:id` → ProtectedRoute → ProtectedLayout → LeadDetailPage |
| Página | `pages/LeadDetailPage.jsx` | Estado, tabs, handlers, chamadas API, layout das abas |
| Canvas | `components/dashboard/LeadDetailCanvas.jsx` | Visão geral (BANT, specs, energia, timeline, CTA) |
| Backend rota | `backend/src/modules/leads/routes.js` | GET /:id (GET_LEAD_FULL + activity), PATCH /:id, PATCH /:id/status |
| Backend agente | `backend/src/agents/lead-domain/index.js` | getLeadFull, updateLead, updateStatus (Prisma) |
| Analytics | `backend/src/agents/analytics-domain/index.js` | GET_LEAD_ACTIVITY (timeline) |

---

## 8. Diagrama de sequência (carregamento)

```
Browser                LeadDetailPage           api (axios)           Backend leads route
   |                           |                       |                          |
   |  GET /leads/:id           |                       |                          |
   |-------------------------->|                       |                          |
   |                           |  GET /api/leads/:id   |                          |
   |                           |---------------------->|  GET /api/leads/:id      |
   |                           |                       |------------------------->|
   |                           |                       |     GET_LEAD_FULL        |
   |                           |                       |     GET_LEAD_ACTIVITY    |
   |                           |                       |     Prisma + enrich      |
   |                           |                       |<-------------------------|
   |                           |  res.data (lead+activity)                         |
   |                           |<----------------------|                          |
   |                           |  setLead(); setContext('LEAD')                     |
   |                           |  setLoading(false)    |                          |
   |  Render (tabs, canvas, etc.)                                                     |
   |<--------------------------|                       |                          |
```

Este é o workflow da página `http://localhost:5173/leads/b04ac3d2-04a0-439f-b85d-abf7f837ed39`: da entrada na rota ao carregamento via API e às ações em cada aba.
