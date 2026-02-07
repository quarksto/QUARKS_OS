# 🎯 Plano Mestre — Arquitetura Híbrida Contextual (Opção D)

**Data de Aprovação:** 2026-02-05  
**Status:** ✅ APROVADO  
**Versão:** 1.0  
**Score Atual:** 8.05/10  
**Meta:** 9.5+/10

---

## 📑 Sumário Executivo

### Objetivo
Implementar a **Arquitetura Híbrida Contextual** no Quarks OS, transformando a experiência do usuário com interfaces adaptativas por contexto (Vendas WhatsApp-like, Gestão Dashboard, Projetos Kanban), Copilot onipresente com streaming, e infraestrutura real-time.

### Métricas de Sucesso

| KPI | Baseline | Meta | Medição |
|-----|----------|------|---------|
| **Score Arquitetural** | 8.05 | 9.5+ | Avaliação interna |
| **Latência Notificação** | 30s | < 500ms | P95 |
| **Percepção Velocidade** | 3-10s wait | Streaming | UX Survey |
| **Tempo Resposta Lead** | Desconhecido | < 2 min | Analytics |
| **Adoção Copilot** | Baseline | +50% | Usage metrics |
| **NPS** | Baseline | +20 pontos | Pesquisa |

---

## 1. 📊 Gap Analysis: Do 8.05 para 9.5+

### 1.1 Onde Perdemos Pontos

| Critério | Score Atual | Score Ideal | Gap | Ação para Fechar |
|----------|-------------|-------------|-----|------------------|
| **UX Vendas** | 9/10 | 10/10 | -1 | Chat integrado no shell |
| **UX Gestão** | 9/10 | 10/10 | -1 | KPIs real-time |
| **Familiaridade** | 8/10 | 10/10 | -2 | UX patterns WhatsApp |
| **Esforço Impl.** | 6/10 | 7/10 | -1 | Reutilização máxima |
| **Risco** | 7/10 | 9/10 | -2 | Feature flags + rollback |
| **Escalabilidade** | 9/10 | 10/10 | -1 | Event sourcing |
| **Diferenciação** | 8/10 | 10/10 | -2 | Features únicas |
| **Reutilização** | 8/10 | 10/10 | -2 | Componentes shared |

### 1.2 Features para 9.5+

| Feature | Impacto no Score | Prioridade |
|---------|------------------|------------|
| **Chat integrado ao SalesMode shell** | +0.3 | P0 |
| **Streaming Copilot (word-by-word)** | +0.3 | P0 |
| **Real-time leads & status** | +0.2 | P0 |
| **Unread indicators** | +0.2 | P0 |
| **Mentions (@usuario)** | +0.15 | P1 |
| **Smart Templates** | +0.15 | P1 |
| **Follow-up Alerts** | +0.1 | P1 |
| **Quick Actions** | +0.1 | P1 |
| **Voice Notes** | +0.05 | P2 |
| **Offline Mode** | +0.1 | P2 |
| **WhatsApp Business API** | +0.25 | P2 |

**Total Potencial: +1.75 → Score 9.8/10**

---

## 2. 🏗️ Arquitetura Técnica Final

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                         SHELL UNIFICADO                                  │ │
│ │  ┌─────────────────────────────────────────────────────────────────── ┐ │ │
│ │  │  Header [ModeSwitcher: 📞 Vendas | 📊 Gestão | 🔧 Projetos]       │ │ │
│ │  └─────────────────────────────────────────────────────────────────── ┘ │ │
│ │  ┌──────┬───────────────────────────────────────────────────────────┐  │ │
│ │  │Sidebar│                   CONTENT AREA                           │  │ │
│ │  │      │  ┌─────────────────────────────────────────────────────┐  │  │ │
│ │  │      │  │                                                     │  │  │ │
│ │  │      │  │   SalesMode | ManageMode | ProjectMode              │  │  │ │
│ │  │      │  │                                                     │  │  │ │
│ │  │      │  └─────────────────────────────────────────────────────┘  │  │ │
│ │  └──────┴───────────────────────────────────────────────────────────┘  │ │
│ │  ┌─────────────────────────────────────────────────────────────────── ┐ │ │
│ │  │  🤖 CopilotBar (sempre visível, streaming)                        │ │ │
│ │  └─────────────────────────────────────────────────────────────────── ┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐                       │
│  │   RealtimeProvider    │  │   CopilotProvider     │                       │
│  │   (WebSocket + REST)  │  │   (Context + Stream)  │                       │
│  └───────────┬───────────┘  └───────────┬───────────┘                       │
│              └─────────────┬────────────┘                                   │
│                            │                                                │
└────────────────────────────┼────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  WebSocket GW   │
                    │  (Socket.io)    │
                    └────────┬────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────────┐
│                            │         BACKEND                                 │
│  ┌─────────────────────────▼───────────────────────────────────────────────┐│
│  │                         EVENT BUS (Redis)                                ││
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           ││
│  │  │lead:new    │ │lead:status │ │msg:new     │ │copilot:    │           ││
│  │  │            │ │            │ │            │ │stream      │           ││
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ LeadDomain   │ │ MessageDomain│ │ CopilotDomain│ │ NotifyDomain │       │
│  │ Agent        │ │ Agent (NEW)  │ │ Agent        │ │ Agent (NEW)  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                         MAESTRO ORCHESTRATOR                             ││
│  └──────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                            ┌────────▼────────┐
                            │   PostgreSQL    │
                            │   + Prisma      │
                            └─────────────────┘
```

### 2.2 Modelo de Dados Expandido

```prisma
// ============================================
// NOVOS MODELOS PARA ARQUITETURA CONTEXTUAL
// ============================================

// Modelo unificado de mensagens/atividades
model Message {
  id          String      @id @default(uuid())
  leadId      String
  lead        Lead        @relation(fields: [leadId], references: [id], onDelete: Cascade)
  
  // Quem enviou
  senderType  SenderType
  senderId    String?
  sender      User?       @relation(fields: [senderId], references: [id])
  
  // Conteúdo
  content     String
  contentType ContentType @default(TEXT)
  metadata    Json?       // { proposalId, fileUrl, templateId, etc }
  
  // Status de leitura
  read        Boolean     @default(false)
  readAt      DateTime?
  readBy      String[]    // userIds que leram
  
  // Threading
  replyToId   String?
  replyTo     Message?    @relation("replies", fields: [replyToId], references: [id])
  replies     Message[]   @relation("replies")
  
  // Mentions
  mentions    String[]    // userIds mencionados
  
  // Timestamps
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([leadId, createdAt])
  @@index([senderId])
}

enum SenderType {
  SYSTEM      // Eventos automáticos (status change, etc)
  USER        // Usuário do sistema
  COPILOT     // IA
  EXTERNAL    // WhatsApp, Email (futuro)
}

enum ContentType {
  TEXT
  PROPOSAL_CARD
  STATUS_CHANGE
  ACTIVITY
  FILE
  AUDIO
  IMAGE
  TEMPLATE
  ALERT
}

// Templates de mensagem
model MessageTemplate {
  id          String   @id @default(uuid())
  name        String
  content     String   // Suporta variáveis: {{lead.name}}, {{user.name}}, etc
  category    String   // follow-up, proposal, welcome, etc
  isActive    Boolean  @default(true)
  usageCount  Int      @default(0)
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Alertas de follow-up
model FollowUpAlert {
  id          String         @id @default(uuid())
  leadId      String
  lead        Lead           @relation(fields: [leadId], references: [id], onDelete: Cascade)
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  
  triggerType AlertTrigger
  triggerAt   DateTime
  message     String?
  
  status      AlertStatus    @default(PENDING)
  dismissedAt DateTime?
  
  createdAt   DateTime       @default(now())
  
  @@index([userId, status, triggerAt])
}

enum AlertTrigger {
  NO_CONTACT_24H
  NO_CONTACT_48H
  NO_CONTACT_7D
  PROPOSAL_NO_VIEW_48H
  PROPOSAL_VIEWED
  SCHEDULED
  CUSTOM
}

enum AlertStatus {
  PENDING
  SENT
  DISMISSED
  ACTIONED
}

// Preferências do usuário por modo
model UserPreferences {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  defaultMode     String   @default("sales") // sales, manage, project
  sidebarCollapsed Boolean @default(false)
  pinnedLeads     String[] // leadIds
  notifyBrowser   Boolean  @default(true)
  notifyEmail     Boolean  @default(false)
  notifySound     Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Extensão do Lead existente
model Lead {
  // ... campos existentes ...
  
  messages        Message[]
  followUpAlerts  FollowUpAlert[]
  
  // Novos campos
  lastContactAt   DateTime?
  lastMessageAt   DateTime?
  unreadCount     Int       @default(0)
  isPinned        Boolean   @default(false)
  pinnedBy        String[]  // userIds que fixaram
}

// Extensão do User existente
model User {
  // ... campos existentes ...
  
  sentMessages     Message[]
  preferences      UserPreferences?
  followUpAlerts   FollowUpAlert[]
  messageTemplates MessageTemplate[]
  
  // Novos campos
  lastSeenAt       DateTime?
  isOnline         Boolean   @default(false)
}
```

### 2.3 Protocolo de Eventos WebSocket

```typescript
// ============================================
// PROTOCOLO DE EVENTOS REAL-TIME
// ============================================

// Eventos do Servidor → Cliente
interface ServerEvents {
  // Leads
  'lead:created': { lead: Lead };
  'lead:updated': { leadId: string; changes: Partial<Lead> };
  'lead:status_changed': { leadId: string; oldStatus: string; newStatus: string; changedBy: string };
  'lead:deleted': { leadId: string };
  
  // Mensagens
  'message:new': { message: Message };
  'message:read': { messageId: string; readBy: string };
  'message:typing': { leadId: string; userId: string; isTyping: boolean };
  
  // Copilot
  'copilot:stream_start': { sessionId: string };
  'copilot:stream_chunk': { sessionId: string; chunk: string; index: number };
  'copilot:stream_end': { sessionId: string; fullResponse: string };
  'copilot:tool_use': { sessionId: string; tool: string; status: 'started' | 'completed' };
  
  // Alertas
  'alert:new': { alert: FollowUpAlert };
  'alert:reminder': { alert: FollowUpAlert };
  
  // Propostas
  'proposal:viewed': { proposalId: string; leadId: string; viewedAt: Date };
  'proposal:status_changed': { proposalId: string; status: string };
  
  // Presença
  'presence:user_online': { userId: string };
  'presence:user_offline': { userId: string };
  
  // Sistema
  'system:notification': { type: string; message: string; data?: any };
}

// Eventos do Cliente → Servidor
interface ClientEvents {
  // Subscrições
  'subscribe:lead': { leadId: string };
  'unsubscribe:lead': { leadId: string };
  'subscribe:all_leads': {};
  
  // Ações
  'message:send': { leadId: string; content: string; contentType: string };
  'message:typing': { leadId: string; isTyping: boolean };
  'message:mark_read': { messageIds: string[] };
  
  // Copilot
  'copilot:send': { sessionId: string; message: string; context?: any };
  'copilot:cancel': { sessionId: string };
  
  // Presença
  'presence:heartbeat': {};
}
```

---

## 3. 📅 Roadmap Detalhado

### Fase 0: Infraestrutura Base (Sprint 1)
**Duração:** 2 semanas  
**Objetivo:** Estabelecer fundação WebSocket + Redis

#### Tarefas Backend

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| B0.1 | Instalar e configurar Socket.io no Express | 4h | Backend |
| B0.2 | Configurar Redis (local + staging) | 4h | DevOps |
| B0.3 | Criar adapter Redis para Socket.io | 4h | Backend |
| B0.4 | Implementar WebSocket Gateway básico | 8h | Backend |
| B0.5 | Criar middleware de autenticação WS | 4h | Backend |
| B0.6 | Implementar pub/sub básico com Redis | 6h | Backend |
| B0.7 | Criar logging e monitoring para WS | 4h | Backend |
| B0.8 | Testes de conexão/reconexão | 4h | QA |

#### Tarefas Frontend

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| F0.1 | Criar RealtimeProvider (Context) | 6h | Frontend |
| F0.2 | Implementar cliente Socket.io | 4h | Frontend |
| F0.3 | Auto-reconexão com backoff exponencial | 4h | Frontend |
| F0.4 | Fallback para polling quando WS falha | 4h | Frontend |
| F0.5 | Indicador visual de conexão | 2h | Frontend |
| F0.6 | Testes de integração WS | 4h | QA |

#### Entregáveis
- [ ] WebSocket conectando frontend ↔ backend
- [ ] Redis funcionando (pub/sub)
- [ ] Reconexão automática
- [ ] Fallback para REST
- [ ] Indicador de conexão na UI

---

### Fase 1: SalesMode Evolution (Sprints 2-3)
**Duração:** 4 semanas  
**Objetivo:** Transformar /workspace em experiência WhatsApp-like completa

#### Sprint 2: Real-time Leads

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| S2.1 | Broadcast de novos leads via WS | 4h | Backend |
| S2.2 | Broadcast de status changes via WS | 4h | Backend |
| S2.3 | Atualizar ConversationList com WS events | 6h | Frontend |
| S2.4 | Animação de entrada de novo lead | 2h | Frontend |
| S2.5 | Implementar modelo Message no Prisma | 4h | Backend |
| S2.6 | Migration para novos campos Lead | 2h | Backend |
| S2.7 | **CRUD Message** (create, list, mark read) | 8h | Backend |
| S2.8 | Implementar unread count | 4h | Backend |
| S2.9 | Badge de não lidos na ConversationList | 4h | Frontend |
| S2.10 | Indicador de lead "quente" (recent activity) | 2h | Frontend |

#### Sprint 3: Chat Integrado

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| S3.1 | **Novo componente: QuickChatPanel** | 12h | Frontend |
| S3.2 | Integrar QuickChatPanel no LeadContextPanel | 4h | Frontend |
| S3.3 | Timeline de mensagens (scroll infinito) | 6h | Frontend |
| S3.4 | Envio de mensagem com optimistic update | 4h | Frontend |
| S3.5 | Indicador "digitando..." | 4h | Full-stack |
| S3.6 | Message delivery status (sent/delivered/read) | 4h | Full-stack |
| S3.7 | Notificações browser (Web Notifications API) | 4h | Frontend |
| S3.8 | Som de notificação (configurável) | 2h | Frontend |
| S3.9 | Testes E2E do fluxo completo | 8h | QA |

#### Entregáveis Sprint 2
- [ ] Novos leads aparecem instantaneamente
- [ ] Status changes são broadcast
- [ ] Badge de não lidos funcionando
- [ ] Modelo Message implementado

#### Entregáveis Sprint 3
- [ ] Chat inline no painel de lead
- [ ] Indicador de digitação
- [ ] Notificações browser
- [ ] Timeline de mensagens

---

### Fase 2: Copilot Streaming (Sprint 4)
**Duração:** 2 semanas  
**Objetivo:** Streaming word-by-word do Gemini

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| C4.1 | Refatorar CopilotDomainAgent para streaming | 8h | Backend |
| C4.2 | Implementar Gemini stream via WS | 6h | Backend |
| C4.3 | Evento copilot:stream_chunk | 4h | Backend |
| C4.4 | Atualizar CopilotSidebar para streaming | 6h | Frontend |
| C4.5 | Indicador "Copilot está pensando..." | 2h | Frontend |
| C4.6 | Animação de palavras aparecendo | 4h | Frontend |
| C4.7 | Tool use feedback visual | 4h | Frontend |
| C4.8 | Integrar Copilot no SalesMode shell | 6h | Frontend |
| C4.9 | CopilotBar (barra inferior sempre visível) | 6h | Frontend |
| C4.10 | Quick actions do Copilot no contexto | 4h | Frontend |
| C4.11 | Testes de latência e performance | 4h | QA |

#### Entregáveis
- [ ] Respostas Copilot aparecem word-by-word
- [ ] Indicador visual durante processamento
- [ ] CopilotBar sempre visível
- [ ] Latência < 100ms para primeiro chunk

---

### Fase 3: Unificação e Modos (Sprints 5-6)
**Duração:** 4 semanas  
**Objetivo:** Unificar a experiência com mode switcher e shell universal

#### Sprint 5: Shell Unificado

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| U5.1 | **Novo componente: UnifiedShell** | 12h | Frontend |
| U5.2 | **Novo componente: ModeSwitcher** | 6h | Frontend |
| U5.3 | Migrar HybridShell → SalesMode | 8h | Frontend |
| U5.4 | Criar ManageMode (wrapper do Dashboard) | 6h | Frontend |
| U5.5 | Context de modo (ModeProvider) | 4h | Frontend |
| U5.6 | Persistir modo preferido (UserPreferences) | 4h | Full-stack |
| U5.7 | Transição animada entre modos | 4h | Frontend |
| U5.8 | Keyboard shortcuts por modo | 2h | Frontend |
| U5.9 | URL routing por modo (/sales, /manage) | 4h | Frontend |

#### Sprint 6: Features Avançadas

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| U6.1 | **Mentions (@usuario)** - Backend | 6h | Backend |
| U6.2 | **Mentions (@usuario)** - Frontend (autocomplete) | 6h | Frontend |
| U6.3 | **Smart Templates** - Backend (CRUD + variáveis) | 8h | Backend |
| U6.4 | **Smart Templates** - Frontend (selector + preview) | 6h | Frontend |
| U6.5 | **Follow-up Alerts** - Backend (scheduler) | 8h | Backend |
| U6.6 | **Follow-up Alerts** - Frontend (notifications) | 4h | Frontend |
| U6.7 | **Pinned Leads** | 4h | Full-stack |
| U6.8 | **Quick Actions menu** | 6h | Frontend |
| U6.9 | Refinar UI/UX baseado em feedback | 8h | Frontend |
| U6.10 | Testes E2E completos | 8h | QA |

#### Entregáveis Sprint 5
- [ ] Shell unificado funcionando
- [ ] Mode switcher no header
- [ ] Transição suave entre modos
- [ ] Preferências persistidas

#### Entregáveis Sprint 6
- [ ] Mentions funcionando
- [ ] Templates de mensagem
- [ ] Alertas de follow-up
- [ ] Leads fixados
- [ ] Quick actions

---

### Fase 4: Polish & Diferenciação (Sprint 7)
**Duração:** 2 semanas  
**Objetivo:** Refinar, otimizar e diferenciar

| ID | Tarefa | Esforço | Responsável |
|----|--------|---------|-------------|
| P7.1 | **Optimistic Updates** em toda UI | 8h | Frontend |
| P7.2 | **Virtualização** da lista de leads | 6h | Frontend |
| P7.3 | Animações e micro-interações polish | 6h | Frontend |
| P7.4 | **Keyboard-first navigation** (vim-like) | 6h | Frontend |
| P7.5 | **Dark mode** (por modo) | 8h | Frontend |
| P7.6 | Onboarding tour interativo | 6h | Frontend |
| P7.7 | Performance profiling e otimização | 8h | Full-stack |
| P7.8 | Load testing (100+ conexões WS) | 4h | DevOps |
| P7.9 | Documentação técnica final | 8h | Todos |
| P7.10 | User acceptance testing | 8h | QA + Users |

#### Entregáveis
- [ ] UI responsiva e fluida
- [ ] Optimistic updates everywhere
- [ ] Keyboard navigation completa
- [ ] Performance validada
- [ ] Documentação completa

---

### Fase 5: Integrações Futuras (Sprints 8+)
**Duração:** Ongoing  
**Objetivo:** Expandir capacidades

| Feature | Esforço | Prioridade |
|---------|---------|------------|
| WhatsApp Business API | 3 sprints | P2 |
| Email Inbox Integration | 2 sprints | P2 |
| Voice Notes | 1 sprint | P3 |
| Offline Mode (IndexedDB) | 1.5 sprints | P3 |
| Mobile App (React Native) | 4+ sprints | P4 |
| ProjectMode (Kanban avançado) | 2 sprints | P3 |

---

## 4. 📋 Estrutura de Componentes Final

### 4.1 Árvore de Componentes

```
src/frontend/src/
├── App.jsx                         # Router principal
├── main.jsx                        # Entry point
│
├── providers/                      # Novos providers
│   ├── RealtimeProvider.jsx        # WebSocket context
│   ├── ModeProvider.jsx            # Modo atual (sales/manage/project)
│   └── NotificationProvider.jsx    # Web notifications
│
├── shell/                          # Novo: Shell unificado
│   ├── UnifiedShell.jsx            # Container principal
│   ├── ModeSwitcher.jsx            # Alternador de modos
│   ├── CopilotBar.jsx              # Barra inferior do Copilot
│   └── ConnectionStatus.jsx        # Indicador WS
│
├── modes/                          # Novo: Modos de visualização
│   ├── SalesMode/                  # Modo Vendas (WhatsApp-like)
│   │   ├── SalesMode.jsx           # Container
│   │   ├── ConversationList.jsx    # Evolução do existente
│   │   ├── LeadPanel.jsx           # Painel de contexto
│   │   ├── QuickChatPanel.jsx      # NOVO: Chat inline
│   │   └── MessageBubble.jsx       # NOVO: Bolha de mensagem
│   │
│   ├── ManageMode/                 # Modo Gestão
│   │   ├── ManageMode.jsx          # Wrapper do Dashboard
│   │   └── LiveKPIs.jsx            # KPIs real-time
│   │
│   └── ProjectMode/                # Modo Projetos (futuro)
│       └── ProjectMode.jsx         # Placeholder
│
├── components/
│   ├── copilot/
│   │   ├── CopilotSidebar.jsx      # Existente, refatorado
│   │   ├── StreamingMessage.jsx    # NOVO: Mensagem streaming
│   │   └── ToolUseIndicator.jsx    # NOVO: Indicador de tool use
│   │
│   ├── shared/                     # NOVO: Componentes compartilhados
│   │   ├── UnreadBadge.jsx
│   │   ├── TypingIndicator.jsx
│   │   ├── PresenceIndicator.jsx
│   │   ├── QuickActions.jsx
│   │   ├── TemplateSelector.jsx
│   │   ├── MentionInput.jsx
│   │   └── AlertBanner.jsx
│   │
│   └── dashboard/                  # Existente
│       └── ...
│
├── hooks/                          # Hooks customizados
│   ├── useRealtime.js              # NOVO: Hook para WS events
│   ├── useMessages.js              # NOVO: Hook para mensagens
│   ├── usePresence.js              # NOVO: Hook para presença
│   ├── useNotifications.js         # NOVO: Hook para notificações
│   ├── useTemplates.js             # NOVO: Hook para templates
│   └── useChat.js                  # Existente, refatorado
│
├── services/
│   ├── api.js                      # Existente
│   ├── websocket.js                # NOVO: Cliente WebSocket
│   └── notifications.js            # NOVO: Web Notifications
│
└── hybrid/                         # Legado - migrar para modes/
    ├── HybridShell.jsx             # → SalesMode.jsx
    ├── ConversationList.jsx        # → modes/SalesMode/
    ├── LeadContextPanel.jsx        # → modes/SalesMode/
    ├── LeadDetailDrawer.jsx        # → shared/
    └── HybridSidebar.jsx           # → shell/Sidebar.jsx
```

### 4.2 Estrutura Backend

```
src/backend/src/
├── server.js                       # Entry point
│
├── websocket/                      # NOVO: WebSocket handling
│   ├── gateway.js                  # Socket.io setup
│   ├── auth.js                     # WS authentication
│   ├── handlers/                   # Event handlers
│   │   ├── leadHandlers.js
│   │   ├── messageHandlers.js
│   │   ├── copilotHandlers.js
│   │   └── presenceHandlers.js
│   └── pubsub.js                   # Redis pub/sub adapter
│
├── agents/
│   ├── lead-domain/                # Existente
│   ├── copilot-domain/             # Existente, refatorado para streaming
│   ├── message-domain/             # NOVO
│   │   ├── index.js
│   │   ├── agent.js
│   │   └── routes.js
│   ├── notification-domain/        # NOVO
│   │   ├── index.js
│   │   ├── agent.js
│   │   └── scheduler.js
│   └── template-domain/            # NOVO
│       ├── index.js
│       └── agent.js
│
├── services/
│   ├── realtime/                   # NOVO
│   │   ├── broadcaster.js          # Event broadcasting
│   │   └── presence.js             # User presence tracking
│   └── alerts/                     # NOVO
│       └── followUpScheduler.js    # Cron-like scheduler
│
└── prisma/
    ├── schema.prisma               # Atualizado com novos modelos
    └── migrations/
        └── 20260205_add_messages/
```

---

## 5. 🎯 Critérios de Aceite por Feature

### 5.1 Real-time Leads

```gherkin
Feature: Real-time Lead Updates

Scenario: Novo lead aparece instantaneamente
  Given estou na tela de SalesMode
  And estou conectado via WebSocket
  When um novo lead é criado (webhook ou manual)
  Then o lead aparece no topo da lista em < 500ms
  And uma animação de fade-in é exibida
  And um som de notificação é tocado (se habilitado)

Scenario: Status change é broadcast
  Given estou visualizando um lead
  And outro usuário muda o status do mesmo lead
  Then o status atualiza na minha tela em < 500ms
  And um toast indica "Status atualizado por {usuario}"
```

### 5.2 Streaming Copilot

```gherkin
Feature: Copilot Streaming

Scenario: Resposta aparece word-by-word
  Given estou no CopilotBar ou CopilotSidebar
  When envio uma mensagem para o Copilot
  Then vejo "Copilot está pensando..." imediatamente
  And após < 1s, as palavras começam a aparecer
  And cada palavra aparece com animação suave
  And posso interromper a qualquer momento
```

### 5.3 Chat Inline

```gherkin
Feature: Quick Chat

Scenario: Enviar mensagem no painel do lead
  Given selecionei um lead no SalesMode
  When digito uma mensagem no QuickChatPanel
  And pressiono Enter ou clico Enviar
  Then a mensagem aparece na timeline instantaneamente
  And mostra status "Enviando..."
  And após confirmação do servidor, mostra "Enviado ✓"
```

### 5.4 Mentions

```gherkin
Feature: Mentions

Scenario: Mencionar colega
  Given estou escrevendo uma mensagem
  When digito @ seguido de letras
  Then um dropdown aparece com usuários que match
  When seleciono um usuário
  Then o nome é inserido como mention destacada
  And quando envio, o usuário mencionado recebe notificação
```

---

## 6. ⚙️ Configuração de Ambiente

### 6.1 Variáveis de Ambiente Necessárias

```env
# Backend
PORT=3001
DATABASE_URL=postgresql://...
GOOGLE_API_KEY=...

# NOVO: Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# NOVO: WebSocket
WS_CORS_ORIGIN=http://localhost:5173
WS_PING_INTERVAL=25000
WS_PING_TIMEOUT=60000

# NOVO: Notifications
NOTIFICATION_FROM_EMAIL=noreply@quarks.com
FCM_SERVER_KEY= # Firebase Cloud Messaging (futuro)

# Frontend (Vite)
VITE_API_BASE=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### 6.2 Infraestrutura

| Componente | Desenvolvimento | Staging | Produção |
|------------|-----------------|---------|----------|
| Redis | Local (Docker) | Managed | Redis Cluster |
| WebSocket | Single node | Single node | Sticky sessions + Redis adapter |
| PostgreSQL | Local | Managed | Managed |

---

## 7. 📊 Métricas e Monitoramento

### 7.1 Métricas Chave

| Métrica | Ferramenta | Alvo |
|---------|------------|------|
| WS connections | Redis counter | Track |
| Message latency | Custom logging | < 500ms P95 |
| Copilot stream time | Custom logging | < 100ms first chunk |
| Error rate | Sentry | < 0.1% |
| Active users | Presence service | Track |

### 7.2 Dashboards

- [ ] Conexões WS ativas
- [ ] Latência de mensagens
- [ ] Taxa de reconexão
- [ ] Uso do Copilot
- [ ] Erros por tipo

---

## 8. 🧪 Estratégia de Testes

### 8.1 Testes Unitários

| Área | Cobertura Alvo |
|------|----------------|
| Handlers WS | 80% |
| Agents de domínio | 80% |
| Hooks React | 70% |
| Componentes | 60% |

### 8.2 Testes E2E

| Fluxo | Prioridade |
|-------|------------|
| Conexão WS + reconexão | P0 |
| Novo lead real-time | P0 |
| Chat envio/recebimento | P0 |
| Copilot streaming | P0 |
| Mode switching | P1 |
| Mentions | P1 |
| Templates | P2 |

### 8.3 Load Testing

| Cenário | Passe |
|---------|-------|
| 100 conexões WS simultâneas | < 50ms latência |
| 1000 mensagens/min | Zero drops |
| 10 broadcast/sec | < 100ms propagação |

---

## 9. 🚀 Rollout Strategy

### 9.1 Feature Flags

```typescript
const features = {
  'realtime_leads': true,      // Fase 1
  'quick_chat': false,         // Fase 1 (depois)
  'copilot_streaming': false,  // Fase 2
  'unified_shell': false,      // Fase 3
  'mentions': false,           // Fase 3
  'templates': false,          // Fase 3
};
```

### 9.2 Rollout Gradual

| Fase | Audiência | Duração |
|------|-----------|---------|
| Alpha | Team interno | 1 semana |
| Beta | 10% usuários | 1 semana |
| Rollout | 50% usuários | 1 semana |
| GA | 100% | — |

---

## 10. 📅 Cronograma Final

```
2026
Fev                              Mar                              Abr
W06   W07   W08   W09   W10   W11   W12   W13   W14   W15   W16
│     │     │     │     │     │     │     │     │     │     │
├─────┴─────┤                                                    
│  FASE 0   │  Infraestrutura WebSocket + Redis
│           │
├───────────┴───────────┬───────────┘
│      FASE 1           │  SalesMode Evolution + Chat
│                       │
├───────────────────────┴───────────┤
│            FASE 2                 │  Copilot Streaming
│                                   │
├───────────────────────────────────┴───────────────────────────┤
│                      FASE 3                                    │  Unificação + Features
│                                                                │
├────────────────────────────────────────────────────────────────┴──────┤
│                           FASE 4                                       │  Polish
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

Releases:
         ──────►          ──────────────►      ────────────►     ────►
         Infra OK         Real-time +          Streaming        GA
         (interno)        Chat (beta)          (beta)          Release
```

---

## 11. ✅ Checklist de Aprovação Final

### Pré-Requisitos
- [x] Opção D aprovada
- [ ] Budget Redis aprovado (~$50/mês)
- [ ] Equipe alocada para 7 sprints
- [ ] Ambiente staging disponível
- [ ] Feature flags configurados

### Por Fase
- [ ] **Fase 0:** WS conectando, Redis OK
- [ ] **Fase 1:** Real-time leads, chat inline
- [ ] **Fase 2:** Copilot streaming
- [ ] **Fase 3:** Shell unificado, features avançadas
- [ ] **Fase 4:** Polish, performance

### Release Criteria
- [ ] Zero regressões em features existentes
- [ ] Performance dentro dos targets
- [ ] Testes E2E passando
- [ ] Documentação atualizada
- [ ] User acceptance testing aprovado

---

## 📎 Anexos

1. [ANALISE_ALTERNATIVAS_ARQUITETURAIS.md](ANALISE_ALTERNATIVAS_ARQUITETURAIS.md)
2. [COMPARATIVO_VISUAL_OPCOES.md](COMPARATIVO_VISUAL_OPCOES.md)
3. [ESTUDO_VIABILIDADE_ARQUITETURA_HIBRIDA.md](ESTUDO_VIABILIDADE_ARQUITETURA_HIBRIDA.md)
4. [ANALISE_AS_IS_SISTEMA.md](ANALISE_AS_IS_SISTEMA.md)

---

**Assinaturas de Aprovação:**

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| Product Owner | _______________ | 05/02/2026 | ✅ Aprovado |
| Tech Lead | _______________ | ____/____/____ | _______________ |
| Dev Lead | _______________ | ____/____/____ | _______________ |

---

*Plano Mestre v1.0 — Arquitetura Híbrida Contextual*
*Quarks OS — Solar CRM + Copilot IA*
