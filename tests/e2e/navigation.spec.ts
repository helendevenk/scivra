import { test, expect } from '@playwright/test';

test.describe('Navigation — Desktop', () => {
  test('main navigation links work (Experiments, Pricing, Blog)', async ({
    page,
  }) => {
    await page.goto('/en');

    // Experiments link — direct nav item (no dropdown)
    const experimentsLink = page
      .locator('header')
      .getByText('Experiments', { exact: true })
      .first();
    await expect(experimentsLink).toBeVisible();
    await experimentsLink.click();
    await page.waitForURL(/\/experiments/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Go back to home
    await page.goto('/en');

    // Pricing link — direct nav item
    const pricingLink = page
      .locator('header')
      .getByText('Pricing', { exact: true })
      .first();
    await expect(pricingLink).toBeVisible();
    await pricingLink.click();
    await page.waitForURL(/\/pricing/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Blog is under "Content" dropdown — click Content trigger, then Blog
    await page.goto('/en');
    const contentTrigger = page
      .locator('header')
      .getByText('Content', { exact: true })
      .first();

    if (await contentTrigger.isVisible()) {
      await contentTrigger.click();

      const blogLink = page.getByText('Blog', { exact: true }).first();
      await expect(blogLink).toBeVisible();
      await blogLink.click();
      await page.waitForURL(/\/blog/);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('mobile hamburger menu opens and links work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en');

    // Hamburger button should be visible on mobile
    const hamburger = page.locator('button[aria-label*="Menu"]').first();
    await expect(hamburger).toBeVisible();

    // Click to open mobile menu
    await hamburger.click();

    // Mobile menu should show nav items
    const mobileNav = page.locator('nav[role="navigation"]').first();
    await expect(mobileNav).toBeVisible();

    // Click Experiments link in mobile menu
    const experimentsLink = mobileNav
      .getByText('Experiments', { exact: true })
      .first();
    await expect(experimentsLink).toBeVisible();
    await experimentsLink.click();

    await page.waitForURL(/\/experiments/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/en');

    // Scroll to footer
    const footer = page.locator('footer').first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    // Footer should contain links
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Click the first navigable footer link and verify it loads
    for (let i = 0; i < linkCount; i++) {
      const link = footerLinks.nth(i);
      const href = await link.getAttribute('href');
      // Skip external links and anchor links
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        await link.click();
        // Should not land on error page
        await expect(page.locator('body')).not.toContainText(
          'Page not found'
        );
        break;
      }
    }
  });

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/en/experiments');

    // Brand logo should link to home
    const logo = page.locator('header a').first();
    await expect(logo).toBeVisible();

    await logo.click();

    // Should navigate to homepage (URL should be / or /en)
    await page.waitForURL(/\/(en)?$/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('404 page for invalid route', async ({ page }) => {
    const res = await page.goto('/en/this-route-does-not-exist-12345');

    // App should render the not-found page
    // The not-found.tsx shows "Page not found" text
    await expect(page.getByText('Page not found')).toBeVisible();
  });

  test('back button navigation works', async ({ page }) => {
    // Navigate: home -> experiments -> detail -> back -> back
    await page.goto('/en');
    await expect(page.locator('h1').first()).toBeVisible();
    const homeUrl = page.url();

    await page.goto('/en/experiments');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goto('/en/experiments/newtons-laws-of-motion');
    await expect(page.locator('h1').first()).toBeVisible();

    // Go back to experiments list
    await page.goBack();
    await page.waitForURL(/\/experiments$/);
    await expect(page.locator('h1').first()).toHaveText(
      'Physics Experiments'
    );

    // Go back to homepage
    await page.goBack();
    expect(page.url()).toBe(homeUrl);
  });
});
