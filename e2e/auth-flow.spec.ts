import { test, expect } from '@playwright/test'

test.describe('Authentication & Route Protection Flow', () => {
  test('renders login page and form', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
    
    // Check form container or main login elements
    const form = page.locator('form, [data-slot="form"]').first()
    await expect(form).toBeAttached({ timeout: 15000 })
  })

  test('redirects unauthenticated users attempting to visit /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('redirects unauthenticated users attempting to visit nested dashboard routes', async ({ page }) => {
    await page.goto('/dashboard/projects/new')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })
})
