# Implementation Plan: Leads List Refactor (Stitch)

**Branch**: `05-leads-refactor-stitch` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)

## Summary

Refactor the Leads List Page (`/leads`) and Lead List Table to align with the Quarks OS Design System and Stitch "CRM Lead Overview" reference. Full-page table layout with Stitch-inspired visuals (badges, avatars, typography). AdaptiveHeader and LeadPipelineFilters for consistency with Dashboard.

## Technical Context

**Language/Version**: React 18, JavaScript/JSX
**Primary Dependencies**: React Router, Mantine or Tailwind (per DS), api.js
**Storage**: N/A (data via GET /api/leads/pipeline)
**Testing**: Manual verification; responsiveness check
**Target Platform**: Web
**Project Type**: Frontend refactor
**Performance Goals**: Filtering < 100ms; page load < 3s
**Constraints**: Reuse LeadPipelineFilters; maintain data contract with API
**Scale/Scope**: LeadsListPage, LeadListTable, optional LeadsHeader

## Constitution Check

- **P4 (PT-BR)**: All UI strings in Portuguese. PASS.
- **P5 (Design System)**: Use petroleum/solar tokens, badge-kanban, DS classes. PASS.
- **P3 (Spec-Driven)**: spec.md, plan.md, tasks.md. PASS.

## Project Structure

### Documentation

```text
specs/05-leads-refactor-stitch/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code

```text
src/frontend/src/
├── pages/
│   └── LeadsListPage.jsx      # [MODIFY] AdaptiveHeader, layout
├── components/
│   ├── dashboard/
│   │   ├── LeadListTable.jsx  # [MODIFY] Stitch visuals, badges, avatars
│   │   ├── AdaptiveHeader.jsx # [REUSE] from Dashboard
│   │   └── LeadPipelineFilters.jsx # [REUSE]
│   └── leads/
│       └── LeadsHeader.jsx    # [NEW] Optional, if logic complex
```

## Reference

- Stitch design: `docs/DASHBOARD_STITCH_MCP.md` or similar
- DS: `docs/QUARKS_OS_Design_System_v1.md`, `docs/DESIGN_SYSTEM_RULES.md`
- Existing LeadsListPage and LeadListTable paths per spec
