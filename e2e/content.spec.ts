import { test, expect } from '@playwright/test'

test.describe('Public Content Routes', () => {
  test('navigates to /about and renders about content', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveURL(/\/about/)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
  })

  test('navigates to /projects and renders projects section', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveURL(/\/projects/)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
  })

  test('navigates to /blog and renders blog section', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/blog/)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
  })
})
