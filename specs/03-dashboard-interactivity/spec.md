# Feature Specification: Dashboard Component Interactivity

**Feature Branch**: `03-dashboard-interactivity`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Activates interactive states and behaviors for Dashboard components (Sidebar, Kanban, KPIs, Activity List) using Stitch as a reference."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Kanban Pipeline (Priority: P1)

Sales reps need to manage deals efficiently by moving them through stages and viewing details without leaving the board.

**Why this priority**: Core functionality for a CRM. Static cards are useless for workflow.

**Independent Test**: Can drag a card from "Triagem" to "Qualificação" and see the state update visually. Can click a card to see a "Lead Detail" mock/modal.

**Acceptance Scenarios**:
1. **Given** a lead in "Triagem", **When** user drags the card to "Qualificação", **Then** the card snaps to the new column and updates its internal status.
2. **Given** any deal card, **When** user clicks the card body, **Then** a "Lead Detail" modal/drawer opens mimicking the Stitch reference visuals.

---

### User Story 2 - Navigation & Sidebar States (Priority: P1)

Users need a responsive navigation experience that maximizes workspace while preserving context.

**Why this priority**: Essential for screen real estate management (especially with the complex Kanban board).

**Independent Test**: Toggling the sidebar between Expanded/Collapsed persists state and smoothly animates content width. Tooltips appear only in collapsed mode.

**Acceptance Scenarios**:
1. **Given** expanded sidebar, **When** user clicks "Collapse", **Then** width shrinks to icon-only mode with smooth transition.
2. **Given** collapsed sidebar, **When** user hovers an icon, **Then** a tooltip with the section name appears adjacent to it.
3. **Given** "Copilot" button click, **Then** the Right Sidebar toggles visibility, pushing the main content or overlaying depending on screen size.

---

### User Story 3 - Widget Micro-Interactions (Priority: P2)

Users expect a "live" feel to the data, with visual feedback on interaction.

**Why this priority**: Increases perceived quality and "premium" feel (Stitch/Vercel aesthetic).

**Independent Test**: Hovering KPIs or Chart bars triggers distinct visual feedback.

**Acceptance Scenarios**:
1. **Given** the KPI Grid, **When** user hovers a card, **Then** it slightly lifts/scales (subtle) or highlights its border.
2. **Given** Recent Activity list, **When** user hovers an item, **Then** the background highlights and the "View" action becomes visible/active.
3. **Given** Consumption Chart, **When** user hovers a bar, **Then** a precise tooltip with the kWh value appears.

---

### Edge Cases

- **Drag Error**: If a drag drop fails (network/logic), the card should snap back to original position with a "shake" or red outline error.
- **Empty States**: If a Kanban column has no cards, it should show a placeholder "Drop here" or "No deals" state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support Drag and Drop reordering of Kanban cards between columns.
- **FR-002**: System MUST render a "Lead Detail" view (Modal/Sheet) overlaying the dashboard when a deal is selected.
- **FR-003**: Sidebar MUST persist its collapsed/expanded state during the session.
- **FR-004**: System MUST provide visual feedback (hover styles) for all interactive elements (Cards, List Items, Charts).
- **FR-005**: Right Sidebar (Copilot) MUST be toggleable via the Header button and a "Close" button within the sidebar itself.

### Key Entities

- **DealState**: Status Enum (NEW, QUALIFICATION, PROPOSAL, NEGOTIATION).
- **UIState**: Global store for layout preferences (isSidebarCollapsed, isCopilotOpen).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Drag and drop operations complete visually in under 16ms (60fps) for smooth feel.
- **SC-002**: Sidebar toggle animation is smooth (no layout thrashing).
- **SC-003**: All interactive elements have visible `:hover` and `:active` states.
