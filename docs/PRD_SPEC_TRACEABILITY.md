# Rastreabilidade PRD × Specs

**Base**: [QUARKS_OS_PRD_v2_1.md](QUARKS_OS_PRD_v2_1.md)  
**Atualizado**: 2026-02-05

Este documento liga os módulos e funcionalidades do PRD às specs/features do projeto, permitindo verificar cobertura e priorização.

---

## 1. Módulos PRD × Specs

| Módulo PRD | Spec(s) | Status | Observação |
|------------|---------|--------|------------|
| **1. CRM Leads** | 02-dashboard-refactor-stitch, 05-leads-refactor-stitch | Parcial | Kanban em 02; tela /leads em 05. API leads existente. |
| **2. Proposta Interativa** | 06-catalog-backend, 09-proposals-frontend | Parcial | Catálogo 06 entregue; PDF e página pública (09) ok. Falta integrar catálogo no fluxo; assinatura digital fora. |
| **3. Simulador Solar** | — | Não | Sem spec dedicada. Calc engine Python existe para kWh/kWp. |
| **4. Kit Builder** | 06-catalog-backend | Parcial | Kit CRUD em 06; tela de montagem de kit não especificada. |
| **5. Financeiro** | 06-catalog-backend | Parcial | PricingRule em 06; módulo financeiro completo fora. |
| **6. Copilot IA** | 01-multimodal-copilot | Sim | Chat texto + imagem + vídeo/áudio; testes manuais concluídos. RAG pendente. |
| **7. Analytics** | 02-dashboard-refactor-stitch | Sim | Dashboard KPIs + pipeline. Funil e Atividade opcionais. |

---

## 2. Funcionalidades Core PRD × Specs

| Funcionalidade PRD | Spec(s) | Status |
|--------------------|---------|--------|
| Importação de fatura | 01-multimodal-copilot (US2) | Parcial (upload imagem; OCR via Gemini) |
| OCR consumo | 01-multimodal-copilot | Parcial |
| Cálculo kWp | Calc engine (Python) | Sim (fora de specs) |
| Simulação ROI | Calc engine | Sim |
| Payback automático | Calc engine | Sim |
| Proposta PDF + interativa | 06-catalog-backend, proposta existente | Parcial (preview existe; PDF e interativa incompletos) |
| Assinatura digital | — | Não |
| Score de lead | — | Não |

---

## 3. Specs × Módulos PRD

| Spec | Módulos PRD Cobertos | Escopo Principal |
|------|----------------------|------------------|
| 01-multimodal-copilot | 6 (Copilot) | Chat multimodal, proposal via conversa, análise fatura |
| 02-dashboard-refactor-stitch | 1 (CRM), 7 (Analytics) | Dashboard, Kanban, KPIs |
| 03-dashboard-interactivity | 1 (CRM), 7 (Analytics) | Sidebar, Drag&Drop, micro-interactions |
| 05-leads-refactor-stitch | 1 (CRM) | Tela /leads, lista, filtros, Stitch DS |
| 06-catalog-backend | 2 (Proposta), 4 (Kit), 5 (Financeiro) | Product, Kit, PricingRule CRUD; PricingService |
| 07-proposal-engine | 2 (Proposta) | Motor de propostas (spec existente) |
| 09-proposals-frontend | 2 (Proposta) | PDF, página pública, design system |

---

## 4. Gaps (Requisitos PRD sem Spec)

| Requisito | Prioridade Sugerida | Nota |
|-----------|---------------------|------|
| Simulador Solar (tela) | Alta | Calc engine existe; falta UI e fluxo. |
| Kit Builder (tela montagem) | Média | CRUD em 06; tela de composição não especificada. |
| Assinatura digital | Média | Proposta interativa. |
| Score de lead | Baixa | CRM Leads. |
| Módulo Financeiro (margens, faturamento) | Média | PricingRule em 06; gestão financeira ampla fora. |

## 5. Roadmap Sugerido

### Fase 1 (Entregue)

1. ✅ `02-dashboard-refactor-stitch` — Concluído
2. ✅ `01-multimodal-copilot` — Concluído (testes manuais ok)
3. ✅ `06-catalog-backend` — Concluído (Product, Kit, PricingRule)
4. ✅ `09-proposals-frontend` — Concluído (PDF, página pública, DS)
5. ✅ `05-leads-refactor-stitch` — Concluído

### Fase 2 (Próximos — Alta prioridade)

1. Integrar catálogo (06) no fluxo de criação de proposta (front + backend)
2. Webhook Marketing: consumption default, location (city), schema Lead, seed User, URL padronizada
3. Filtro Kanban + placeholders KpiGrid/InsightBar (busca/UX)

### Fase 3 (Gaps PRD)

1. ❌ `07-proposal-engine` — CRIAR/estender spec (motor propostas completo)
2. ❌ `08-solar-simulator` — CRIAR SPEC (tela + fluxo dimensionamento)
3. ❌ Assinatura digital, Score de lead — specs futuras

---

## 6. Próximas Ações

- [ ] Integrar catálogo (06) no fluxo de criação de proposta (front + backend)
- [ ] Webhook Marketing: consumption default, location (city), schema Lead, seed User, URL padronizada
- [ ] Dashboard: filtro Kanban na busca; placeholders KpiGrid/InsightBar
- [ ] Criar/estender spec `07-proposal-engine` para motor de propostas completo (se necessário)
- [ ] Criar spec `08-solar-simulator` para tela de dimensionamento (opcional)

---

## 7. Referências

- [PRD v2.1](QUARKS_OS_PRD_v2_1.md)
- [O_QUE_FALTA](O_QUE_FALTA.md)
- [JORNADA_E_FLUXO](JORNADA_E_FLUXO.md)
- [specs/STATUS](../specs/STATUS.md)
- [Constitution](./../.agent/memory/constitution.md)
