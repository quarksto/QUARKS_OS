# Análise profunda: fluxos e arquitetura do frontend

Documento técnico que aprofunda a auditoria de fluxos: origem dos dados, duplicações, riscos e bugs encontrados.

---

## 1. Fluxo de dados do pipeline de leads

### 1.1 Quem busca o pipeline

| Onde | Como | Atualização |
|------|-----|-------------|
| **DashboardRefactored** | `useDashboardData()` → `api.get('/leads/pipeline')` | Polling 30s + `refresh()` manual |
| **LeadsPage** (/funnel, /leads) | `useDashboardData()` → mesmo pipeline | Polling 30s + `refresh()` no create success |
| **SalesWorkspace** (/workspace) | `api.get('/leads/pipeline')` direto em `refreshPipeline()` | Só no mount + após status/update + **useLeadRealtime** (lead:created, lead:updated, message:new, unread_reset) |
| **LeadsListPage** (não roteada) | `useLeadsList()` → internamente `useDashboardData()` | Mesmo que Dashboard/LeadsPage |

Consequências:

- **Duas fontes de verdade**: Dashboard e LeadsPage compartilham estado via hook (consistente entre si). SalesWorkspace tem estado próprio e **não** usa `useDashboardData`, então lista no Workspace pode divergir da lista no Funil/Leads até que haja novo fetch.
- **Realtime só no Workspace**: eventos WebSocket (novo lead, lead atualizado, mensagem nova) só atualizam o pipeline em SalesWorkspace. Em Dashboard e LeadsPage o pipeline só muda a cada 30s ou após ação que chame `refresh()`.
- **Formato do pipeline**: todos esperam um objeto por status (ex.: `{ NEW: [], CONTACTED: [], ... }`). O backend `/leads/pipeline` devolve isso via Lead Agent; uso é consistente.

### 1.2 Detalhe do lead (GET /leads/:id)

- **LeadDetailPage**: um único `GET /leads/:id` no mount (useEffect com `id`). Atualizações locais (status, edição) fazem `setLead` sem novo GET, exceto após salvar qualificação (aí faz GET de novo).
- **LeadDetailModal**: recebe `initialLead` (item do pipeline); ao abrir faz `GET /leads/${initialLead.id}` para detalhe completo. Não há polling nem realtime.
- **SalesWorkspace**: ao mudar `selectedLead` faz `GET /leads/${selectedLead.id}` e guarda em `leadDetail`. Drawer usa esse `leadDetail`; ao editar/salvar chama `onUpdate` que refaz PATCH e depois GET pipeline + GET lead.

Ou seja: três lugares diferentes buscam o mesmo recurso (detalhe do lead) com lógicas e ciclos de vida diferentes.

---

## 2. Propagação do leadId para a página de nova proposta

### 2.1 Entradas para /proposals/new

| Origem | Como navega | leadId disponível? |
|--------|-------------|---------------------|
| **LeadDetailPage** | `navigate(\`/proposals/new?leadId=${lead.id}\`)` | Sim, na **query** |
| **LeadDetailModal** | `navigate(\`/proposals/new?leadId=${lead.id}\`)` | Sim, na **query** |
| **SalesWorkspace** (Ctrl+Shift+N) | `navigate('/proposals/new', { state: { leadId: selectedLead.id } })` | Sim, no **state** |
| **LeadContextPanel** | `navigate('/proposals/new', { state: { leadId: lead.id } })` | Sim, no **state** |
| **HybridShell** | `navigate('/proposals/new', { state: { leadId: selectedLead.id } })` | Sim, no **state** |
| **ProposalsListPage** | `<Link to="/proposals/new">` | Não (nova proposta sem lead) |

### 2.2 Ajuste aplicado em ProposalPage

- **Antes**: só `useParams()`; a rota é `/proposals/new` (sem `:leadId`), então leadId nunca vinha.
- **Depois**: `leadId` é obtido de **query** (`searchParams.get('leadId')`) e de **state** (`location.state?.leadId`), com fallback: `leadId = leadIdFromQuery || leadIdFromState || undefined`.

Assim, tanto os fluxos que usam query (ficha do lead, modal) quanto os que usam state (Workspace, LeadContextPanel, HybridShell) passam o lead para o wizard. ProposalsListPage continua podendo abrir nova proposta sem lead (leadId undefined).

---

## 3. Três “telas” de detalhe do lead (duplicação de conceito)

### 3.1 LeadDetailModal (Dashboard + LeadsPage)

- **Arquivo**: `LeadDetailModal.jsx`
- **Abertura**: clique em card/linha do lead; recebe o item do pipeline como `initialLead`.
- **Dados**: faz `GET /leads/:id` ao abrir; estado local `lead`.
- **UI**: modal fullscreen; abas “Detalhes” e “Documentos”; botão “Nova Proposta” → `navigate(/proposals/new?leadId=...)`; **Documentos** chama `GET /documents/lead/:leadId` e `POST /documents/upload` (backend existe em `modules/documents`).
- **Contexto Copilot**: não foi verificado se setContext é chamado ao abrir (LeadDetailPage chama; modal pode não chamar).
- **Não reutiliza** componentes de LeadDetailPage (LeadModalProfile, LeadDetailCanvas, etc.); layout e códigos próprios.

### 3.2 LeadDetailDrawer (SalesWorkspace)

- **Arquivo**: `LeadDetailDrawer.jsx`
- **Abertura**: seleção de lead na lista + Enter ou clique; `detailDrawerOpen === true`.
- **Dados**: `lead` e `loading` vêm do SalesWorkspace (que faz GET /leads/:id quando `selectedLead` muda). Edição: `onUpdate(leadId, data)` → PATCH + refresh pipeline + refresh lead no Workspace.
- **UI**: drawer direita; perfil, contato, proposta, timeline; link “Ver ficha” → `/leads/:id`. Reutiliza **LeadBasicsEditForm** (igual à página).
- **Sem aba Documentos** (upload de arquivos); sem integração explícita com documentos do backend.

### 3.3 LeadDetailPage (/leads/:id)

- **Arquivo**: `LeadDetailPage.jsx` + `LeadDetailCanvas.jsx` + blocos de abas (LeadModalProfile, LeadQualificationForm, etc.).
- **Dados**: GET /leads/:id no mount; setContext Copilot; estado local para status, edição, qualificação.
- **UI**: página cheia com abas (Visão Geral = Canvas, Dados & Edição, Qualificação, Proposta, Documentos, Histórico). Documentos: lista de PDFs de propostas + “Documentos do imóvel” (em breve). **Não** usa a mesma Documentos do LeadDetailModal (modal usa `/documents/lead/:leadId`; página fala em “em breve” para fotos/anexos).

Inconsistências:

- **Documentos**: no modal há upload e lista via API de documents; na página de detalhe a parte “Documentos” é outra (PDFs de propostas + placeholder). Comportamento e backend usados não são os mesmos.
- **Edição**: Drawer e Página usam LeadBasicsEditForm; Modal tem botão “Editar” mas não usa o mesmo form (layout próprio).
- **Funcionalidades**: Qualificação completa só na página; proposta (botão) na página e no modal; timeline na página e no drawer.

---

## 4. Estado global vs local

- **LayoutContext**: só `isSidebarCollapsed` e `toggleSidebar`; persistido em localStorage. Usado por DashboardShell.
- **CopilotContext**: `viewMode`, `activeContext`, `messages`, `isThinking`; `setContext`, `openSidebar`, `closeSidebar`, `triggerAction`. Não guarda lead nem pipeline.
- **AuthContext**: autenticação (fora do escopo desta análise).
- **ModeProvider**: modo (Vendas / Gestão / Projetos); usado pelo UnifiedShell para navegação e transição.
- **RealtimeProvider**: socket e conexão; usado por Copilot e por useLeadRealtime.

Não existe contexto global para “lead selecionado” nem “pipeline”. Cada tela mantém seu próprio estado (pipeline, selectedLead, leadDetail). Trocar de rota (ex.: Workspace → Leads) descarta o estado da tela anterior.

---

## 5. Navegação: matriz origem → destino

| De | Para | Como |
|----|------|------|
| Dashboard | Detalhe lead | Modal (LeadDetailModal) |
| Dashboard | Nova proposta | Não direto; pode ir ao lead e depois “Proposta” |
| LeadsPage (Funil/Leads) | Detalhe lead | Modal |
| LeadsPage | Ficha completa | Dentro do modal, LeadModalJourneyBanner → `/leads/:id` (se existir) |
| LeadsPage | Nova proposta | Dentro do modal → `/proposals/new?leadId=...` |
| SalesWorkspace | Detalhe lead | Drawer (LeadDetailDrawer) |
| SalesWorkspace | Ficha completa | Link “Ver ficha” no drawer → `/leads/:id` |
| SalesWorkspace | Nova proposta | Ctrl+Shift+N ou botão → `/proposals/new` com state.leadId (agora lido em ProposalPage) |
| LeadDetailPage | Nova proposta | Botão “Proposta” → `/proposals/new?leadId=...` |
| ProposalsListPage | Nova proposta | Link `/proposals/new` (sem leadId) |
| ProposalDetailPage | Lead | Link “Ver lead” → `/leads/:proposal.leadId` |
| GlobalSearch | Lead | `navigate(\`/leads/${it.id}\`)` |
| KanbanBoard | Detalhe | Se `onLeadClick` existir → modal; senão → `navigate(\`/leads/${lead.id}\`)` (LeadsPage sempre passa onLeadClick, então é modal) |

---

## 6. Riscos e bugs identificados

### 6.1 Corrigidos nesta análise

- **ProposalPage e leadId**: passou a ler query e state; fluxos “Nova proposta” a partir de lead passam a receber o lead corretamente.

### 6.2 Ainda presentes

1. **LeadsListPage e `refresh`**: `useLeadsList()` não retorna `refresh`, mas LeadsListPage faz `const { leads, loading, refresh } = useLeadsList()`. Se a página for roteada, `refresh` será `undefined` e botões que chamem `refresh()` podem quebrar. **Sugestão**: em `useLeadsList` retornar também `refresh` de `useDashboardData()`.

2. **Documentos do lead em dois padrões**: Modal usa `/documents/lead/:leadId` e upload; página de detalhe usa bloco “Documentos do imóvel — em breve”. Decisão de produto: unificar “Documentos” (upload + lista) na página também e reutilizar a mesma API, ou manter apenas no modal até haver uma tela única de detalhe.

3. **Realtime só no Workspace**: em Dashboard e LeadsPage, novo lead ou atualização de outro usuário só aparece após 30s ou refresh manual. Se o produto exigir atualização imediata em todas as telas de lista, seria preciso usar useLeadRealtime (ou equivalente) também onde o pipeline é exibido, ou um único store/contexto de pipeline atualizado por WebSocket.

4. **Sidebar colapsada em dois lugares**: `LayoutContext` usa `quarks-sidebar-collapsed`; SalesWorkspace usa `quarks-command-center-sidebar-collapsed`. Se o usuário alternar entre Workspace e Dashboard, o estado “colapsado” pode ser diferente. Unificar chave ou contexto evita surpresa.

5. **HybridShell não é rota**: HybridShell é um layout alternativo que usa pipeline + realtime e navega para `/proposals/new` com state. Não está em nenhuma rota do App; apenas componentes do `hybrid/` são usados dentro de SalesWorkspace. Ou seja, “fluxo híbrido” hoje é o próprio SalesWorkspace; HybridShell em si está morto como rota.

### 6.3 Inconsistências de UX (não são bugs de código)

- Dois itens de menu (Funil e Leads) para a mesma página.
- Três formas de “ver o lead” (modal, drawer, página) com níveis diferentes de funcionalidade (documentos, qualificação, proposta).
- Rotas existentes sem item no menu (clients, chat, cronograma, kits, settings).

---

## 7. Resumo executivo

- **Dados**: Pipeline em dois “mundos” (useDashboardData vs SalesWorkspace + realtime só no Workspace). Detalhe do lead buscado em três fluxos distintos (página, modal, drawer) com ciclos de vida diferentes.
- **Nova proposta**: Correção em ProposalPage (query + state) resolve a passagem de leadId em todos os pontos de entrada conhecidos.
- **Detalhe do lead**: Três UIs (Modal, Drawer, Página) com features e backends diferentes (ex.: documentos). Unificar ou definir claramente quando usar cada uma reduz confusão e duplicação.
- **Estado**: Sem store global de leads; cada tela gerencia seu estado. Realtime e polling não estão alinhados entre telas.
- **Código morto / legado**: LeadsListPage sem rota; useLeadsList sem `refresh`; HybridShell como layout não roteado; páginas duplicadas (Dashboard, ProposalPageNew, logins). Limpar ou documentar evita uso equivocado.

A **auditoria anterior** (`AUDITORIA_FLUXOS_FRONTEND.md`) continua válida para decisões de produto (um fluxo de leads, o que vai no menu). Esta análise aprofunda **como** os dados fluem, onde estão as duplicações e os riscos técnicos restantes.
