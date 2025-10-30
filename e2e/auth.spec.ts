import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    // Click register/get started button
    const registerButton = page.locator('text=Get Started').first();
    await registerButton.click();
    
    await expect(page).toHaveURL(/\/register/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    const loginButton = page.locator('text=Sign In').first();
    await loginButton.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display register form correctly', async ({ page }) => {
    await page.goto('/register');
    
    // Check form fields exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check form fields exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

