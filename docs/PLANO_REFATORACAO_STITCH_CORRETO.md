# 🎨 Plano de Refatoração UI/UX com Stitch MCP (CORRETO)

**Data**: 2026-02-05 17:30  
**Objetivo**: Refatorar páginas do Quarks OS usando Stitch MCP corretamente  
**Status**: 📋 PLANO REVISADO

---

## ✅ PROCESSO CORRETO DO STITCH MCP

### Como o Stitch MCP Funciona

O Stitch MCP **NÃO** é para buscar código de projetos existentes.  
O Stitch MCP é para **GERAR NOVAS TELAS A PARTIR DE TEXTO**.

**Fluxo Correto**:

```
1. create_project → Criar projeto Stitch
2. generate_screen_from_text → Gerar tela com prompt de texto
3. fetch_screen_code → Obter HTML/React gerado
4. Adaptar ao Design System → Integrar no código
```

---

## 📋 FERRAMENTAS DISPONÍVEIS

### Ferramentas do Stitch MCP

| Ferramenta | Uso | Quando Usar |
|------------|-----|-------------|
| `create_project` | Criar novo projeto Stitch | Início do processo |
| `list_projects` | Listar projetos existentes | Descoberta |
| `get_project` | Obter detalhes de projeto | Referência |
| `list_screens` | Listar telas de um projeto | Descoberta |
| `get_screen` | Obter detalhes de tela | Referência |
| `generate_screen_from_text` | **GERAR NOVA TELA** | ⭐ Principal |
| `fetch_screen_code` | Obter código HTML/React | Após gerar |
| `fetch_screen_image` | Obter screenshot | Visualização |

---

## 🎯 PROMPT TEMPLATE PARA GERAÇÃO

### Template Base (Design System v1.4)

```
Design System obrigatório — Quarks OS v1.4 (light theme, sem gradientes):

CORES:
- Primária/marca: petroleum #0F4C5C (sidebar, botões primários, bordas ativas, nav ativo). Usar: bg-petroleum, text-petroleum, border-petroleum, hover:bg-petroleum-600.
- Ação/destaque: solar #F59E0B (CTAs principais, barras de progresso, ícone bolt). Usar: bg-solar-500, text-solar-600, bg-[#F59E0B].
- Fundo do app: canvas #F1F5F9 ou branco. Usar: bg-[#F1F5F9], bg-white.
- Neutros: slate (texto, bordas). Usar: text-slate-900, text-slate-500, text-slate-400, border-slate-200, bg-slate-50.
- Proibido: gradientes, dark mode (a menos que pedido explícito).

TIPOGRAFIA:
- Fonte geral: Geist ou Inter (font-sans).
- Dados numéricos: Geist Mono (tabular-nums).
- Classes: títulos de página (24px), títulos de seção (16px), títulos de bloco (14px), dados (13px), rótulos (11px), metadados (10px).
- Ícones: Material Symbols Outlined; tamanhos 20px header, 14px barras, 12px em cards.

COMPONENTES:
- Cards: bg-white border border-slate-200 rounded-lg shadow-sm (classe .technical-card). Hover: hover:border-petroleum/30 hover:shadow-md.
- Botões secundários: rounded-lg border border-slate-200 shadow-sm font-bold text-[11px] (classe .btn-pill).
- Botão CTA primário: rounded-full bg-[#F59E0B] hover:bg-solar-600 text-white px-3 py-1.5 font-bold text-[10px].
- Badges: px-2 py-1 rounded-full text-[10px] font-medium uppercase (badge-kanban); ou px-2 py-0.5 border border-slate-200 rounded-lg text-[9px] (badge-ultra-compact).
- Navegação ativa: bg-white/10 text-white rounded-md (nav-item-active); inativa: text-white/90 hover:bg-white/5 (nav-item-inactive).

LAYOUT:
- Container principal: p-4 md:p-8 max-w-[1600px] mx-auto.
- Sidebar: bg-petroleum, w-80 expandida / w-[72px] colapsada, border-r border-slate-200/40.
- Header: h-20 border-b border-slate-200 bg-[#F8FAFC] px-6.
- Grid de cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6.
- Sem sombras pesadas: usar shadow-sm ou shadow-md apenas.

TELA A GERAR: [DESCRIÇÃO DA TELA]
```

---

## 🎯 PLANO DE REFATORAÇÃO POR PÁGINA

### 🔴 PRIORIDADE P0 - Semana 1

#### 1. Login Page (`/login`)

**Prompt para `generate_screen_from_text`**:

```
Design System obrigatório — Quarks OS v1.4 (light theme, sem gradientes):
[... incluir template base ...]

TELA A GERAR: 
Página de Login do Quarks OS: layout centralizado com card de login (max-w-md). Logo "Quarks OS" no topo (petroleum). Título "Bem-vindo de volta" (text-2xl font-bold text-slate-900). Subtítulo "Acesse sua conta para continuar" (text-sm text-slate-500). Formulário com 2 inputs: Email (type=email, placeholder="seu@email.com") e Senha (type=password, placeholder="••••••••"), ambos com border-slate-200 focus:border-petroleum/60 focus:ring-petroleum/20. Checkbox "Lembrar-me" (text-sm text-slate-600). Botão "Entrar" (rounded-full bg-[#F59E0B] hover:bg-solar-600 text-white w-full py-2.5 font-bold). Link "Esqueceu a senha?" (text-sm text-petroleum hover:underline). Fundo bg-[#F1F5F9]. Card com bg-white border border-slate-200 rounded-lg shadow-sm p-8. Sem gradientes, tema claro, petroleum e solar.
```

**Ações**:
1. `create_project({ title: "Quarks OS - Login Page" })`
2. `generate_screen_from_text({ projectId, prompt, deviceType: "DESKTOP" })`
3. `fetch_screen_code({ projectId, screenId })`
4. Adaptar código ao React
5. Manter funcionalidade de autenticação

**Estimativa**: 4-6 horas

---

#### 2. Dashboard (`/`)

**Prompt para `generate_screen_from_text`**:

```
Design System obrigatório — Quarks OS v1.4 (light theme, sem gradientes):
[... incluir template base ...]

TELA A GERAR:
Dashboard Quarks OS: sidebar petroleum (w-80) com logo, nav (Dashboard ativo, Leads, Propostas, Chat IA, Projetos, Dimensionamento IA, Cronograma, Configurações). Área principal: header "Dashboard" com botão CTA "+ NOVO NEGÓCIO" (rounded-full bg-[#F59E0B]). Barra de insight IA (bg-petroleum/5, ícone smart_toy, texto "IA sugere: 3 leads prontos para proposta"). Grid de 4 cards KPI: "Leads Gerados" (120, +15%), "Conversão" (32%, +8%), "Pipeline Ativo" (R$ 450k, +12%), "Automações" (89%, +5%). Cada card com .technical-card, título (text-[11px] text-slate-500), valor (text-2xl font-bold text-slate-900), variação (text-xs text-green-600). Seção "Fluxo Comercial" com kanban em 4 colunas: Triagem (12 leads), Qualificação (8), Proposta (5), Negociação (3). Cada card de lead com nome, consumo kWh, badge temperatura (Quente/Morno/Frio), score BANT. Tema claro, petroleum e solar, sem gradientes.
```

**Ações**:
1. `generate_screen_from_text({ projectId: "5019214678898543770", prompt })`
2. `fetch_screen_code({ projectId, screenId })`
3. Comparar com `DashboardRefactored.jsx`
4. Adicionar micro-interações

**Estimativa**: 2-3 horas

---

### 🟡 PRIORIDADE P1 - Semana 2

#### 3. Leads List (`/leads`)

**Prompt**:

```
[... template base ...]

TELA A GERAR:
Página "Leads & Clientes": sidebar petroleum. Header com título "Leads & Clientes" (text-2xl font-bold text-slate-900), subtítulo "Gestão da Base de Contatos" (text-sm text-slate-500), botão "Novo lead" (rounded-full bg-[#F59E0B]). Filtros: dropdown "Temperatura" (Todos/Quente/Morno/Frio), dropdown "Origem" (Todos/Site/Indicação/WhatsApp), dropdown "Score" (Todos/A/B/C/D). Tabela com colunas: Avatar + Nome, Email, Localização, Consumo (kWh/mês), Estágio (badge), Temperatura (badge), Score (A-D). Cada linha com hover:bg-slate-50 cursor-pointer. Badges: estágio (badge-kanban-*), temperatura (Quente=bg-red-50 text-red-700, Morno=bg-yellow-50 text-yellow-700, Frio=bg-blue-50 text-blue-700). Paginação no rodapé. Tema claro, petroleum e solar, sem gradientes.
```

**Estimativa**: 6-8 horas

---

#### 4. Funnel/Kanban (`/funnel`)

**Prompt**:

```
[... template base ...]

TELA A GERAR:
Página "Funil de Vendas": sidebar petroleum. Header com título "Funil de Vendas" (text-2xl font-bold), filtros (Temperatura, Origem). Kanban com 6 colunas: Triagem, Qualificação, Proposta, Negociação, Fechados, Perdidos. Cada coluna com header (título, contador, valor total R$). Cards de lead com: nome (font-bold text-sm), consumo (text-xs text-slate-500), badge temperatura, score BANT (A-D), potencial solar (kWp). Drag-and-drop visual. Cada card com .technical-card, hover:shadow-md. Tema claro, petroleum e solar, sem gradientes.
```

**Estimativa**: 6-8 horas

---

#### 5. Workspace (`/workspace`)

**NÃO GERAR COM STITCH** - Manter HybridShell

**Ações**:
- Melhorar componentes visuais existentes
- Adicionar QuickChatPanel (Sprint 3)
- Implementar real-time indicators

**Estimativa**: 8-10 horas (melhorias manuais)

---

### 🟢 PRIORIDADE P2 - Semana 3

#### 6. Proposal Generator (`/proposals/new`)

**Prompt**:

```
[... template base ...]

TELA A GERAR:
Página "Gerador de Proposta": sidebar petroleum. Header "Nova Proposta" com breadcrumb (Propostas > Nova). Formulário em 3 seções: 1) Dados do Cliente (nome, email, telefone, endereço, consumo médio kWh), 2) Dimensionamento (potência kWp, número de painéis, área necessária m², tipo de telhado, orientação), 3) Financeiro (valor investimento, economia mensal, payback meses, financiamento). Cada seção com .technical-card. Inputs com border-slate-200 focus:border-petroleum/60. Preview ao lado (card com resumo: potência, painéis, investimento, economia). Botões: "Salvar rascunho" (btn-pill), "Gerar proposta" (rounded-full bg-[#F59E0B]). Tema claro, petroleum e solar, sem gradientes.
```

**Estimativa**: 8-10 horas

---

#### 7. Proposals List (`/proposals`)

**Prompt**:

```
[... template base ...]

TELA A GERAR:
Página "Propostas": sidebar petroleum. Header "Propostas" com botão "+ Nova proposta" (solar CTA). Filtros: Status (Todas/Rascunho/Enviada/Aceita/Recusada), Período. Grid de cards de proposta: nome cliente, data criação, potência kWp, valor investimento, status (badge), ações (Editar, Visualizar, Enviar). Cada card com .technical-card, hover:shadow-md. Tema claro, petroleum e solar, sem gradientes.
```

**Estimativa**: 4-6 horas

---

#### 8. Settings (`/settings`)

**Prompt**:

```
[... template base ...]

TELA A GERAR:
Página "Configurações": sidebar petroleum. Header "Configurações". Tabs: Perfil, Empresa, Integrações, Notificações. Seção Perfil: foto avatar, nome, email, senha (alterar). Seção Empresa: nome, CNPJ, endereço, logo. Seção Integrações: cards Google Maps, WhatsApp, Email (status conectado/desconectado, botão Conectar/Desconectar). Seção Notificações: toggles (Email, Push, SMS) para eventos (Novo lead, Proposta aceita, Follow-up). Botão "Salvar alterações" (solar CTA). Tema claro, petroleum e solar, sem gradientes.
```

**Estimativa**: 6-8 horas

---

## 📊 CÓDIGO DE EXEMPLO

### Criar Projeto e Gerar Tela

```javascript
// 1. Criar projeto
const project = await mcp_stitch_create_project({
  title: "Quarks OS - Login Page"
});

const projectId = project.name.split('/')[1]; // Extrair ID

// 2. Gerar tela com prompt
const screen = await mcp_stitch_generate_screen_from_text({
  projectId: projectId,
  prompt: `
    Design System obrigatório — Quarks OS v1.4 (light theme, sem gradientes):
    
    CORES:
    - Primária: petroleum #0F4C5C
    - Ação: solar #F59E0B
    - Fundo: canvas #F1F5F9
    
    TELA A GERAR:
    Página de Login do Quarks OS: layout centralizado com card de login...
  `,
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_FLASH" // ou GEMINI_3_PRO
});

const screenId = screen.id;

// 3. Buscar código gerado
const code = await mcp_stitch_fetch_screen_code({
  projectId: projectId,
  screenId: screenId
});

console.log(code.htmlCode); // HTML/React gerado

// 4. Buscar screenshot
const image = await mcp_stitch_fetch_screen_image({
  projectId: projectId,
  screenId: screenId
});

console.log(image.downloadUrl); // URL da imagem
```

---

## 🚀 PRÓXIMOS PASSOS CORRETOS

### Opção 1: Gerar Login (P0) ⭐ RECOMENDADO

1. Criar projeto "Quarks OS - Login Page"
2. Gerar tela com prompt do Design System
3. Buscar código HTML/React
4. Adaptar ao código existente
5. Manter funcionalidade de autenticação

### Opção 2: Melhorar Dashboard (P0)

1. Gerar nova versão do Dashboard
2. Comparar com `DashboardRefactored.jsx`
3. Identificar melhorias visuais
4. Implementar micro-interações

### Opção 3: Gerar Leads (P1)

1. Criar projeto "Quarks OS - Leads Page"
2. Gerar tela com prompt
3. Comparar com `LeadListTableRefactored`
4. Implementar melhorias

---

## 📋 CHECKLIST PÓS-GERAÇÃO

Após obter código do Stitch, verificar:

- [ ] Cores apenas petroleum, solar, canvas, slate (sem gradientes)
- [ ] Cards com `.technical-card` (bg-white, border-slate-200, rounded-lg, shadow-sm)
- [ ] Botões: `.btn-pill` para secundários; CTA solar (rounded-full bg-[#F59E0B])
- [ ] Tipografia: hierarquia `.ds-title-page`, `.ds-title`, `.ds-data`, `.ds-meta`
- [ ] Ícones: Material Symbols Outlined, tamanhos consistentes
- [ ] Layout: container com padding e max-width; sidebar petroleum

---

## 💬 Qual página você quer gerar primeiro?

1. **Login** (ganho rápido, alta visibilidade) ⭐
2. **Dashboard** (comparar com atual, polish)
3. **Leads** (alta prioridade, muito usado)
4. **Outra** (especifique)

---

**Status**: 📋 PLANO CORRETO  
**Aguardando**: Decisão de qual página gerar primeiro
