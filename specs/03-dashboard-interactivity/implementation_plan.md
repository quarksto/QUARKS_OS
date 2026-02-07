# Implementation Plan - Dashboard Interactivity

**Feature**: Dashboard Component Interactivity (`03-dashboard-interactivity`)
**Status**: APPROVED

## Proposed Changes

### 1. State Management (Global UI)
We need a lightweight global state for layout preferences.
#### [NEW] `src/frontend/src/contexts/LayoutContext.jsx`
- Create `LayoutProvider` to manage:
  - `isSidebarCollapsed` (boolean)
  - `isCopilotOpen` (boolean)
  - `toggleSidebar()`
  - `toggleCopilot()`
- Wrap `DashboardRefactored` or Main App with this provider.

### 2. Kanban Board (Drag & Drop)
Implement Drag and Drop. Since we want "Stitch-like" premium feel:
- **Library**: Use `@dnd-kit/core` (modern, lightweight) OR standard HTML5 DnD if simple.
- **Decision**: HTML5 DnD is sufficient for simple column-to-column movement without external heavy deps unless user approves new dep. **Plan: Use HTML5 DnD for zero-dependency simplicity first.**

#### [MODIFY] `src/frontend/src/components/dashboard/KanbanBoard.jsx`
- Add `onDragStart`, `onDragOver`, `onDrop` handlers.
- maintain local state `columns` (derived from props but locally mutable for optimisic UI).
- Add `LeadDetailModal` integration.

#### [NEW] `src/frontend/src/components/dashboard/LeadDetailModal.jsx`
- Create a Modal/Drawer component.
- Style to match the "Lead Detail" Stitch reference (fetched earlier).

### 3. Sidebar & Header Refactor
Connect to LayoutContext.

#### [MODIFY] `src/frontend/src/components/dashboard/DashboardSidebar.jsx`
- Consume `LayoutContext`.
- Remove internal state if present, prefer context.
- Implement Tooltip logic for collapsed state.

#### [MODIFY] `src/frontend/src/components/dashboard/DashboardHeader.jsx`
- Connect "Ocultar Copilot" button (if it exists or needs to be added) to `toggleCopilot`.

### 4. Recent Activity & KPIs (Micro-interactions)
#### [MODIFY] `src/frontend/src/components/dashboard/RecentActivityList.jsx`
- Add `onClick` to items to triggering a toast or console log (placeholder for "View Details").
- Polish hover states (already started visually, ensure clickability).

#### [MODIFY] `src/frontend/src/components/dashboard/KpiGrid.jsx`
- Add `scale-105` or border-highlight on hover.

## Verification Plan

### Automated Tests
- None planned for UI interactions in this phase (manual verification preferred for visual feel).

### Manual Verification
1. **Kanban**: Drag a card from Col A to Col B. Verify it stays.
2. **Sidebar**: Click toggle. Verify smooth transition. Refresh page (check persistence if implemented, effectively just check context works).
3. **Copilot**: Click "Chat IA" or Header toggle. Verify Right Sidebar appears/disappears.
4. **Modal**: Click a Kanban card. Verify Modal opens with "Stitch" style content.
