# Testes visuais com Chrome DevTools MCP

Screenshots e snapshots gerados pelo MCP Chrome DevTools para regressão visual e validação de UI.

## Como rodar testes visuais

1. **Subir o frontend:** `cd src/frontend && npm run dev` (http://localhost:5173).
2. No Cursor, peça ao assistente para usar o Chrome DevTools MCP para:
   - **Navegar** para uma rota (ex.: `/login`, `/dashboard`, `/leads`).
   - **Snapshot** (`take_snapshot`): árvore a11y da página (estrutura, textos, botões).
   - **Screenshot** (`take_screenshot`): imagem PNG para comparação visual.

## Exemplos de comandos (para o assistente)

- "Tire um screenshot da página de login e salve em docs/visual-tests/login.png"
- "Navegue para /dashboard, tire um snapshot e um screenshot"
- "Liste os elementos da página atual e tire um screenshot full page"

## Requisitos

- Chrome aberto e conectado ao MCP (Cursor com Chrome DevTools MCP instalado).
- Frontend rodando em http://localhost:5173.
