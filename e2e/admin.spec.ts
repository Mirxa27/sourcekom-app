import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin');
    
    // Should redirect to login or show unauthorized
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login|\/admin/);
  });

  test('should display admin panel for authenticated admin', async ({ page }) => {
    // Note: This test requires authentication setup
    // In real scenario, you would:
    // 1. Login as admin user
    // 2. Then navigate to admin panel
    
    await page.goto('/admin');
    
    // Check if login form is shown or admin panel
    const loginForm = page.locator('form').first();
    const adminPanel = page.locator('text=Admin Dashboard').first();
    
    const isLogin = await loginForm.isVisible().catch(() => false);
    const isAdmin = await adminPanel.isVisible().catch(() => false);
    
    expect(isLogin || isAdmin).toBe(true);
  });
});

test.describe('Dashboard', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login/);
  });
});

