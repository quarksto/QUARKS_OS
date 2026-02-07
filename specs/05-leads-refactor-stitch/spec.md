# Refactor Leads List Page (Stitch Integration)

**Branch**: `05-leads-refactor-stitch`
**Status**: DRAFT
**Created**: 2026-02-03

## Goal Description

Refactor the **Leads List Page** (`/leads`) and **Lead List Table** to align with the **Quarks OS Design System** (Updated) and the reference **Stitch "CRM Lead Overview"** design. The goal is to improve visual hierarchy, data readability, and consistency with the recently refactored Dashboard.

## User Review Required

> [!IMPORTANT]
> **Layout Strategy**: The Stitch reference uses a **Master-Detail** (Split View) layout. The current implementation is a **Full-Page Table**. This spec proposes:
> 1.  Keeping the **Full-Page Table** as the default view for maximum data density.
> 2.  Applying the **Visual Style** (Colors, Badges, Typography) from Stitch to the table rows.
> 3.  Integrating `AdaptiveHeader` and `LeadPipelineFilters` (reused) for consistency.

## Proposed Changes

### 1. Functional Requirements

*   **Header**:
    *   Replace `DashboardShell` header logic with `AdaptiveHeader`.
    *   Include "New Lead" action and "Filters" (reusing `LeadPipelineFilters` or similar).
    *   Show "Total Leads" count and potential value summary in the header or sub-header.
*   **Table Design (Stitch-Inspired)**:
    *   **Typography**: Use `Inter` (or `Geist` per DS) with stricter hierarchy (Title vs. Subtitle).
    *   **Visuals**: Use Avatar circles (Initials) with color coding.
    *   **Badges**: Use the new "Kanban-style" badges (`badge-kanban`) for Status, Origin, and Temperature.
    *   **Spacing**: Increase row density padding (`py-3` to `py-4`) but clean up borders.
    *   **Hover Actions**: Show "Quick Actions" (Call, Email, Edit) on row hover only.
*   **Filters**:
    *   Implement the same filter logic as Kanban (`LeadPipelineFilters`) for the List View to ensure unified filtering.

### 2. User Scenarios

*   **View List**: User opens `/leads` and sees a clean, high-density list of leads with clear status indicators.
*   **Filter**: User clicks "Filters" in the header to filter by Temperature, Status, or Origin.
*   **Search**: User types in the search bar (in header? or above table?) to find a lead instantly.
*   **Quick Edit**: User clicks a lead to open the **Lead Detail Modal** (existing).

### 3. Success Criteria

*   **Visual Consistency**: The page looks indistinguishable from the `DashboardRefactored` aesthetic (no jarring transitions).
*   **Responsiveness**: Table scrolls horizontally on mobile; Cards/List view on very small screens (optional, but good provided by `LeadPipelineList`).
*   **Performance**: Filtering is instant (<100ms) for local data.

## Technical Plan

### Components

#### [MODIFY] `src/frontend/src/pages/LeadsListPage.jsx`
*   Replace `DashboardShell` props to use `AdaptiveHeader` pattern.
*   Lift state (leads, loading, filters) to this level or use a context.

#### [MODIFY] `src/frontend/src/components/dashboard/LeadListTable.jsx`
*   Refactor table markup to remove `bg-slate-50` headers if they clash with the "Clean/White" Stitch look (or refine them).
*   Update `StatusBadge` to use `badge-kanban` classes.
*   Add `Avatar` component (or inline).

#### [NEW] `src/frontend/src/components/leads/LeadsHeader.jsx` (Optional)
*   If logic is complex, separate the header actions.

## Verification Plan

### Automated Tests
*   Verify `AdaptiveHeader` renders correctly with specific `moduleActions`.

### Manual Verification
*   Open `/leads`.
*   Check responsiveness (resize window).
*   Verify "New Lead" modal opens.
*   Verify Filters work sync with the Table content.
