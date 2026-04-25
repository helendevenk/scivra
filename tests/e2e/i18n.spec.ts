import { test, expect } from '@playwright/test';

test.describe('English-only routing', () => {
  test('homepage loads without locale prefix', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('english routes load without /en prefix', async ({ page }) => {
    const res = await page.goto('/pricing');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(page.url()).not.toContain('/en/');
  });

  test('locale switcher is not shown in single-language mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('中文', { exact: false })).toHaveCount(0);
  });

  test('legacy /zh route does not remain on chinese prefix', async ({ page }) => {
    await page.goto('/zh');
    expect(page.url()).not.toContain('/zh');
  });
});
