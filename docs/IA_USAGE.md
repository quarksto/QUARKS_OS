# Mapeamento de Uso de IA no Quarks OS

**Atualizado:** 2026-02-09

Este documento descreve onde e como a IA é utilizada no sistema, as dependências de configuração e o status de cada ponto.

---

## 1. Visão Geral

| Ponto | Tipo IA | Função | Config | Status |
|-------|---------|--------|--------|--------|
| **Copilot Solar** | Gemini 3 Flash | Assistente comercial/técnico (chat, tools) | GOOGLE_API_KEY | ✅ Funcional |
| **Solar API** | Google Solar API | Insights de potencial solar por endereço | GOOGLE_API_KEY ou GOOGLE_MAPS_API_KEY | ✅ Funcional |
| **InsightBar** | Regras (não LLM) | Mensagem contextual no Dashboard | — | ✅ Conectado |
| **Dimensionamento IA** | — | Página em construção | — | 🔜 Placeholder |
| **Tools Copilot** | Maestro/Calc | create_proposal_preview, get_projects_summary, etc. | — | ✅ Funcional |

---

## 2. Copilot Solar

### Onde está
- **Backend:** `src/backend/src/agents/copilot-domain/`
  - `index.js` — CopilotDomainAgent (Gemini 3 Flash)
  - `tools.js` — Tools e executeTool (Maestro)
  - `session.js` — Persistência de sessão
  - `routes.js` — POST /copilot/chat (multipart)
- **WebSocket:** `gateway.js` — `copilot:message`, `copilot:stream_chunk`, `copilot:session`
- **Frontend:** `CopilotContext.jsx`, `CopilotSidebar.jsx`, `copilotService.js`

### Fluxo
1. Usuário envia mensagem via WebSocket ou POST (com arquivo).
2. Copilot chama Gemini com systemInstruction + tools.
3. Resposta é streamada via WebSocket (`copilot:stream_chunk`).
4. Tool calls (ex.: create_proposal_preview) são executados via Maestro.

### Tools disponíveis
- `get_projects_summary` — Resumo de projetos ativos
- `get_project_details` — Detalhes de um projeto
- `create_proposal_preview` — Preview de proposta (consumo, distribuidora, etc.)
- `generate_image` — Geração de imagem (Visual Agent)
- `generate_video` — Geração de vídeo (Veo)
- `switch_mode` — Alternar modo (Sales, Management, Projects)

### Configuração
```env
GOOGLE_API_KEY=...   # Obrigatório para o Copilot
VITE_WS_URL=http://localhost:3001  # WebSocket no frontend
```

### Referências
- `docs/QUARKS_OS_Copilot_Spec.md`
- `specs/01-multimodal-copilot/PRONTO_E_PENDENTE.md`

---

## 3. Solar API

### Onde está
- **Backend:** `src/backend/src/services/solarService.js`
- **Rota:** GET `/api/leads/:id/solar`
- **Frontend:** `LeadModalSolarInsights.jsx` (aba Solar no Lead)

### Fluxo
1. Lead tem `location` (endereço) e/ou `consumption` (kWh).
2. Se `GOOGLE_API_KEY` ou `GOOGLE_MAPS_API_KEY` configurado: geocode → Google Solar API.
3. Caso contrário: estimativa baseada em consumo (regra prática ~4.5 kWh/kWp/mês).

### Retorno
- `roofArea` (m²)
- `yearlyEnergy` (kWh/ano)
- `recommendedCapacity` (kWp)
- `savingsAnnual` (R$/ano, quando API retorna)

### Configuração
```env
GOOGLE_API_KEY=...
# ou
GOOGLE_MAPS_API_KEY=...
```

---

## 4. InsightBar (Barra de Insight IA)

### Onde está
- **Componente:** `src/frontend/src/components/dashboard/InsightBar.jsx`
- **Uso:** Dashboard (SalesDashboardSolar)
- **API:** GET `/api/analytics/insight`

### Comportamento
- Exibe mensagem contextual baseada nas métricas do Dashboard.
- Regras simples (sem LLM): taxa de conversão, leads ativos, deltas MoM.
- CTA "Ver detalhes" → abre Copilot ou navega para `/chat`.

### Sem IA generativa
- Usa lógica condicional no Analytics Agent para gerar texto.
- Rápido, sem custo de tokens.

---

## 5. Dimensionamento IA

### Onde está
- **Página:** `DimensionamentoPage.jsx` — rota `/dimensionamento`
- **Status:** Placeholder ("Em construção")

### Planejado
- Integração com calc_engine (Python) ou tools do Copilot.
- Formulário de consumo → kWp, geração, ROI, payback.

---

## 6. Python Calc Engine (Copilot)

O `calc_engine` possui rota `/copilot/chat` própria com CopilotAgent Python. O frontend **não** a utiliza — usa o backend Node.js. Manter como alternativa para migração futura.

---

## 7. Checklist de Funcionamento

Para garantir que a IA funciona:

1. **Variáveis de ambiente (backend)**
   - [ ] `GOOGLE_API_KEY` definida
   - [ ] `VITE_WS_URL` definida no frontend (ex.: `http://localhost:3001`)

2. **Backend rodando**
   - [ ] `npm run dev` em `src/backend`
   - [ ] WebSocket ouvindo na porta configurada

3. **Frontend**
   - [ ] `npm run dev` em `src/frontend`
   - [ ] RealtimeProvider conectado ao WebSocket

4. **Testes manuais**
   - [ ] Abrir Copilot, enviar mensagem texto → resposta streamada
   - [ ] Enviar imagem de conta de luz → análise
   - [ ] Lead com endereço → aba Solar com insights
   - [ ] Dashboard → InsightBar com mensagem contextual

---

## 8. Backlog (O que falta)

- **File API** — Arquivos >20MB (vídeo/áudio) usar Gemini File API
- **RAG (US5)** — Perguntas sobre catálogo (garantia, specs) via Product Agent
- **userId real** — Integrar Copilot com AuthContext
- **Dimensionamento IA** — Implementar tela funcional
- **Insight com LLM** (opcional) — Substituir regras por prompt ao Gemini para insights mais ricos
