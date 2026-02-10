# Credenciais de desenvolvimento / teste

Usuários para ambiente local e testes. **Não usar em produção.**

---

## 1. Usuário Master

| Campo   | Valor              |
|--------|--------------------|
| **Login** | `master@quarks.solar` |
| **Senha** | `master123`           |
| **Role**  | ADMIN                 |

**Criar/atualizar no banco:**

```bash
cd src/backend && node create_master_user.js
```

---

## 2. Admin alternativo

| Campo   | Valor                |
|--------|----------------------|
| **Login** | `admin@quarks.solar`   |
| **Senha** | `admin123`             |
| **Role**  | ADMIN                  |

**Criar no banco:**

```bash
cd src/backend && node create_alt_users.js
```

---

## 3. Seed para E2E (Master + 1 lead)

Para que **todos** os testes E2E rodem (incluindo o fluxo “ficha do lead → nova proposta”):

```bash
cd src/backend && node create_e2e_seed.js
```

Isso cria o usuário Master (se não existir) e um lead de teste. Depois rode os testes com as credenciais do Master (ver **e2e/README.md**).

## 4. Uso em testes

- **Testes manuais (login no browser):** usar qualquer um dos logins acima, após rodar o script correspondente.
- **Testes E2E (Playwright):** definir `E2E_LOGIN_EMAIL` e `E2E_LOGIN_PASSWORD` (ex.: master). Rodar o seed antes para ter 1 lead. Ver **e2e/README.md**.

**Referência:** `docs/TESTE_LOGIN_STITCH.md` cita `admin@quarks.com` / `admin123`; os scripts atuais usam `admin@quarks.solar`. Preferir os valores dos scripts (`admin@quarks.solar`) para consistência.
