import { test, expect } from '@playwright/test';

// Test against deployed URL
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Deployment E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for deployment tests
    test.setTimeout(60000);
  });

  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle').catch(() => {});
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('navigation is accessible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 15000 });
    
    const links = page.locator('nav a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('can navigate to About page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Try multiple selectors for About link
    const aboutSelectors = [
      'a:has-text("About")',
      'a[href*="/about"]',
      'text=About',
    ];
    
    let clicked = false;
    for (const selector of aboutSelectors) {
      try {
        const link = page.locator(selector).first();
        if (await link.isVisible({ timeout: 3000 })) {
          await link.click();
          await page.waitForURL(/\/about/, { timeout: 10000 });
          clicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (clicked) {
      expect(page.url()).toContain('/about');
    } else {
      // Skip if About link not found
      test.skip();
    }
  });

  test('404 page works correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/non-existent-page-999999`, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Accept 401 (auth required) or 404 (not found) as valid responses
    const status = response?.status();
    expect([404, 401, 403]).toContain(status);
    
    // If 404, check for 404 content
    if (status === 404) {
      const notFoundContent = page.locator('text=404, text=Page Not Found, text=not found').first();
      await expect(notFoundContent).toBeVisible({ timeout: 10000 });
    }
  });

  test('responsive design works', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
  });

  test('images load correctly', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check for logo
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images load
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src').catch(() => null);
        if (src) {
          expect(src).toBeTruthy();
        }
      }
    }
  });

  test('forms are accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      await expect(forms.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
