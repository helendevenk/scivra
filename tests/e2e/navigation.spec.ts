import { test, expect } from '@playwright/test';

test.describe('Navigation — Desktop', () => {
  test('homepage exposes core product links without locale prefixes', async ({
    page,
  }) => {
    await page.goto('/');
    const labsLink = page.locator('a[href="/labs"]').first();
    const pricingLink = page.locator('a[href="/pricing"]').first();

    await expect(labsLink).toBeVisible();
    await expect(pricingLink).toBeVisible();

    await labsLink.click();
    await page.waitForURL('/labs');
    await expect(page.url()).not.toContain('/en/');

    await page.goto('/');
    await pricingLink.click();
    await page.waitForURL('/pricing');
    await expect(page.url()).not.toContain('/en/');
  });

  test('mobile hamburger menu opens and links work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Hamburger button should be visible on mobile
    const hamburger = page.locator('button[aria-label*="Menu"]').first();
    await expect(hamburger).toBeVisible();

    // Click to open mobile menu
    await hamburger.click();

    // Mobile menu should show nav items
    const mobileNav = page.locator('nav[role="navigation"]').first();
    await expect(mobileNav).toBeVisible();

    // Click Experiments link in mobile menu
    const pricingLink = mobileNav.locator('a[href="/pricing"]').first();
    await expect(pricingLink).toBeVisible();
    await pricingLink.click();

    await page.waitForURL('/pricing');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');

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
    await page.goto('/labs');

    // Brand logo should link to home
    const logo = page.locator('header a').first();
    await expect(logo).toBeVisible();

    await logo.click();

    // Should navigate to homepage (URL should be / or /en)
    await page.waitForURL('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('404 page for invalid route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');

    // App renders error/not-found page with "Something went wrong" or similar
    await expect(
      page.getByText(/something went wrong|not found|404/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('back button navigation works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    const homeUrl = page.url();

    await page.goto('/labs');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goto('/labs/physics/ngss-hs/newtons-laws-of-motion');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goBack();
    await page.waitForURL('/labs');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Interactive Science Labs'
    );

    await page.goBack();
    expect(page.url()).toBe(homeUrl);
  });
});
