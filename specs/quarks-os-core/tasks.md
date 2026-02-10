# Quarks OS Core - Tasks (Migrated)

Estas tarefas representam o estado atual do desenvolvimento, inferido a partir da base de código existente.

## Implementação Existente (Backend)

- [x] **Infraestrutura Básica**
    - [x] Configuração do Servidor Express (`server.js`)
    - [x] Conexão com Banco de Dados Prisma
    - [x] Sistema de Logging (Pino)

- [x] **Autenticação & Usuários** (`src/modules/auth`, `src/modules/users`)
    - [x] Registro de Usuários
    - [x] Login JWT
    - [x] Middleware de Proteção de Rotas

- [x] **Gestão de Leads** (`src/modules/leads`)
    - [x] CRUD de Leads
    - [x] Pipeline Kanban
    - [x] Integração Webhook (Simulada/Parcial)

- [x] **Propostas Comerciais** (`src/modules/proposals`)
    - [x] CRUD de Propostas
    - [x] Geração de PDF (via Python Bridge)
    - [x] Envio de Email (Simulado)
    - [x] Link Público para Cliente

- [x] **Funcionalidades Auxiliares**
    - [x] Templates de Mensagens (`src/modules/templates`)
    - [x] Regras de Precificação (`src/modules/pricing-rules`)

- [x] **Motor de Cálculo** (`src/calc_engine`)
    - [x] API Python para cálculos solares
    - [x] Integração NodeJS -> Python

## Gaps Identificados / TODOs

- [x] **Testes Automatizados**
    - [x] Implementar suíte de testes unitários (Jest) para Agentes
    - [ ] Testes de Integração API

- [ ] **Qualidade de Código**
    - [ ] Refatoração para remover código morto (identificado no Lint)
    - [ ] Tipagem mais forte (JSDocs ou migração TS)

- [ ] **Integrações Externas**
    - [ ] Conectar API real do Google Solar
    - [ ] Configurar provedor de Email real (SendGrid/AWS SES)
