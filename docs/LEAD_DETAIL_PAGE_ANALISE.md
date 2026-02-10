# Página de Detalhe do Lead (`/leads/:id`) — Análise e Fluxo

**URL de referência:** `http://localhost:5173/leads/:id`

---

## 1. Fluxo atual (automático)

| Etapa | O que acontece |
|-------|----------------|
| **Entrada** | Usuário acessa `/leads/:id` (lista, Kanban, busca ou link direto). |
| **Carregamento** | `LeadDetailPage` monta → `useEffect` chama `GET /api/leads/:id` → backend retorna lead + `activity` (timeline). |
| **Contexto Copilot** | Após carregar, `setContext({ type: 'LEAD', summary, data })` atualiza o Copilot para o lead atual. |
| **Abas** | Visão Geral (Canvas), Dados & Edição, Qualificação, Proposta, Documentos, Histórico. |
| **Alterar status** | Select no header → `PATCH /api/leads/:id/status` → estado local atualizado. |
| **Editar** | Botão "Editar" → abas "Dados & Edição" com `LeadBasicsEditForm` → "Salvar Alterações" → `PATCH /api/leads/:id`. |
| **Nova proposta** | Botão "Proposta" → navega para `/proposals/new?leadId=:id` ou dispara `triggerAction('GENERATE_PROPOSAL')` e abre o Copilot. |
| **Qualificação** | Aba Qualificação → `LeadQualificationForm` → save → `PATCH /api/leads/:id` (campos de qualificação). |
| **Histórico** | Aba Histórico → `LeadModalTimeline` usa `lead.activity` (vindo do GET /leads/:id). |

Fluxo de dados: **Frontend → API Backend → Prisma → PostgreSQL**. Não há passo manual para “conectar” ao banco na tela; basta o backend estar no ar com `DATABASE_URL` configurado.

---

## 2. O que já está feito

- Rota protegida e layout com shell (sidebar + header + breadcrumbs).
- Carregamento do lead por ID e exibição de erro (ex.: 404).
- Pipeline visual (stepper) com status do lead.
- Abas: Visão Geral (Canvas), Dados, Qualificação, Proposta, Documentos, Histórico.
- Header com temperatura, select de status, Editar, Proposta e (em edição) Cancelar / Salvar.
- Integração com Copilot (contexto + ação “Gerar Proposta”).
- Canvas com BANT, especificações técnicas, gráfico de energia, stakeholders, timeline e CTA.
- Uso de tokens de tipografia (ds-meta, ds-body, etc.) e cards (technical-card = ds-card).

---

## 3. O que ainda falta (pendências)

### 3.1 Dados reais no Canvas (`LeadDetailCanvas.jsx`)

- **BANT:** Valores fixos (budget 80, authority 100, etc.). Falta: origem a partir do lead ou de um modelo de scoring no backend.
- **Especificações técnicas:** Valores fixos (área de telhado, GPS, concessionária, etc.). Falta: mapear para `lead.roofType`, `lead.fullAddress`, `lead.distributor`, etc., e preencher “Em breve” onde não houver dado.
- **Gráfico de energia:** Mock. Falta: consumo real (`lead.consumption`) e projeção (ex.: vinda do motor de proposta ou Solar API).
- **Stakeholders:** Lista fixa. Falta: API ou regra (ex.: contatos do lead, responsável comercial) ou manter “Em breve”.
- **Timeline:** Já usa `lead.activity` (retornado pelo GET /leads/:id). Conferir formato do backend (ex.: `created_at`, `type`, `description`).

### 3.2 Fluxo automático desejável

- **Atualização em tempo real:** Ao mudar status (ou editar) em outra aba/lista, esta página pode ficar desatualizada. Opção: polling suave (ex.: re-fetch a cada N segundos quando a aba está visível) ou WebSocket (evento “lead updated”).
- **Deep link para proposta:** Botão “Proposta” já leva a `/proposals/new?leadId=:id`. Garantir que a página de nova proposta lê `leadId` da query e pré-carrega o lead.
- **Documentos:** Aba “Documentos” indica “em breve” para fotos/anexos. Backend/armazenamento de arquivos ainda a implementar.

### 3.3 Design System (DS)

- Ajustes aplicados nesta rodada: ver seção 4 abaixo (resumo das alterações no código).

---

## 4. Ajustes de DS aplicados

- **LeadDetailPage:** Select de status: `focus:ring-1 focus:ring-petroleum` → `focus:outline-none focus:border-petroleum/60`. Botões primários: `hover:shadow-md` → `hover:shadow-sm`. Divider do header: `bg-slate-200` → `bg-slate-100`. Conteúdo: `lg:p-10` → `lg:p-8`. Tabs: `border-slate-200` → `border-slate-100`. Step ativo do pipeline: remoção de `shadow-sm` no estado padrão. Caixa de erro: `bg-amber-50` → `bg-white border border-amber-200` (alerta em outline). Uso de `ds-title-section` onde estava `ds-title`.
- **LeadDetailCanvas:** Fundo: `bg-slate-50` → `bg-canvas`. CTA “Criar Nova Tarefa”: foco acessível com `focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2` (DS permite exceção para a11y).

---

## 5. Checklist rápido

- [x] Página carrega lead por ID e mostra erro quando não existe.
- [x] Status alterável pelo select e refletido na UI.
- [x] Edição de dados básicos e qualificação com PATCH.
- [x] Navegação para nova proposta com `leadId`.
- [x] Copilot recebe contexto do lead.
- [ ] Canvas usar dados reais do lead (BANT, specs, energia, stakeholders).
- [ ] (Opcional) Atualização em tempo real ou polling quando a aba está visível.
- [x] Conformidade DS revisada (focus, bordas, padding, sombras, tokens).
