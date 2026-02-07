# Feature Specification: Proposals Frontend Refactor (Stitch)

**Feature Branch**: `09-proposals-frontend`
**Status**: Draft
**Input**: Roadmap Goal "Integração Frontend (Phase 3)" from 07-proposal-engine.

## Contexto
O backend de propostas está completo (07). O frontend existe (`ProposalsListPage.jsx`, `ProposalDetailPage.jsx`) mas precisa ser alinhado com o Design System Stitch (v1), usando componentes padronizados (`LeadListTable` style, `AdaptiveHeader`, `StatusBadge`).

## User Scenarios

### US1: Listagem de Propostas
O usuário deve ver uma lista de propostas com filtros (Status, Data) e identificação clara do Lead e valores.
- **Visual**: Tabela clean, avatars de leads, badges de status coloridos.
- **Interação**: Clicar na proposta leva ao detalhe. Botão "Nova Proposta" visível.

### US2: Detalhe da Proposta
O usuário deve ver todos os detalhes da proposta técnica/comercial, editar status e enviar para o cliente.
- **Cards**: "Resumo Financeiro", "Sistema", "Ações".
- **Ações**: Enviar Email, Gerar PDF, Link Público.

### US3: Public Proposal View (Cliente)
O cliente (externo) acessa o link público e vê a proposta formatada para leitura (Web + PDF download).
- **Nota**: Já existe `ProposalViewPublicPage`, precisa verificar se adere ao design "Public Facing" (clean, branded).

## Requirements

1. **Refatorar `ProposalsListPage`**:
   - Usar `AdaptiveHeader` com breadcrumbs e filtros no header (se possível) ou toolbar.
   - Usar Tabela estilo Stitch (similar `LeadListTableRefactored`).

2. **Refatorar `ProposalDetailPage`**:
   - Layout de Colunas (Left: Detalhes, Right: Ações/Edição).
   - Feedback visual claro para "Enviando", "Salvando".

3. **Integração com Backend**:
   - Verificar chamadas `api.post('/send')` e `api.post('/generate-pdf')`.

## Success Criteria
- [ ] Listagem alinhada visualmente com Leads.
- [ ] Detalhe permite ciclo completo (Rascunho -> Enviado -> Aceito) sem erros de UI.
- [ ] Sidebar e Navegação consistentes.
