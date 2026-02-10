# Análise do Dashboard — Quarks OS

**Data:** 2026-02-03  
**Base:** `.agent/skills` (speckit.analyze — análise estruturada, read-only) + DS de referência (`docs/QUARKS_OS_Design_System_v1.md`) + plano *Fluxo e Jornada* ([JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md)).  
**Artefato:** `src/frontend/src/pages/Dashboard.jsx`.

---

## 1. Resumo Executivo

O Dashboard é a **única tela 100% alinhada ao DS de referência** e funciona como origem do próprio DS. A análise identifica consistências, dados dinâmicos vs. estáticos, navegação e oportunidades de melhoria sem alterar comportamento.

---

## 2. Inventário de Requisitos (Dashboard)

| ID | Requisito | Implementado | Fonte |
|----|-----------|--------------|--------|
| R1 | Exibir KPIs (leads, conversão, pipeline, automações) | Sim | `useDashboardData` → `/api/analytics/dashboard` |
| R2 | Exibir pipeline/kanban por estágio (NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION) | Sim | `useDashboardData` → `/api/leads/pipeline` |
| R3 | Sidebar colapsável com navegação Operacional/Engenharia | Sim | Estado `sidebarCollapsed`, classes DS |
| R4 | Barra de insight IA (mensagem contextual) | Sim | Bloco fixo "IA Insight: 5 leads qualificados..." |
| R5 | CTA principal "+ NOVO NEGÓCIO" | Sim | `.btn-pill` solar |
| R6 | Indicador de loading (Live Data / Syncing) | Sim | `loading` do hook |
| R7 | Polling de dados (atualização periódica) | Sim | `setInterval(loadData, 30000)` |

---

## 3. Consistência com o Design System (DS v1.4)

| Item DS | Uso no Dashboard | Status |
|---------|------------------|--------|
| Cores `petroleum` / `solar` | Sidebar bg-petroleum, botões, barras, badges, ícone bolt | Alinhado |
| `.technical-card` | Cards de KPI e cards de lead no kanban | Alinhado |
| `.kpi-title`, `.kpi-value` | Labels e valores em todos os cards | Alinhado |
| `.badge-ultra-compact` | Meta, LIVE, Eco, contagem de coluna | Alinhado |
| `.btn-pill` | + NOVO NEGÓCIO, Ver detalhes, filtro | Alinhado |
| `.section-title` | "Fluxo Comercial" | Alinhado |
| `.support-text`, `.support-text-sm` | "Tx. de Sucesso", localização no card | Alinhado |
| `.nav-item-active`, `.nav-item-inactive` | Itens da sidebar | Alinhado |
| Background `#FCFDFF` | `main` | Alinhado |
| Material Symbols Outlined | bolt, search, grid_view, view_kanban, etc. | Alinhado |
| Tipografia (20px título, 11px mono subtítulo) | Header da página | Alinhado |

**Conclusão:** Nenhuma inconsistência com o DS. O Dashboard é a referência de implementação.

---

## 4. Dados Dinâmicos vs. Estáticos

### 4.1 Dinâmicos (API)

| Dado | Fonte | Campo |
|------|--------|--------|
| `metrics.activeLeads` | GET /api/analytics/dashboard | Exibido em KPI "Leads Gerados", rodapé Pipeline, badge "N Negócios" |
| `metrics.conversionRate` | Idem | Card "Conversão" (valor + donut) |
| `metrics.revenue` | Idem | Card "Pipeline Ativo" |
| `metrics.automations` | Idem | Card "Automações" |
| `pipeline[statusKey]` | GET /api/leads/pipeline | Colunas do kanban; cada lead: `lead.id`, `lead.name`, `lead.location`, `lead.consumption` |

### 4.2 Estáticos (hardcoded no JSX)

| Dado | Onde | Observação |
|------|------|------------|
| "+12.5%" | Card Leads Gerados | Deveria vir da API ou ser calculado |
| "1.5k" Meta, "252" Restante | Card Leads Gerados | Placeholder |
| Barra de progresso 83.2% | Card Leads Gerados | Fixo |
| "Meta: 40%", "34.0%", "+4.2%" | Card Conversão | Placeholder |
| "R$ 37k" Avg Ticket | Card Pipeline | Placeholder |
| Barras do mini pipeline (flex-[3], [2], [1], [2]) | Card Pipeline | Proporções fixas |
| "0.02ms" Agente Sync, "Active" | Card Automações | Placeholder |
| Barras do gráfico de automações (heights %) | Card Automações | Decorativo |
| "5" leads no IA Insight | Barra de insight | Fixo |
| "92% Match" | Cada card de lead | Placeholder |
| "R$ --" | Cada card de lead | Placeholder até vínculo com proposta |
| Avatar/empresa "Solar Tech Ltda", "Enterprise Plan" | Sidebar rodapé | Placeholder |
| URL da imagem do avatar | Sidebar | Externa (Google) |

**Risco:** Usuário pode interpretar valores estáticos como reais. Recomendação: substituir por dados da API ou deixar explícito (label "Exemplo" ou esconder até ter dados). O plano *Fluxo e Jornada* classifica este item como **prioridade média** (ver [JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md) §5).

---

## 5. Navegação

| Elemento | Comportamento atual | Problema |
|----------|---------------------|----------|
| Links da sidebar (Dashboard, Funil de Vendas, Leads, Projetos, etc.) | `href="#"` | Não navegam; não usam React Router |
| Botão "Ver detalhes" (IA Insight) | Sem `onClick`/rota | Sem ação |
| Botão "+ NOVO NEGÓCIO" | Sem `onClick`/rota | Sem ação |
| Botão filtro (filter_list) | Sem ação | Sem ação |
| Busca Global (⌘K) | Sem handler | Sem ação |

**Recomendação:** Usar `<Link to="...">` ou `navigate()` para Chat (`/chat`), Propostas (`/proposals`), e futuras rotas; conectar CTAs a fluxos (ex.: novo negócio → modal ou página). O plano *Fluxo e Jornada* inclui "Conectar '+ NOVO NEGÓCIO' a fluxo real" e "filtro do Kanban" como prioridade média.

---

## 6. Acessibilidade e Semântica

| Item | Status | Sugestão |
|------|--------|----------|
| Sidebar | `<aside>` com `id="sidebar"` | Ok |
| Navegação | `<nav>` presente | Ok; trocar `<a href="#">` por `<Link>` ou botões com `aria-current` |
| Headings | `<h1>` no header, `<h2>` na seção | Ok |
| Contraste | petroleum/solar sobre fundos claros; texto branco na sidebar | Verificar WCAG em ferramenta |
| Estado de loading | Só texto "Syncing..." | Considerar `aria-live="polite"` e/ou skeleton |
| Botão colapsar sidebar | Só ícone | Incluir `aria-label="Colapsar menu"` |

---

## 7. Cobertura de APIs

| Endpoint | Uso no Dashboard | Observação |
|----------|-------------------|------------|
| GET /api/analytics/dashboard | Sim (`useDashboardData`) | Retorno deve ter `activeLeads`, `conversionRate`, `revenue`, `automations`, `proposalsSent` |
| GET /api/leads/pipeline | Sim (`useDashboardData`) | Retorno deve ser objeto com chaves NEW, CONTACTED, PROPOSAL_SENT, NEGOTIATION e arrays de leads com `id`, `name`, `location`, `consumption` |
| GET /api/analytics/funnel | Não | Disponível no backend; Dashboard não exibe funil (gráfico) |
| GET /api/analytics/activity | Não | Disponível no backend; Dashboard não exibe "Atividade Recente" |

**Oportunidade:** Os componentes `SalesFunnelChart` e `RecentActivity` existem e não são usados; poderiam ser integrados ao Dashboard usando `/funnel` e `/activity`.

---

## 8. Estrutura do Código

| Aspecto | Status |
|---------|--------|
| Componente único | Dashboard é um arquivo ~310 linhas; legível, mas poderia ser fatorado em subcomponentes (Sidebar, Header, InsightBar, KpiGrid, KanbanBoard) para reuso e testes |
| Estado local | Apenas `sidebarCollapsed`; dados vêm do hook | Ok |
| Constantes | `COLUMN_TITLES` fora do componente | Ok |
| Sem prop-types/TypeScript | Sem validação explícita de props (não há props) | Opcional |

---

## 9. Tabela de Achados (Estilo speckit.analyze)

| ID | Categoria | Severidade | Local | Resumo | Recomendação |
|----|-----------|------------|--------|--------|----------------|
| D1 | Dado estático | MÉDIA | Vários cards | Valores fixos (meta 1.5k, +12.5%, R$ 37k, 92% Match, etc.) parecem reais | Trazer da API ou rotular como exemplo |
| D2 | Navegação | ALTA | Sidebar + CTAs | Links `href="#"` e botões sem ação | Usar React Router e handlers |
| D3 | API não usada | BAIXA | Backend | /funnel e /activity existem; Dashboard não usa | Opcional: integrar SalesFunnelChart e RecentActivity |
| D4 | Acessibilidade | BAIXA | Botão colapsar, loading | Falta aria-label e aria-live | Adicionar onde aplicável |
| D5 | Código | BAIXA | Dashboard.jsx | Arquivo único grande | Opcional: extrair Sidebar, KpiGrid, KanbanBoard |

---

## 10. Métricas

| Métrica | Valor |
|---------|--------|
| Linhas (Dashboard.jsx) | ~310 |
| Dados dinâmicos (campos) | 5 (activeLeads, conversionRate, revenue, automations, pipeline) |
| Dados estáticos relevantes | 10+ (metas, deltas, labels de exemplo) |
| Consistência com DS | 100% |
| Endpoints consumidos | 2 de 4 disponíveis (dashboard, pipeline) |

---

## 11. Próximos Passos Sugeridos

1. **Navegação:** Trocar `href="#"` por `<Link to="/chat">`, `<Link to="/proposals">`, etc., e conectar "+ NOVO NEGÓCIO" e "Ver detalhes" a fluxos ou rotas.
2. **Dados:** Alinhar contrato da API com o frontend (ex.: meta, restante, delta) ou remover/rotular valores estáticos.
3. **Opcional:** Usar `/api/analytics/funnel` e `/api/analytics/activity` com os componentes existentes (SalesFunnelChart, RecentActivity) em uma segunda linha do Dashboard.
4. **Opcional:** Extrair subcomponentes (Sidebar, KpiGrid, KanbanBoard) e melhorar acessibilidade (aria-label, aria-live).

---

## 12. Referência ao plano

As prioridades de correção do Dashboard (dados estáticos, navegação e CTAs) estão alinhadas ao plano *Fluxo, Rotas e Jornada Completa do Quarks OS*. Ver [JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md) para prioridades consolidadas e [O_QUE_FALTA.md](O_QUE_FALTA.md) para backlog por fase da jornada.

---

*Análise gerada com base em `.agent/skills` (abordagem speckit.analyze), no DS de referência (QUARKS_OS_Design_System_v1.md) e no plano de jornada. Nenhum arquivo de código foi modificado.*
