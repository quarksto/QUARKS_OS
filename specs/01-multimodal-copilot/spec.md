# Feature Specification: Multimodal Sales Copilot

**Feature Branch**: `01-multimodal-copilot`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Upgrade chatbot to Multimodal Agent (Gemini 3) similar to Google Antigravity/Toggle Agent, using existing skills/agents."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conversational Proposal Generation (Priority: P1)

A sales representative wants to generate a proposal through natural conversation without filling extensive forms.

**Why this priority**: The core value proposition is simplifying the proposal workflow using the existing robust backend.

**Independent Test**: Can be tested by chatting with the bot "Gere uma proposta para o João, consumo 600kwh" and verifying a valid proposal link is returned.

**Acceptance Scenarios**:

1.  **Given** a logged-in user, **When** they type "Faça uma proposta para Maria, cidade Campinas, consumo 500", **Then** the Agent extracts entities, calls `ProposalAgent`, and returns a summary + link.
2.  **Given** missing information (e.g., city), **When** the Agen asks "Qual a cidade?", **Then** the user replies and the flow continues.

---

### User Story 2 - Bill Analysis via Image (Multimodal) (Priority: P1)

A user wants to upload a photo of an energy bill to automatically extract consumption data.

**Why this priority**: High friction reduction in data entry; leverages Gemini 3's high-fidelity document understanding.

**Independent Test**: Upload a sample PDF/Image of a bill -> System populates the "Consumption" field in the proposal context.

**Acceptance Scenarios**:

1.  **Given** an image of a CPFL bill, **When** uploaded to the chat, **Then** the Copilot identifies "Distributor: CPFL", "Average Consumption: 450kWh" and asks confirmation.

### User Story 3 - Site Survey Video Analysis (Gemini 3 Exclusive) (Priority: P2)

A sales rep uploads a 30s video walking around the client's roof/yard to identify shading or installation obstacles.

**Why this priority**: leverages Gemini 3's **native video understanding** to catch technical issues early.

**Independent Test**: Upload a video of a shaded roof -> Bot warns: "Detectei sombreamento potencial no lado Leste."

**Acceptance Scenarios**:

1.  **Given** a video file, **When** uploaded, **Then** Gemini analyzing frames identifies "Telhado Cerâmico", "Árvore próxima" and suggests "Microinversor" instead of String.

### User Story 4 - Voice-to-Proposal (Audio Native) (Priority: P2)

Sales rep sends a 2-minute audio note summarising the client meeting.

**Why this priority**: Uses Gemini 3 **native audio processing** (no separate STT needed) for nuance capture.

**Independent Test**: Upload .mp3 -> Bot extracts "Cliente quer 10 placas", "Orçamento até 20k".

---

### User Story 5 - Technical Support (RAG) (Priority: P2)

A user asks technical questions about products (kits) available in the catalog.

**Why this priority**: Reduces burden on engineering team; empowers sales reps.

**Independent Test**: Ask "Qual a garantia do Inversor Growatt?" -> Bot replies with accurate data from the Product Catalog/Docs.

**Acceptance Scenarios**:

1.  **Given** a question about product specs, **When** asked, **Then** the Agent searches the Knowledge Base (or Product Agent) and answers accurately.

---

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001**: System MUST integrate with Google Gemini API using **Gemini 3** models for superior multimodal processing.
-   **FR-002**: System MUST expose a "Chat" interface in the Frontend connected to the Backend.
-   **FR-003**: System MUST implement a "Tool Use" layer where the LLM can invoke `Maestro` workflows (e.g., `createProposal`).
-   **FR-004**: System MUST accept **Images** (Bills), **Video** (Site Survey), and **Audio** (Voice Notes).
-   **FR-005**: System MUST maintain conversation state (Memory) context awareness.

### Key Entities

-   **AgentSession**: Stores chat history and current "draft" context.
-   **SkillRegistry**: A mapping of available Tools (`calculate`, `search_products`, `generate_proposal`) available to the LLM.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: 90% of valid bill images result in correct consumption extraction (+/- 5%).
-   **SC-002**: Sales Reps can generate a complete proposal in < 1 minute via Chat.
-   **SC-003**: System responds to text queries in < 3 seconds, image queries in < 10 seconds.
