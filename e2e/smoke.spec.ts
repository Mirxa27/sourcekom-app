import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check page loads
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check navigation exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Find and click About link
    const aboutLink = page.locator('a:has-text("About"), a[href*="/about"]').first();
    if (await aboutLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/, { timeout: 10000 });
    }
  });
});

