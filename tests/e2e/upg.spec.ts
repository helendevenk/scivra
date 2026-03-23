import { test, expect } from '@playwright/test';

test.describe('UPG — Generator Page', () => {
  test('UPG page loads with input form', async ({ page }) => {
    const res = await page.goto('/en/upg');
    expect(res?.status()).toBe(200);

    // Page title
    await expect(page.locator('h1').first()).toBeVisible();

    // The textarea prompt input should be present
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
  });

  test('empty prompt keeps generate button disabled', async ({ page }) => {
    await page.goto('/en/upg');

    // The textarea should be empty
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveValue('');

    // Generate button should be disabled when prompt is empty
    const submitButton = page.getByRole('button', { name: /try free|generate/i });
    await expect(submitButton).toBeDisabled();
  });

  test('valid prompt enables generate button', async ({ page }) => {
    await page.goto('/en/upg');

    const textarea = page.locator('textarea').first();
    await textarea.fill('Doppler Effect');

    // After entering text, the generate button should become enabled
    const submitButton = page.getByRole('button', { name: /try free|generate/i });
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
  });
});

test.describe('UPG — Gallery Page', () => {
  test('gallery page loads with published UPGs', async ({ page }) => {
    const res = await page.goto('/en/gallery');
    expect(res?.status()).toBe(200);

    // Page should have a heading
    await expect(page.locator('h1').first()).toBeVisible();

    // Gallery page title
    await expect(page.locator('h1').first()).toContainText(/gallery/i);
  });

  test('gallery card shows content if items exist', async ({ page }) => {
    await page.goto('/en/gallery');
    await page.waitForTimeout(2000); // wait for client-side render

    const cards = page.locator('a[href*="/gallery/"], [data-testid="gallery-card"]');
    const count = await cards.count();

    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      // Empty state is acceptable — gallery may have no published items
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('gallery detail page loads when clicking card', async ({ page }) => {
    await page.goto('/en/gallery');
    await page.waitForTimeout(2000);

    const cards = page.locator('a[href*="/gallery/"]');
    const count = await cards.count();

    if (count > 0) {
      await cards.first().click();
      await page.waitForURL(/\/gallery\/.+/);
      await expect(page.locator('body')).not.toContainText('Page not found');
    } else {
      test.skip();
    }
  });
});
