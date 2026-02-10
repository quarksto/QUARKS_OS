# Quarks OS Core - Technical Plan (Migrated)

## Arquitetura Atual

O sistema adota uma arquitetura de microsserviços lógicos (monolíto modular) em Node.js, com um orquestrador central (`maestro.js`) que delega tarefas para Agentes de Domínio (`lead-domain`, `proposal-domain`). Os serviços de cálculo pesado são delegados via HTTP para um serviço Python (`calc_engine`).

### Pilha Tecnológica

- **Backend (API)**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL, Prisma ORM
- **Motor de Cálculo**: Python, FastAPI/Flask (inferido), NumPy/Pandas
- **Frontend**: React (SPA)
- **Mensageria**: Socket.io (inferido por `websocket/gateway`)
- **Logging**: Pino

### Mapeamento de Componentes

| Diretório | Responsabilidade | Status |
|-----------|------------------|--------|
| `src/backend/src/modules/auth` | Autenticação e Registro | ✅ Implementado |
| `src/backend/src/modules/leads` | Gestão de Leads e CRM | ✅ Implementado |
| `src/backend/src/modules/proposals` | Gestão de Propostas e Workflow | ✅ Implementado |
| `src/backend/src/modules/inventory` | Catálogo de Produtos e Kits | ✅ Implementado |
| `src/backend/src/modules/templates` | Templates de Mensagens | ✅ Implementado |
| `src/backend/src/modules/pricing-rules` | Regras de Precificação | ✅ Implementado |
| `src/backend/src/orchestrator` | Maestro (Lógica Central) | ✅ Implementado |
| `src/backend/src/agents/*` | Agentes de Domínio (Lógica de Negócio) | ✅ Implementado |
| `src/calc_engine` | Motor de Cálculo Solar | ✅ Implementado |

## Integração Frontend-Backend

- **Autenticação**: JWT via Header Authorization.
- **API**: RESTful JSON.
- **Websockets**: Atualizações em tempo real para dashboards e notificações.

## Pontos de Atenção (Dívida Técnica)

- **Validação de Entrada**: Faltam schemas de validação robustos (Zod/Joi) em algumas rotas.
- **Testes**: Cobertura de testes unitários e de integração parece baixa ou manual (`verify_*.js`).
- **Linting**: Código possui violações de estilo e variáveis não utilizadas.
