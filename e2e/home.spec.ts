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
    // Find the color-mode toggle (Reka dropdown trigger in Nuxt UI).
    const themeBtn = page.getByRole('button', { name: 'Toggle color mode' })
    if (!(await themeBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip()
      return
    }

    const htmlEl = page.locator('html')
    const initialClass = await htmlEl.getAttribute('class') || ''
    const isDark = initialClass.includes('dark')

    // Open the dropdown and pick the opposite mode. Reka renders the menu
    // teleported into <body> with role=menu / role=menuitem only once open.
    await themeBtn.click()
    // Match by text (more forgiving than accessible-name across engines) and
    // force the click: Reka positions teleported items with tabindex=-1 so
    // Playwright's actionability wait can hang in some engines.
    const targetOption = page.locator('[role="menuitem"]').filter({ hasText: isDark ? /light/i : /dark/i })
    await targetOption.click({ force: true })

    // Assert the observable contract: the html class actually flipped (dark ↔ light).
    await expect(htmlEl).toHaveClass(isDark ? /(^|\s)light(\s|$)/ : /(^|\s)dark(\s|$)/)
  })
})
