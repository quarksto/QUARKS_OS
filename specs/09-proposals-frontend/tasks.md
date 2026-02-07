# Tasks: Proposals Frontend Refactor

**Input**: specs/09-proposals-frontend/plan.md

## Phase 1: Shared Components & Design System Alignment
- [x] T001: Create/Update `StatusBadge` component to support "Outline Style" strictly (Border+Text, White/Transparent BG) per DS Rules.
- [x] T002: Ensure `StandardAvatar` is used in all Lead contexts.
- [x] T003: Implement `ProposalKpiCard` component (Integrated into Page).

## Phase 2: Proposal List Page
- [x] T004: Refactor `ProposalsListPage.jsx`
  - [x] Implement `AdaptiveHeader` with Breadcrumbs.
  - [x] Implement `ProposalKpiGrid` using real backend metrics.
  - [x] Implement Table with `StatusBadge` (Outline) and `StandardAvatar`.
  - [x] Add empty state "No proposals found".

## Phase 3: Proposal Detail Page
- [x] T005: Refactor `ProposalDetailPage.jsx`
  - [x] Implement 2-column layout (Stitch style).
  - [x] "Actions" Card with Send/PDF buttons.
  - [x] "Edit" Card with inputs for Discount/Notes.
  - [x] "Financial" Card with read-only calculated values.
- [x] T006: Verify PDF generation flow (opening Blob URL).

## Phase 4: Public View (Client)
- [x] T007: Review `ProposalViewPublicPage.jsx`.
  - [x] Ensure it looks professional (External facing).
  - [x] Remove any "Internal" actions or navigation.

## Validation
- [x] T008: Manual visual check against `DESIGN_SYSTEM_RULES.md` (Check for purple, check badge styles).
