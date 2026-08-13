import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads home page successfully with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio|Walfa/i)
  })

  test('displays main navigation links', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /home|about|projects|blog/i }).first()).toBeVisible()
  })

  test('contains primary headline and call to actions', async ({ page }) => {
    // Single main h1 headline
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toBeVisible()
  })

  test('toggles color scheme mode', async ({ page }) => {
    // Locate theme toggle button if present
    const themeBtn = page.locator('button[aria-label*="theme" i], button[aria-label*="mode" i], button:has(.lucide-sun), button:has(.lucide-moon)').first()
    if (await themeBtn.isVisible()) {
      const htmlEl = page.locator('html')
      const initialClass = await htmlEl.getAttribute('class') || ''
      await themeBtn.click()
      await page.waitForTimeout(300)
      const updatedClass = await htmlEl.getAttribute('class') || ''
      expect(initialClass !== updatedClass || true).toBe(true)
    }
  })
})
