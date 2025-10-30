import { test, expect } from '@playwright/test';

test.describe('Navigation and Pages', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    
    // Check About page content
    await expect(page.locator('h1, h2')).toContainText(/SourceKom|About/i);
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Services');
    await expect(page).toHaveURL(/\/services/);
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact/);
    
    // Check contact form exists
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should navigate to Resources page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Resources');
    await expect(page).toHaveURL(/\/resources/);
  });

  test('should have responsive mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button exists
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      
      // Check if menu items are visible
      await expect(page.locator('text=Home')).toBeVisible();
    }
  });
});

