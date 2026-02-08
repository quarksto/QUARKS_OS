# Backend Pricing & Services Implementation

**Branch**: `07-pricing-services`
**Status**: IN_PROGRESS 🚧
**Created**: 2026-02-08

## Goal Description

Implement a centralized, server-side pricing engine that includes **Services** (Installation, Engineering, Homologation) in addition to Hardware (Kits). This ensures proposals are profitable and account for all variable costs, eliminating client-side reliance and unsafe fallbacks.

## 1. Functional Requirements

*   **Service Management**:
    *   Define service types: `INSTALLATION`, `ENGINEERING`, `HOMOLOGATION`, `FREIGHT`, `INSURANCE`.
    *   Define pricing rules for services per State (UF) and Power Range (kWp).

*   **Pricing Engine (`PricingDomainAgent`)**:
    *   Input: `Lead` (State), `Kit` (Power/Items).
    *   Process:
        1.  Calculate **Hardware Cost** (Sum of Kit Items).
        2.  Calculate **Services Cost** (Sum of applicable services for State/Power).
        3.  Apply **Tax** (from `PricingRule`).
        4.  Apply **Margin** (from `PricingRule` or Override).
    *   Output: `FinalPrice`, `CostBreakdown` (Hardware, Services, Tax, Margin).

*   **Proposal Integration**:
    *   `ProposalDomainAgent` must request pricing from `PricingDomainAgent`.
    *   If pricing fails (e.g., no service price for State), Proposal creation MUST fail gracefully.

## 2. Key Entities (Prisma)

### `Service`
*   `type`: Enum (INSTALLATION, ENGINEERING, etc.)
*   `name`: String (e.g., "Instalação Padrão Telhado")
*   `description`: String

### `ServicePrice`
*   `serviceId`: Relation
*   `state`: String (UF) or `null` (National)
*   `minPower`: Float
*   `maxPower`: Float
*   `priceType`: Enum (FIXED, PER_WATT, PER_KM)
*   `priceValue`: Float

## 3. Pricing Flow "The Correct Flow"

1.  **User** selects Kit on Frontend.
2.  **Frontend** calls `POST /orchestrator/preview-proposal` with `{ leadId, kitId }`.
3.  **Maestro** calls `PricingDomainAgent.calculate({ lead, kit })`.
4.  **PricingDomainAgent**:
    *   Fetches `KitItems` -> Sums `costPrice` = `HardwareBase`.
    *   Fetches `ServicePrices` matching `Lead.state` and `Kit.power`.
        *   (e.g., Installation MG 3-5kWp: R$ 0.80/Wp * 4000W = R$ 3200).
        *   (e.g., Engineering: Fixed R$ 1500).
    *   Sums Services = `ServicesBase`.
    *   `TotalBase` = `HardwareBase` + `ServicesBase`.
    *   Applies `PricingRule` (Margin & Tax).
    *   `FinalPrice` = `TotalBase * (1+Margin) / (1-Tax)`.
5.  **Maestro** returns full object to Frontend.
6.  **Frontend** displays values.

## 4. Migration Strategy

*   Existing Proposals: Keep static snapshot (do not recalculate).
*   New Proposals: Use new engine.
*   Seed Data: Insert default service prices to avoid system blockage immediately after deploy.
