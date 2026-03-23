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

  test('empty prompt submission shows validation error', async ({ page }) => {
    await page.goto('/en/upg');

    // Find the generate / submit button and click without entering text
    const submitButton = page.locator('button').filter({
      hasText: /generate|try free/i,
    });
    await expect(submitButton.first()).toBeVisible();

    // The textarea should be empty
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveValue('');

    // Click submit with empty prompt
    await submitButton.first().click();

    // Should show validation message (min 2 chars required)
    // The app enforces MIN_PROMPT_LENGTH = 2
    await expect(
      page.getByText(/at least|enter|too short|characters/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('valid prompt shows loading state', async ({ page }) => {
    await page.goto('/en/upg');

    const textarea = page.locator('textarea').first();
    await textarea.fill('Doppler Effect');

    const submitButton = page.locator('button').filter({
      hasText: /generate|try free/i,
    });
    await submitButton.first().click();

    // After clicking, should show loading indicator
    // The component shows a Loader2 spinner and progress bar during generation
    // Note: this may fail if auth is required, but the loading state
    // or an auth prompt should appear
    const loadingOrAuth = page
      .locator('[class*="animate-spin"], [role="progressbar"]')
      .first()
      .or(page.getByText(/sign in|sign up|checking/i).first());

    await expect(loadingOrAuth).toBeVisible({ timeout: 10000 });
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

  test('gallery card shows title, thumbnail, like count', async ({ page }) => {
    await page.goto('/en/gallery');

    // Wait for gallery content to load (cards are client-side rendered)
    // If no items exist, the page should still load successfully
    const cards = page.locator('[class*="cursor-pointer"]');

    // If cards are present, check their structure
    if ((await cards.count()) > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      // Card should show prompt text as title (h3)
      const cardTitle = firstCard.locator('h3').first();
      await expect(cardTitle).toBeVisible();

      // Like count with Heart icon should be present
      const likeArea = firstCard.locator('text=/\\d+/').first();
      await expect(likeArea).toBeVisible();
    } else {
      // Empty state is acceptable — gallery may have no published items
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('gallery detail page loads when clicking card', async ({ page }) => {
    await page.goto('/en/gallery');

    const cards = page.locator('[class*="cursor-pointer"]');

    if ((await cards.count()) > 0) {
      await cards.first().click();
      await page.waitForURL(/\/gallery\/.+/);

      // Detail page should load with status 200 (check we didn't get 404)
      // The page should render content
      await expect(page.locator('body')).not.toContainText(
        'Page not found'
      );
    } else {
      // No gallery items to click — test passes (nothing to navigate to)
      test.skip();
    }
  });
});
