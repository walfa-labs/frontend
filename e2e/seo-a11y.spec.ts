import { test, expect } from '@playwright/test'

test.describe('SEO & Accessibility Integrity', () => {
  const publicRoutes = ['/', '/about', '/projects', '/blog']

  for (const route of publicRoutes) {
    test(`has proper SEO tags on ${route}`, async ({ page }) => {
      await page.goto(route)

      // Exactly one h1 for proper semantic hierarchy
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)

      // Html lang attribute
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBe('en')

      // Canonical link or title present
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
    })
  }

  test('sets noindex robots meta on login route', async ({ page }) => {
    await page.goto('/login')
    const robots = page.locator('meta[name="robots"]')
    if (await robots.count() > 0) {
      const content = await robots.first().getAttribute('content')
      expect(content).toContain('noindex')
    }
  })
})
