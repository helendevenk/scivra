import { test, expect } from '@playwright/test';

test.describe('Smoke Tests — English', () => {
  test('homepage loads', async ({ page }) => {
    const res = await page.goto('/en');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('experiments page loads', async ({ page }) => {
    const res = await page.goto('/en/experiments');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('experiment detail page loads', async ({ page }) => {
    const res = await page.goto('/en/experiments/newtons-laws-of-motion');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('UPG page loads', async ({ page }) => {
    const res = await page.goto('/en/upg');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    const res = await page.goto('/en/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    const res = await page.goto('/en/pricing');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('gallery page loads', async ({ page }) => {
    const res = await page.goto('/en/gallery');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('privacy policy page loads', async ({ page }) => {
    const res = await page.goto('/en/privacy-policy');
    expect(res?.status()).toBe(200);
  });

  test('terms of service page loads', async ({ page }) => {
    const res = await page.goto('/en/terms-of-service');
    expect(res?.status()).toBe(200);
  });
});

test.describe('Smoke Tests — Chinese', () => {
  test('homepage loads', async ({ page }) => {
    const res = await page.goto('/zh');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('experiments page loads', async ({ page }) => {
    const res = await page.goto('/zh/experiments');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    const res = await page.goto('/zh/pricing');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
