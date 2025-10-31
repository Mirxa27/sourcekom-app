import { test, expect } from '@playwright/test'

test('should allow a user to register, login, and logout', async ({ page }) => {
  // Register
  await page.goto('/register')
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
  await page.fill('input[name="password"]', 'password')
  await page.fill('input[name="confirmPassword"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')

  // Logout
  await page.click('button:has-text("Logout")')
  await expect(page).toHaveURL('/')

  // Login
  await page.goto('/login')
  await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
