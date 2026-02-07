# Backend Catalog & Pricing Implementation

**Branch**: `06-catalog-backend`
**Status**: DONE ✅
**Created**: 2026-02-03

## Goal Description

Implement the missing CRUD APIs for **Products**, **Kits**, and **PricingRules** in the backend (Node.js/Maestro), and refactor the **PricingService** to use these database entities instead of hardcoded values. This enables the frontend to manage the catalog and ensures proposals use real-time, data-driven pricing.

## User Review Required

> [!IMPORTANT]
> **Pricing Strategy**: This spec moves pricing logic from hardcoded constants (e.g., `R$ 3500 * kWp`) to a database-driven `PricingRule` model. This is a foundational change for the **Calc Engine** and **Proposal Engine**.

## Proposed Changes

### 1. Functional Requirements

*   **Product Management (CRUD)**:
    *   API to List, Create, Update, Delete `Product` entities.
    *   Support filtering by category (Module, Inverter, etc.) and active status.
    *   Validate unique SKUs.
    
*   **Kit Management (CRUD)**:
    *   API to List, Create, Update, Delete `Kit` entities.
    *   Manage `KitItem` relationships (associating Products to Kits with quantities).
    *   Auto-calculate Kit visual price (optional) or allow manual override.

*   **Pricing Rule Management (CRUD)**:
    *   API to List, Create, Update, Delete `PricingRule` entities.
    *   Support rules by State (UF), Power Range (kWp min/max), and Integrator.
    *   Fields: `minMargin`, `taxRate`, `baseCostPerWp` (fallback).

*   **Pricing Service Refactor**:
    *   Update logic to fetch `PricingRule` based on:
        *   Lead Location (State).
        *   System Size (kWp).
    *   Calculate User Price = (Kit Cost + Components) * (1 + Margin) / (1 - Tax).
    *   Fallback to existing logic if no rule matches (for backward compatibility during migration).

### 2. User Scenarios

*   **Admin/Manager**:
    *   Uploads a new Inverter via API (or future UI).
    *   Defines a "Standard Kit 5kWp" composed of 10 panels and 1 inverter.
    *   Sets a Pricing Rule: "For MG, systems 3-7kWp, minimum margin 15%".
*   **System (Maestro/Calc)**:
    *   Receives a proposal request for 5kWp in MG.
    *   Selects "Standard Kit 5kWp".
    *   Looks up Pricing Rule for MG/5kWp.
    *   Generates final price dynamically.

### 3. Success Criteria

*   **Data Integrity**: Products and Kits can be created and retrieved via API.
*   **Dynamic Pricing**: A proposal generated for 2 different regions (with different rules) yields different prices.
*   **Backward Compatibility**: Existing proposals still load; new proposals use the new engine.
*   **Performance**: Pricing calculation overhead < 200ms.

## Key Entities

*   `Product` (Prisma default)
*   `Kit` (Prisma default)
*   `KitItem` (Prisma default)
*   `PricingRule` (Prisma default)
