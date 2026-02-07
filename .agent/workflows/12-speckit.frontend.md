---
description: Execute o pipeline especializado de frontend (Contexto -> Geração -> Implementação -> Auditoria Técnica).
---

Este workflow automatiza o uso de "Frontend Skills" integrando o design visual com a arquitetura de dados e orquestração do Quarks OS.

## Passos

1. **Definição de Contexto (Arquitetura)**:
   - Identifique o propósito da tela (O que faz vs. O que deveria fazer).
   - Mapeie as tabelas do Banco de Dados (Prisma) envolvidas (ex: `Leads`, `Proposals`).
   - Identifique os Domain Agents que a tela orquestra (ex: `LeadDomainAgent`).

2. **Geração/Refinamento (Stitch)**:
   - Use o prompt do Design System (`docs/MCP_STITCH_DS_PROMPT.md`) incluindo o contexto de dados mapeado.
   - Gere variantes e selecione a que melhor atende à funcionalidade.

3. **Implementação Técnica**:
   - Adapte o código para React.
   - Garanta o minimalismo técnico: **SEM RINGS** nos inputs, cores sólidas Petroleum/Solar.
   - Conecte as ações da UI aos endpoints do backend/agents.

4. **Auditoria Visual e Funcional (DevTools)**:
   - Abra no navegador local.
   - Capture Screenshot e Snapshot do DOM.
   - **Auditoria de Rede**: Verifique se as chamadas de API estão atingindo os modelos de dados corretos.

5. **Relatório de Qualidade Integrado**:
   - Screenshot visual.
   - Relatório de conformidade com o Banco de Dados e Orquestração.

## Quando usar:
- Criação de novas visões que interagem com o banco de dados.
- Refatoração de fluxos complexos (ex: Edição de Lead, Geração de Proposta).
- Auditoria de telas existentes para garantir que o "backend-first" está refletido na UI.
