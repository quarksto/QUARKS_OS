// @ts-check
// Acesso a todas as páginas principais após login.
// Requer: frontend + backend rodando, E2E_LOGIN_EMAIL + E2E_LOGIN_PASSWORD e seed (1 lead).

const { test, expect } = require('@playwright/test');

test.describe('Páginas protegidas (com login)', () => {
  test.beforeEach(async ({ page }) => {
    const EMAIL = process.env.E2E_LOGIN_EMAIL;
    const PASSWORD = process.env.E2E_LOGIN_PASSWORD;
    test.skip(!EMAIL || !PASSWORD, 'Credenciais E2E não definidas');
    await page.goto('/login');
    await page.locator('#email').fill(EMAIL);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(u => u.pathname !== '/login', { timeout: 15000 });
  });

  const pages = [
    { path: '/', name: 'Dashboard' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/leads', name: 'Leads' },
    { path: '/proposals', name: 'Propostas' },
    { path: '/clients', name: 'Clientes' },
    { path: '/products', name: 'Produtos' },
    { path: '/services', name: 'Serviços' },
    { path: '/pricing-rules', name: 'Regras de preço' },
    { path: '/kits', name: 'Kits' },
    { path: '/projetos', name: 'Projetos' },
    { path: '/dimensionamento', name: 'Dimensionamento' },
    { path: '/cronograma', name: 'Cronograma' },
    { path: '/settings', name: 'Configurações' },
    { path: '/workspace', name: 'Workspace' },
    { path: '/chat', name: 'Chat' },
  ];

  for (const { path, name } of pages) {
    test(`${name} (${path}) carrega sem erro`, async ({ page }) => {
      test.setTimeout(20000);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
