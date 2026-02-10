# Plano de testes – Frontend, APIs e E2E

Visão geral dos cenários, componentes e APIs cobertos e como executar toda a suíte.

**Contagem atual:** 18 testes de API (backend) | 26 E2E (Playwright) | 5 testes visuais (Playwright) | 7 testes de componentes (Vitest).

---

## 1. Testes de APIs (Backend)

**Onde:** `src/backend/__tests__/api.test.js`  
**Runner:** Jest + supertest  
**Requisitos:** `DATABASE_URL` e `JWT_SECRET` no `.env`; usuário Master (seed) para rotas autenticadas.

### Cenários cobertos

| Grupo | Cenários |
|-------|----------|
| **Health** | `GET /`, `GET /health`, `GET /api/health/db` |
| **Auth** | Login sem body (erro), credenciais inválidas (401), login Master (token) |
| **Analytics** | `GET /api/analytics/dashboard`, `/funnel`, `/activity` |
| **Leads** | `GET /api/leads/pipeline` (público), `GET /api/leads` (401 sem token, 200 com token) |
| **Proposals** | `GET /api/proposals` (401 sem token, 200 com token), `GET /api/proposals/public/:slug` (404 slug inválido) |
| **Users** | `GET /api/users` (401 sem token, 200 com token) |
| **Copilot** | `POST /api/copilot/chat` (rota existe, 200 ou 503) |

### Como rodar

```powershell
cd src\backend
$env:E2E_LOGIN_EMAIL="master@quarks.solar"
$env:E2E_LOGIN_PASSWORD="master123"
npx jest __tests__/api.test.js --no-coverage
```

Ou com npm (se configurado no `package.json`):

```bash
cd src/backend && npm test
```

---

## 2. Testes E2E (Playwright)

**Onde:** `e2e/specs/`  
**Requisitos:** Frontend em `http://localhost:5173`, backend em `http://localhost:3001`, `E2E_LOGIN_EMAIL` e `E2E_LOGIN_PASSWORD`; seed (Master + 1 lead) para fluxos com lead.

### Especificações

| Spec | Descrição | Testes |
|------|-----------|--------|
| **smoke.spec.js** | Rotas públicas e protegidas sem auth | Login carrega; raiz redireciona; /dashboard, /leads, /proposals sem login → login; login + dashboard |
| **flows-lead-proposal.spec.js** | Fluxo Lead → Proposta | Lista de leads carrega e abre ficha ao clicar; da ficha, botão Proposta → /proposals/new?leadId= |
| **pages.spec.js** | Todas as páginas protegidas | Dashboard, leads, proposals, clients, products, services, pricing-rules, kits, projetos, dimensionamento, cronograma, settings, workspace, chat carregam sem erro |
| **flows-proposals.spec.js** | Fluxo Propostas | Lista de propostas carrega; abrir primeira proposta → detalhe; link Nova Proposta → /proposals/new |

### Como rodar

```powershell
# Seed (uma vez)
cd src\backend && node create_e2e_seed.js

# E2E (frontend e backend rodando)
cd d:\QUARKS_OS
$env:E2E_LOGIN_EMAIL="master@quarks.solar"
$env:E2E_LOGIN_PASSWORD="master123"
npm run test:e2e
```

### 2.1 Testes visuais (regressão no navegador)

**Onde:** `e2e/specs/visual.spec.js`  
**O que faz:** Abre o navegador, acessa telas (login, dashboard, leads, proposals), tira **screenshot** e compara com um **baseline** salvo. Se algo mudar no layout, o teste falha (regressão visual).

| Comando | Uso |
|--------|-----|
| `npm run test:e2e -- e2e/specs/visual.spec.js` | Rodar testes visuais (comparar com baseline). |
| `npm run test:e2e -- e2e/specs/visual.spec.js --update-snapshots` | **Primeira vez** ou após mudança intencional de layout: gravar novos baselines em `e2e/specs/__snapshots__/`. |
| `npm run test:e2e -- e2e/specs/visual.spec.js --headed` | Ver o **navegador de verdade** durante os testes (Chromium aberto). |
| `npm run test:e2e -- e2e/specs/visual.spec.js --ui` | Abrir a **UI do Playwright**: rodar passo a passo, ver traces e screenshots. |

*Da raiz do projeto use sempre `npm run test:e2e -- ...` (ou `npx playwright test --config=e2e/playwright.config.js ...`) para carregar o baseURL `http://localhost:5173`.*

**Requisitos:** Mesmos do E2E (frontend + backend rodando). Para telas autenticadas (dashboard, leads, proposals): `E2E_LOGIN_EMAIL` e `E2E_LOGIN_PASSWORD`.  
**Viewport:** 1280×720 (fixo nos testes visuais para resultado estável).  
**Baselines:** Ficam em `e2e/specs/__snapshots__/`. Vale versionar no Git para o time compartilhar os “golden” screenshots.

---

## 3. Testes de componentes (Frontend)

**Onde:** `src/frontend/src/**/*.test.jsx`  
**Runner:** Vitest + React Testing Library  
**Setup:** `src/frontend/src/test/setup.js` (jest-dom + mock de `window.matchMedia` para Mantine).

### Componentes cobertos

| Componente | Testes |
|------------|--------|
| **StandardAvatar** | Iniciais sem `src`, `??` sem nome, duas iniciais para nome composto, size `sm` |
| **PageHeader** | Renderiza título; botão de ação com callback; sem botão quando `actionButton` é undefined |

### Como rodar

```bash
cd src/frontend
npm run test          # run once
npm run test:watch    # watch mode
```

---

## 4. Relatório unificado (Backend + Frontend + E2E)

Um único comando executa os testes do **Backend** (Jest), do **Frontend** (Vitest) e dos **E2E** (Playwright), grava os logs e gera um **relatório único** com erros separados por área.

**Comando:**

```powershell
cd d:\QUARKS_OS
$env:E2E_LOGIN_EMAIL="master@quarks.solar"; $env:E2E_LOGIN_PASSWORD="master123"
npm run test:report
```

**Requisito para E2E:** frontend (localhost:5173) e backend (localhost:3001) devem estar rodando. Backend e Frontend não precisam de servidor.

**Arquivos gerados em `test-results/`:**

| Arquivo        | Conteúdo |
|----------------|----------|
| **report.md**  | Relatório com status Backend / Frontend / E2E, contagens e trechos de erros |
| **backend.log**  | Saída completa dos testes de API (Jest) |
| **frontend.log** | Saída completa dos testes de componentes (Vitest) |
| **e2e.log**     | Saída completa dos testes E2E (Playwright) |

O relatório garante que falhas do Backend, do Frontend e do E2E apareçam em seções distintas; os logs completos ficam nos `.log` para análise detalhada. O script termina com código de saída 1 se alguma suíte falhar.

---

## 5. Resumo – como rodar tudo

1. **Backend APIs** (sem subir servidor; usa app montado com supertest):
   ```powershell
   cd d:\QUARKS_OS\src\backend
   $env:E2E_LOGIN_EMAIL="master@quarks.solar"; $env:E2E_LOGIN_PASSWORD="master123"
   npx jest __tests__/api.test.js --no-coverage
   ```

2. **Frontend componentes**:
   ```powershell
   cd d:\QUARKS_OS\src\frontend
   npm run test
   ```

3. **E2E** (frontend + backend rodando em terminais separados; seed aplicado):
   ```powershell
   cd d:\QUARKS_OS
   $env:E2E_LOGIN_EMAIL="master@quarks.solar"; $env:E2E_LOGIN_PASSWORD="master123"
   npm run test:e2e
   ```

4. **Testes visuais no navegador** (regressão de layout; primeiro uso: criar baselines):
   ```powershell
   cd d:\QUARKS_OS
   $env:E2E_LOGIN_EMAIL="master@quarks.solar"; $env:E2E_LOGIN_PASSWORD="master123"
   npm run test:e2e -- e2e/specs/visual.spec.js --update-snapshots   # uma vez
   npm run test:e2e -- e2e/specs/visual.spec.js                     # comparação
   npm run test:e2e -- e2e/specs/visual.spec.js --headed            # ver o navegador
   ```

---

## 6. Outros testes do backend

- **Agentes (Jest):** `src/backend/src/agents/calc-domain/__tests__/`, `pricing-domain/__tests__/`, `proposal-domain/__tests__/`
- **Verificação ad-hoc de APIs (servidor rodando):** `node src/backend/src/verify_apis_e2e.js`

---

## 7. Expandir cobertura

- **APIs:** Incluir mais rotas em `__tests__/api.test.js` (templates, inventory, projects, documents, etc.).
- **E2E:** Novos specs para criar lead, criar proposta, filtros, busca.
- **Componentes:** Testes para `DataTable`, `DashboardShell`, `LeadListTable`, páginas (ex.: `LoginPage`, `ProposalsListPage`) com mocks de API.
