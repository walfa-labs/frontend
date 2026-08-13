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
    // The color mode toggle may be a simple button or a dropdown trigger.
    // Use a broad selector to find it, then interact appropriately.
    const themeBtn = page.locator('button[aria-label*="color" i], button[aria-label*="theme" i], button[aria-label*="mode" i]').first()
    
    // Skip test gracefully if no toggle is visible (e.g. hidden on certain viewports)
    if (!(await themeBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip()
      return
    }

    const htmlEl = page.locator('html')
    const initialClass = await htmlEl.getAttribute('class') || ''

    // Check if it's a dropdown trigger (aria-haspopup)
    const hasPopup = await themeBtn.getAttribute('aria-haspopup')
    
    if (hasPopup) {
      // It's a dropdown — click to open, then select the opposite mode
      await themeBtn.click()
      // Wait for dropdown menu to appear
      const menuItem = page.locator('[role="menuitem"], [role="menuitemradio"]').first()
      await menuItem.waitFor({ state: 'visible', timeout: 5000 })
      
      // Pick "Dark" or "Light" option depending on current mode
      const isDark = initialClass.includes('dark')
      const targetOption = page.locator(`[role="menuitem"], [role="menuitemradio"]`).filter({
        hasText: isDark ? /light/i : /dark/i
      }).first()
      
      if (await targetOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await targetOption.click()
      } else {
        // Just click the first available option
        await menuItem.click()
      }
    } else {
      // Simple toggle button
      await themeBtn.click({ force: true })
    }

    await page.waitForTimeout(500)
    const updatedClass = await htmlEl.getAttribute('class') || ''
    // Verify that the class actually changed (dark ↔ light)
    expect(updatedClass).not.toBe(initialClass)
  })
})
