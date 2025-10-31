import { test, expect } from '@playwright/test';

test.describe('Navigation and Pages', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
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
    
    // Check About page content - look for actual page content
    await expect(page.locator('h1, h2').first()).toContainText(/Adding strength to businesses|Our Story|Leadership with Vision/i);
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Check if we're on mobile viewport by checking if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').first();
    const isMobile = await mobileMenuButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isMobile) {
      // On mobile: open mobile menu first
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Click Services link in mobile menu
      const mobileServicesLink = page.locator('[data-testid="mobile-nav-services"]').first();
      await expect(mobileServicesLink).toBeVisible({ timeout: 5000 });
      await mobileServicesLink.click();
    } else {
      // On desktop: click Services link in nav
      const servicesLink = page.locator('[data-testid="nav-services"]').first();
      await expect(servicesLink).toBeVisible({ timeout: 10000 });
      await servicesLink.click();
    }
    
    await expect(page).toHaveURL(/\/services/, { timeout: 10000 });
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Check if we're on mobile viewport by checking if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').first();
    const isMobile = await mobileMenuButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isMobile) {
      // On mobile: open mobile menu first
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Click Contact link in mobile menu
      const mobileContactLink = page.locator('[data-testid="mobile-nav-contact"]').first();
      await expect(mobileContactLink).toBeVisible({ timeout: 5000 });
      // Try scrolling into view and then click
      await mobileContactLink.scrollIntoViewIfNeeded();
      await mobileContactLink.click({ force: true });
    } else {
      // On desktop: click Contact link in nav
      const contactLink = page.locator('[data-testid="nav-contact"]').first();
      await expect(contactLink).toBeVisible({ timeout: 10000 });
      await contactLink.click();
    }
    
    await expect(page).toHaveURL(/\/contact/, { timeout: 10000 });
    
    // Check contact form exists
    const form = page.locator('form').first();
    await expect(form).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to Resources page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Check if we're on mobile viewport by checking if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').first();
    const isMobile = await mobileMenuButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isMobile) {
      // On mobile: open mobile menu first
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Click Resources link in mobile menu
      const mobileResourcesLink = page.locator('[data-testid="mobile-nav-resources"]').first();
      await expect(mobileResourcesLink).toBeVisible({ timeout: 5000 });
      await mobileResourcesLink.click();
    } else {
      // On desktop: click Resources link in nav
      const resourcesLink = page.locator('[data-testid="nav-resources"]').first();
      await expect(resourcesLink).toBeVisible({ timeout: 10000 });
      await resourcesLink.click();
    }
    
    await expect(page).toHaveURL(/\/resources/, { timeout: 10000 });
  });

  test('should have responsive mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // On mobile, desktop nav should be hidden and mobile menu button should be visible
    const menuButton = page.locator('[data-testid="mobile-menu-button"]').first();
    await expect(menuButton).toBeVisible({ timeout: 5000 });
    
    // Click mobile menu button to open Sheet
    await menuButton.click();
    await page.waitForTimeout(500); // Wait for Sheet to open
    
    // Check if mobile navigation items are visible in the Sheet
    const mobileAboutLink = page.locator('[data-testid="mobile-nav-about"]').first();
    await expect(mobileAboutLink).toBeVisible({ timeout: 5000 });
    
    const mobileHomeLink = page.locator('[data-testid="mobile-nav-home"]').first();
    await expect(mobileHomeLink).toBeVisible({ timeout: 5000 });
  });
});

