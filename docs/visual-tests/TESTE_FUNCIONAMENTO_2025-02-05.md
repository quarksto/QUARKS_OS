# Teste de funcionamento da interface — 2025-02-05

Teste executado via **Chrome DevTools MCP** com usuário logado (`demo@quarks.solar`).

---

## Rotas e navegação

| Rota | Status | Observação |
|------|--------|------------|
| `/dashboard` | OK | KPIs (Leads Gerados, Conversão, Pipeline, Automações), Insight IA, Balanço Energético, Kanban (TRIAGEM → PERDIDOS), Atividade recente, painel Copilot |
| `/leads` | OK | "Base de Leads", busca, tabela (CONTATO, PIPELINE, TEMP., ORIGEM, VALOR POTENCIAL, AÇÕES), "0 leads", paginação, CTA "NOVO CLIENTE" |
| `/proposals` | OK | "Proposals", busca, link "New Proposal", tabela (PROPOSAL NAME, LEAD, VALUE, STATUS, DATE, ACTIONS), "No proposals found." |
| `/kits` | OK (pós-correção) | Colunas `size_kwp` e `price` adicionadas à tabela `kits`; página carrega e exibe "Nenhum kit cadastrado" quando vazio. |
| `/settings` | OK | "Configurações", Perfil (Usuário Demo, demo@quarks.solar, Integrador), seções "Em breve", Sobre |

---

## Sidebar e CTAs

- Links do menu (Dashboard, Workspace, Funil de Vendas, Leads, Clientes, Propostas, Copilot IA, Projetos, Dimensionamento IA, Cronograma, Kits, Configurações) **levam às rotas corretas**.
- Busca global na sidebar: campo "Busca global" aceita input (testado com "lead").
- Botões "NOVO NEGÓCIO" (dashboard), "NOVO CLIENTE" (leads), "New Proposal" (proposals) presentes.

---

## Screenshots salvos

- `docs/visual-tests/dashboard.png`
- `docs/visual-tests/leads.png`
- `docs/visual-tests/proposals.png`
- `docs/visual-tests/kits-error.png` (erro de catálogo)
- `docs/visual-tests/settings.png`

---

## Pendências

1. ~~**Kits:**~~ Corrigido: criada migration `20260205025758_add_kit_size_kwp_price` e executado script `prisma/add_kit_columns.js` para adicionar `size_kwp` e `price` na tabela `kits`.
2. **Busca global:** validar se o atalho ⌘K abre o overlay e se `/api/search` é chamado ao digitar (teste manual ou E2E).
