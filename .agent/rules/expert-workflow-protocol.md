---
description: Define o ciclo de vida rigoroso para execução de tarefas (Análise -> Planejamento -> Construção -> Validação).
---

# Protocolo de Trabalho Experiente (Rigorous Workflow)

Este protocolo DEVE ser seguido para qualquer nova Funcionalidade (Feature) ou Tarefa Complexa.

## 1. 🔍 Análise (Analysis Layer)
*Antes de escrever qualquer código:*
- **Agente**: Atue como *Product Manager / Tech Lead*.
- **Skill Obrigatória**: Consultar `docs/` (PRD, Arquitetura) e regras existentes.
- **Ação**: Se houver ambiguidade, use o comportamento de `@speckit.clarify` (fazer perguntas) antes de prosseguir.
- **Python-First**: Para lógica de backend, dê preferência a **Python (FastAPI)** dada a sua estabilidade no ambiente atual, reservando Node.js para orquestração leve/BFF.

## 2. 📝 Planejamento (Planning Layer)
*Antes de alterar o sistema:*
- **Agente**: Atue como *Software Architect*.
- **Skill**: `@speckit.plan`.
- **Ação**: Atualize ou crie o `implementation_plan.md`.
    - Defina arquivos a criar/modificar.
    - Valide dependências.
    - Obtenha aprovação do usuário.

## 3. 🏗️ Construção (Construction Layer)
*Durante a codificação:*
- **Agente**: Atue como *Senior Engineer*.
- **Skill**: `@senior-engineer` (ment mindset).
- **Ação**:
    - Código modular e limpo.
    - Tratamento de erro explícito (try/catch global é insuficiente).
    - Logs detalhados para debug (`logger.info`, `logger.error`).

## 4. 🧐 Revisão & Validação (Review Layer)
*Logo após escrever o código (antes de notificar o usuário):*
- **Agente**: Atue como *QA Engineer / Security Auditor*.
- **Skill**: `@speckit.reviewer` e `@speckit.tester`.
- **Ação**:
    - **Self-Review**: O código segue as regras de Design System? Segue as regras de Idioma (PT-BR)?
    - **Verification**: Execute um script de teste (como `verify_engine.py`). Nunca assuma que "deve funcionar".
    - **Lint Virtual**: Verifique erros óbvios de importação ou sintaxe.

## 5. 📢 Entrega
- Somente após o PASS na fase 4, notifique o usuário com o artefato `walkthrough.md` atualizado.
