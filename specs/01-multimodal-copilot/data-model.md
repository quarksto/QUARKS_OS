# Data Model: Multimodal Sales Copilot

## Entities

### AgentSession
Stores the state of a conversation between a user and the Copilot.

-   `id` (UUID, PK): Unique session identifier.
-   `userId` (UUID, FK -> User): The user who owns this session.
-   `context` (JSONB): Flexible storage for active intent data (e.g., `draftProposalId`, `detectedDistributor`).
-   `createdAt` (DateTime): Session start.
-   `updatedAt` (DateTime): Last interaction.

### AgentMessage
Individual messages within a session.

-   `id` (UUID, PK)
-   `sessionId` (UUID, FK -> AgentSession)
-   `role` (Enum: USER, ASSISTANT, SYSTEM)
-   `content` (Text): The text content or JSON structure of the message.
-   `metadata` (JSONB): Optional metadata (e.g., token usage, tool calls, processing time).
-   `createdAt` (DateTime)

## Relationships

-   `User` has many `AgentSession`
-   `AgentSession` has many `AgentMessage`

## Validation Rules

-   `userId` is mandatory; anonymous sessions not allowed in MVP.
-   `content` cannot be empty unless it's a tool-only response.
