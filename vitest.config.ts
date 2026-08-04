import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // happy-dom by default; individual files can opt into the full Nuxt
    // environment with a `// @vitest-environment nuxt` docblock.
    environment: 'happy-dom',
  },
})
