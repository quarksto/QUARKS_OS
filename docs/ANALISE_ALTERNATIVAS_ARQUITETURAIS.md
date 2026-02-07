# 🔄 Análise de Alternativas Arquiteturais — Evolução Natural do Quarks OS

**Data:** 2026-02-05  
**Versão:** 2.0  
**Objetivo:** Análise profunda do estilo WhatsApp Web puro + alternativas não pensadas + recomendação evolutiva

---

## 📑 Índice

1. [Descoberta: O Que Já Temos](#1-descoberta-o-que-já-temos)
2. [Opção A: WhatsApp Web Style Puro](#2-opção-a-whatsapp-web-style-puro)
3. [Opção B: Evolução Incremental (Já Iniciada)](#3-opção-b-evolução-incremental-já-iniciada)
4. [Opção C: Arquitetura "Notion-like"](#4-opção-c-arquitetura-notion-like)
5. [Opção D: Arquitetura Híbrida Contextual](#5-opção-d-arquitetura-híbrida-contextual)
6. [O Que Não Foi Pensado](#6-o-que-não-foi-pensado)
7. [Matriz Comparativa](#7-matriz-comparativa)
8. [Recomendação Final](#8-recomendação-final)
9. [Plano de Implementação](#9-plano-de-implementação)

---

## 1. 🔍 Descoberta: O Que Já Temos

### 1.1 Componentes Híbridos Existentes

O sistema **já possui uma base sólida** para experiência WhatsApp Web:

```
src/frontend/src/hybrid/
├── HybridShell.jsx        ← Shell principal (357 linhas, bem desenvolvido)
├── HybridSidebar.jsx      ← Sidebar colapsável (82 linhas)
├── ConversationList.jsx   ← Lista de leads/conversas (199 linhas)
├── LeadContextPanel.jsx   ← Painel de contexto (218 linhas)
└── LeadDetailDrawer.jsx   ← Drawer de detalhes (192 linhas)
```

**TOTAL: ~1.050 linhas de código híbrido já implementado!**

### 1.2 Funcionalidades Já Implementadas

| Funcionalidade | Status | Componente |
|----------------|--------|------------|
| Lista de leads estilo WhatsApp | ✅ | `ConversationList.jsx` |
| Busca com Ctrl+K | ✅ | `HybridShell.jsx` |
| Navegação por teclado (↑↓) | ✅ | `HybridShell.jsx` |
| Seleção de lead com destaque | ✅ | `ConversationList.jsx` |
| Painel de contexto | ✅ | `LeadContextPanel.jsx` |
| Drawer de detalhes | ✅ | `LeadDetailDrawer.jsx` |
| Integração com Copilot | ✅ | `onOpenCopilot` prop |
| Link WhatsApp direto | ✅ | Nos painéis de contato |
| Sidebar colapsável | ✅ | `HybridSidebar.jsx` |
| Badge de "Novo" (48h) | ✅ | `ConversationList.jsx` |
| Filtro por status | ✅ | `ConversationList.jsx` |
| Ordenação (recente/nome) | ✅ | `ConversationList.jsx` |

### 1.3 O Que Falta para WhatsApp Web Completo

| Funcionalidade | Status | Gap |
|----------------|--------|-----|
| Chat integrado no shell | ❌ | Chat está em `/chat` separado |
| Real-time updates (WebSocket) | ❌ | Usa polling |
| Notificações push | ❌ | Não implementado |
| Histórico de mensagens in-line | ❌ | Activity existe mas limitado |
| Indicador de "digitando..." | ❌ | Copilot não tem streaming |
| Status de lead em tempo real | ❌ | Polling |
| Unread count (não lidos) | ❌ | Não implementado |

---

## 2. 📱 Opção A: WhatsApp Web Style Puro

### 2.1 Conceito

Transformar o Quarks OS em uma experiência **100% messaging-centric**, onde:
- O **Lead é uma conversa**
- Todas as interações são **mensagens no timeline**
- O Copilot é um **participante da conversa**
- Propostas são **cards dentro da conversa**

### 2.2 Como Ficaria

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quarks OS                                    🔍 Buscar (Ctrl+K)   👤    │
├──────────┬─────────────────────────────────────────────────────┬────────┤
│  SIDEBAR │  LISTA DE LEADS (Conversas)                         │ CHAT   │
│  ────────│  ─────────────────────────────────────              │        │
│ Dashboard│ ┌────────────────────────────────────┐              │ Maria  │
│ Workspace│ │ 🟢 João Silva        Há 2 min      │              │ Santos │
│ Funil    │ │ "Proposta enviada ontem..."        │              │────────│
│ Leads    │ ├────────────────────────────────────┤              │        │
│ Propostas│ │ ● Pedro Costa        Há 15 min     │              │ [msgs] │
│ Settings │ │ "Qual o prazo de entrega?"         │              │        │
│          │ ├────────────────────────────────────┤              │        │
│          │ │ ○ Ana Oliveira       Ontem         │              │        │
│          │ │ "Aguardando retorno..."            │              │ [card] │
│          │ └────────────────────────────────────┘              │Proposta│
│          │                                                      │        │
│          │  + Novo Lead                                         │ ______ │
│          │                                                      │ [Send] │
├──────────┴──────────────────────────────────────────────────────┴────────┤
│ 💡 Copilot: Posso ajudar? | 📊 Dashboard | 📄 Nova Proposta | ⚙️ Config  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Modelo de Dados Necessário

```prisma
model Message {
  id          String   @id @default(uuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])
  
  senderType  SenderType  // SYSTEM | USER | COPILOT | EXTERNAL
  senderId    String?     // userId ou null para system
  content     String
  contentType ContentType // TEXT | PROPOSAL_CARD | FILE | AUDIO | IMAGE
  metadata    Json?       // { proposalId, fileUrl, etc }
  
  read        Boolean  @default(false)
  readAt      DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Para threading
  replyToId   String?
  replyTo     Message? @relation("replies", fields: [replyToId], references: [id])
  replies     Message[] @relation("replies")
}

enum SenderType {
  SYSTEM
  USER
  COPILOT
  EXTERNAL  // WhatsApp via webhook
}

enum ContentType {
  TEXT
  PROPOSAL_CARD
  FILE
  AUDIO
  IMAGE
  STATUS_CHANGE
  ACTIVITY
}
```

### 2.4 Prós e Contras

| ✅ Prós | ❌ Contras |
|--------|-----------|
| UX familiar (WhatsApp) | Mudança radical de paradigma |
| Histórico unificado | Modelo de dados novo |
| Copilot integrado naturalmente | Não é ideal para tudo |
| Mobile-first por natureza | Kanban fica secundário |
| Engajamento alto | Curva de aprendizado |

### 2.5 Esforço Estimado

| Componente | Esforço | Notas |
|------------|---------|-------|
| Modelo Message | 1 sprint | Schema + migrations |
| Migração Activity → Message | 1 sprint | Conversão de dados |
| UI Chat integrado | 2 sprints | Novo ChatPanel |
| WebSocket | 1 sprint | Já previsto |
| Backend Messages | 1 sprint | CRUD + streaming |
| **TOTAL** | **6 sprints** | ~12 semanas |

---

## 3. 📈 Opção B: Evolução Incremental (Já Iniciada)

### 3.1 Conceito

Continuar evoluindo o que já existe no `/workspace`, adicionando:
- WebSocket para real-time
- Streaming do Copilot
- Notificações
- Chat in-line opcional

### 3.2 Como Ficaria

Mantém a estrutura atual do `HybridShell`, mas evolui:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quarks OS                                    🔍 Buscar (Ctrl+K)   👤    │
├──────────┬────────────────────────┬─────────────────────────────────────┤
│  SIDEBAR │  LEADS (já existe)     │  PAINEL DE CONTEXTO (já existe)     │
│  ────────│  ─────────────────     │  ────────────────────────────       │
│          │ ┌──────────────────┐   │                                     │
│          │ │ 🟢 João Silva    │   │  João Silva                         │
│          │ │ PROPOSTA_SENT    │   │  ──────────────                     │
│          │ ├──────────────────┤   │  Status: [dropdown ▼]               │
│          │ │ ● Pedro Costa    │   │                                     │
│          │ │ NEW (48h) ⚡     │   │  📧 joao@email.com  📋              │
│          │ ├──────────────────┤   │  📱 (11) 9999-9999  [WhatsApp]      │
│          │ │ ...              │   │                                     │
│          │ └──────────────────┘   │  ────────────────────────────       │
│          │                        │  📊 Consumo: 450 kWh                │
│          │  NOVO: Indicador       │  📍 Local: São Paulo, SP            │
│          │  de atividade real-    │  💰 Potencial: R$ 45.000            │
│          │  time (WS)             │                                     │
│          │                        │  NOVO: Timeline de mensagens        │
│          │                        │  ┌────────────────────────────┐     │
│          │                        │  │ 💬 Chat rápido             │     │
│          │                        │  │ __________________________ │     │
│          │                        │  │ [Enviar]                   │     │
│          │                        │  └────────────────────────────┘     │
└──────────┴────────────────────────┴─────────────────────────────────────┘
```

### 3.3 Implementação Incremental

| Sprint | Feature | Componente |
|--------|---------|------------|
| 1 | WebSocket básico | Server + Client |
| 2 | Leads real-time (novo lead aparece) | ConversationList |
| 3 | Status changes broadcast | HybridShell |
| 4 | Streaming Copilot | ChatPage/CopilotSidebar |
| 5 | Notificações browser | Service Worker |
| 6 | Quick chat no painel | LeadContextPanel |

### 3.4 Prós e Contras

| ✅ Prós | ❌ Contras |
|--------|-----------|
| Usa o que já existe | Menos revolucionário |
| Baixo risco | Não é "wow" como WhatsApp |
| Implementação gradual | Pode ficar fragmentado |
| Mantém workflows atuais | Chat ainda separado |
| Users não precisam reaprender | |

### 3.5 Esforço Estimado

| Componente | Esforço | Notas |
|------------|---------|-------|
| WebSocket infra | 1 sprint | Socket.io + Redis |
| Real-time leads | 0.5 sprint | Broadcast simples |
| Status broadcast | 0.5 sprint | Idem |
| Streaming Copilot | 1.5 sprint | Gemini SDK |
| Notificações | 0.5 sprint | Web Notifications API |
| Quick chat | 1 sprint | Novo componente |
| **TOTAL** | **5 sprints** | ~10 semanas |

---

## 4. 📝 Opção C: Arquitetura "Notion-like"

### 4.1 Conceito

Uma abordagem diferente: **tudo é um bloco**. Similar ao Notion:
- Lead é uma página com blocos
- Blocos podem ser: notas, propostas, tarefas, chat, arquivos
- Flexibilidade máxima

### 4.2 Como Ficaria

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quarks OS                                    🔍 Buscar (Ctrl+K)   👤    │
├──────────┬──────────────────────────────────────────────────────────────┤
│  SIDEBAR │                                                              │
│  ────────│  📄 João Silva                                    [⋮ Menu]  │
│ Dashboard│  ════════════════════════════════════════════════════════    │
│ Workspace│                                                              │
│ ─────────│  [⚡ Status: PROPOSTA_SENT ▼]  [💰 R$ 45.000]                │
│  Recentes│                                                              │
│  ├ João  │  ────────────────────────────────────────────────────────    │
│  ├ Pedro │                                                              │
│  └ Maria │  📊 Dados do Cliente           [+ Novo Bloco]                │
│          │  ┌─────────────────────────────────────────────────────┐     │
│ Funil    │  │ Consumo: 450 kWh | Local: São Paulo               │     │
│ Leads    │  │ Email: joao@... | Tel: (11)...                    │     │
│ Propostas│  └─────────────────────────────────────────────────────┘     │
│ Settings │                                                              │
│          │  📄 Proposta Solar #1234                                     │
│          │  ┌─────────────────────────────────────────────────────┐     │
│          │  │ 7.5 kWp | R$ 42.000 | Payback: 4.2 anos            │     │
│          │  │ [Ver Proposta] [Editar] [Duplicar]                 │     │
│          │  └─────────────────────────────────────────────────────┘     │
│          │                                                              │
│          │  💬 Notas e Histórico                                        │
│          │  ┌─────────────────────────────────────────────────────┐     │
│          │  │ [Chat-like com notas, mentions, etc]               │     │
│          │  └─────────────────────────────────────────────────────┘     │
│          │                                                              │
│          │  [+ Nota] [+ Tarefa] [+ Arquivo] [🤖 Copilot]               │
└──────────┴──────────────────────────────────────────────────────────────┘
```

### 4.3 Prós e Contras

| ✅ Prós | ❌ Contras |
|--------|-----------|
| Flexibilidade máxima | Complexidade alta |
| Diferencial competitivo | Muito diferente do padrão |
| Extensível | Curva de aprendizado |
| Colaboração natural | Implementação longa |
| Familiar (Notion popular) | Overkill para alguns casos |

### 4.4 Esforço Estimado

**8-10 sprints** — Muito alto para o momento atual.

---

## 5. 🎯 Opção D: Arquitetura Híbrida Contextual (NOVA)

### 5.1 Conceito

**Minha recomendação**: Uma arquitetura que **adapta a interface ao contexto**:
- No **CRM/Vendas**: Estilo WhatsApp (conversas)
- No **Dashboard**: Visualização analítica
- No **Projeto/Instalação**: Estilo Kanban/Project
- O Copilot é **onipresente** e contextual

### 5.2 Como Ficaria

A interface muda conforme o **modo de trabalho**:

```
MODO VENDAS (WhatsApp-like) - Acessado via /workspace
┌────────────────────────────────────────────────────────────────────────────┐
│  🔷 Quarks OS    [Modo: 📞 Vendas ▼]           🔍 Buscar (Ctrl+K)    👤     │
├──────────┬───────────────────────────────┬────────────────────────────────┤
│ SIDEBAR  │ LEADS (Conversas)             │ LEAD SELECIONADO + CHAT        │
│          │ ┌─────────────────────────┐   │                                │
│          │ │ 🟢 João - Há 2min       │   │  João Silva                    │
│          │ │ "Quando começa?"        │   │  ──────────────────            │
│          │ ├─────────────────────────┤   │  [Timeline de interações]      │
│          │ │ ● Pedro - Há 15min      │   │                                │
│          │ │ "Proposta enviada"      │   │  ┌────────────────────────┐    │
│          │ └─────────────────────────┘   │  │ Chat direto            │    │
│          │                               │  └────────────────────────┘    │
│          │ [🤖 Copilot sugerindo]        │  [📄 Criar Proposta]           │
└──────────┴───────────────────────────────┴────────────────────────────────┘

MODO GESTÃO (Dashboard-like) - Acessado via /dashboard
┌────────────────────────────────────────────────────────────────────────────┐
│  🔷 Quarks OS    [Modo: 📊 Gestão ▼]           🔍 Buscar (Ctrl+K)    👤     │
├──────────┬─────────────────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                                 │
│          │  📊 KPIs               📈 Pipeline                              │
│          │  ┌──────────────────┐  ┌──────────────────────────────────────┐ │
│          │  │ 45 Leads         │  │ NEW → CONTACTED → PROPOSAL → WON     │ │
│          │  │ R$ 2.3M em pipe  │  │ [Kanban visual]                      │ │
│          │  └──────────────────┘  └──────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────────────────────┘

MODO PROJETO (Project-like) - Futuro /projetos
┌────────────────────────────────────────────────────────────────────────────┐
│  🔷 Quarks OS    [Modo: 🔧 Projeto ▼]          🔍 Buscar (Ctrl+K)    👤     │
├──────────┬─────────────────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                                 │
│ Projetos │  📋 Instalação Solar - João Silva                               │
│ ├─ João  │  ════════════════════════════════════════════════════════       │
│ └─ Pedro │                                                                 │
│          │  Etapas: [Compra ✓] → [Entrega ✓] → [Instalação 🔄] → [Vistoria]│
│          │                                                                 │
│          │  Tarefas Pendentes:                                             │
│          │  ☐ Agendar instalação                                          │
│          │  ☐ Confirmar equipe                                            │
└──────────┴─────────────────────────────────────────────────────────────────┘
```

### 5.3 Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ SalesMode  │ │ManageMode  │ │ProjectMode │ │ CopilotHub │   │
│  │ (WhatsApp) │ │(Dashboard) │ │ (Kanban)   │ │ (Global)   │   │
│  └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘   │
│         └──────────────┴──────────────┴──────────────┘          │
│                           │                                      │
│              ┌────────────▼────────────┐                        │
│              │    Context Manager      │                        │
│              │  (mode, entity, user)   │                        │
│              └────────────┬────────────┘                        │
│                           │                                      │
│              ┌────────────▼────────────┐                        │
│              │   WebSocket + REST      │                        │
│              │   Unified Data Layer    │                        │
│              └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Prós e Contras

| ✅ Prós | ❌ Contras |
|--------|-----------|
| Melhor de cada mundo | Mais complexo que B |
| Contexto apropriado | Precisa de estados de modo |
| Escalável para novos modos | Design consistente é crítico |
| Copilot unificado | |
| Evolução natural do existente | |

### 5.5 Esforço Estimado

| Componente | Esforço | Notas |
|------------|---------|-------|
| WebSocket infra | 1 sprint | Socket.io + Redis |
| Context Manager | 0.5 sprint | React Context + Routes |
| SalesMode evolution | 2 sprints | Evoluir HybridShell |
| Streaming Copilot | 1.5 sprint | Gemini SDK |
| Quick chat in panel | 1 sprint | Novo componente |
| Mode switcher UI | 0.5 sprint | Header component |
| **TOTAL** | **6.5 sprints** | ~13 semanas |

---

## 6. 🔎 O Que Não Foi Pensado

### 6.1 Funcionalidades Ignoradas

| Gap | Descrição | Impacto |
|-----|-----------|---------|
| **Unread/Não Lido** | Leads sem atividade recente do usuário | Alto - UX essencial |
| **Mentions (@)** | Mencionar colegas em notas/chat | Alto - Colaboração |
| **Reactions** | Reagir a mensagens/atividades | Médio - Engajamento |
| **Pinned Leads** | Fixar leads importantes no topo | Médio - Produtividade |
| **Quick Actions** | Ações rápidas sem abrir modal | Alto - Eficiência |
| **Smart Templates** | Templates de mensagem com variáveis | Alto - Produtividade |
| **Follow-up Alerts** | Alertas de leads sem contato | Alto - Vendas |
| **Typing Indicator** | Ver quando colega está escrevendo | Médio - Colaboração |
| **Presence/Status** | Ver quem está online | Baixo - Nice to have |
| **Voice Notes** | Gravar nota de voz para lead | Médio - Mobile |

### 6.2 Melhorias Estruturais Não Pensadas

| Gap | Descrição | Por que importa |
|-----|-----------|-----------------|
| **Unified Activity Model** | Activity e Chat são modelos separados | Deveria ser um só |
| **Event Sourcing** | Não rastreamos eventos de forma auditável | Compliance, undo |
| **Optimistic Updates** | UI espera resposta do servidor | Percepção de lentidão |
| **Offline Mode** | Sem suporte offline | Mobile é crítico |
| **State Sync** | Cada aba tem seu estado | Conflitos possíveis |
| **Smart Notifications** | Notificações burras (ou nenhuma) | Fadiga de alertas |

### 6.3 Integrações Faltantes

| Integração | Status | Impacto |
|------------|--------|---------|
| **WhatsApp Business API** | ❌ Não integrado | Altíssimo - Canal principal |
| **Email Inbox** | ❌ Não integrado | Alto - Comunicação |
| **Calendário** | ❌ Não integrado | Médio - Agendamentos |
| **VoIP/Telefonia** | ❌ Não integrado | Médio - Ligações |
| **Documentos Cloud** | ❌ Não integrado | Baixo - Arquivos |

### 6.4 Performance Não Endereçada

| Issue | Atual | Ideal |
|-------|-------|-------|
| Polling interval | 30s | Real-time |
| Lista de leads | Carrega tudo | Virtualização |
| Imagens Copilot | Upload síncrono | Background upload |
| PDF Proposals | Geração síncrona | Queue + notificação |
| Search | API call sempre | Local index + API |

---

## 7. 📊 Matriz Comparativa

### 7.1 Scoring por Critério (1-10)

| Critério | Peso | A: WhatsApp Puro | B: Incremental | C: Notion | D: Contextual |
|----------|------|------------------|----------------|-----------|---------------|
| **UX Vendas** | 20% | 10 | 7 | 6 | 9 |
| **UX Gestão** | 15% | 4 | 8 | 7 | 9 |
| **Familiaridade** | 15% | 10 | 9 | 6 | 8 |
| **Esforço Impl.** | 15% | 5 | 8 | 3 | 6 |
| **Risco** | 10% | 4 | 9 | 3 | 7 |
| **Escalabilidade** | 10% | 7 | 6 | 10 | 9 |
| **Diferenciação** | 10% | 8 | 5 | 10 | 8 |
| **Reutilização** | 5% | 4 | 10 | 6 | 8 |
| **SCORE** | — | **6.75** | **7.45** | **6.05** | **8.05** |

### 7.2 Resumo Visual

```
                         ESFORÇO BAIXO
                              │
                              │    B (Incremental)
                              │    ⭐⭐⭐
                              │
     IMPACTO ─────────────────┼──────────────────── IMPACTO
      BAIXO                   │                      ALTO
                              │         D (Contextual)
                              │         ⭐⭐⭐⭐⭐
                 C (Notion)   │
                 ⭐           │    A (WhatsApp Puro)
                              │         ⭐⭐⭐⭐
                              │
                         ESFORÇO ALTO
```

---

## 8. 💡 Recomendação Final

### 8.1 Veredicto

> **RECOMENDAÇÃO: Opção D — Arquitetura Híbrida Contextual**
> 
> Com elementos da Opção A (WhatsApp) concentrados no modo Vendas.

### 8.2 Justificativa

1. **Evolui o que já existe** (1.050 linhas de código híbrido)
2. **WhatsApp Experience para vendas** (onde mais importa)
3. **Mantém Dashboard analítico** (gestores precisam)
4. **Prepara para Projetos** (roadmap PRD)
5. **Copilot unificado** (diferencial competitivo)
6. **Esforço razoável** (6.5 sprints vs 6 do WhatsApp puro)

### 8.3 Decisão por Componente

| Componente | Decisão | Prioridade |
|------------|---------|------------|
| `/workspace` | Evoluir para SalesMode (WhatsApp-like) | P0 |
| `/dashboard` | Manter como ManageMode | P0 |
| `/chat` | Migrar para dentro do SalesMode | P1 |
| `/funnel` | Integrar ao ManageMode | P2 |
| `/projetos` | Novo ProjectMode (futuro) | P3 |
| Copilot | Onipresente, streaming | P0 |

---

## 9. 📅 Plano de Implementação

### Fase 0: Infraestrutura (Sprint 1)

```
[ ] WebSocket (Socket.io) no backend
[ ] Redis para pub/sub
[ ] Cliente WebSocket no frontend
[ ] Reconexão automática
```

### Fase 1: SalesMode Evolution (Sprints 2-3)

```
[ ] Evoluir HybridShell com real-time
[ ] Broadcast de novos leads
[ ] Broadcast de status changes
[ ] Indicador de não lidos
[ ] Quick chat no LeadContextPanel
```

### Fase 2: Copilot Streaming (Sprint 4)

```
[ ] Streaming de respostas Gemini
[ ] Indicador "digitando..."
[ ] Integração contextual no SalesMode
```

### Fase 3: Unificação (Sprints 5-6)

```
[ ] Chat migrado para dentro do shell
[ ] Mode switcher no header
[ ] Notificações inteligentes
[ ] Unified Activity Model
```

### Fase 4: Polish (Sprint 7)

```
[ ] Mentions (@usuario)
[ ] Pinned leads
[ ] Quick actions
[ ] Smart templates
[ ] Follow-up alerts
```

---

## 10. 📎 Anexos

### A. Código Existente que Será Reutilizado

| Arquivo | Linhas | Reutilização |
|---------|--------|--------------|
| HybridShell.jsx | 357 | 80% |
| ConversationList.jsx | 199 | 90% |
| LeadContextPanel.jsx | 218 | 70% (add chat) |
| LeadDetailDrawer.jsx | 192 | 100% |
| HybridSidebar.jsx | 82 | 100% |
| **TOTAL** | **1.048** | **~85%** |

### B. Novos Componentes Necessários

| Componente | Responsabilidade | Esforço |
|------------|------------------|---------|
| QuickChat.jsx | Chat in-line no painel | 2 dias |
| ModeSwitcher.jsx | Alternar Vendas/Gestão | 0.5 dia |
| UnreadBadge.jsx | Indicador de não lidos | 0.5 dia |
| TypingIndicator.jsx | "Digitando..." | 0.5 dia |
| RealtimeProvider.jsx | Context para WS | 1 dia |

---

*Documento de análise de alternativas. Versão 2.0 com Opção D recomendada.*
