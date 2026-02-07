# Correções de erros — Quarks OS

**Data:** 2026-02-02

---

## 1. Erros identificados (a partir dos logs e código)

| Origem | Problema |
|--------|----------|
| **Maestro** | Bloco de código duplicado/errado em `execute()`: referência a `domain` e `agent` indefinidos (código morto que sobrescrevia o método correto). |
| **Maestro** | Uso de `calculation.system_size_kwp` (snake_case) quando o agente **calc** retorna **camelCase** (`systemSizeKwp`, `generationMonthly`, etc.) → resultado `undefined` e "No kit found for undefined kWp". |
| **Copilot** | `new GoogleGenAI()` no construtor do Copilot e do FileManager: sem `GOOGLE_API_KEY` no `.env` o backend quebrava ao carregar o módulo. |
| **Python (calc_engine)** | Em alguns contextos aparecia `NameError: Optional is not defined` em `roi.py`; o arquivo já tem `from typing import Optional` — pode ser cache ou ambiente. |

---

## 2. Correções aplicadas

### 2.1 `src/backend/src/orchestrator/maestro.js`

- **Removido** o primeiro bloco `async execute(workflowName, payload) { ... }` que estava duplicado e usava `this.agents[domain] = agent` (variáveis inexistentes).
- **Ajuste de nomes** para o retorno do agente **calc** (camelCase):
  - `FIND_BEST_KIT`: uso de `calculation.systemSizeKwp ?? calculation.system_size_kwp ?? 5` para não passar `undefined` ao Product.
  - Em `workflowPreviewProposal`, montagem de `proposalData.generation` usando:
    - `calculation.systemSizeKwp ?? calculation.system_size_kwp`
    - `calculation.generationMonthly`, `calculation.panelsCount`, `calculation.areaRequired` com fallbacks para snake_case quando existir.

### 2.2 `src/backend/src/agents/copilot-domain/index.js`

- **Inicialização tardia do Gemini:** o cliente não é mais criado no construtor.
  - `this._ai = null` no construtor.
  - Getter `get ai()`: só instancia `GoogleGenAI` quando for usar e se `GOOGLE_API_KEY` estiver definida; caso contrário lança erro claro.
  - Assim o backend sobe mesmo sem chave; o erro só aparece ao usar o chat.

### 2.3 `src/backend/src/agents/copilot-domain/file-manager.js`

- **Inicialização tardia:** `this.client` não é mais criado no construtor.
  - `this._client = null` no construtor.
  - Getter `get client()`: cria o cliente só quando necessário e só se `GOOGLE_API_KEY` existir.
  - Evita que o `require('file-manager')` derrube o servidor quando a chave não está configurada.

---

## 3. Verificação

- Backend foi iniciado com `node src/server.js` em `src/backend` e subiu sem exceções (porta 3001).
- Todos os agentes (lead, calc, proposal, product, pricing, copilot, visual, analytics) foram registrados.

---

## 4. O que você pode fazer agora

1. **Manter o backend estável**
   - Com `.env` e `GOOGLE_API_KEY` configurada: chat e File API funcionam.
   - Sem `GOOGLE_API_KEY`: backend sobe; ao abrir o chat aparece mensagem pedindo para configurar a chave.

2. **Motor Python (calc_engine)**
   - Se ainda aparecer `Optional is not defined` em `roi.py`, rode o serviço a partir da pasta do calc_engine com o `venv` ativado e confira se não há outro `roi.py` no path.
   - O arquivo `src/calc_engine/src/models/roi.py` já contém `from typing import Optional`.

3. **Logs antigos**
   - `error_verify.log` e `server.log` estavam em UTF-16 (BOM), o que atrapalha leitura em alguns editores. Os erros que motivaram as correções foram tratados no código acima.

---

*Resumo das alterações feitas para reduzir falhas no backend e no fluxo de proposta.*
