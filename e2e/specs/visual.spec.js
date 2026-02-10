// @ts-check
// Testes visuais: captura de telas e comparação com baseline (regressão visual).
// Requer: frontend + backend rodando, E2E_LOGIN_EMAIL + E2E_LOGIN_PASSWORD para telas autenticadas.
//
// Primeira execução (criar baselines):
//   npx playwright test e2e/specs/visual.spec.js --update-snapshots
//
// Execução normal (comparar com baseline):
//   npx playwright test e2e/specs/visual.spec.js
//
// Ver no navegador (modo headed):
//   npx playwright test e2e/specs/visual.spec.js --headed
//
// UI do Playwright (ver passo a passo):
//   npx playwright test e2e/specs/visual.spec.js --ui

const { test, expect } = require('@playwright/test');

test.describe('Visual – telas principais', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('tela de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByLabel(/e-mail|email/i).or(page.locator('#email'))).toBeVisible({ timeout: 8000 });
    await expect(page).toHaveScreenshot('login.png');
  });

  test.describe('telas autenticadas', () => {
    test.beforeEach(async ({ page }) => {
      const EMAIL = process.env.E2E_LOGIN_EMAIL;
      const PASSWORD = process.env.E2E_LOGIN_PASSWORD;
      test.skip(!EMAIL || !PASSWORD, 'E2E_LOGIN_EMAIL e E2E_LOGIN_PASSWORD obrigatórios para telas autenticadas');
      await page.goto('/login');
      await page.locator('#email').fill(EMAIL);
      await page.locator('#password').fill(PASSWORD);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(u => u.pathname !== '/login', { timeout: 15000 });
    });

    test('dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).not.toHaveURL(/\/login/);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveScreenshot('dashboard.png');
    });

    test('lista de leads', async ({ page }) => {
      await page.goto('/leads');
      await expect(page).toHaveURL(/\/leads/);
      await page.waitForLoadState('domcontentloaded');
      const tableOrEmpty = page.getByRole('table').or(page.getByText(/nenhum lead|0 lead/i));
      await expect(tableOrEmpty.first()).toBeVisible({ timeout: 10000 });
      await expect(page).toHaveScreenshot('leads.png');
    });

    test('lista de propostas', async ({ page }) => {
      await page.goto('/proposals');
      await expect(page).toHaveURL(/\/proposals/);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveScreenshot('proposals.png');
    });
  });
});
