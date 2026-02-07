# Task List: Multimodal Sales Copilot

**Feature**: `multimodal-copilot`
**Branch**: `01-multimodal-copilot`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup

Setup tasks for project initialization.

- [x] T001 [P] Install Gemini SDK (`@google/genai`) and `multer` in Backend
- [x] T002 Update `server.js` to register `copilot` routes
- [x] T003 [P] Create `Copilot` module directory structure
- [x] T004 [P] Update Prisma Schema with `AgentSession` and `AgentMessage` models
- [x] T005 Run Prisma Migration to create new tables

## Phase 2: Foundational

Blocking prerequisites for all user stories.

- [x] T006 Implement `CopilotDomainAgent` class in `copilot/index.js`
- [x] T007 Implement `ToolRegistry` in `copilot/tools.js` wrapping `Maestro` calls
- [x] T008 [P] Implement `AgentSessionService` in `copilot/session.js`
- [x] T009 Register `copilot` agent in `orchestrator/maestro.js`

## Phase 3: Conversation (US1)

User Story 1: Conversational Proposal Generation

- [x] T010 [US1] Implement `POST /copilot/chat` endpoint
- [x] T011 [US1] Create `ChatPage.jsx` layout
- [x] T012 [US1] Implement React `useChat` hook
- [x] T013 [US1] Connect Frontend Chat to Backend API
- [x] T014 [US1] Verify basic text conversation (Ping/Pong with Gemini) — *teste manual*

## Phase 4: Image Analysis (US2)

User Story 2: Bill Analysis via Image

- [x] T015 [US2] POST /chat accepts `multipart/form-data` (multer in routes)
- [x] T016 [US2] Implement `FileHandler` middleware in `middleware/fileHandler.js`
- [x] T017 [US2] CopilotAgent handles image parts (inlineData) in Gemini prompt
- [x] T018 [US2] "Upload" button in Chat (InputArea with file input)
- [x] T019 [US2] Verify Image Analysis extracting Consumption/Distributor — *teste manual*

## Phase 5: Video & Audio (US3, US4)

User Stories 3 & 4: Site Survey Video & Voice Notes (Gemini 3)

- [x] T020 [US3] Frontend accepts `.mp4` and `.mp3` (accept="video/*,audio/*")
- [ ] T021 [US3] Video/Audio: add Gemini File API for files >20MB if needed
- [x] T022 [US3] Verify Video Analysis (Shading Detection) — *teste manual*
- [x] T023 [US4] Verify Audio Analysis (Voice-to-Proposal) — *teste manual*

## Dependencies

1.  Setup (T001-T005) -> Phase 2
2.  Foundational (T006-T009) -> Phase 3, 4, 5
3.  Conversation (T010-T014) -> Phase 4, 5
4.  Image Analysis (T015-T019) -> Independent of 5, but relies on 3
