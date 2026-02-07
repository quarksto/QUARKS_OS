# Domain Model: Leads, Opportunities & Clients
**Quarks OS - Business Logic Definition**

This document defines the core entities of the Commercial Module and aligns with the **Fluxo e Jornada** plan (see [JORNADA_E_FLUXO.md](JORNADA_E_FLUXO.md)): nicho (integradores de energia solar no Brasil), perfis de usuário, etapas regulatórias e ciclo de vida.

---

## 0. Nicho e perfis de usuário

**Nicho:** O Quarks OS atende **integradores de energia solar no Brasil** — empresas que vendem, projetam e instalam sistemas fotovoltaicos para residências e empresas. A jornada inclui etapas regulatórias obrigatórias (homologação, vistoria, ligação) além do ciclo comercial.

### Perfis de usuário

| Perfil         | Foco                  | Atividades principais                        |
| -------------- | --------------------- | -------------------------------------------- |
| **Comercial**  | Leads e vendas        | Captação, qualificação, proposta, fechamento |
| **Integrador** | Proposta e fechamento | Dimensionamento, proposta, assinatura       |
| **Engenharia** | Projeto e instalação  | Projeto técnico, homologação, instalação     |
| **Admin**      | Operação              | Catálogo, pricing, cronograma, analytics    |

### Etapas regulatórias (concessionária)

Após fechamento, o integrador precisa: (1) Projeto de engenharia (memorial, diagrama unifilar, ART) → (2) Homologação (submissão à concessionária) → (3) Aprovação → (4) Instalação → (5) Vistoria → (6) Ligação (medidor bidirecional).

---

## 1. High-Level Definitions

| Concept | Definition | Goal | Key Metrics |
| :--- | :--- | :--- | :--- |
| **LEAD** | A potential contact (Person or Company) that has expressed interest or was identified as a target, but is **not yet qualified**. | **Qualification**. Determine if they have a real need and budget. | *Response Rate, Conversion to Opp* |
| **OPPORTUNITY** | A qualified business potential. A Lead becomes an Opportunity when a specific **deal** is being negotiated. | **Closing**. Monitor the pipeline and close the deal. | *Pipeline Value, Win Rate, Cycle Time* |
| **CLIENT** | A contact with a **closed deal** (Won). They have a signed contract or active usage. | **Retention & Growth**. Deliver value and upsell. | *LTV, Churn, Satisfaction* |

---

## 2. The Lifecycle Flow (Data Interconnection)

Instead of three disconnected databases, we view this as a **Lifecycle Flow**. A single contact flows through these specific stages:

### Phase 1: Lead (Triagem & Qualificação)
*   **Input**: Forms, Indication, Cold Import.
*   **Data Focus**: Contact Info (Phone/Email), Location, Basic Profile.
*   **Activities**:
    1.  **New (Triagem)**: AI verifies basic data (CEP, Telhado).
    2.  **Contacted (Qualificação)**: SDR confirms interest.
*   **Exit Criteria**: "Is there a Project?" -> **Yes** (Promote to Opportunity) / **No** (Discard/Nurture).

### Phase 2: Opportunity (Pipeline de Vendas)
*   **Transition**: When a Lead moves to "Proposal Sent".
*   **Data Focus**: **Financials** (Consumption, Potential Value R$, Proposal PDF), **Timeline**.
*   **Activities**:
    1.  **Proposal**: Send technical/commercial proposal.
    2.  **Negotiation**: Discuss terms, financing.
*   **Exit Criteria**: "Contract Signed?" -> **Yes** (Promote to Client) / **No** (Closed Lost).

### Phase 3: Client (Pós-Venda e Sucesso)
*   **Transition**: When an Opportunity moves to "Closed Won".
*   **Data Focus**: **Project Details** (Installation Date, Equipment), **Billing**, **Support**.
*   **Activities**:
    *   Project Engineering.
    *   Installation.
    *   Maintenance.

---

## 3. Implementation Strategy (Frontend/Stitch)

To reflect this model in the current "Quarks OS", we will refine the views:

1.  **Leads List (`/leads`)**:
    *   **Focus**: Velocity. Handling incoming volume.
    *   **Filters**: Show primarily 'New' and 'Contacted'.
    *   **Action**: "Qualify" (Move to Pipeline).

2.  **Sales Pipeline (`/pipeline` - Kanban)**:
    *   **Focus**: Value Management.
    *   **Filters**: Show 'Proposal' and 'Negotiation'. Hides 'New' (noise).
    *   **Cards**: Emphasize **R$ Value** and **Temperature**.

3.  **Clients List (`/clients` - Future)**:
    *   **Focus**: Relationship.
    *   **Data**: Show Project Status (e.g., "Installing"), Last Contact.

## 4. Summary for Planning

*   **Lead** = *Person* (Who are they?)
*   **Opportunity** = *Deal* (What might they buy?)
*   **Client** = *Relationship* (What have they bought?)

> **Technical Note**: currently in the code, `Lead` entity holds all these fields. We can separate them logically by Stage without rewriting the entire database immediately, but the UI should distinguish them clearly.

---

## 5. Jornada em fases (alinhamento ao plano)

| Fase | Nome                    | Entidades / transição                         |
| ---- | ----------------------- | ---------------------------------------------- |
| 1    | Captação/Qualificação   | Lead (NEW → CONTACTED); webhook, triagem       |
| 2    | Vendas                  | Lead (proposta, dimensionamento); Proposal      |
| 3    | Fechamento              | Lead → CLOSED_WON / CLOSED_LOST; transição para Client |
| 4    | Projeto/Homologação     | Project (futuro); memorial, homologação        |
| 5    | Instalação              | Installation (futuro); cronograma, vistoria, ligação |
| 6    | Pós-venda               | Client; monitoramento, garantias, manutenção   |

---

## 6. Modelo de dados futuro (do plano)

- **Proposta interativa:** ProposalView (acesso compartilhado, link único); ProposalInteraction (aceite/recusa, comentários do cliente).
- **Omnichannel:** Channel (WhatsApp, chat, email, telefone); Conversation (thread unificada por lead/cliente).
- **Projeto e instalação (própria ou terceirizada):** Project (vinculado a Lead/Client; status; executor); Contractor (parceiro terceirizado; SLA); Installation (data; equipe; checklist; rastreabilidade).
