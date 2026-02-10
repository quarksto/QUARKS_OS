// @ts-check
// Fluxos: lista de propostas, abrir detalhe, nova proposta (sem lead).
// Requer: frontend + backend, E2E_LOGIN_EMAIL + E2E_LOGIN_PASSWORD.

const { test, expect } = require('@playwright/test');

test.describe('Fluxo Propostas', () => {
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

  test('lista de propostas carrega', async ({ page }) => {
    await page.goto('/proposals');
    await expect(page).toHaveURL(/\/proposals/);
    const tableOrEmpty = page.getByRole('table').or(page.getByText(/nenhuma proposta|0 proposta|propostas/i));
    await expect(tableOrEmpty.first()).toBeVisible({ timeout: 10000 });
  });

  test('abrir primeira proposta da lista (se houver) leva ao detalhe', async ({ page }) => {
    await page.goto('/proposals');
    const firstRow = page.getByRole('table').locator('tbody tr').first();
    if (await firstRow.count() === 0) {
      test.skip(true, 'Nenhuma proposta na lista');
    }
    await firstRow.click();
    await expect(page).toHaveURL(/\/proposals\/[a-f0-9-]+/, { timeout: 8000 });
  });

  test('link Nova Proposta leva a /proposals/new', async ({ page }) => {
    await page.goto('/proposals');
    const link = page.getByRole('link', { name: /nova proposta/i }).first();
    await expect(link).toBeVisible({ timeout: 5000 });
    await link.click();
    await expect(page).toHaveURL(/\/proposals\/new/, { timeout: 5000 });
  });
});
