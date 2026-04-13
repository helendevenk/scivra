import { test, expect } from '@playwright/test';

test.describe('Labs Discovery', () => {
  test('labs index page loads with subject cards', async ({
    page,
  }) => {
    const res = await page.goto('/labs');
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Interactive Science Labs'
    );
    await expect(page.locator('a.group').first()).toBeVisible();
  });

  test('subject page exposes experiment cards', async ({ page }) => {
    const res = await page.goto('/labs/physics');
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Physics Virtual Labs'
    );
    await expect(
      page.locator('a[href^="/labs/physics/"][href*="/"]').nth(1)
    ).toBeVisible();
  });

  test('experiment detail page loads on canonical labs route', async ({
    page,
  }) => {
    const res = await page.goto(
      '/labs/physics/ngss-hs/newtons-laws-of-motion'
    );
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      "Newton's Laws"
    );
    await expect(
      page.locator('nav').filter({ hasText: 'Labs' }).first()
    ).toContainText('Labs');
  });

  test('legacy experiment route redirects to labs detail page', async ({
    page,
  }) => {
    await page.goto('/experiments/newtons-laws-of-motion');
    await page.waitForURL('/labs/physics/ngss-hs/newtons-laws-of-motion');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      "Newton's Laws"
    );
  });

  test('grade filter on labs index updates the route', async ({ page }) => {
    await page.goto('/labs');
    await page.getByRole('link', { name: 'AP' }).first().click();
    await expect(page).toHaveURL(/\/labs\?grade=AP/);
  });
});
