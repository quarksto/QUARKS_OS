# Implementation Plan - Proposals Frontend Refactor (Stitch)

**Feature**: `09-proposals-frontend`
**Status**: PLANNING
**Depends On**: `07-proposal-engine` (Completed)

## 1. Technical Context

### Existing Architecture
- **Backend**: `/api/proposals` CRUD endpoints exist (Node/Prisma).
- **Frontend**: React + Vite + Tailwind.
- **Design System**: Quarks OS v1.4 (Stitch-aligned).
  - Forbidden: Purple colors, background fills for badges.
  - Required: `StandardAvatar`, `AdaptiveHeader`, `DashboardShell`.

### Stitch Integration
- **Source**: Stitch Project `dedd44b7...` (generated via MCP).
- **Strategy**: Hybrid. Use Stitch HTML as "View Layer" reference but refactor into React components using our Design System tokens.

## 2. Component Architecture

### `ProposalsListPage.jsx`
- **Wrappers**: `DashboardShell` -> `AdaptiveHeader`.
- **State**: `proposals` (Array), `metrics` (Derived), `filters` (Object).
- **Sub-components**:
  - `ProposalKpiGrid`: New component for the top cards (Pending, Conversion, Total).
  - `ProposalListTable`: Refactored table with:
    - `StandardAvatar` for Lead.
    - `StatusBadge` (Outline style per DS Rules).

### `ProposalDetailPage.jsx`
- **Layout**: 2-Column Grid (Details Left, Actions/Edit Right).
- **Actions**:
  - `handleSend`: POST `/api/proposals/:id/send`
  - `handlePdf`: POST `/api/proposals/:id/generate-pdf` -> `openProposalDocument`.
- **Edit Mode**: Inline editing for Status/Notes/Discounts.

## 3. Data Model Alignment

| Frontend View | Backend Field | Transformation |
|---|---|---|
| Lead Avatar | `lead.name` | Initials (StandardAvatar) |
| Value | `totalPrice` | `Intl.NumberFormat` (BRL) |
| Status | `status` | Map to DS colors (DRAFT=Slate, SENT=Blue, etc.) |
| Created | `createdAt` | `toLocaleDateString` |

## 4. Design System Validation (Constitution Check)

- [x] **No Purple**: Validated (Code uses Slate/Solar/Petroleum).
- [x] **No Badge Fills**: ProposalBadges must be `border-color text-color bg-white` (or very light tint `bg-color-50` if DS allows - *Correction: DS Rules say "No Background Fills" but allows "Standard Badges: Outline Style"*. I must ensure badges are Outline).
- [x] **Avatar**: Must use `StandardAvatar` component, not generic `img`.

## 5. Implementation Phases

1. **Phase 1: Components (Atom/Molecule)**
   - Create `ProposalKpiCard.jsx`.
   - Update `ProposalListTable.jsx` to use `StandardAvatar` and `StitchBadge` (Outline).

2. **Phase 2: Pages (Organism)**
   - Refactor `ProposalsListPage.jsx` (already started, needs DS polish).
   - Refactor `ProposalDetailPage.jsx` to match Stitch layout.

3. **Phase 3: Integration Verify**
   - Test "Send Proposal" flow.
   - Test "Generate PDF" flow.
