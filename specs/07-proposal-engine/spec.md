# Backend Proposal Engine

**Branch**: `07-proposal-engine`
**Status**: DRAFT
**Created**: 2026-02-03

## Goal Description

Expandir o `ProposalDomainAgent` e criar APIs REST completas para o ciclo de vida de propostas solares. Atualmente o módulo tem apenas `CREATE_DRAFT` e `generatePreview`. Faltam: listagem, atualização, envio, aceitação/rejeição, e geração de PDF.

## User Review Required

> [!IMPORTANT]
> **Dependências**: Este módulo consome o `06-catalog-backend` (Products, Kits, PricingRules) e o `calc_engine` Python (cálculos de geração, ROI, tarifa).

## Proposed Changes

### 1. Functional Requirements

*   **Proposal CRUD**:
    *   API para Listar propostas (filter by lead, status, creator)
    *   API para Obter proposta por ID (com lead, kit, items)
    *   API para Atualizar proposta (status, preço, desconto)
    *   API para Deletar proposta (soft delete ou cascade)

*   **Proposal Workflow**:
    *   `SEND_PROPOSAL` - Atualiza status para SENT, envia notificação
    *   `MARK_AS_VIEWED` - Cliente visualizou a proposta
    *   `ACCEPT_PROPOSAL` - Cliente aceitou → Lead.status = CLOSED_WON
    *   `REJECT_PROPOSAL` - Cliente rejeitou com motivo

*   **PDF Generation**:
    *   Endpoint para gerar PDF da proposta
    *   Armazenar URL do PDF no campo `pdfUrl`
    *   Integração com calc_engine `/generate/proposal` existente

*   **Proposal Customization**:
    *   Permitir desconto percentual ou absoluto
    *   Permitir notas/observações do vendedor
    *   Suporte a múltiplas revisões (versioning)

### 2. User Scenarios

*   **Vendedor**:
    1. Cria proposta via Maestro workflow
    2. Ajusta desconto/preço manualmente
    3. Gera preview HTML
    4. Envia proposta ao cliente
    5. Acompanha status (visualizada, aceita, rejeitada)

*   **Sistema (Automação)**:
    1. Lead criado com consumo → auto-gerar proposta draft
    2. Proposta expirada após X dias → notificar vendedor

### 3. Success Criteria

*   **CRUD funcional**: Criar, listar, atualizar, deletar propostas via API
*   **Status Workflow**: Transições de status corretas (DRAFT → SENT → VIEWED → ACCEPTED/REJECTED)
*   **PDF Generation**: Gerar PDF e armazenar URL
*   **Integration**: ProposalDomainAgent integrado ao Maestro

## Key Entities

*   `Proposal` (existente no Prisma schema)
*   Novos campos sugeridos:
    *   `discountPercent` Float?
    *   `notes` Text?
    *   `version` Int @default(1)
    *   `sentAt` DateTime?
    *   `viewedAt` DateTime?
    *   `acceptedAt` DateTime?
    *   `rejectedAt` DateTime?
    *   `rejectionReason` String?

## Technical Context

*   **Language**: Node.js (Backend), Python (calc_engine)
*   **Database**: PostgreSQL via Prisma
*   **Existing Code**:
    *   `ProposalDomainAgent` - CREATE_DRAFT, generatePreview
    *   `calc_engine /generate/proposal` - HTML generation
*   **Dependencies**: 06-catalog-backend (Kits, Pricing)
