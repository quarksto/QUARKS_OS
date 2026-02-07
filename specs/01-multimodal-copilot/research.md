# Research: Multimodal Sales Copilot

**Decision**: Use Google Gemini API (Model: **Gemini 3**).
**Rationale**: 
1.  **Strict Requirement**: User mandated Gemini 3.
2.  **Native Multimodality**: Gemini 3 processes Video and Audio as first-class tokens (not just frames/transcription), enabling nuanced understanding of site surveys and tone of voice.
3.  **Long Context**: Necessary for analyzing long video inputs or massive RAG contexts (manuals).
2.  **Function Calling**: Robust support for defining tools (`tools` schema) that the model can invoke, perfect for wrapping `Maestro` agents.
3.  **Cost/Efficiency**: Flash model is highly efficient for high-throughput tasks like chat.

**Alternatives Considered**:
-   **OpenAI GPT-4o**: Good but requires external OCR for complex docs in some flows; Google ecosystem preference aligned with "Google Antigravity".
-   **Tesseract OCR + LLM**: classic approach, but brittle for unstructured/varying energy bills. Gemini Vision is superior.

**Implementation Patterns**:
-   **Tool Binding**: The backend will expose a `tools.js` that maps LLM function calls (e.g. `call_maestro("create_proposal", {...})`) to internal `Maestro.execute()` calls.
-   **Streaming**: For better UX, we should stream text responses, though MVP might use Request/Response for simplicity first (Phase 1).

**Unknowns Resolved**:
-   *Gemini SDK Version*: Use latest `^0.2.0` or stable.
-   *Auth*: Uses `GOOGLE_API_KEY` env var.
