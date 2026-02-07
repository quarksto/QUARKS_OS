# Task List: Leads List Refactor (Stitch)

**Feature**: `05-leads-refactor-stitch`
**Branch**: `05-leads-refactor-stitch`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Header & Layout

- [x] T001 [US1] Replace DashboardShell header with AdaptiveHeader in LeadsListPage.jsx
- [x] T002 [US1] Add "New Lead" action and "Filters" button to header
- [x] T003 [US1] Integrate LeadPipelineFilters (reuse from Kanban) for list view
- [x] T004 [US1] Show "Total Leads" count in header or sub-header

## Phase 2: Table Stitch Styling

- [x] T010 [US2] Update LeadListTable typography to Inter/Geist with strict hierarchy
- [x] T011 [US2] Add Avatar circles (initials) with color coding per lead
- [x] T012 [US2] Replace StatusBadge with badge-kanban classes for Status, Origin, Temperature
- [x] T013 [US2] Adjust row padding (py-3 to py-4) and borders for clean look
- [x] T014 [US2] Remove or refine bg-slate-50 headers if they clash with DS

## Phase 3: Interactions

- [x] T020 [US3] Implement hover actions (Call, Email, Edit) on row hover
- [x] T021 [US3] Connect Filters to table data (unified filtering with Kanban)
- [x] T022 [US3] Implement search bar in header (instant filter by name/email)
- [x] T023 [US3] Ensure lead click opens Lead Detail Modal (existing)

## Phase 4: Polish & Responsiveness

- [x] T030 Add horizontal scroll for table on mobile
- [x] T031 Optional: Cards/List view on very small screens (if LeadPipelineList supports)
- [ ] T032 Manual verification: Open /leads, resize, test filters and search
- [x] T033 Verify visual consistency with DashboardRefactored

## Dependencies

1. Phase 1 (Header) -> Phase 2 (Table) -> Phase 3 (Interactions)
2. Phase 4 can run after Phase 3
3. AdaptiveHeader and LeadPipelineFilters must exist or be created
