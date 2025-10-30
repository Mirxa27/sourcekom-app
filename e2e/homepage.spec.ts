import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/SourceKom/i);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText(/Revolutionizing Resource Management/i);
    
    // Check navigation is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check search bar is visible
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    
    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should navigate to browse page via search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill('office');
    await searchInput.press('Enter');
    
    // Should navigate to browse page
    await expect(page).toHaveURL(/\/browse/);
  });

  test('should display featured resources', async ({ page }) => {
    await page.goto('/');
    
    // Check if featured resources section exists
    const featuredSection = page.locator('text=Featured Resources');
    await expect(featuredSection).toBeVisible({ timeout: 10000 });
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test About link
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    
    await page.goBack();
    
    // Test Services link
    await page.click('text=Services');
    await expect(page).toHaveURL(/\/services/);
  });
});

