# 📋 Tasks — Arquitetura Híbrida Contextual

**Projeto:** Quarks OS  
**Objetivo:** Implementar Arquitetura Híbrida Contextual (Opção D)  
**Score Alvo:** 9.5+/10  
**Data Início:** 2026-02-05  
**Duração:** 7 sprints (~14 semanas)

---

## 📊 Progresso Geral

| Fase | Status | Progresso | Sprint |
|------|--------|-----------|--------|
| Fase 0: Infraestrutura | ✅ Concluído | 100% | 1 |
| Fase 1: SalesMode Evolution | ✅ Concluído | 100% | 2-3 |
| Fase 2: Copilot Streaming | ✅ Concluído | 100% | 4 |
| Fase 3: Unificação | ✅ Concluído | 100% | 5-6 |
| Fase 4: Polish | 🏗️ Iniciado | 10% | 7 |

**Total:** 82% completo

---

## 🏗️ Fase 0: Infraestrutura Base (✅ 100%)

### Backend
- [X] **B0.1** Instalar e configurar Socket.io no Express
- [X] **B0.2** Configurar Redis (local + staging)
- [X] **B0.3** Criar adapter Redis para Socket.io
- [X] **B0.4** Implementar WebSocket Gateway básico
- [X] **B0.5** Criar middleware de autenticação WS
- [X] **B0.6** Implementar pub/sub básico com Redis
- [X] **B0.7** Criar logging e monitoring para WS
- [X] **B0.8** Testes de conexão/reconexão

### Frontend
- [X] **F0.1** Criar RealtimeProvider (Context)
- [X] **F0.2** Implementar cliente Socket.io
- [X] **F0.3** Auto-reconexão com backoff exponencial
- [X] **F0.4** Fallback para polling quando WS falha
- [X] **F0.5** Indicador visual de conexão
- [X] **F0.6** Testes de integração WS

---

## 📱 Fase 1: SalesMode Evolution (✅ 100%)

### Sprint 2: Real-time Leads
- [X] **S2.1** Broadcast de novos leads via WS
- [X] **S2.2** Broadcast de status changes via WS
- [X] **S2.3** Atualizar ConversationList com WS events
- [X] **S2.4** Animação de entrada de novo lead
- [X] **S2.5** Implementar modelo Message no Prisma
- [X] **S2.6** Migration para novos campos Lead
- [X] **S2.7** CRUD Message (create, list, mark read)
- [X] **S2.8** Implementar unread count
- [X] **S2.9** Badge de não lidos na ConversationList
- [X] **S2.10** Indicador de lead "quente"

### Sprint 3: Chat Integrado
- [X] **S3.1** Novo componente: QuickChatPanel
- [X] **S3.2** Integrar QuickChatPanel no LeadContextPanel
- [X] **S3.3** Timeline de mensagens (scroll funcional)
- [X] **S3.4** Envio de mensagem com optimistic update
- [X] **S3.5** Indicador "digitando..."
- [X] **S3.6** Message delivery status (sent/read marks)
- [X] **S3.7** Notificações browser (Web Notifications API)
- [X] **S3.8** Som de notificação (configurável)

---

## 🤖 Fase 2: Copilot Streaming (✅ 100%)

- [X] **C4.1** Refatorar CopilotDomainAgent para streaming (8h)
- [X] **C4.2** Implementar Gemini stream via WS (6h)
- [X] **C4.3** Evento copilot:stream_chunk (4h)
- [X] **C4.4** Atualizar CopilotSidebar para streaming (6h)
- [X] **C4.5** Indicador "Copilot está pensando..." (2h)
- [X] **C4.6** Animação de palavras aparecendo (Visual Streaming) (4h)
- [X] **C4.7** Tool use feedback visual (dentro do stream) (4h)
- [X] **C4.8** Integrar Copilot no SalesMode shell (6h)
- [X] **C4.9** CopilotBar (barra inferior flutuante premium) (6h)
- [X] **C4.10** Quick actions do Copilot no contexto (4h)

---

## 🔄 Fase 3: Unificação e Modos (✅ 100%)

### Sprint 5: Shell Unificado & Roteamento
- [X] **U5.1** Novo componente: UnifiedShell (Orquestrador) (4h)
- [X] **U5.2** Novo componente: ModeSwitcher (SegmentedControl) (3h)
- [X] **U5.3** Transições animadas entre modos (Fade/Blur) (4h)
- [X] **U5.4** Roteamento Inteligente (Workspace vs Dashboard) (4h)
- [X] **U5.5** Context de modo (ModeProvider) persistente (2h)

### Sprint 6: Controle & Contexto
- [X] **U6.1** Atalhos Globais Unificados (Alt+1/2/3, Ctrl+J/K, Esc) (4h)
- [X] **U6.2** Tool: switch_mode (IA controla a interface) (4h)
- [X] **U6.3** Context Insight (IA entende o modo atual) (4h)
- [X] **U6.4** Integração do CopilotBar em todos os contextos (3h)

---

## ✨ Fase 4: Polish & Performance (🏗️ 10%)

- [ ] **P7.1** Lazy loading de shells pesados (4h)
- [ ] **P7.2** Skeleton screens premium durante transição (4h)
- [ ] **P7.3** Otimização de renderização (React.memo no pipeline) (6h)
- [X] **P7.4** Som de transição de modo (Sutil) (2h)
- [ ] **P7.5** Feedback háptico (se mobile) (2h)

---

## 🔄 Changelog

| Data | Versão | Mudança |
|------|--------|---------|
| 2026-02-05 | 1.3 | Fase 3 concluída. UnifiedShell, ModeSwitcher e IA de controle operacional. |
| 2026-02-05 | 1.2 | Fase 2 (Streaming) concluída. Copilot agora responde em tempo real via WS. |
| 2026-02-05 | 1.1 | Fase 0 concluída. Chat real-time implementado. |
| 2026-02-05 | 1.0 | Criação inicial |
