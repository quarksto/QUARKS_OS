// @ts-check
// Testes de fumaça: rotas principais e redirecionamento de auth.
// Requer: frontend (http://localhost:5173) e backend rodando.

const { test, expect } = require('@playwright/test');

test.describe('Rotas públicas', () => {
  test('página de login carrega', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login|entrar|acessar/i }).or(
      page.getByLabel(/e-mail|email/i)
    ).first()).toBeVisible({ timeout: 10000 });
  });

  test('rota raiz redireciona para login ou dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });
});

test.describe('Rotas protegidas sem auth', () => {
  test('acesso a /dashboard sem login redireciona para login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('acesso a /leads sem login redireciona para login', async ({ page }) => {
    await page.goto('/leads');
    await expect(page).toHaveURL(/\/login/);
  });

  test('acesso a /proposals sem login redireciona para login', async ({ page }) => {
    await page.goto('/proposals');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Fluxo com login (opcional)', () => {
  const EMAIL = process.env.E2E_LOGIN_EMAIL;
  const PASSWORD = process.env.E2E_LOGIN_PASSWORD;

  test.skip(!EMAIL || !PASSWORD, 'E2E_LOGIN_EMAIL e E2E_LOGIN_PASSWORD não definidos');

  test('login e carregamento do dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-mail|email/i).fill(EMAIL);
    await page.getByLabel(/senha|password/i).fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    await expect(page.getByText(/dashboard|leads|pipeline|funil|propostas/i).first()).toBeVisible({ timeout: 8000 });
  });
});
