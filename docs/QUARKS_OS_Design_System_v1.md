# Quarks OS — Design System v1.3 (Dashboard como referência)

**Origem:** Este DS é extraído e padronizado a partir da **página Dashboard** (DashboardRefactored + componentes em `src/frontend/src/components/dashboard/`). A Dashboard é a **fonte única de verdade** para tokens, componentes primários e padrões visuais. Todas as telas devem seguir estes padrões para consistência.

**Artefatos de referência:**
- Página: `src/frontend/src/pages/DashboardRefactored.jsx`
- Componentes: `src/frontend/src/components/dashboard/*.jsx`
- Estilos: `src/frontend/src/index.css`, `src/frontend/tailwind.config.js`
- Análise: `docs/DASHBOARD_ANALYSIS.md`

---

## 1. Regras críticas (NÃO NEGOCIÁVEIS)

1. **SEM GRADIENTES** — Nenhum gradiente de fundo. Usar cores sólidas (branco, slate-50, petroleum).
2. **TEMA CLARO** — Light mode apenas. Fundos claros, texto slate, bordas definidas.
3. **SEM DARK MODE** — A menos que pedido explícito para um recurso específico.
4. **Sombras** — `shadow-sm` ou `shadow-md`. Nada de sombras pesadas ou neon.
5. **IDIOMA (PT-BR)** — Todo o sistema (front-end, labels, mensagens de erro, feedbacks da IA e documentação de interface) deve ser obrigatoriamente desenvolvido em **Português do Brasil (PT-BR)**.

---

## 2. Tokens (referência Dashboard)

### 2.1 Cores — Tailwind (theme extend)

| Token       | Valor / escala              | Uso no Dashboard |
|------------|-----------------------------|-------------------|
| `canvas`   | `#F1F5F9`                   | Fundo do app (Shell: `bg-[#F1F5F9]`) |
| `petroleum`| `#0F4C5C` (DEFAULT) + 50–950 | Sidebar, botões, barras, badges, ícone bolt, nav ativo, InsightBar, Copilot ativo |
| `solar`    | `#F59E0B` (DEFAULT) + 50–700 | CTA "NOVO NEGÓCIO", donut conversão, barras de progresso, logo bolt, trend positivo |
| `slate`    | (Tailwind padrão)            | Texto, bordas, fundos neutros |

**Uso comum (Dashboard):**
- **Primária / marca:** `bg-petroleum`, `text-petroleum`, `border-petroleum`, `hover:bg-petroleum-600`, `bg-petroleum/10`, `text-petroleum-800`.
- **Ação / destaque:** `bg-[#F59E0B]`, `bg-solar-500`, `text-solar-600`, `bg-emerald-50 text-emerald-600` (sucesso/Online), `bg-amber-50 text-amber-600` (Sincronizando).
- **Neutros:** `bg-white`, `bg-[#F8FAFC]` (header), `text-slate-900`, `text-slate-500`, `text-slate-400`, `border-slate-200`, `border-slate-200/40`.

### 2.2 Cores — CSS custom properties (index.css)

| Variável                 | Valor     | Uso |
|--------------------------|-----------|-----|
| `--text-high-contrast`   | `#0f172a` | Títulos e valores principais |
| `--text-medium-contrast` | `#475569` | Corpo de texto |
| `--text-low-contrast`    | `#94a3b8` | Labels e metadados |
| `--quarks-solar`         | `#f59e0b` | Ação/Geração |
| `--quarks-energy`        | `#334155` | Consumo/Interface |
| `--success`              | `#10b981` | Sucesso |
| `--border-light`         | `#e2e8f0` | Bordas leves |

### 2.3 Tipografia — Fontes

| Token           | Valor                    | Uso |
|-----------------|--------------------------|-----|
| `--font-primary`| `"Geist", sans-serif`    | Texto geral (Tailwind: `font-sans`) |
| `--font-display`| `"Geist", sans-serif`    | Títulos e destaques (Tailwind: `font-display`) |
| `--font-data`   | `"Geist Mono", monospace`| Dados numéricos e código (Tailwind: `font-mono`) |
| **Ícones**      | Material Symbols Outlined| 20px header; 14px InsightBar/CTAs; 12px em cards |

### 2.4 Tipografia — Classes do DS (index.css)

| Classe            | Uso no Dashboard |
|-------------------|-------------------|
| `.ds-title-page`  | Título da página no header (24px, semibold) — AdaptiveHeader |
| `.ds-title-section` | Título de seção (16px) |
| `.ds-title`       | Título de bloco (14px) |
| `.ds-display-xl`  | Números grandes / KPIs (42px, bold) — card Leads Gerados |
| `.ds-display-l`   | Valores médios (32px, bold) — KPIs, Kanban score |
| `.ds-data`        | Dados (13px, medium) |
| `.ds-label`       | Rótulos (11px, slate-500) |
| `.ds-meta`        | Metadados (10px, slate-500) |
| `.ds-body`        | Corpo de texto (13px, medium-contrast) |
| `.kpi-title`      | Alias de `.ds-meta` — rótulos de KPI |
| `.kpi-value`      | Alias de `.ds-display-l` — valor KPI |
| `.ds-title-card`  | Título dentro de card (16px, slate-500) — KpiGrid cards |

### 2.5 Espaçamento e grid

| Token / padrão      | Valor / uso no Dashboard |
|---------------------|---------------------------|
| Base                | 8px (grid Tailwind) |
| Container principal | `p-4 md:p-8 max-w-[1600px] mx-auto` |
| KpiGrid             | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8` |
| Gap entre seções    | `gap-6`, `gap-8`, `mb-8` |
| Sidebar expandida   | `w-80`; colapsada: `w-[72px]` |
| Header              | `h-20` (80px) |

### 2.6 Border radius (tailwind.config.js)

| Nome   | Valor   |
|--------|---------|
| `rounded-md`  | 6px  |
| `rounded-lg`  | 8px (padrão Tailwind) |
| `rounded-full`| 9999px (pills, avatares) |

---

## 3. Componentes primários (referência Dashboard)

### 3.1 Shell e layout

| Componente        | Arquivo             | Uso no Dashboard |
|-------------------|---------------------|-------------------|
| **DashboardShell**| DashboardShell.jsx  | Wrapper: Sidebar + AdaptiveHeader + main. Classes: `flex h-screen w-screen bg-[#F1F5F9] overflow-hidden font-sans text-slate-900`. |
| **DashboardSidebar** | DashboardSidebar.jsx | Navegação colapsável. Classes: `bg-petroleum border-r border-slate-200/40`, largura `w-80` / `w-[72px]`. Logo: `bolt` solar; busca; nav com `.nav-item-active` / `.nav-item-inactive` (ou equivalentes inline). |
| **AdaptiveHeader**| AdaptiveHeader.jsx  | Header fixo. Classes: `h-20 border-b border-slate-200 bg-[#F8FAFC] px-6 sticky top-0 shadow-sm`. Ícone módulo: `w-9 h-9 bg-petroleum rounded-md`; título: `.ds-title-page`; subtítulo: `text-[11px] text-slate-400`; indicador loading: `bg-amber-50 text-amber-600` / `bg-emerald-50 text-emerald-600`. Copilot ativo: `border-petroleum bg-petroleum/10 text-petroleum`. |

### 3.2 Cards

| Classe / padrão   | Definição (index.css / uso) |
|-------------------|------------------------------|
| **.technical-card** | `bg-white border border-slate-200 rounded-lg transition-all flex flex-col shadow-sm hover:shadow-md`. Base para todos os cards. |
| **Card KPI (KpiGrid)** | `.technical-card` + `p-6 h-[160px] hover:border-petroleum/30 hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-sm`. Título: `.ds-title-card`; valor: `.ds-display-xl` ou `.ds-display-l`. |
| **Card Kanban**   | `.technical-card p-4 hover:border-petroleum/40 cursor-pointer`; uso de `.badge-kanban-*` e blocos de Score/Potencial. |

### 3.3 Botões e badges

| Classe / padrão   | Definição |
|-------------------|-----------|
| **.btn-pill**     | `rounded-lg border border-slate-200 shadow-sm font-bold text-[11px]` — filtros, ações secundárias. |
| **Botão primário (CTA)** | `rounded-full bg-[#F59E0B] hover:bg-solar-600 text-[#FFFFFF] px-3 py-1.5 font-bold text-[10px]` — ex.: "NOVO NEGÓCIO" no Dashboard. |
| **.badge-ultra-compact** | `px-2 py-0.5 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500` — meta, LIVE, contagens. |
| **.badge-kanban**  | `px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider`. Variantes: `.badge-kanban-temp`, `.badge-kanban-origin`, `.badge-kanban-consumption`; `.badge-kanban-dot` para indicador. |
| **.icon-circle**   | `w-10 h-10 rounded-lg border border-slate-200/40 flex items-center justify-center` — ícones no header (notificações, Copilot). |

### 3.4 Navegação (Sidebar)

| Classe             | Uso no Dashboard |
|--------------------|-------------------|
| **.nav-item-active**  | `bg-white/10 text-white rounded-md font-semibold` — item atual. |
| **.nav-item-inactive**| `text-white/90 hover:text-white hover:bg-white/5 rounded-md` — demais itens. |

*(No DashboardSidebar as classes podem ser aplicadas inline; o comportamento visual deve ser o mesmo.)*

### 3.5 InsightBar (Dashboard)

- **Container:** `bg-petroleum/[0.02] border-b border-slate-200/40 px-6 py-3 flex items-center justify-between animate-slideDown`.
- **Ícone:** `w-6 h-6 rounded-full bg-white border border-slate-200/40` + Material `smart_toy` 14px.
- **Texto:** `text-[13px] text-petroleum-800`; destaque numérico: `text-emerald-600 font-bold`.
- **CTA:** `text-[11px] font-bold uppercase tracking-wide text-petroleum-600 hover:text-petroleum-800 hover:underline`.

### 3.6 KpiGrid (Dashboard)

- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8`.
- **Cada card:** CardWrapper com `.technical-card` + `h-[160px]`, `.ds-title-card`, trend badge (`bg-emerald-50 text-emerald-600` / `bg-red-50 text-red-600`), `.ds-display-xl` ou `.ds-display-l`, barras/ donut com `bg-solar-500`, `bg-petroleum`, etc.

### 3.7 KanbanBoard (Dashboard)

- **Colunas:** títulos com estilo de seção; contador por coluna.
- **Card de lead:** `.technical-card` + badges `.badge-kanban-consumption`, `.badge-kanban-temp`, `.badge-kanban-origin`; bloco Score/Potencial com `bg-slate-50 border border-slate-100`; texto com `text-[10px]`, `text-[14px]`, etc., conforme KanbanBoard.jsx.

---

## 4. Inputs e Formulários

A prioridade é a limpeza visual e a redução de ruído cognitivo.

| Estado    | Classes Tailwind (Padrão) | Descrição |
|-----------|---------------------------|-----------|
| **Default** | `border border-slate-200 bg-white text-slate-900 rounded-lg` | Borda sutil, fundo branco. |
| **Hover**   | `hover:border-slate-300` | Feedback sutil ao passar o mouse. |
| **Focus**   | `focus:border-petroleum/60 focus:ring-0 outline-none shadow-none` | **Foco Minimalista Total**: Alterar APENAS a cor da borda para petroleum (60% opacidade). **PROIBIDO** usar anéis (ring), sombras (box-shadow) ou glow. |
| **Error**   | `border-red-300 focus:border-red-500 focus:ring-0` | Indicação de erro apenas pela cor da borda. |
| **Label**   | `text-sm font-medium text-slate-700` | Labels externos, acima do input. |

---

## 5. Animações (index.css)

| Classe              | Uso |
|---------------------|-----|
| `.animate-slideDown`| Entrada suave (InsightBar): opacity + translateY(-8px) → 0. |
| `.animate-shake`    | Erro/feedback (ex.: drag inválido no Kanban). |
| `.animate-fadeInScale` | Modais / overlays. |

---

## 5. Utilitários

| Classe            | Uso |
|-------------------|-----|
| `.scrollbar-hide` | Esconder scrollbar (nav da Sidebar). |
| `.scrollbar-custom`| Scrollbar 6px, track transparente, thumb slate. |

---

## 6. Referência rápida por módulo

| Módulo        | title               | subtitle                    | headerIcon   | moduleActions exemplo   |
|---------------|---------------------|-----------------------------|--------------|--------------------------|
| Dashboard     | Dashboard           | Solar Integrator 4.0        | grid_view    | Botão NOVO NEGÓCIO      |
| Leads (lista) | Leads & Clientes    | Gestão da Base de Contatos  | person_search| Badge "X leads"          |
| Leads (kanban)| Leads & Clientes    | Gestão do Pipeline de Vendas | view_kanban | Badge "X leads"          |
| Propostas     | Gerador de Proposta | Engine Python Solar         | description  | —                        |
| Kits          | Kits & Tarifas      | Gestão de Equipamentos e Tarifas | solar_panel| —                     |
| Configurações | Configurações       | Preferências do Sistema     | settings     | —                        |

---

## 7. Checklist de conformidade com o DS (a partir da Dashboard)

Ao criar ou alterar uma tela, verificar:

- [ ] Uso de **DashboardShell** (Sidebar + AdaptiveHeader + main).
- [ ] Cores apenas da paleta: **petroleum**, **solar**, **canvas**, **slate**; sem gradientes.
- [ ] Tipografia: **.ds-title-page**, **.ds-title-section**, **.ds-display-***, **.ds-meta**, **.kpi-title**, **.kpi-value** onde aplicável.
- [ ] Cards: base **.technical-card**; KPIs com **h-[160px]** e hover conforme KpiGrid.
- [ ] Botões: **.btn-pill** para secundários; CTA primário com `rounded-full bg-[#F59E0B]` (solar).
- [ ] Badges: **.badge-ultra-compact** ou **.badge-kanban-*** conforme contexto.
- [ ] Navegação: **.nav-item-active** / **.nav-item-inactive** na Sidebar.
- [ ] Container de conteúdo: **p-4 md:p-8 max-w-[1600px] mx-auto**.
- [ ] Ícones: Material Symbols Outlined, tamanhos 20px (header), 14px (barras), 12px (cards).

---

*Design System v1.3 — Padrões e tokens definidos a partir da página Dashboard (DashboardRefactored, AdaptiveHeader, InsightBar, KpiGrid, KanbanBoard, DashboardSidebar, index.css, tailwind.config.js). Última atualização: referência explícita à Dashboard como fonte única para o DS.*
