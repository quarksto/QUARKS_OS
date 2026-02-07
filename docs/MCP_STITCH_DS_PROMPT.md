# Comando / Prompt para MCP Stitch — Design System Quarks OS v1.3

**Objetivo:** Usar este texto como prompt de referência ao invocar o MCP Stitch (`generate_screen_from_text` ou equivalente) para que as telas geradas sigam o **Design System atualizado** do Quarks OS.

**Referência completa:** `docs/QUARKS_OS_Design_System_v1.md`

---

## 1. Comando / Prompt para o MCP (copiar e colar)

Use o bloco abaixo como **prompt de sistema** ou **instrução de design** ao chamar a ferramenta de geração de tela do MCP (ex.: `generate_screen_from_text`). Substitua `[DESCRIÇÃO DA TELA]` pela tela desejada (ex.: "Ficha do Lead com abas Dados básicos, Qualificação, Proposta, Documentos e Histórico").

```
Design System obrigatório — Quarks OS v1.3 (light theme, sem gradientes):

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

## 2. Exemplo de uso por tipo de tela

### Ficha do Lead (página de detalhe)

Substituir `[DESCRIÇÃO DA TELA]` por:

```
Página "Ficha do Lead" (detalhe de um lead): header com título (nome do lead), breadcrumb (Leads > Ficha: Nome), barra de completude (%), dropdown de estágio do pipeline (Triagem, Qualificação, Proposta, Negociação, Fechados, Perdidos), stepper horizontal com os estágios e o atual destacado em petroleum. Abas: Dados básicos (perfil, contato, consumo, endereço, mapa, potencial solar), Qualificação técnica (formulário CEP, telhado, conexão, distribuidora), Proposta (card proposta ou CTA gerar), Documentos (lista PDFs de propostas + bloco "Documentos do imóvel — em breve"), Histórico (timeline). Botões no header: Copilot, Voltar ao Dashboard. Tema claro, petroleum e solar, sem gradientes, cards .technical-card, botões .btn-pill e CTA solar.
```

### Lista de Leads

```
Página "Leads": header com título "Leads & Clientes", subtítulo "Gestão da Base de Contatos", botão "Novo lead" (solar CTA), filtros (temperatura, origem, score). Tabela ou cards com: nome, email, localização, consumo kWh, badge de estágio, badge de temperatura (Quente/Morno/Frio), score. Clique na linha/card abre a ficha do lead. Sidebar petroleum, header bg-[#F8FAFC], cards .technical-card, badges .badge-kanban-*. Tema claro, sem gradientes.
```

### Dashboard

```
Dashboard: sidebar petroleum com nav (Dashboard, Leads, Propostas, Chat, etc.). Área principal: header "Dashboard" com botão CTA "+ NOVO NEGÓCIO" (solar). Barra de insight IA (bg-petroleum/5, ícone smart_toy). Grid de 4 cards KPI (Leads Gerados, Conversão, Pipeline Ativo, Automações) com .technical-card, .ds-title-card, .ds-display-xl, barras ou donut em petroleum/solar. Secção "Fluxo Comercial" com kanban em 4 colunas (Triagem, Qualificação, Proposta, Negociação); cada card de lead com .technical-card, badges consumo/temperatura/origem, score e potencial. Tema claro, petroleum e solar, sem gradientes.
```

---

## 3. Fluxo recomendado ao usar o MCP

1. **list_projects** — Listar projetos Stitch existentes (ex.: "Quarks OS - Telas do App").
2. **create_project** (se necessário) — Criar projeto com nome alinhado ao app (ex.: "Quarks OS - [Módulo]").
3. **generate_screen_from_text** — Passar o **Comando / Prompt** acima, com `[DESCRIÇÃO DA TELA]` preenchido por uma das variantes da seção 2 ou por descrição específica.
4. **fetch_screen_code** / **get_screen** — Recuperar HTML/Tailwind/React gerado.
5. **Adaptar ao código React** — Substituir classes por equivalentes do DS (index.css, tailwind.config.js); usar componentes existentes (DashboardShell, .technical-card, .btn-pill) onde fizer sentido.

---

## 4. Checklist pós-geração (conformidade DS)

Após obter o código do MCP, verificar:

- [ ] Cores apenas petroleum, solar, canvas, slate; sem gradientes.
- [ ] Cards com aspecto .technical-card (bg-white, border-slate-200, rounded-lg, shadow-sm).
- [ ] Botões: .btn-pill para secundários; CTA solar (rounded-full bg-[#F59E0B]).
- [ ] Tipografia: hierarquia .ds-title-page, .ds-title, .ds-data, .ds-meta onde aplicável.
- [ ] Ícones: Material Symbols Outlined, tamanhos consistentes.
- [ ] Layout: container com padding e max-width; sidebar petroleum se for shell completo.

---

*Documento gerado para uso com MCP Stitch. Design System de referência: docs/QUARKS_OS_Design_System_v1.md (v1.3).*
