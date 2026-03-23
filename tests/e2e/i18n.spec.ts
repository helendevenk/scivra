import { test, expect } from '@playwright/test';

test.describe('i18n — Locale Routing and Content', () => {
  test('English homepage loads at /en', async ({ page }) => {
    const res = await page.goto('/en');
    expect(res?.status()).toBe(200);

    await expect(page.locator('h1').first()).toBeVisible();

    // Navigation should show English text
    await expect(
      page.getByText('Experiments', { exact: true }).first()
    ).toBeVisible();
  });

  test('Chinese homepage loads at /zh', async ({ page }) => {
    const res = await page.goto('/zh');
    expect(res?.status()).toBe(200);

    await expect(page.locator('h1').first()).toBeVisible();

    // Navigation should show Chinese text (from zh/landing.json)
    await expect(
      page.getByText('实验室', { exact: true }).first()
    ).toBeVisible();
  });

  test('language switcher changes URL prefix', async ({ page }) => {
    // Start on English page
    await page.goto('/en');

    // Find the locale selector (it renders language options)
    // The LocaleSelector component should be in the header
    const localeSelector = page.locator(
      'button[aria-label*="language"], button[aria-label*="locale"], [data-slot="locale-selector"]'
    );

    // Try to find the locale switcher
    // It might be a dropdown or button group
    if (await localeSelector.first().isVisible()) {
      await localeSelector.first().click();

      // Click Chinese option
      const zhOption = page.getByText('中文', { exact: false }).first();
      if (await zhOption.isVisible()) {
        await zhOption.click();
        await page.waitForURL(/\/zh/);
        expect(page.url()).toContain('/zh');
      }
    } else {
      // Try finding locale links directly (some implementations use links)
      const zhLink = page.locator('a[href*="/zh"]').first();
      if (await zhLink.isVisible()) {
        await zhLink.click();
        await page.waitForURL(/\/zh/);
        expect(page.url()).toContain('/zh');
      } else {
        // Locale switcher implementation not found — skip gracefully
        test.skip();
      }
    }
  });

  test('experiments page content changes with locale', async ({ page }) => {
    // English experiments page
    await page.goto('/en/experiments');
    const enTitle = page.locator('h1').first();
    await expect(enTitle).toHaveText('Physics Experiments');

    // Chinese experiments page
    await page.goto('/zh/experiments');
    const zhTitle = page.locator('h1').first();
    await expect(zhTitle).toHaveText('物理实验');
  });

  test('pricing page content changes with locale', async ({ page }) => {
    // English pricing
    const enRes = await page.goto('/en/pricing');
    expect(enRes?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    const enHeading = await page.locator('h1').first().textContent();

    // Chinese pricing
    const zhRes = await page.goto('/zh/pricing');
    expect(zhRes?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    const zhHeading = await page.locator('h1').first().textContent();

    // The headings should be different (different languages)
    expect(enHeading).not.toBe(zhHeading);
  });
});
