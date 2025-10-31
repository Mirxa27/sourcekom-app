import { test, expect } from '@playwright/test'

test('should allow a user to create, edit, and delete a resource', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')

  // Create resource
  await page.goto('/dashboard/resources/new')
  await page.fill('input[name="title"]', 'Test Resource')
  await page.fill('textarea[name="description"]', 'This is a test resource.')
  await page.fill('input[name="price"]', '10')
  await page.fill('input[name="fileUrl"]', 'https://example.com/file.zip')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard/resources')
  await expect(page.locator('text=Test Resource')).toBeVisible()

  // Edit resource
  await page.click('a:has-text("Edit Resource")')
  await page.fill('input[name="title"]', 'Updated Test Resource')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard/resources')
  await expect(page.locator('text=Updated Test Resource')).toBeVisible()

  // Delete resource
  await page.click('button:has-text("Delete")')
  await expect(page.locator('text=Updated Test Resource')).not.toBeVisible()
})
