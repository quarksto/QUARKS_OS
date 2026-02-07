# Implementation Plan: Backend Catalog & Pricing

**Branch**: `06-catalog-backend` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)

## Summary

Implement CRUD APIs for **Product**, **Kit**, and **PricingRule** in the Node.js backend (Maestro), and refactor **PricingService** to use database-driven rules instead of hardcoded values. Enables real-time, data-driven pricing for proposals.

## Technical Context

**Language/Version**: Node.js 18+, Prisma
**Primary Dependencies**: Prisma, Maestro, Express
**Storage**: PostgreSQL (Product, Kit, KitItem, PricingRule already in schema per ARQUITETURA_DE_DADOS)
**Testing**: Manual API verification; Jest optional
**Target Platform**: Web API
**Project Type**: Backend module extension
**Performance Goals**: Pricing calculation < 200ms
**Constraints**: Backward compatibility for existing proposals; Python calc engine unchanged
**Scale/Scope**: 4 CRUD modules + PricingService refactor

## Constitution Check

- **P1 (Python-First)**: Calc logic remains in Python; this spec is Node/Prisma only for catalog and pricing lookup. PASS.
- **P2 (Node Orchestration)**: APIs and Maestro agents follow existing pattern. PASS.
- **P3 (Spec-Driven)**: spec.md, plan.md, tasks.md present. PASS.
- **P6 (Error Handling)**: All endpoints MUST have explicit try/catch and logging. PASS.

## Project Structure

### Documentation

```text
specs/06-catalog-backend/
├── spec.md
├── plan.md
├── tasks.md
└── data-model.md (optional, schema in ARQUITETURA_DE_DADOS)
```

### Source Code

```text
src/backend/src/
├── modules/
│   ├── products/          # [NEW] Product CRUD
│   │   ├── routes.js
│   │   └── controller.js
│   ├── kits/              # [NEW] Kit CRUD
│   │   ├── routes.js
│   │   └── controller.js
│   └── pricing-rules/     # [NEW] PricingRule CRUD
│       ├── routes.js
│       └── controller.js
├── agents/
│   ├── product-domain/    # [MODIFY] Use Product CRUD
│   ├── pricing-domain/    # [MODIFY] Refactor to use PricingRule
│   └── ...
└── server.js              # [MODIFY] Register new routes
```

## Data Model (Existing)

Per `docs/ARQUITETURA_DE_DADOS.md` and Prisma schema:

- **Product**: id, name, sku, type (MODULE|INVERTER|STRUCTURE|CABLE|OTHER), costPrice, ...
- **Kit**: id, name, description, ...
- **KitItem**: kitId, productId, quantity
- **PricingRule**: state (UF), minKwp, maxKwp, minMargin, taxRate, baseCostPerWp, integratorId (optional)

## Dependencies

- Prisma schema MUST have Product, Kit, KitItem, PricingRule models (verify in schema.prisma)
- ProposalDomainAgent and PricingDomainAgent must be refactored to consume new APIs
- No changes to Python calc engine
