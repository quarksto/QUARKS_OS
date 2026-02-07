# Tasks: Dashboard Interactivity

**Input**: specs/03-dashboard-interactivity/spec.md
**Prerequisites**: 02-dashboard-refactor-stitch complete (DashboardRefactored.jsx active)

## Phase 1: Interactive Pipeline (US1) -- **IN PROGRESS**

- [x] T001: Implement `KanbanBoard` usage in `LeadsPage.jsx` keeping data flow from `useDashboardData`. [Kanban Fix]
- [ ] T002: Verify Drag and Drop state updates (Network/UI).

## Phase 2: Navigation & Sidebar (US2)

- [ ] T003: Implement collapsible state in `DashboardSidebar` (prop: `collapsed`).
- [ ] T004: Add width transition (animate-width) to Sidebar container.
- [ ] T005: Show tooltips for nav items only when collapsed.

## Phase 3: Micro-Interactions (US3)

- [ ] T006: Add `:hover` lift/scale effect to `KpiGrid` cards.
- [ ] T007: Add hover highlight to `RecentActivityList` rows with "View" action reveal.
- [ ] T008: Verify Chart tooltips on hover (Recharts configuration).

## Phase 4: Verification

- [ ] T009: Test full "New Deal" flow with interactive elements enabled.
- [ ] T010: Verify mobile responsiveness of sidebar toggle.
