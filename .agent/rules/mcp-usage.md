---
description: Diretriz para utilização proativa de servidores MCP (Model Context Protocol) conectados.
---

# Regra de Uso de MCPs (Model Context Protocol)

1. **Verificação de Ferramentas**:
   - Antes de tarefas complexas (especialmente UI/UX ou Integrações), verifique se há ferramentas MCP disponíveis (prefixo `mcp_*`) que possam acelerar o processo.

2. **Integração com Stitch (UI Generation)**:
   - Para tarefas de frontend que envolvam "criar nova tela", "prototipar", ou "mockup", utilize prioritariamente:
     1. `mcp_stitch_create_project` para iniciar um escopo.
     2. `mcp_stitch_generate_screen_from_text` para gerar o visual inicial baseado no PRD.
     3. `mcp_stitch_fetch_screen_code` para recuperar o código HTML/Tailwind/React.
   - **Adaptação — DS de referência**: O código gerado pelo Stitch (ou qualquer UI) deve seguir o **Design System de referência** documentado em `docs/QUARKS_OS_Design_System_v1.md`. Esse DS reflete o que está na tela hoje: **Tailwind CSS**, cores `petroleum` e `solar`, classes de componente em `src/frontend/src/index.css` (`.technical-card`, `.kpi-title`, `.kpi-value`, `.btn-pill`, etc.), ícones Material Symbols Outlined, fontes Geist/Inter. Consultar sempre esse documento ao adaptar ou criar UI; Mantine é usado apenas onde já existir (ex.: ProposalPage, MainLayout).

3. **Mapeamento de Contexto**:
   - Utilize `list_resources` e `read_resource` para acessar documentções ou dados fornecidos via MCP, tratando-os como fonte de verdade dinâmica.
