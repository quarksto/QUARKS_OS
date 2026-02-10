# Auditoria de Conformidade — Design System (dsoficial.md)

**Referência:** `docs/dsoficial.md` (DS v1.4)  
**Data:** 2025-02-09

---

## 1. Resumo Executivo

| Categoria | Status | Observação |
|-----------|--------|------------|
| Regras Críticas (Minimalismo, Sombras, Gradientes) | ⚠️ Parcial | Sombras e gradientes em alguns componentes |
| Cores & Tokens | ⚠️ Parcial | Uso de `bg-*-500` em indicadores e badges |
| Tipografia (ds-*) | ✅ Bom | Uso consistente de ds-title-page, ds-body, ds-label |
| Componentes (Cards, Botões, Inputs) | ✅ Bom | Maioria em conformidade |
| Iconografia (Material Symbols) | ✅ Bom | Stroke 300 em vários componentes |
| Motion & Acessibilidade | ⚠️ Parcial | Alguns focus:ring proibidos |

---

## 2. Violações Identificadas

### 2.1 Sombras (DS: Zero exceto `shadow-sm` em hover)

| Arquivo | Violação |
|---------|----------|
| `LeadModalProposal.jsx` | `hover:shadow-md` |
| `ProposalDetailPage.jsx` | `hover:shadow-md`, `shadow-sm hover:shadow` |
| `KitsPage.jsx` | `shadow-xl` em modais |
| `InputArea.jsx` | `hover:shadow-md`, `focus-within:shadow-md` |
| `GlobalSearch.jsx` | `shadow-xl` |
| `ProposalDetailCanvas.jsx` | `shadow-sm hover:shadow-md` |
| `LeadModalMap.jsx` | `shadow-lg` |
| `ProposalViewPublicPage.jsx` | `shadow-2xl`, `shadow-lg` |

**Correção:** Substituir por `shadow-none` ou `hover:shadow-sm` apenas onde permitido.

---

### 2.2 Gradientes (DS: Proibido)

| Arquivo | Violação |
|---------|----------|
| `ProposalViewPublicPage.jsx` | `bg-gradient-to-l from-solar/10 to-transparent` |
| `ProposalViewPublicPage.jsx` | `bg-gradient-to-t from-black/60 to-transparent` (overlay em imagens) |

**Correção:** Remover gradientes; usar cores sólidas ou transparência simples.

---

### 2.3 Fundos coloridos em badges/cards (DS: Outline apenas)

| Arquivo | Violação |
|---------|----------|
| `ProposalViewPublicPage.jsx` | `bg-emerald-500`, `bg-red-500`, `bg-amber-500`, `bg-blue-500` em badges |
| `LeadListTable.jsx` | Dots `bg-blue-500`, `bg-amber-500`, `bg-emerald-500` |
| `CronogramaPage.jsx` | `bg-*-100` em status — aceitável (light), mas Outline é preferível |

**Correção:** Usar `border-*-200 text-*-700 bg-white` (Outline) em badges. Dots pequenos (2–3px) podem permanecer para indicadores de estado.

---

### 2.4 Focus Ring (DS: Sem ring/glow, `focus:border-petroleum`)

| Arquivo | Violação |
|---------|----------|
| `ProposalDetailPage.jsx` | `focus:ring-2 focus:ring-slate-200`, `focus:ring-petroleum` |
| `LeadModalFooter.jsx` | Possível uso de ring em botões |

**Correção:** `focus:outline-none focus:border-petroleum/60` ou `focus:ring-0`.

---

### 2.5 rounded-xl vs rounded-lg (DS: rounded-lg = 8px padrão)

| Arquivo | Violação |
|---------|----------|
| `KitsPage.jsx` | `rounded-xl` em cards e modais |
| `LeadListTable.jsx` | `rounded-xl` em container |
| `ProposalViewPublicPage.jsx` | `rounded-2xl`, `rounded-3xl` em vários elementos |
| `InputArea.jsx` | `rounded-2xl` em bubbles (Chat UI permite `rounded-2xl`) |

**Nota:** O DS §4 (Chat UI) permite `rounded-2xl` para bubbles. Cards e modais devem usar `rounded-lg`.

---

### 2.6 Alturas (DS: h-8, h-9, h-10, h-12)

A maioria dos botões e inputs segue h-8 ou h-9. Verificar componentes custom que usam valores arbitrários.

---

## 3. Páginas em Conformidade

- **SettingsPage:** technical-card, ds-title-section, ds-body, border-slate-100/200, sem sombras.
- **CronogramaPage:** technical-card, ds-body, ds-label, botões h-8. Ajustar STATUS_COLORS para Outline.
- **ProposalsListPage:** KPI cards com hover:shadow-sm, bordas slate-200.
- **ClientDetailPage:** shadow-none explícito, estrutura correta.

---

## 4. Ações Prioritárias

1. **Alta:** Corrigir `ProposalViewPublicPage.jsx` (gradientes, sombras pesadas, badges sólidos).
2. **Alta:** Corrigir `KitsPage.jsx` (shadow-xl, rounded-xl).
3. **Média:** Corrigir `GlobalSearch.jsx` (shadow-xl).
4. **Média:** Ajustar STATUS_COLORS em `CronogramaPage.jsx` para estilo Outline.
5. **Baixa:** Revisar focus:ring em `ProposalDetailPage.jsx` e similares.

---

## 5. Checklist de Novos Componentes (DS §12.3)

Antes de commitar, verificar:

- [ ] Cores apenas `petroleum`, `solar`, `slate`, `white` (exceto outline em status)
- [ ] Altura `h-8`, `h-9` ou `h-10`
- [ ] `focus:border-petroleum` ou `focus:outline-none`, sem ring
- [ ] Responsivo (mobile)
- [ ] Ícones Material Symbols (stroke 300 / ds-icon-w300)
- [ ] Zero sombras ou apenas `hover:shadow-sm` em cards
- [ ] Sem gradientes, sem roxo, sem emojis

---

## 6. Refatoração Concluída (2025-02-09)

### Arquivos ajustados para conformidade DS v1.4

| Categoria | Arquivos | Correções |
|-----------|----------|-----------|
| **Sombras** | ProposalViewPublicPage, KitsPage, GlobalSearch, InputArea, LeadModalProposal, ProposalDetailPage, ProposalDetailCanvas, LeadModalMap, SalesWizard, StepKit, PricingRulesPage, ProductsPage, ServicesPage, DashboardRightSidebar, TemplateSelector, MentionInput, LoginPage, LoginPageStitch | `shadow-xl`/`shadow-lg`/`shadow-md` → `shadow-sm` |
| **Gradientes** | ProposalViewPublicPage | `bg-gradient-to-*` → `bg-*/40` ou sólido |
| **Badges Outline** | ProposalViewPublicPage, LeadListTable (temp), KanbanBoard, LeadCompactCard | `bg-*-500` → `border-*-200 text-*-700 bg-white` |
| **Focus** | StepFinancials, StepKit, StepRoof, StepConsumption, LoginPageStitch, ProposalDetailPage | `focus:ring-*` → `focus:border-petroleum/60 focus:ring-0` |
| **Bordas** | LeadListTable, ProposalDetailPage, ProposalViewPublicPage, KitsPage, LeadPipelineList, wizard steps, TemplateSelector, MentionInput, DashboardRightSidebar | `rounded-xl`/`rounded-2xl`/`rounded-3xl` → `rounded-lg` (exceto Chat UI bubbles: `rounded-2xl` permitido) |
| **Botão destrutivo** | ProposalViewPublicPage | `bg-red-500` → outline `border-red-200 text-red-600 hover:bg-red-50` |

**Nota:** Dots pequenos (1.5–2px) para indicadores de status permanecem. Chat bubbles mantêm `rounded-2xl` conforme DS §4.
