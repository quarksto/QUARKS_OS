# Plano de Testes Funcionais Reais – QUARKS_OS

Objetivo: **executar o sistema de ponta a ponta** (frontend + backend + banco) para **identificar falhas e faltas nos fluxos** antes e depois de mudanças. Serve como teste de fumaça manual e base para automação E2E.

---

## 1. Pré-requisitos

- **Backend** rodando (ex.: `cd src/backend && npm run dev`) — porta 3001 ou a configurada.
- **Frontend** rodando (ex.: `cd src/frontend && npm run dev`) — porta 5173.
- **Banco** acessível (PostgreSQL via Prisma).
- Usuário de teste: ver **docs/CREDENCIAIS_DESENVOLVIMENTO.md** (ex.: Master `master@quarks.solar` / `master123` após `node create_master_user.js`).
- Navegador com DevTools (F12) para inspecionar erros de rede/console.

---

## 2. Cenários de Jornada (teste manual)

Executar na ordem; anotar **passou / falhou / não testado** e o que quebrou.

### 2.1 Autenticação

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| A1 | Acessar `/login` | Página de login carrega | |
| A2 | Logar com credenciais válidas | Redireciona para `/` ou `/dashboard` | |
| A3 | Acessar `/dashboard` sem estar logado | Redireciona para `/login` | |
| A4 | Fazer logout (se houver) | Volta para tela pública | |

### 2.2 Dashboard e pipeline

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| B1 | Ir em **Dashboard** (`/dashboard`) | KPIs e/ou pipeline aparecem (ou “Nenhum lead”) | |
| B2 | Ver lista/kanban de leads | Dados carregam sem erro no console | |
| B3 | Clicar em um lead (card/linha) | Abre modal **ou** navega para ficha (conforme produto) | |
| B4 | Fechar modal (se abriu) e abrir outro lead | Comportamento consistente | |

### 2.3 Ficha do lead (`/leads/:id`)

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| C1 | Da lista/kanban ou busca, abrir **ficha do lead** (`/leads/:id`) | Página carrega com nome/status do lead | |
| C2 | Trocar **status** (select no header) | Status atualiza na tela sem erro | |
| C3 | Aba **Dados & Edição** → Editar → alterar um campo → Salvar | Dados salvam; mensagem ou atualização visível | |
| C4 | Aba **Qualificação** → preencher e salvar | Salvamento e refresh (ou mensagem de sucesso) | |
| C5 | Aba **Proposta** → ação “Nova proposta” / “Ver detalhes” | Navega para `/proposals/new?leadId=...` | |
| C6 | Aba **Documentos** | Lista ou “em breve”; sem erro de API | |
| C7 | Aba **Histórico** | Timeline aparece (ou vazia); sem erro | |

### 2.4 Nova proposta a partir do lead

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| D1 | Na ficha do lead, clicar em **Proposta** / “Nova proposta” | URL fica `/proposals/new?leadId=<id>` | |
| D2 | Verificar tela de nova proposta | Lead pré-preenchido ou visível (nome/consumo) | |
| D3 | Preencher passos do wizard (se houver) e submeter | Cria proposta e redireciona (ex.: lista ou detalhe) | |
| D4 | Abrir novamente a ficha do lead | Proposta criada aparece na aba Proposta | |

### 2.5 Workspace (`/workspace`)

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| E1 | Ir em **Workspace** (`/workspace`) | Lista/pipeline de leads carrega | |
| E2 | Selecionar um lead | Drawer lateral abre com dados do lead | |
| E3 | No drawer, clicar “Ver ficha” | Navega para `/leads/:id` | |
| E4 | Criar proposta a partir do Workspace (atalho ou botão) | Nova proposta abre com lead do contexto (query ou state) | |

### 2.6 Lista de propostas e detalhe

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| F1 | Ir em **Propostas** (`/proposals`) | Lista de propostas carrega | |
| F2 | Clicar em uma proposta | Abre detalhe (`/proposals/:id`) | |
| F3 | Link “Ver lead” (se existir) | Navega para `/leads/:leadId` correto | |
| F4 | Nova proposta a partir da lista (sem lead) | `/proposals/new` abre; pode não ter lead (comportamento esperado) | |

### 2.7 Busca global e rotas fora do menu

| # | Passo | Verificação | Resultado |
|---|--------|-------------|------------|
| G1 | Atalho de busca global (ex.: Ctrl+K) | Modal/overlay de busca abre | |
| G2 | Buscar por nome de lead | Resultado(s) aparecem; clique leva ao lead | |
| G3 | Acessar `/clients` | Página carrega (ou 404 se não implementado) | |
| G4 | Acessar `/projetos` | Página carrega | |
| G5 | Acessar `/view-proposal/:slug` (slug público conhecido) | Visualização pública sem login | |

---

## 3. Checklist de falhas e faltas conhecidas (auditoria)

Usar para **confirmar se já foram corrigidas** ou se ainda falham.

| # | Item | Como testar | Status |
|---|------|-------------|--------|
| 1 | **leadId na nova proposta** | Da ficha do lead → Proposta → Nova proposta. URL deve ter `?leadId=...` e o wizard deve mostrar dados do lead. | |
| 2 | **Pipeline no Workspace vs Dashboard** | Adicionar/editar lead no Workspace; sem refresh, abrir Dashboard. Ver se listas divergem até próximo refresh. | |
| 3 | **Detalhe em 3 contextos** | Mesmo lead: modal (Dashboard), drawer (Workspace), página (`/leads/:id`). Ver se dados e ações são consistentes. | |
| 4 | **Funil vs Leads (duplicado)** | `/funnel` e `/leads` são a mesma página. Ver se não gera confusão (menu com dois itens iguais). | |
| 5 | **Rotas sem menu** | `/clients`, `/chat`, `/cronograma`, `/kits`, `/settings` — acessíveis por URL; ver se faz sentido não estarem no menu. | |

---

## 4. Como registrar falhas

Para cada falha encontrada, anotar:

1. **Cenário** (ex.: “2.4 Nova proposta a partir do lead”).
2. **Passo** em que quebrou.
3. **Comportamento esperado** (uma linha).
4. **Comportamento observado** (erro na tela, redirect errado, console, etc.).
5. **Evidência** (print, cópia do erro do console ou da aba Network).

Exemplo:

- Cenário: 2.4 D2  
- Esperado: tela de nova proposta mostra nome do lead.  
- Observado: campo lead vazio; no console: `leadId is undefined`.  
- Evidência: screenshot + request `GET /api/leads/...` 404.

---

## 5. Automação E2E (opcional)

Para repetir os fluxos críticos em cada mudança:

- **Playwright**: pasta `e2e/` na raiz do projeto.
- Instalação: `npm install -D @playwright/test` e `npx playwright install chromium`.
- Comando: `npm run test:e2e` (com backend e frontend rodando). Credenciais opcionais: `E2E_LOGIN_EMAIL` e `E2E_LOGIN_PASSWORD`.
- Detalhes: **e2e/README.md**.

Cenários prioritários para automação:

1. Login → Dashboard carrega.
2. Dashboard → clicar lead → abrir ficha (`/leads/:id`).
3. Ficha do lead → Nova proposta → URL com `leadId` → wizard inicia.
4. Propostas → abrir detalhe de uma proposta.

---

## 6. Resumo

- **Teste manual**: seguir a **Seção 2** (cenários) e a **Seção 3** (checklist de auditoria); registrar falhas como na **Seção 4**.
- **Ambiente**: backend + frontend + banco; usuário de teste.
- **Objetivo**: identificar falhas e faltas reais nos fluxos (navegação, API, dados, UX) para corrigir e evitar regressões.
