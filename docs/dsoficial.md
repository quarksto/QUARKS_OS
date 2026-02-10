# Quarks OS — Design System (dsoficial)

O Design System atual é o **v1.4**, que consolida e expande as definições da v1.3 (especialmente "Outline Mode" para badges).

- **Projeto Stitch Padrão**: `7501714242827931826`

## 1. Regras Críticas
- **Design Minimalista (Less is More)**:
    - **Conteúdo > Forma**: O foco é o dado. Elementos decorativos (linhas, ícones soltos, backgrounds pesados) são proibidos.
    - **Espaço em Branco**: O layout respira. Use margens generosas (`gap-6`, `p-8`) em vez de bordas para separar seções.
- **Zero Sombras (Super Flat)**:
    - **Proibido usar sombras** para profundidade artificial (`box-shadow`, `shadow-*`).
    - **Exceção**: Apenas `shadow-sm` muito sutil (5%) no **hover** de cards/botões.
- **Sem Gradientes & Efeitos**:
    - **Apenas cores sólidas**. Nada de blur, glow, glassmorphism pesado ou texturas.
    - **Tema Claro (Light Mode)**: Default. Sólido e limpo.
- **Linhas Mínimas & Sutis**:
    - **Bordas e Divisores**: Devem ser quase imperceptíveis. Use `Slate 100` (#f1f5f9) para bordas de cards e `Slate 50` (#f8fafc) ou `Slate 100/50` para divisores internos.
    - **Grid Lines (Gráficos)**: Use apenas `Slate 100` com transparência ou elimine-as se o dado for legível.
- **Micro-interações Mínimas**:
    - **Proibido**: Animações complexas, saltos, bounces.
    - **Permitido**: `transition-colors` (hover), `scale-95` (active) ultra-rápido (200ms).
- **Sem Emojis**: **Proibido usar emojis** no texto ou UI. Use ícones (Material Symbols) stroke-width 300.
- **Idioma & Localização**: Sistema todo em **Português do Brasil (PT-BR)**.
    - **Datas**: `DD/MM/AAAA`.
    - **Moeda**: `R$ 0,00`.

## 2. Design Tokens & Semântica

### 2.1 Cores Primitivas (Paleta)
| Token | Hex | Var Tailwind |
| :--- | :--- | :--- |
| **Petroleum** | `#0F4C5C` (900) - `#08323d` (950) | `bg-petroleum`, `text-petroleum` |
| **Solar** | `#F59E0B` (500) - `#fffbeb` (50) | `bg-solar`, `text-solar` |
| **Canvas** | `#F8FAFC` (Slate 50) | `bg-canvas` |
| **Slate** | `#1e293b` (800) -> `#f8fafc` (50) | `bg-slate-{n}`, `text-slate-{n}` |

### 2.2 Tokens Semânticos (Uso Obrigatório)
Estes tokens abstraem as cores primitivas para garantir consistência e acessibilidade.

| Token Semântico | Referência (Primitive) | Aplicação |
| :--- | :--- | :--- |
| `--text-high-contrast` | `Slate 700` (#334155) | Títulos, Valores em destaque (KPIs). |
| `--text-medium-contrast` | `Slate 500` (#64748b) | Corpo de texto, parágrafos. |
| `--text-low-contrast` | `Slate-400` (#94a3b8) | Labels, placeholders, metadados. |
| `--border-subtle` | `Slate 50` (#f8fafc) | Divisores internos muito sutis. |
| `--border-light` | `Slate 100` (#f1f5f9) | Bordas de cards e inputs. |
| `--border-default` | `Slate 100` (#f1f5f9) | Substituído por `Slate 100` na v1.4 para menos contraste. |
| `--quarks-solar` | `Solar 500` (#F59E0B) | Ações primárias, focus rings. |
| `--quarks-energy` | `Slate 600` (#475569) | Elementos de interface secundários. |

### 2.3 Radius e Estrutura Minimalista
| Token | Valor | Regra |
| :--- | :--- | :--- |
| `rounded-lg` | **8px** | Padrão Universal (Cards, Inputs, Modais). Evita "cantos vivos" agressivos. |
| `rounded-full` | 9999px | Botões e Badges (Pills). Suavidade máxima. |
| `border` | 1px Solid | **Sempre Sutil**. `border-slate-100`. Nunca usar bordas grossas (>1px). |
| **KPI Weight** | `font-semibold` (600) | **Redução de Peso**: Para tamanhos grandes (>24pt), use 600 em vez de 700 para evitar agressividade visual. |
| **No-Black Rule** | Max `Slate 800` | **Proibido usar Preto 1000** (`Slate 900` ou superior) em textos extensos ou números grandes. |
| **Input Borders** | `Petroleum/20` | **Cor Principal**: Usar Petroleum (sutil) para bordas de input. **Sem Amarelo/Solar**. |
| **Input Focus** | `No Border` | **Quiet Mode**: Quando em foco/seleção, o input não deve ter nenhuma borda ou ring visível. |

- **Gride System (Workspace Standard)**:
    - **Mobile**: `grid-cols-1`, no sidebar (menu hambúrguer oculto ou overlay).
    - **Tablet**: `grid-cols-2` ou Layout de Painel Único, Sidebar colapsada (`w-[72px]`).
    - **Desktop**: Layout Multi-Painel, Sidebar expandida ou colapsada conforme contexto.
- **Z-Index**: `z-50` (Modal/Header), `z-40` (Tooltip), `z-30` (Dropdown), `z-0` (Base).

## 2.3 Espaçamento & Ritmo (Workspace Standard)
- **Container Master**: `max-w-[1600px] mx-auto`.
- **Padding da Página (Main Content)**:
    - **Mobile**: `p-4`.
    - **Desktop**: `p-6` (24px) - O padrão Workspace para equilíbrio entre densidade e respiro.
- **Padding de Headers / Sub-headers**:
    - **Padrão**: `px-8` horizontal para alinhamento com AdaptiveHeader.
- **Gaps (Distância)**:
    - **Compacto**: `gap-2` (micro-elementos).
    - **Interno (Column Items)**: `gap-4`.
    - **Padrão Workspace (Major Panels)**: `gap-6`.
    - **Grid de Cards (KPIs)**: `gap-6`.
    - **Grandes Seções**: `gap-8` ou `space-y-8`.

## 2.4 Cores Proibidas & Restrições
- **Roxo (Purple)**: **Banido**. Não usar em nenhuma hipótese.
- **Fundos Semânticos**: Proibido usar `bg-red-500`, `bg-green-500` etc. em cards ou badges inteiros. Use apenas **Outline** (`border-red-200 text-red-700`).
- **Gradients**: Proibido.
- **Neon / Glow**: Proibido.

## 3. Tipografia (Geist / Geist Mono)
| Classe | Tamanho | Peso (Tailwind) | Uso |
| :--- | :--- | :--- | :--- |
| `.ds-display-xl` | 42px | `font-bold` (700) | KPIs Grandes |
| `.ds-display-l` | 32px | `font-bold` (700) | KPIs Médios / Scores |
| `.ds-title-page` | 24px | `font-bold` (700) | Títulos de Página |
| `.ds-title-section` | 16px | `font-medium` (500) | Seções |
| `.ds-label` | 11px | `font-medium` (500) | Rótulos (Input/Listas) |
| `.text-meta` | 10px | `font-bold` (700) | Micro-labels (Caps) |

## 4. Componentes Primitivos (Flat / Minimal)

### Botões
- **Primário (CTA)**: `rounded-full bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-[11px] px-4 py-2`. **Sem sombra**.
- **Secundário (Petroleum)**: `rounded-full border border-petroleum text-petroleum hover:bg-petroleum hover:text-white font-bold text-[11px] px-4 py-2`.
- **Terciário (Ghost)**: `bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg px-3 py-2 text-[11px] font-medium transition-all`.
- **Icon Button**: `rounded-full p-2 hover:bg-slate-50 text-slate-500`. **Sempre circular**.
- **Destructive**: `text-red-600 hover:bg-red-50 border-red-200`.

### Badges (Outline)
- **Kanban/Status**: `.badge-kanban` (`rounded-full border border-slate-200 bg-white text-[10px] uppercase tracking-wider`).
- **Contagem**: `.badge-ultra-compact` (`rounded-md border border-slate-200 px-1.5 py-0.5 text-[9px]`).

### Inputs & Forms
- **Campo de Texto**: `border border-slate-200 rounded-lg bg-transparent h-9 px-3 text-[13px]`. **Zero sombra e sem preenchimento**.
- **Select (Dropdown)**: `bg-transparent border border-slate-200 rounded-lg h-9 px-2 text-[13px]`. Seta simples em SVG.
- **Switch (Toggle)**: `bg-slate-200` (off) / `bg-solar-500` (on). **Sem efeito 3D**.
- **Checkbox / Radio**: `border-slate-300 rounded text-solar-500 focus:ring-0`.
- **Focus**: `focus:border-petroleum/60 focus:outline-none`. **Sem ring/glow**.
- **Erro**: `border-red-300 text-red-600 focus:border-red-500`. Animação `animate-shake`.
- **Label**: `block text-[12px] font-medium text-slate-700 mb-1`.

### Conteúdo & Overlay
- **Card (Base)**: `bg-white border border-slate-200 rounded-lg`. Shadow apenas `sm` em hover.
- **Container**: `max-w-[1600px] mx-auto` (para telas ultra-wide).
- **Scrollbar**: `scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent`.
- **Tabela**: Header `bg-slate-50 text-slate-500 uppercase text-[10px]`. Linhas `border-b border-slate-100 hover:bg-slate-50/50`.
- **Modal**: `bg-white rounded-lg shadow-sm border border-slate-200`. Overlay `bg-slate-900/20` (backdrop blur light).
- **Avatar**: `rounded-full bg-slate-100 text-slate-600 font-medium flex items-center justify-center`.
- **Divider**: `border-t border-slate-100` (sutil) ou `border-slate-200` (seção).

### Feedback & Estados
- **Alertas (Toast)**: `bg-slate-800 text-white rounded-lg shadow-lg` (minimalista). Sem bordas coloridas pesadas.
- **Loading**: Skeleton (`bg-slate-100 animate-pulse`) ou Spinner sutil (`text-solar-500`). **Proibido full-screen loaders bloqueantes**.
- **Empty State**: Ícone outline cinza (`text-slate-300`) + Texto curto (`text-slate-500`). Nada de ilustrações 3D complexas.

### Data Visualization (Charts)
- **Cores**: 
    - `Petroleum` (#0F4C5C) para séries principais.
    - `Solar` (#F59E0B) para destaques/ação.
    - `Emerald` (#10b981) para positivo/conclusão.
    - `Slate` (#94a3b8) para neutro/previsão.
- **Estilo**: **Flat**. Sem sombras nos gráficos, sem grid lines pesadas (usar `stroke-slate-100`). Tooltip customizado (veja acima).

### AI & Chat UI
- **Input Area**: `rounded-2xl border border-slate-200 bg-white shadow-sm` (suave). Botão de envio integrado.
- **Bubbles**:
    - **User**: `bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm`.
    - **Bot/AI**: `bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm`.
- **Typing**: Dots animados (`animate-pulse`) cor `solar`.

## 5. Iconografia
- **UI Geral**: Material Symbols Outlined (Google Fonts).
    - *Regra*: Estilo 'Outlined' (Stroke fino, peso 300).
- **Redes Sociais / Marcas**: `react-icons` (FaInstagram, FaWhatsapp, etc.) ou `@tabler/icons-react`.
    - *Uso*: Apenas para links externos ou representação de marcas/canais.
- **Containers de Ícone**: Quando houver necessidade de fundo ou borda em um ícone, use **formato totalmente arredondado** (`rounded-full`) com **linhas mínimas e sutis** (`border-slate-100` ou `bg-slate-50`). O **espaçamento interno (padding) deve ser igual em todos os eixos** (ex: `p-2`), garantindo centralização perfeita.
- **Tamanhos**: 12px (cards), 14px (barras), 20px (headers/nav).

## 6. Motion & Animação
- **Transições**: `transition-all duration-200 ease-in-out` (padrão para hover/focus).
- **Entradas**: `animate-fade-in` ou `animate-slide-up` (suave, 300ms).
- **Micro-interações**: **Mínimas**. Escala ultra-sutil (`active:scale-95`). Nada de movimentos bruscos ou distrativos.

## 7. Padrões de Layout (Legado / Core)
Para garantir a consistência estrutural das versões originais:
- **DashboardShell**: Estrutura imutável `Sidebar` (Petroleum) + `AdaptiveHeader` + `Main Content`.
- **KpiGrid**: Grid de 4 colunas (`grid-cols-4`) para KPIs, mantendo o "Data-First" (números grandes, 42px/32px).
- **InsightBar**: Barra de IA no topo, sem modais intrusivos.

## 8. Mapeamento de Dados & Arquitetura (Binding)
Para garantir a conformidade com `docs/ARQUITETURA_DE_DADOS.md`:
- **Lead.status**: Obrigatório usar `.badge-kanban`.
    - Ex: `NEW` (Cinza), `WON` (Verde/Emerald), `LOST` (Vermelho/Red).
- **Valores Monetários** (`Proposal.totalPrice`, `Product.costPrice`):
    - Exibição: Formatado em BRL (R$) com fonte `Geist Mono` ou tabular.
    - Input: Sempre alinhado à direita.
- **KPIs (DashboardMetrics)**:
    - `LeadCount` -> `.ds-display-xl` (Data-First).
    - `ConversionRate` -> `.ds-display-l` + `.text-emerald-600` (se positivo).
- **Estados de Carregamento**:
    - Sempre vincular `isLoading` dos Agents ao Skeleton UI do componente específico. **Nunca bloquear a tela inteira.**

## 9. Hierarquia Visual & Composição
Para guiar o olhar do usuário:
1.  **Tipografia**:
    - **Nível 1 (Página)**: `.ds-title-page` (`text-petroleum-900`).
    - **Nível 2 (Seção)**: `.ds-title-section` (`text-slate-700`).
    - **Nível 3 (Corpo)**: `.text-[13px] text-slate-600` (Leitura).
    - **Nível 4 (Meta)**: `.ds-label` ou `.text-[11px] text-slate-400` (Detalhes).
2.  **Ações (Botões)**:
    - **1 página = 1 CTA Principal** (`bg-solar`).
    - Ações secundárias sempre em `Outline` ou `Ghost`.
3.  **Espaçamento**:
    - Itens relacionados: `gap-2`.
    - Separação de grupos: `gap-6` ou `my-6`.

## 10. Imagens & Assets Criativos
- **Estilo**: Realista, Tech-Minimalist (ex: Painéis solares em telhados modernos, sem "clipart" ou vetores infantis).
- **Qualidade**: Alta resolução, bem iluminada (Solar), com foco no produto/resultado.
- **IA Generativa**: Ao usar `generate_image`, peça sempre "photorealistic, architectural style, 8k".

## 11. Acessibilidade & Responsividade
- **Responsividade (Mobile-First)**:
    - Sidebar colapsa para Menu Hamburguer ou Bottom Bar em mobile.
    - Tabelas ganham scroll horizontal (`overflow-x-auto`) ou viram Cards verticais.
    - Grid de 4 colunas vira 1 coluna (`grid-cols-1`) em telas pequenas.
- **Acessibilidade (a11y)**:
    - **Ícones**: Se decorativo, `aria-hidden="true"`. Se interativo, `aria-label="Descrição da Ação"`.
    - **Contraste**: Textos pequenos (`.ds-meta`) apenas em Slate-500 ou mais escuro. Nada de cinza muito claro.
    - **Foco**: O outline de foco (`focus:border-petroleum`) é OBRIGATÓRIO para navegação via teclado.

---

## 12. Governança & Extensão (Guardrails)
Para manter a integridade do Design System em escalas maiores, todo novo componente deve seguir esta rigorosa governança.

### 12.1 Princípio da Composição
- **Nunca comece do zero**: Todo componente novo deve ser composto por primitivos existentes.
    - Ex: Um novo "FilterDropdown" deve ser feito de `Button` (Trigger) + `Card` (Container) + `Badge` (Selection).
- **Proibido "CSS Freestyle"**: Não escreva classes Tailwind arbitrárias (ex: `h-[37px]`, `bg-[#123456]`). Se o token não existe, o design está errado.

### 12.2 Padrões de Altura (Vertical Rhythm)
A consistência vertical é fundamental para a harmonia visual. Use **apenas** estas alturas para elementos interativos.

| Classe | Altura | Uso Obrigatório |
| :--- | :--- | :--- |
| `h-8` (32px) | **Base** | **Padrão Universal**. Botões, Inputs, Selects. Compacto e denso. |
| `h-9` (36px) | **Medium** | Opcional. Para elementos que precisam de mais respiro. |
| `h-10` (40px) | **Large** | CTAs Principais, Login, Search Bars de destaque. |
| `h-12` (48px) | **X-Large** | Botões de Login, Modais de confirmação crítica. |

### 12.3 Auditoria de Criação (Checklist)
Antes de commitar um novo componente, verifique:
1.  [ ] Usa apenas cores `petroleum`, `solar`, `slate` e `white`?
2.  [ ] Segue o padrão de altura (`h-8`, `h-9` ou `h-10`)?
3.  [ ] Tem `focus:border-petroleum` (acessibilidade)?
4.  [ ] É responsivo (funciona em mobile)?
5.  [ ] Usa ícones `Material Symbols` (stroke 300)?
6.  [ ] **Zero Erros**: O build (`npm run build`) passa e não há erros no console?

## 13. Contexto & Inteligência Artificial (AI-First)

Para garantir que a I.A. não seja apenas um "chat à parte", mas o cérebro do sistema, siga estas regras de integração:

### 13.1 Consciência de Contexto (Context Awareness)
- **Cabeçalho de Atendimento**: O Copilot deve sempre exibir explicitamente o objeto ou pessoa que está auxiliando (ex: "Atendimento: João Dias").
- **Sincronização Visual**: Quando um Lead é selecionado no Workspace, o Copilot deve atualizar seu estado interno para refletir esse contexto imediatamente.

### 13.2 Pílulas de Ação (Action Pills)
- **Interatividade**: Sugestões da IA (ex: "Gerar Proposta", "Analisar Histórico") devem ser apresentadas como pílulas (`badge-kanban`) clicáveis.
- **Comportamento**: Ao clicar, a pílula deve disparar um comando direto para o chat ou iniciar o fluxo automatizado correspondente.

### 13.3 Gatilhos de Deep-Link (AI Triggers)
- **Botões "Análise IA"**: Todo painel de dados denso (como o Perfil Executivo) deve ter um botão de destaque para acionar a análise do Copilot sobre aqueles dados específicos.
- **Estilo**: Use `rounded-full` com bordas sutis e ícone de faísca (`auto_awesome`) ou insight.

### 13.4 Chat UI Tokens
- **Botões Internos**: Botões de ação dentro das bolhas de chat ou controles do Copilot (anexos, microfone, enviar) devem ser **sempre** `rounded-full` e `h-8`.
- **Fidelidade**: Manter o visual "Super Flat" mesmo em elementos flutuantes.

## 14. Padrão de Modais (Modal Primitives v1.4)
Para garantir que todos os modais do sistema tenham a mesma "assinatura visual", utilize os componentes em `src/frontend/src/components/shared/ModalPrimitives.jsx`.

### 14.1 Estrutura Canônica
Toda janela modal deve seguir esta ordem hierárquica:
1.  **ModalOverlay**: Backdrop `bg-slate-900/20` com blur `2px`.
2.  **ModalPanel**: Container com `border-slate-200`, `rounded-lg` e **zero shadow**.
3.  **ModalHeader**: Cabeçalho com ícone Petroleum (border sutil), Título Slate 700 e Subtítulo Slate 400 (Caps).
4.  **ModalContent**: Área de scroll com `p-6`.
5.  **ModalFooter**: Ações alinhadas à direita, `gap-3` e botões `rounded-full`.

### 14.2 Anatomia do Header
O ícone do header deve ser sempre envolto em um `rounded-lg bg-slate-50 border-slate-100` para destaque sutil (vidéo DS §5). O peso do ícone deve ser rigorosamente `ds-icon-w300`.

> **Nota**: Se um componente não passar nesta checklist, ele **não deve** ser integrado ao codebase principal.
