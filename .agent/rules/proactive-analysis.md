---
description: Define o comportamento de análise contínua, busca por melhorias e otimização baseada em capabilities.
---

# Regra de Análise Proativa e Otimização

1. **Consulta à Documentação**:
   - Antes de iniciar qualquer tarefa significativa (Sprint, Feature, Refactor), o agente deve consultar a pasta `docs/` (especialmente PRD, Arquitetura e Design System) para garantir alinhamento.
   - Sempre verifique se a implementação atual diverge do especificado e alerte o usuário.

2. **Melhoria Contínua**:
   - Ao ler ou escrever código, se o agente identificar uma oportunidade de otimização (performance, segurança, legibilidade), deve sugerir ativamente.
   - Não apenas implemente o pedido: **melhore-o**. Se o usuário pedir um endpoint simples, mas você notar que ele precisa de validação, sugira/adicione a validação (Zod/Joi) citando a boa prática.

3. **Soluções Baseadas em Capacidade**:
   - Utilize as *Skills* instaladas (Tier 1/2/3) como referência de "Otimização".
   - Exemplo: Se estiver mexendo no Docker, consulte mentalmente as práticas de `@docker-compose-orchestration` e sugira melhorias no Dockerfile.
   - Exemplo: Se estiver criando uma Query SQL, verifique índices e performance como um `@database-architect` faria.

4. **Socratic Questioning & Gaps**:
   - Se a especificação for ambígua, use o método socrático (via skill `@speckit.quizme` se disponível ou nativamente) para identificar buracos na lógica antes de codar.
