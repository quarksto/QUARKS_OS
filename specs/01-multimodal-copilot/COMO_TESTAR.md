# Como rodar e testar o Copilot (T014, T019, T022, T023)

## Pré-requisitos

1. **GOOGLE_API_KEY** — Chave da API do Google AI (Gemini).  
   - Obtenha em: https://aistudio.google.com/apikey  
   - Crie um arquivo `src/backend/.env` com:
   ```env
   GOOGLE_API_KEY=sua_chave_aqui
   ```

2. **PostgreSQL** — Banco rodando com o schema Prisma (migrações aplicadas).

3. **Node** (backend e frontend) e **Python 3** (motor de cálculo, opcional para chat).

---

## Passo a passo

### 1. Backend (porta 3001)

```bash
cd src/backend
npm install
npx prisma migrate deploy   # se ainda não rodou
node src/server.js
```

Ou com `nodemon`: `npm run dev` (se configurado).

### 2. Frontend (Vite)

```bash
cd src/frontend
npm install
npm run dev
```

Acesse o endereço que o Vite mostrar (ex.: http://localhost:5173).

### 3. Testar o Chat

1. No frontend, vá em **Chat** (ou `/chat`).
2. **T014 — Conversa texto**:  
   - Digite: `Gere uma proposta para João, consumo 600 kWh, cidade Campinas`.  
   - Verifique: resposta do Copilot (e, se houver tool, execução de proposta).
3. **T019 — Imagem (conta de luz)**:  
   - Clique no 📎, escolha uma **imagem** ou PDF de conta de luz.  
   - Envie com ou sem texto (ex.: "Extraia consumo e distribuidora").  
   - Verifique: resposta com consumo/distribuidora extraídos.
4. **T022 — Vídeo**:  
   - Envie um **vídeo** (.mp4) curto (ex.: telhado).  
   - Verifique: resposta sobre sombreamento/tipo de telhado.
5. **T023 — Áudio**:  
   - Envie um **áudio** (.mp3) com resumo de reunião.  
   - Verifique: resposta com resumo ou sugestão de proposta.

---

## Erros comuns

| Mensagem | Solução |
|----------|---------|
| "API do Gemini não configurada" | Definir `GOOGLE_API_KEY` em `src/backend/.env`. |
| "Arquivo muito grande" | Limite 25MB; use arquivo menor ou implemente File API (T021). |
| "Copilot não inicializado" | Backend não subiu ou Copilot não registrado; ver logs do backend. |
| CORS / rede | Backend em 3001, frontend em 5173; CORS já liberado no backend. |

---

## Motor de cálculo (opcional)

Para o Copilot **gerar propostas** de fato (tool `createProposal`), o motor Python precisa estar rodando:

```bash
cd src/calc_engine
# venv ativado
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend chama `http://localhost:8000` para cálculos; ajuste no backend se usar outra porta/host.
