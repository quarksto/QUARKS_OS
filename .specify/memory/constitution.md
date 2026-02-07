<!--
Sync Impact Report (2026-02-03)
- Version: Initial creation (v1.0.0)
- Added: All principle sections, governance
- Templates: N/A (initial)
-->

# QUARKS OS — Project Constitution

**Project**: Quarks OS — Solar Edition
**Constitution Version**: 1.0.0
**Ratification Date**: 2026-02-03
**Last Amended**: 2026-02-03

---

## 1. Project Identity

Quarks OS is a unified platform for solar energy integrators in Brazil, providing CRM, proposal generation, sizing, financial simulation, and an AI Copilot. The system serves Integrators, Engineering, and Commercial profiles.

---

## 2. Principles

### Principle 1: Python-First for Calculation Logic (MUST)

- **Rule**: Backend calculation logic (dimensioning, ROI, payback, kWh generation) MUST be implemented in **Python (FastAPI)**. Node.js is reserved for orchestration, BFF, and lightweight APIs.
- **Rationale**: The calc engine is stable in Python; domain logic lives in `src/calc_engine/`. Avoid duplicating calculation logic in Node.
- **Validation**: Specs involving calculation MUST reference Python/FastAPI for calc; Node for orchestration only.

### Principle 2: Node.js for Orchestration (MUST)

- **Rule**: API routing, Maestro orchestration, agent coordination, and database access MUST use **Node.js**. Prisma, Express/Fastify, and the Maestro pattern are the standard.
- **Rationale**: The backend architecture is modular with Maestro; agents and workflows are Node-based.
- **Validation**: New API endpoints and orchestration flows MUST follow the existing Maestro/agent pattern.

### Principle 3: Spec-Driven Development (MUST)

- **Rule**: All features MUST follow the Speckit pipeline: Specify → Clarify → Plan → Tasks → Analyze → Implement → Validate. No implementation without spec, plan, and tasks.
- **Rationale**: Ensures traceability, testability, and alignment with PRD. Reduces rework.
- **Validation**: Features without `spec.md`, `plan.md`, and `tasks.md` in `specs/` are out of compliance.

### Principle 4: Portuguese (PT-BR) for User-Facing Content (MUST)

- **Rule**: All user-facing strings (labels, messages, validation errors, UI copy) MUST be in **Brazilian Portuguese**. Technical identifiers and code comments MAY remain in English.
- **Rationale**: Target users are Brazilian solar integrators; UX must be native.
- **Validation**: Specs MUST require PT-BR for UI copy; code reviews MUST check locale.

### Principle 5: Design System Consistency (MUST)

- **Rule**: Frontend components MUST use the Quarks OS Design System (petroleum/solar tokens, `.technical-card`, `.btn-pill`, etc.). No ad-hoc color palettes or typography outside the DS.
- **Rationale**: Consistency across Dashboard, Chat, Proposals, and Leads. Reference: `docs/QUARKS_OS_Design_System_v1.md` and `docs/DESIGN_SYSTEM_RULES.md`.
- **Validation**: New UI work MUST reference DS tokens; self-review MUST check DS compliance.

### Principle 6: Error Handling and Logging (MUST)

- **Rule**: All services MUST use explicit error handling (try/catch with specific handling). Global try/catch is insufficient. Logs MUST use structured logging (`logger.info`, `logger.error`) for debugging.
- **Rationale**: Production reliability; rapid incident diagnosis.
- **Validation**: Code reviews MUST reject bare `catch (e)` without handling; logging MUST be present for critical paths.

### Principle 7: Validation Before Implementation (MUST)

- **Rule**: Before notifying the user of completion, the agent MUST: (a) Self-review against DS and PT-BR rules, (b) Run verification scripts (e.g., `verify_engine.py`), (c) Never assume "it should work" without evidence.
- **Rationale**: Expert Workflow Protocol; reduces regressions.
- **Validation**: Completion reports MUST include verification output.

---

## 3. Governance

### Amendment Procedure

1. Propose changes in a PR or issue.
2. Update `constitution.md` with new version and Sync Impact Report.
3. Increment version (MAJOR/MINOR/PATCH per semver).
4. Propagate changes to dependent templates (plan-template, spec-template, tasks-template).

### Versioning Policy

- **MAJOR**: Backward-incompatible principle removals or redefinitions.
- **MINOR**: New principles or materially expanded guidance.
- **PATCH**: Clarifications, typo fixes, non-semantic refinements.

### Compliance Review

- `speckit.plan` and `speckit.analyze` MUST validate specs/plans against this constitution.
- Constitution conflicts are CRITICAL; they require adjustment of spec/plan/tasks, not dilution of principles.
