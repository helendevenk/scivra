import { expect, test } from '@playwright/test';

test.describe('marketing smoke', () => {
  test('homepage renders with heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('pricing page is reachable', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).not.toBeEmpty();
    // Page should load without error
    await expect(page.locator('text=404')).not.toBeVisible();
  });

  test('blog index is reachable', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.locator('text=404')).not.toBeVisible();
  });

  test('experiments index lists experiment cards', async ({ page }) => {
    await page.goto('/experiments');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Should have at least one experiment card link
    const cards = page.locator('a[href*="/experiments/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('experiment detail page loads', async ({ page }) => {
    await page.goto('/experiments/newtons-laws');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('sign-in page is reachable', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.locator('text=404')).not.toBeVisible();
  });
});

test.describe('SEO smoke', () => {
  test('robots.txt is served', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent');
    expect(body).toContain('Sitemap');
  });

  test('sitemap.xml is served', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/experiments');
  });
});
