# Checklist de verificação (pré-release)

**Objetivo:** Conferir estado do produto antes de release, com base na auditoria e em [O_QUE_FALTA.md](../docs/O_QUE_FALTA.md).

---

## Como validar (rápido)

1. **Backend:** `cd src/backend && node src/server.js` (porta 3001). Aguarde "Server running" e usuário padrão criado.
2. **Script automático:** Com o backend rodando, em outro terminal:
   ```bash
   node scripts/validate_all.js
   ```
   Verifica: health, analytics/dashboard, leads/pipeline, webhook marketing, inventory/kits, search.
3. **Webhook isolado:** `cd src/backend && node verify_marketing_webhook.js` — cria um lead via POST /api/marketing/webhook/facebook_ads.
4. **Frontend:** `cd src/frontend && npm run dev` — abra http://localhost:5173. Teste: login → Dashboard (KPIs, Kanban, filtros) → Busca ⌘K → /leads → /proposals → criar proposta (se houver lead).
5. **Proposta + catálogo:** Com usuário logado, use o script `debug_verify_create.ps1` (PowerShell) ou chame POST /api/orchestrate/create-proposal com `{ "leadId": "<id>", "consumption": 600 }` e token no header — confira se a proposta retornada tem `kitId` e preço coerente.

---

## Rotas e navegação

- [x] `/`, `/dashboard`, `/leads`, `/proposals`, `/settings` respondem e renderizam (teste 2025-02-05: Chrome DevTools MCP)
- [x] Links da sidebar e CTAs ("+ NOVO NEGÓCIO", "NOVO CLIENTE", "New Proposal") levam aos destinos corretos
- [x] `/kits` — corrigido: colunas `size_kwp` e `price` adicionadas à tabela `kits` (migration + script one-off)
- [ ] `/leads/:id` abre LeadDetailPage; `/proposals/:id` e página pública de proposta funcionam

---

## Dashboard e busca

- [ ] useDashboardData carrega dados de `/analytics/dashboard`, pipeline, activity, funnel
- [ ] Busca global (⌘K) abre GlobalSearch e `/api/search` retorna leads/proposals
- [ ] KpiGrid e InsightBar: valores vêm da API ou estão claramente rotulados como exemplo
- [ ] Filtro do Kanban (se existir) aplica corretamente (data, estágio)

---

## Catálogo e propostas

- [ ] CRUD de Products, Kits, PricingRules (spec 06) disponível e estável
- [ ] Geração de PDF de proposta e página pública (spec 09) alinhadas ao design system
- [ ] (Backlog) Fluxo de criação de proposta usa catálogo (Products/Kits/PricingRules) quando integrado

---

## Copilot e frontend

- [ ] Chat aceita texto, imagem, vídeo, áudio (testes manuais 01-multimodal-copilot concluídos)
- [ ] ChatPage e ProposalPage (gerador) alinhados ao DS (petroleum/solar) conforme planejado
- [ ] VITE_API_BASE documentado para produção (README ou setup)

---

## Marketing / Webhook (validação manual)

- [ ] Payload: adapters retornam `consumption` (default se ausente) e `location`/city conforme schema Lead
- [ ] Campos enviados ao criar lead estão alinhados ao schema Lead (sem campos inexistentes)
- [ ] Seed User existe para `ownerId` de leads criados via webhook
- [ ] URL do webhook padronizada em código e docs (`/api/marketing/webhook/:source` ou conforme definido)

---

## Testes visuais (Chrome DevTools MCP)

Com o **Chrome DevTools MCP** e o frontend rodando em http://localhost:5173:

- **Snapshot:** estrutura a11y da página (textos, botões, links) para checagem de conteúdo e acessibilidade.
- **Screenshot:** captura da viewport ou full page para regressão visual; salvar em `docs/visual-tests/`.
- **Navegação:** pedir ao assistente para abrir rotas (`/login`, `/dashboard`, `/leads`, `/proposals`) e capturar snapshot + screenshot.

Ver [docs/visual-tests/README.md](../docs/visual-tests/README.md).

---

## Referências

- [specs/STATUS.md](STATUS.md)
- [docs/O_QUE_FALTA.md](../docs/O_QUE_FALTA.md)
- [docs/PRD_SPEC_TRACEABILITY.md](../docs/PRD_SPEC_TRACEABILITY.md)
