// @ts-check
// Fluxos: lista de leads → ficha do lead → nova proposta (com leadId).
// Requer: frontend + backend rodando e E2E_LOGIN_EMAIL + E2E_LOGIN_PASSWORD.

const { test, expect } = require('@playwright/test');

test.describe('Fluxo Lead → Proposta', () => {
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

  test('lista de leads carrega e abre ficha ao clicar', async ({ page }) => {
    await page.goto('/leads');
    await expect(page).toHaveURL(/\/leads/);
    const tableOrEmpty = page.getByRole('table').or(page.getByText(/nenhum lead|0 lead|no lead/i));
    await expect(tableOrEmpty.first()).toBeVisible({ timeout: 10000 });
    const firstDataRow = page.getByRole('table').locator('tbody tr').first();
    if (await firstDataRow.count() > 0) {
      await firstDataRow.click();
      await expect(page).toHaveURL(/\/leads\/[a-f0-9-]+/);
      await expect(page.getByText(/visão geral|dados|qualificação|proposta/i).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('da ficha do lead, botão proposta leva a /proposals/new?leadId=', async ({ page }) => {
    await page.goto('/leads');
    const firstDataRow = page.getByRole('table').locator('tbody tr').first();
    if (await firstDataRow.count() === 0) {
      test.skip(true, 'Nenhum lead na lista para testar');
    }
    await firstDataRow.click();
    await expect(page).toHaveURL(/\/leads\/[a-f0-9-]+/);
    const proposalBtn = page.getByRole('button', { name: /add_circle\s+proposta|proposta/i }).first();
    await proposalBtn.click();
    await expect(page).toHaveURL(/\/proposals\/new\?leadId=[a-f0-9-]+/);
  });
});
