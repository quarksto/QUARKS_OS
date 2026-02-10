# Testes E2E – QUARKS_OS

Testes de funcionamento real no navegador (Playwright).

## Pré-requisitos

1. **Backend** rodando, ex.: `cd src/backend && npm run dev`
2. **Frontend** rodando, ex.: `cd src/frontend && npm run dev`
3. Node 18+

## Instalação

Na raiz do repositório:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Executar

```bash
# Na raiz do projeto
npx playwright test
# ou
npm run test:e2e
```

- **Sem login**: os testes de rotas públicas e de redirecionamento (protegidas sem auth) rodam sempre.
- **Com login**: para os testes que entram no dashboard e no fluxo lead → proposta, defina variáveis de ambiente. Use as credenciais de desenvolvimento (ver **docs/CREDENCIAIS_DESENVOLVIMENTO.md**). Antes, rode o seed (cria Master + 1 lead para validar o fluxo completo):

  ```bash
  cd src/backend && node create_e2e_seed.js
  ```

  **Exemplo (usuário Master):**

  ```bash
  set E2E_LOGIN_EMAIL=master@quarks.solar
  set E2E_LOGIN_PASSWORD=master123
  npx playwright test
  ```

  No PowerShell:

  ```powershell
  $env:E2E_LOGIN_EMAIL="master@quarks.solar"
  $env:E2E_LOGIN_PASSWORD="master123"
  npm run test:e2e
  ```

## Estrutura

- `playwright.config.js` – baseURL `http://localhost:5173`, timeouts, reporter.
- `specs/smoke.spec.js` – login, redirecionamentos, dashboard (com credenciais).
- `specs/flows-lead-proposal.spec.js` – fluxo lista → ficha do lead → nova proposta (leadId na URL).

## Relatório

Após falha: `npx playwright show-report e2e/playwright-report` (HTML com trace/screenshot/vídeo).

## Documento de testes manuais

Para cenários completos e checklist de auditoria, veja **docs/PLANO_TESTES_FUNCIONAIS_REAIS.md**.
