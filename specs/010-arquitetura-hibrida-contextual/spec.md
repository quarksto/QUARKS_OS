# 📐 Spec: Arquitetura Híbrida Contextual

**Spec ID:** 10  
**Versão:** 1.0  
**Status:** ✅ Aprovado  
**Data Aprovação:** 2026-02-05  
**Owner:** Tech Lead  
**Estimativa:** 7 sprints (~14 semanas)

---

## 1. 📋 Visão Geral

### 1.1 Objetivo

Implementar uma arquitetura híbrida contextual que adapta a interface do Quarks OS ao contexto de uso:
- **SalesMode (📞 Vendas)**: Experiência WhatsApp-like para atendimento de leads
- **ManageMode (📊 Gestão)**: Dashboard analítico para gestores
- **ProjectMode (🔧 Projetos)**: Kanban para acompanhamento de instalações (futuro)

Com Copilot IA onipresente, streaming de respostas, e infraestrutura real-time.

### 1.2 Problema que Resolve

1. UX fragmentada entre diferentes páginas
2. Atualização lenta (polling 30s)
3. Copilot isolado da experiência principal
4. Falta de colaboração real-time
5. Ausência de notificações

### 1.3 Valor de Negócio

| Benefício | Impacto |
|-----------|---------|
| Tempo de resposta a leads | -90% (30s → <500ms) |
| Engajamento Copilot | +50% |
| Produtividade vendas | +30% |
| NPS | +20 pontos |
| Diferenciação competitiva | Alta |

---

## 2. 👤 Usuários e Cenários

### 2.1 Personas

| Persona | Uso Principal | Modo Preferido |
|---------|---------------|----------------|
| Vendedor | Atendimento, chat, propostas | SalesMode |
| Gestor | Acompanhamento, KPIs, pipeline | ManageMode |
| Engenheiro | Projetos, instalações | ProjectMode |
| Admin | Configuração, relatórios | Todos |

### 2.2 Cenários de Uso

#### Cenário 1: Vendedor Atende Novo Lead
```
1. Lead entra via webhook
2. Vendedor recebe notificação instantânea (<500ms)
3. Lead aparece no topo da lista com badge "Novo"
4. Vendedor seleciona lead
5. Painel lateral mostra dados + chat
6. Vendedor envia mensagem via chat inline
7. Ativa Copilot com contexto do lead
8. Copilot responde em streaming
9. Vendedor cria proposta com sugestão do Copilot
```

#### Cenário 2: Gestor Monitora Pipeline
```
1. Gestor acessa /manage
2. Dashboard mostra KPIs em tempo real
3. Gráficos atualizam quando leads mudam de status
4. Alerta aparece quando meta está em risco
5. Gestor clica em KPI para drill-down
```

#### Cenário 3: Colaboração Multi-Usuário
```
1. Vendedor A está atendendo lead
2. Vendedor B vê que lead está "em atendimento"
3. Vendedor A muda status para PROPOSAL_SENT
4. Vendedor B vê mudança instantaneamente
5. Gestor vê KPI de propostas atualizar
```

---

## 3. 🎯 Requisitos Funcionais

### 3.1 Infraestrutura Real-Time

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.01 | Sistema deve suportar WebSocket para comunicação real-time | P0 |
| RF.02 | Reconexão automática com backoff exponencial | P0 |
| RF.03 | Fallback para REST quando WS indisponível | P0 |
| RF.04 | Pub/Sub via Redis para escalabilidade | P0 |
| RF.05 | Indicador visual de status de conexão | P0 |

### 3.2 SalesMode (WhatsApp-like)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.10 | Lista de leads estilo conversas | P0 |
| RF.11 | Lead selecionado mostra painel lateral | P0 |
| RF.12 | Chat inline no painel do lead | P0 |
| RF.13 | Mensagens em tempo real | P0 |
| RF.14 | Indicador de "digitando" | P1 |
| RF.15 | Status de mensagem (enviado/lido) | P1 |
| RF.16 | Badge de mensagens não lidas | P0 |
| RF.17 | Leads "quentes" destacados | P1 |
| RF.18 | Busca com Ctrl+K | P0 (existe) |
| RF.19 | Navegação por teclado (↑↓) | P0 (existe) |

### 3.3 Copilot Streaming

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.20 | Respostas do Copilot em streaming (word-by-word) | P0 |
| RF.21 | Indicador visual "Copilot está pensando" | P0 |
| RF.22 | Feedback visual de tool use | P1 |
| RF.23 | CopilotBar sempre visível (bottom) | P0 |
| RF.24 | Contexto do lead ativo automaticamente | P0 |
| RF.25 | Cancelar resposta em andamento | P1 |

### 3.4 Shell Unificado

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.30 | Mode switcher no header | P0 |
| RF.31 | Transição suave entre modos | P1 |
| RF.32 | Persistir modo preferido do usuário | P1 |
| RF.33 | Keyboard shortcuts por modo | P2 |
| RF.34 | URL routing por modo (/sales, /manage) | P1 |

### 3.5 Features Avançadas

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.40 | Mentions (@usuario) com notificação | P1 |
| RF.41 | Smart Templates com variáveis | P1 |
| RF.42 | Follow-up Alerts automáticos | P1 |
| RF.43 | Leads fixados (pinned) | P2 |
| RF.44 | Quick Actions menu | P2 |

### 3.6 Notificações

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF.50 | Notificações browser (Web Notifications API) | P0 |
| RF.51 | Som de notificação (configurável) | P1 |
| RF.52 | Badge no título da aba | P1 |
| RF.53 | Notificação de mention | P1 |
| RF.54 | Notificação de proposta visualizada | P1 |

---

## 4. 📊 Requisitos Não-Funcionais

### 4.1 Performance

| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF.01 | Latência de broadcast WS | < 500ms P95 |
| RNF.02 | First chunk Copilot streaming | < 100ms |
| RNF.03 | Conexões WS simultâneas | 200+ |
| RNF.04 | Tempo reconexão automática | < 5s |
| RNF.05 | FPS da UI | 60fps |

### 4.2 Escalabilidade

| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF.10 | Broadcast por segundo | 10+ |
| RNF.11 | Mensagens por minuto | 1000+ |
| RNF.12 | Horizontal scaling | Suportado via Redis |

### 4.3 Disponibilidade

| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF.20 | Uptime WebSocket | 99.9% |
| RNF.21 | Graceful degradation | Funcional sem WS |
| RNF.22 | Zero message loss | Durante reconexão |

### 4.4 Segurança

| ID | Requisito | Descrição |
|----|-----------|-----------|
| RNF.30 | Auth WS | JWT validado na conexão |
| RNF.31 | RBAC em eventos | Apenas eventos autorizados |
| RNF.32 | Rate limiting | 100 mensagens/min/usuário |

---

## 5. 🎨 Design e UX

### 5.1 Wireframe SalesMode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔷 Quarks OS    [📞 Vendas ▼]           🔍 Buscar (Ctrl+K)       👤 User   │
├──────────┬────────────────────────────────┬─────────────────────────────────┤
│ SIDEBAR  │  LISTA DE LEADS               │  PAINEL DO LEAD                 │
│          │                               │                                 │
│ 📊 Dash  │  🔍 Buscar leads...           │  ┌─────────────────────────┐    │
│ 📞 Vendas│                               │  │ João Silva              │    │
│ 📋 Leads │  ┌─────────────────────────┐  │  │ Status: [CONTACTED ▼]  │    │
│ 📄 Props │  │ 🟢 João Silva       2min│  │  │                         │    │
│ ⚙️ Config│  │    "Olá, vi seu anúncio"│  │  │ 📧 joao@email.com  📋  │    │
│          │  ├─────────────────────────┤  │  │ 📱 (11) 99999 [WhatsApp]│    │
│          │  │ 🔵 Maria Costa    15min │  │  └─────────────────────────┘    │
│          │  │    "Proposta enviada"   │  │                                 │
│          │  ├─────────────────────────┤  │  ────────────────────────────   │
│          │  │ ⚪ Pedro Alves    1h    │  │                                 │
│          │  │    "Aguardando retorno" │  │  💬 CHAT                        │
│          │  └─────────────────────────┘  │  ┌─────────────────────────────┐│
│          │                               │  │ ▲ Mensagens anteriores...   ││
│          │  + Novo Lead                  │  │                             ││
│          │                               │  │ 👤 João: Olá, vi o anúncio  ││
│          │                               │  │ 🧑 Você: Olá João! Vamos... ││
│          │                               │  │                             ││
│          │                               │  ├─────────────────────────────┤│
│          │                               │  │ Digite mensagem...  [Enviar]││
│          │                               │  └─────────────────────────────┘│
├──────────┴────────────────────────────────┴─────────────────────────────────┤
│  🤖 Copilot: "Posso ajudar com o lead João?"  │ [💬 Perguntar] [📄 Proposta]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Componentes de UI

| Componente | Descrição | DS Compliance |
|------------|-----------|---------------|
| ConversationItem | Item da lista de leads | Petroleum/Solar tokens |
| UnreadBadge | Badge de não lidos | Solar-500 |
| TypingIndicator | "Digitando..." animado | Slate-400 |
| MessageBubble | Bolha de mensagem | Slate bg, Petroleum text |
| CopilotBar | Barra inferior do Copilot | Petroleum-900 bg |
| ModeSwitcher | Dropdown de modos | Slate border |

### 5.3 Animações

| Animação | Duração | Easing |
|----------|---------|--------|
| Novo lead fade-in | 300ms | ease-out |
| Status change | 200ms | ease-in-out |
| Mode transition | 400ms | ease-in-out |
| Message appear | 150ms | ease-out |
| Typing dots | loop 1s | ease-in-out |

---

## 6. 🔧 Arquitetura Técnica

### 6.1 Diagrama de Arquitetura

```
Frontend (React)
    │
    ├── RealtimeProvider (Socket.io client)
    │       │
    │       ├── useRealtime() hook
    │       ├── useMessages() hook
    │       └── usePresence() hook
    │
    ├── ModeProvider
    │       │
    │       ├── SalesMode
    │       ├── ManageMode
    │       └── ProjectMode
    │
    └── CopilotProvider
            │
            └── Streaming context
    
    ↓ WebSocket + REST ↓

Backend (Express + Socket.io)
    │
    ├── WebSocket Gateway
    │       │
    │       ├── Auth middleware (JWT)
    │       ├── Event handlers
    │       └── Redis pub/sub adapter
    │
    ├── Domain Agents (Maestro)
    │       │
    │       ├── LeadDomainAgent
    │       ├── MessageDomainAgent (NEW)
    │       ├── CopilotDomainAgent (streaming)
    │       └── NotificationDomainAgent (NEW)
    │
    └── Services
            │
            ├── Broadcaster
            ├── Presence
            └── FollowUpScheduler
    
    ↓ Prisma ↓

PostgreSQL
```

### 6.2 Stack Técnica

| Layer | Tecnologia | Notas |
|-------|------------|-------|
| Frontend | React + Vite | Existente |
| WebSocket Client | Socket.io-client | Adicionar |
| State Management | React Context | Existente + novos |
| Backend | Express 5 | Existente |
| WebSocket Server | Socket.io | Adicionar |
| Pub/Sub | Redis | Adicionar |
| ORM | Prisma | Existente |
| Database | PostgreSQL | Existente |
| AI | Google Gemini | Existente |

### 6.3 Novos Modelos de Dados

| Modelo | Campos Principais |
|--------|-------------------|
| Message | id, leadId, senderType, content, contentType, read, mentions |
| MessageTemplate | id, name, content, category, usageCount |
| FollowUpAlert | id, leadId, triggerType, triggerAt, status |
| UserPreferences | id, userId, defaultMode, pinnedLeads, notifications |

---

## 7. 📅 Cronograma

| Sprint | Fase | Entregáveis |
|--------|------|-------------|
| 1 | Infraestrutura | WebSocket + Redis |
| 2 | SalesMode | Real-time leads |
| 3 | SalesMode | Chat inline |
| 4 | Copilot | Streaming |
| 5 | Unificação | Shell + Modos |
| 6 | Features | Mentions, Templates, Alerts |
| 7 | Polish | Performance, UX |

---

## 8. ✅ Critérios de Aceite

### 8.1 Definition of Done (Sprint)

- [ ] Código revisado (PR approved)
- [ ] Testes unitários passando (80%+ coverage)
- [ ] Testes E2E passando
- [ ] Sem regressões
- [ ] Performance dentro dos targets
- [ ] Documentação atualizada

### 8.2 Definition of Done (Feature)

- [ ] Funcionalidade completa conforme requisitos
- [ ] Design System compliance
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] Responsividade
- [ ] Internacionalização ready
- [ ] Error handling

### 8.3 Definition of Done (Release)

- [ ] Todas as features do milestone completas
- [ ] Zero bugs P0/P1
- [ ] Load testing aprovado
- [ ] UAT aprovado
- [ ] Rollback plan documentado
- [ ] Monitoring configurado

---

## 9. 🚧 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| WebSocket instabilidade | Média | Alto | Reconexão + fallback REST |
| Performance degradada | Baixa | Alto | Profiling contínuo |
| Conflitos de estado | Média | Médio | Optimistic updates + conflict resolution |
| Regressões UI | Média | Médio | Testes E2E extensivos |
| Redis failure | Baixa | Alto | Fallback in-memory |

---

## 10. 📎 Referências

1. [PLANO_MESTRE_ARQUITETURA_HIBRIDA_CONTEXTUAL.md](../docs/PLANO_MESTRE_ARQUITETURA_HIBRIDA_CONTEXTUAL.md)
2. [ANALISE_ALTERNATIVAS_ARQUITETURAIS.md](../docs/ANALISE_ALTERNATIVAS_ARQUITETURAIS.md)
3. [ESTUDO_VIABILIDADE_ARQUITETURA_HIBRIDA.md](../docs/ESTUDO_VIABILIDADE_ARQUITETURA_HIBRIDA.md)
4. [tasks.md](tasks.md)

---

*Spec validada e aprovada em 2026-02-05*
