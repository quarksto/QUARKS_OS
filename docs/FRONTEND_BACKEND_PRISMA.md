# Conexão Frontend → Backend → Prisma

**Objetivo:** Deixar explícito como o frontend se conecta ao backend que usa Prisma (PostgreSQL).

---

## Fluxo de dados

```
Frontend (React/Vite)
    ↓ HTTP (VITE_API_BASE)
Backend (Node/Express)
    ↓ Prisma Client
PostgreSQL (banco quarks)
```

O frontend **não** acessa o Prisma diretamente (Prisma roda só no Node). Toda leitura/escrita no banco passa pelas APIs do backend.

---

## Configuração no frontend

- **Variável:** `VITE_API_BASE` (ex.: `http://localhost:3001`).
- **Arquivo:** `src/frontend/.env` (copiar de `.env.example`).
- **Uso:**
  - `api.js`: `baseURL = ${API_BASE}/api` → chamadas para `/api/analytics/*`, `/api/leads/*`.
  - `useChat.js`: `POST ${API_BASE}/copilot/chat` (Copilot usa Prisma: `AgentSession`, `AgentMessage`).
  - `ProposalPage.jsx`: `POST ${API_BASE}/orchestrate/preview-proposal`.
  - `ChatPage.jsx`: URLs de mídia (imagem/vídeo) = `${API_BASE} + path`.

Sem `.env`, o default é `http://localhost:3001`.

---

## O que cada rota usa no Prisma (backend)

| Rota (front chama) | Backend | Modelos Prisma |
|--------------------|---------|----------------|
| `GET /api/analytics/dashboard` | AnalyticsAgent | Lead (count), Proposal (count, aggregate) |
| `GET /api/analytics/funnel` | AnalyticsAgent | Lead (count por status) |
| `GET /api/analytics/activity` | AnalyticsAgent | Proposal, Lead (findMany recentes) |
| `GET /api/leads/pipeline` | LeadAgent | Lead (findMany, agrupado por status) |
| `POST /copilot/chat` | Copilot (session.js) | AgentSession, AgentMessage |
| `POST /orchestrate/preview-proposal` | Maestro + agents | Lead, Proposal, Kit, Product, Tariff (indiretos no fluxo) |

---

## Como testar a conexão

1. **Backend:** `cd src/backend && npm run start` (ou `node start.js`) — sobe na porta 3001.
2. **Banco:** PostgreSQL com `DATABASE_URL` do Prisma (schema em `src/backend/prisma/schema.prisma`). Rodar `npx prisma migrate deploy` e, se quiser dados iniciais, `node seed_data.js` (ou scripts de seed).
3. **Frontend:** `cd src/frontend && npm run dev` — usa `VITE_API_BASE` ou default `http://localhost:3001`.
4. Abrir o Dashboard: KPIs e pipeline vêm de `GET /api/analytics/dashboard` e `GET /api/leads/pipeline`, que leem no Prisma (Lead, Proposal).

Se o backend ou o banco estiverem fora do ar, o frontend mostrará erro nas chamadas (ex.: Dashboard com dados zerados ou mensagem de falha).
