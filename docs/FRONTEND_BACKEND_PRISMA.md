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

## Conectar ao banco (backend)

O backend usa **Prisma** com **PostgreSQL**. A URL do banco vem do `.env`:

- **Variável obrigatória:** `DATABASE_URL`
- **Exemplo local:** `postgresql://postgres:postgres@localhost:5432/quarks?schema=public`
- **Exemplo Supabase:** `postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres`

O schema Prisma (`prisma/schema.prisma`) está configurado com `url = env("DATABASE_URL")`, então o valor do `.env` é sempre usado.

**Passos para conectar:**

1. Copiar `src/backend/.env.example` para `src/backend/.env` e definir `DATABASE_URL`.
2. Na pasta do backend: `npx prisma generate` (gera o client).
3. Aplicar migrações: `npx prisma migrate deploy` (ou em dev `npx prisma migrate dev`).
4. (Opcional) Dados iniciais: `node seed_data.js` ou outros scripts em `src/backend/`.

**Verificar se o banco está conectado:**

- Endpoint: `GET /api/health/db`  
- Resposta OK: `{ "status": "ok", "database": "connected" }`  
- Se falhar: 503 com `database: "disconnected"` e mensagem de erro (credenciais, rede, etc.).

---

## Como testar a conexão

1. **Backend:** `cd src/backend && npm run start` (ou `node start.js`) — sobe na porta 3001.
2. **Banco:** PostgreSQL com `DATABASE_URL` no `.env`. Rodar `npx prisma migrate deploy` e, se quiser dados iniciais, `node seed_data.js` (ou scripts de seed).
3. **Frontend:** `cd src/frontend && npm run dev` — proxy envia `/api` para `http://localhost:3001`.
4. Abrir o Dashboard: KPIs e pipeline vêm de `GET /api/analytics/dashboard` e `GET /api/leads/pipeline`, que leem no Prisma (Lead, Proposal).
5. Conferir banco: `curl http://localhost:3001/api/health/db` → deve retornar `database: "connected"`.

Se o backend ou o banco estiverem fora do ar, o frontend mostrará erro nas chamadas (ex.: Dashboard com dados zerados ou mensagem de falha).
