# Task List: Backend Proposal Engine

**Feature**: `07-proposal-engine`
**Branch**: `07-proposal-engine`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Schema Update

- [x] T001 Add workflow fields to Proposal model (discountPercent, notes, version, sentAt, viewedAt, etc.) ✅
- [x] T002 Run `prisma migrate dev --name add_proposal_workflow_fields` ✅
- [x] T003 Run `prisma generate` to update client ✅

## Phase 2: Proposals REST Routes

- [x] T004 Create `src/backend/src/modules/proposals/routes.js` ✅
- [x] T005 [US1] Implement GET /api/proposals (list with filter by leadId, status, creatorId) ✅
- [x] T006 [US1] Implement GET /api/proposals/:id (include lead, kit, items) ✅
- [x] T007 [US1] Implement PATCH /api/proposals/:id (update status, discount, notes) ✅
- [x] T008 [US1] Implement DELETE /api/proposals/:id (soft delete via status=EXPIRED) ✅
- [x] T009 Register proposals routes in server.js ✅

## Phase 3: ProposalDomainAgent CRUD

- [x] T010 Add LIST_PROPOSALS action ✅
- [x] T011 Add GET_PROPOSAL action ✅
- [x] T012 Add UPDATE_PROPOSAL action ✅
- [x] T013 Add DELETE_PROPOSAL action ✅

## Phase 4: Workflow Actions

- [x] T020 [US2] Add SEND_PROPOSAL action (status=SENT, sentAt=now) ✅
- [x] T021 [US2] Add MARK_AS_VIEWED action (status=VIEWED, viewedAt=now) ✅
- [x] T022 [US2] Add ACCEPT_PROPOSAL action (status=ACCEPTED, update Lead.status=CLOSED_WON) ✅
- [x] T023 [US2] Add REJECT_PROPOSAL action (status=REJECTED, rejectionReason) ✅

## Phase 5: PDF Generation

- [x] T030 [US3] Add POST /api/proposals/:id/generate-pdf endpoint ✅
- [x] T031 [US3] Call calc_engine /generate/proposal ✅
- [x] T032 [US3] Store pdfUrl in proposal record ✅
- [x] T033 [US3] Return PDF URL in response ✅

## Phase 6: Integration & Validation

- [ ] T040 Manual test: Create proposal, list, update, delete
- [ ] T041 Manual test: Workflow transitions (DRAFT → SENT → VIEWED → ACCEPTED)
- [ ] T042 Manual test: Generate PDF
- [ ] T043 Verify Maestro workflow still works

## Dependencies

1. Phase 1 → Phase 2, 3, 4, 5
2. Phase 2, 3 can run in parallel
3. Phase 4 depends on Phase 3
4. Phase 5 depends on Phase 3
5. Phase 6 depends on all above
