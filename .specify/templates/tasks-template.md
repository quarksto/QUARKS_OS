# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 2: Foundational

- [ ] T004 Setup database schema and migrations (if applicable)
- [ ] T005 [P] Implement base infrastructure
- [ ] T006 Create base models/entities

## Phase 3: User Story 1 (P1)

- [ ] T010 [US1] [Implementation task]
- [ ] T011 [US1] [Implementation task]

## Phase 4: User Story 2 (P2)

- [ ] T020 [US2] [Implementation task]
- [ ] T021 [US2] [Implementation task]

## Phase N: Polish

- [ ] TXXX [P] Documentation updates
- [ ] TXXX Run quickstart.md validation

## Dependencies

- Setup (Phase 1) -> Foundational (Phase 2) -> User Stories (Phase 3+)
- Each user story should be independently testable
