# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: [e.g., Node 20, Python 3.11 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, Prisma, Maestro or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, Prisma or N/A]  
**Testing**: [e.g., Jest, pytest, Vitest or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, Web or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file at .specify/memory/constitution.md]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── backend/
├── frontend/
├── calc_engine/
└── ...
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [if any] | [current need] | [why simpler insufficient] |
