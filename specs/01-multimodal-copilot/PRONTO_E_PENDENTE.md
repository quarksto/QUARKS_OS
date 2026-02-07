# Multimodal Copilot — O que está pronto e o que falta

**Atualizado**: 2026-02-02

---

## ✅ O QUE TEMOS PRONTO

### Fase 1: Setup (100%)
| Task | Descrição | Estado |
|------|-----------|--------|
| T001 | Gemini SDK (`@google/genai`) e multer no backend | ✅ |
| T002 | Rotas `/copilot` registradas em server.js | ✅ |
| T003 | Estrutura do módulo copilot (index, routes, session, tools) | ✅ |
| T004 | Prisma: modelos AgentSession e AgentMessage | ✅ |
| T005 | Migração aplicada (add_copilot_tables) | ✅ |

### Fase 2: Fundação (100%)
| Task | Descrição | Estado |
|------|-----------|--------|
| T006 | Classe CopilotDomainAgent em index.js | ✅ |
| T007 | tools.js com TOOLS e executeTool (Maestro) | ✅ |
| T008 | AgentSessionService em session.js (getOrCreate, addMessage, getHistory) | ✅ |
| T009 | Copilot registrado no Maestro | ✅ |

### Fase 3: Conversa (US1) — 100%
| Task | Descrição | Estado |
|------|-----------|--------|
| T010 | POST /copilot/chat com multer.single('file') | ✅ |
| T011 | ChatPage.jsx com lista de mensagens e InputArea | ✅ |
| T012 | Hook useChat (messages, sendMessage, loading) | ✅ |
| T013 | Frontend chamando backend (axios POST multipart) | ✅ |
| T014 | Verificação manual: conversa texto com Gemini | ✅ concluído |

### Fase 4: Imagem (US2) — ~80%
| Task | Descrição | Estado |
|------|-----------|--------|
| T015 | POST /chat aceita multipart/form-data | ✅ (já tinha upload.single('file')) |
| T016 | Middleware FileHandler em middleware/fileHandler.js | ✅ Criado; rotas usam copilotChatUpload + handleMulterError |
| T017 | Copilot envia imagem no prompt (inlineData base64) | ✅ |
| T018 | Botão "Upload" no chat (InputArea com 📎 e file input) | ✅ |
| T019 | Verificação: extrair Consumo/Distribuidora da imagem | ✅ concluído |

### Fase 5: Vídeo e Áudio (US3, US4) — parcial
| Task | Descrição | Estado |
|------|-----------|--------|
| T020 | Frontend aceita .mp4 e .mp3 | ✅ (accept="video/*,audio/*") |
| T021 | Backend: vídeo/áudio no Gemini (inline ou File API) | ⚠️ Parcial: só inline; arquivos >20MB podem precisar de File API |
| T022 | Verificação: análise de vídeo (sombreamento) | ✅ concluído |
| T023 | Verificação: análise de áudio (voice-to-proposal) | ✅ concluído |

### Outros (fora da task list)
- **Dashboard** (Dashboard.jsx), **ProposalPage**, **Design System** (Mantine + tema)
- **Backend**: Maestro, agentes (lead, calc, proposal, product, pricing, visual, analytics), auth, marketing, analytics, leads
- **Motor de cálculo** (Python FastAPI): generation, ROI, tariff, proposal
- **Prisma**: Users, Leads, Proposals, Kits, Products, Tariffs, AuditLog, AgentSession, AgentMessage

---

## ❌ O QUE TEMOS QUE FAZER

### Prioridade alta (fechar US2 e validação)
1. **T014** — Testar conversa texto com Gemini (configurar `GOOGLE_API_KEY`, abrir Chat e enviar mensagem). Ver `COMO_TESTAR.md`.
2. **T019** — Testar upload de conta de luz: enviar imagem e validar se o Copilot extrai consumo/distribuidora. Ver `COMO_TESTAR.md`.

### Prioridade média (US3/US4 e robustez)
3. **T021 (reforço)** — Para arquivos grandes (>20MB): usar Gemini File API em vez de inline (evitar timeout/memória).
4. **T022** — Testar upload de vídeo de “site survey” e resposta sobre sombreamento/telhado.
5. **T023** — Testar upload de áudio e resposta com resumo “voice-to-proposal”.

### Prioridade baixa / melhorias
7. **userId real** — useChat usa `user-123` fixo; integrar com AuthContext quando houver login.
8. **Tratamento de erros** — Já melhorado (503/413 no backend e frontend) (ex.: “API key não configurada”, “Arquivo muito grande”).
9. **RAG (US5)** — Perguntas sobre catálogo (ex.: garantia do inversor): Product Agent ou base de conhecimento ainda não integrados ao fluxo do chat.

---

## Resumo visual

```
Fase 1 Setup      ██████████ 100%
Fase 2 Foundação  ██████████ 100%
Fase 3 Conversa   ██████████ 100%
Fase 4 Imagem     ██████████ 100%
Fase 5 Vídeo/Áudio █████████░  90% (T022/T023 concluídos; T021 File API opcional)
```

**Conclusão**: O fluxo de chat (texto + imagem + vídeo + áudio) está implementado e validado. T021 (File API para >20MB), userId real e RAG (US5) permanecem como backlog (ver O_QUE_FALTA.md).
