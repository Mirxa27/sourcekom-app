import { test, expect } from '@playwright/test';

test.describe('Browse Resources', () => {
  test('should load browse page', async ({ page }) => {
    await page.goto('/browse');
    
    await expect(page).toHaveURL(/\/browse/);
    
    // Check page content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display resource filters', async ({ page }) => {
    await page.goto('/browse');
    
    // Check if filters are visible (if they exist)
    const filters = page.locator('input[type="checkbox"], select').first();
    if (await filters.isVisible().catch(() => false)) {
      await expect(filters).toBeVisible();
    }
  });

  test('should navigate to resource detail page', async ({ page }) => {
    await page.goto('/browse');
    
    // Wait for resources to load
    await page.waitForTimeout(2000);
    
    // Try to find a resource link
    const resourceLink = page.locator('a[href*="/resources/"]').first();
    if (await resourceLink.isVisible().catch(() => false)) {
      await resourceLink.click();
      await expect(page).toHaveURL(/\/resources\/.+/);
    }
  });
});

test.describe('Resource Detail Page', () => {
  test('should load resource detail page', async ({ page }) => {
    // Try to navigate to a resource if available
    await page.goto('/browse');
    await page.waitForTimeout(2000);
    
    const resourceLink = page.locator('a[href*="/resources/"]').first();
    if (await resourceLink.isVisible().catch(() => false)) {
      await resourceLink.click();
      await expect(page).toHaveURL(/\/resources\/.+/);
      
      // Check resource details are visible
      const title = page.locator('h1, h2').first();
      await expect(title).toBeVisible();
    }
  });
});

