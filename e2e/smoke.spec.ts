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
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Check if we're on mobile viewport by checking if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').first();
    const isMobile = await mobileMenuButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isMobile) {
      // On mobile: open mobile menu first
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Click About link in mobile menu
      const mobileAboutLink = page.locator('[data-testid="mobile-nav-about"]').first();
      await expect(mobileAboutLink).toBeVisible({ timeout: 5000 });
      await mobileAboutLink.click();
    } else {
      // On desktop: click About link in nav
      const aboutLink = page.locator('[data-testid="nav-about"]').first();
      await expect(aboutLink).toBeVisible({ timeout: 10000 });
      await aboutLink.click();
    }
    
    await expect(page).toHaveURL(/\/about/, { timeout: 10000 });
  });
});

