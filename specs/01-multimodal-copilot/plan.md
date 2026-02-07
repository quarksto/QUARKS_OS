# Implementation Plan: Multimodal Sales Copilot

**Branch**: `01-multimodal-copilot` | **Date**: 2026-02-02 | **Spec**: [spec.md](../spec.md)
**Input**: Feature specification from `specs/01-multimodal-copilot/spec.md`

## Summary

Implement a multimodal chatbot ("Sales Copilot") powered by **Gemini 3** that assists sales representatives by generating proposals from natural language and analyzing energy bills via image upload. Integration involves a new Frontend Chat Interface, a Backend Agent (`CopilotAgent`), and extensions to `Maestro` to expose existing business logic as "Tools" for the LLM.

## Technical Context

**Language/Version**: Node.js v18+ (Backend), React 18 (Frontend)
**Primary Dependencies**: `@google/generative-ai` (Gemini SDK), `multer` (File Uploads)
**Storage**: PostgreSQL (Conversation History in `AgentSession`)
**Testing**: Jest (Backend), Vitest (Frontend), Manual Verification
**Target Platform**: Web Application
**Project Type**: Full Stack Web App
**Performance Goals**: Chat response < 3s (Text), Image Analysis < 10s
**Constraints**: Must use existing `Maestro` architecture; No new microservices (Monolith-ish modular).
**Scale/Scope**: Session-based memory (no long-term vector DB yet).

## Constitution Check

*GATE: Passed. Feature aligns with "Modular Monolith" and "Agentic Architecture" principles of Quarks OS.*

## Project Structure

### Documentation (this feature)

```text
specs/01-multimodal-copilot/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── checklists/          # Validation checks
```

### Source Code

```text
src/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── copilot/           # [NEW] Copilot Module
│   │   │       ├── index.js       # Agent Logic
│   │   │       ├── tools.js       # Tool Definitions (Maestro Bindings)
│   │   │       └── routes.js      # API Endpoints
│   │   ├── orchestrator/
│   │   │   └── maestro.js         # [MODIFY] Register CopilotAgent
│   │   └── server.js              # [MODIFY] Register Routes
│   └── prisma/
│       └── schema.prisma          # [MODIFY] Add Session Models
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── ChatPage.jsx       # [NEW] Chat Interface
│   │   ├── components/
│   │   │   └── chat/              # [NEW] Chat Components
│   │   └── services/
│   │       └── copilot.js         # [NEW] API Service
```

**Structure Decision**: Standard "Module" pattern within existing Backend/Frontend directories.

## Phase 0: Research (Summary)

**Gemini Integration**:
-   **Decision**: Use `@google/generative-ai` SDK (configured for Gemini 3 models).
-   **Rationale**: User mandate for Gemini 3 capabilities.
-   **Tools**: Function Calling via `tools` parameter required.

**State Management**:
-   **Decision**: Postgres Table `CopilotSession`.
-   **Rationale**: Simple, adequate for current scope. Avoids overhead of Redis/VectorDB for MVP.

**File Handling**:
-   **Decision**: `multer` middleware -> Buffer -> Base64 for Gemini.
-   **Rationale**: Avoids S3 complexity for transient analysis files.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New Module | Distinct logic for LLM orchestration | Putting checks in `Maestro` directly would bloat the Orchestrator. |
