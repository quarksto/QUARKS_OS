# Jornada e Fluxo — Quarks OS

**Fonte:** Plano *Fluxo, Rotas e Jornada Completa do Quarks OS* (referência em `.cursor/plans/`).  
**Objetivo:** Índice da documentação que reflete o plano; visão consolidada do nicho, jornada, rotas e prioridades.

**Atualizado:** 2026-02-03

---

## 1. Nicho e escopo

O **Quarks OS** atende **integradores de energia solar no Brasil** — empresas que vendem, projetam e instalam sistemas fotovoltaicos. A jornada inclui etapas regulatórias obrigatórias (homologação, vistoria, ligação) além do ciclo comercial.

### 1.1 Perfis de usuário

| Perfil         | Foco                  | Atividades principais                        |
| -------------- | --------------------- | -------------------------------------------- |
| **Comercial**  | Leads e vendas        | Captação, qualificação, proposta, fechamento |
| **Integrador** | Proposta e fechamento | Dimensionamento, proposta, assinatura        |
| **Engenharia** | Projeto e instalação  | Projeto técnico, homologação, instalação     |
| **Admin**      | Operação              | Catálogo, pricing, cronograma, analytics     |

### 1.2 Etapas regulatórias (concessionária)

1. Projeto de engenharia (memorial, diagrama unifilar, ART)  
2. Homologação (submissão à concessionária)  
3. Aprovação  
4. Instalação  
5. Vistoria  
6. Ligação (medidor bidirecional)

---

## 2. Jornada em fases (resumo)

| Fase | Nome                    | Cobertura atual | Principais gaps / bloqueadores                    |
| ---- | ----------------------- | --------------- | ------------------------------------------------- |
| **1** | Captação/Qualificação   | Parcial         | Adapter Lead (consumption default); score real   |
| **2** | Vendas                  | Parcial         | Proposta interativa mobile; catálogo; pricing    |
| **3** | Fechamento              | Parcial         | Tela Clientes; transição Lead → Client           |
| **4** | Projeto/Homologação     | Placeholder     | CRUD Projetos; homologação; tracking             |
| **5** | Instalação              | Placeholder     | Cronograma; checklist; vistoria; ligação         |
| **6** | Pós-venda               | —               | Fora escopo v2.1; garantias; manutenção          |

---

## 3. Rotas (resumo)

### 3.1 Backend (API)

- **Auth:** `POST /auth/register`, `POST /auth/login`
- **Marketing:** `POST /api/marketing/webhook/:source` (Facebook, Google, TikTok). URL padronizada no código.
- **Analytics:** `GET /api/analytics/dashboard`, `/funnel`, `/activity`
- **Leads:** `GET /api/leads/pipeline`, `POST /api/leads`, `PATCH /api/leads/:id`, `PATCH /api/leads/:id/status`, `GET /api/leads/:id`, `GET /api/leads/:id/activity`, `GET /api/leads/:id/solar`
- **Copilot:** `POST /api/copilot/chat`
- **Orquestração:** `POST /orchestrate/preview-proposal`, `POST /orchestrate/create-proposal`

### 3.2 Frontend

| Rota               | Uso principal              | Fase   |
| ------------------ | -------------------------- | ------ |
| `/`, `/dashboard`  | Dashboard principal        | Todas  |
| `/funnel`          | Kanban de vendas           | 1–3    |
| `/leads`, `/leads/:id` | Lista e ficha do lead  | 1–2    |
| `/proposals`       | Gerador de proposta (preview) | 2   |
| `/chat`            | Copilot IA                 | Transversal |
| `/projetos`, `/dimensionamento`, `/cronograma`, `/kits`, `/settings` | Placeholders | 4–5, Admin |

---

## 4. Requisitos estratégicos (do plano)

- **Proposta interativa:** mobile-first, visualização + aceite/recusa/ajustes + assinatura digital; PDF como complemento.
- **Atendimento omnichannel:** WhatsApp, chat, email, telefone; histórico unificado; contexto CRM.
- **Engenharia:** própria ou terceirizada (ou híbrido); rastreabilidade de executor.
- **Gestão refinada:** catálogo de equipamentos e serviços; formação de preços (regras por estado, margem, markup); kits dinâmicos.
- **Assistente Jarvis:** IA como centro de comando; acesso universal (sidebar/⌘K); comandos em linguagem natural; contexto unificado (lead, proposta, pipeline, catálogo); memória e proatividade.

---

## 5. Prioridades de correção (do plano)

### Alta (bloqueadores)

1. Webhook Marketing: adapter retornar `consumption` (default), `location` (de city); remover campos inexistentes no schema Lead.  
2. Seed de User: garantir ao menos um User para `ownerId` de leads do webhook.  
3. URL do webhook: `POST /api/marketing/webhook/:source` (já em uso no código).

### Média

1. Dashboard: dados estáticos → API ou rótulo "Exemplo".  
2. Navegação e CTAs: conectar "+ NOVO NEGÓCIO" a fluxo real; filtro do Kanban.  
3. `VITE_API_BASE` centralizado para produção.

### Baixa

1. Integrar SalesFunnelChart e RecentActivity com `/api/analytics/funnel` e `/api/analytics/activity`.  
2. Módulo Clientes (`/clients`) para CLOSED_WON.  
3. Catálogo e Pricing (produtos, kits, PricingRule) para propostas com dados reais.

---

## 6. Documentação relacionada

| Documento | Conteúdo |
| --------- | -------- |
| [FLUXOS_MODULOS.md](FLUXOS_MODULOS.md) | Fluxo de dados por módulo; rotas backend; tabela rota × agente × Prisma |
| [DOMAIN_MODEL.md](DOMAIN_MODEL.md) | Lead, Opportunity, Client; ciclo de vida; nicho e perfis |
| [O_QUE_FALTA.md](O_QUE_FALTA.md) | Backlog; gaps por área; prioridades; roadmap |
| [DASHBOARD_ANALYSIS.md](DASHBOARD_ANALYSIS.md) | Análise do Dashboard; dados dinâmicos/estáticos; APIs |
| [QUARKS_OS_PRD_v2_1.md](QUARKS_OS_PRD_v2_1.md) | PRD v2.1; escopo e módulos |
| [QUARKS_OS_Technical_Architecture.md](QUARKS_OS_Technical_Architecture.md) | Arquitetura técnica |

**Plano completo:** arquivo de planejamento em `.cursor/plans/` (fluxo_e_jornada_quarks_os_c23dcc35.plan.md) com jornada detalhada, diagramas Mermaid, cenários positivos/negativos, gaps por fase e roadmap sugerido.
