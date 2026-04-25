import { test, expect } from '@playwright/test';

test.describe('Smoke Tests — English Only', () => {
  test('homepage loads', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('labs page loads', async ({ page }) => {
    const res = await page.goto('/labs');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('experiment detail page loads', async ({ page }) => {
    const res = await page.goto('/labs/physics/ngss-hs/newtons-laws-of-motion');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('UPG page loads', async ({ page }) => {
    const res = await page.goto('/upg');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    const res = await page.goto('/pricing');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('gallery page loads', async ({ page }) => {
    const res = await page.goto('/gallery');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('privacy policy page loads', async ({ page }) => {
    const res = await page.goto('/privacy-policy');
    expect(res?.status()).toBe(200);
  });

  test('terms of service page loads', async ({ page }) => {
    const res = await page.goto('/terms-of-service');
    expect(res?.status()).toBe(200);
  });
  
  test('legacy chinese route no longer serves chinese content', async ({ page }) => {
    await page.goto('/zh');
    expect(page.url()).not.toContain('/zh');
  });
});
