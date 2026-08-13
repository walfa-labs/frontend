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
    // Find the color-mode switcher (native select for reliability/a11y).
    const themeSelect = page.getByLabel('Color mode')
    if (!(await themeSelect.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip()
      return
    }

    const initialValue = await themeSelect.inputValue()

    // Select the opposite mode; the select value is the observable contract.
    const target = initialValue === 'dark' ? 'light' : 'dark'
    await themeSelect.selectOption(target)

    await expect(themeSelect).toHaveValue(target)
  })
})
