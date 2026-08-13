import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useAuthStore } from '../../app/stores/auth'

const { mockNavigateTo } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn((path: string) => path),
}))

mockNuxtImport('navigateTo', () => {
  return mockNavigateTo
})

import authMiddleware from '../../app/middleware/auth.global'

describe('auth.global middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('allows public routes when unauthenticated', () => {
    const auth = useAuthStore()
    auth.setToken(null)

    const result = authMiddleware({ path: '/' } as any, { path: '/' } as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects unauthenticated user from /dashboard to /login', () => {
    const auth = useAuthStore()
    auth.setToken(null)

    const result = authMiddleware({ path: '/dashboard' } as any, { path: '/' } as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
    expect(result).toBe('/login')
  })

  it('redirects unauthenticated user from /dashboard/projects/new to /login', () => {
    const auth = useAuthStore()
    auth.setToken(null)

    const result = authMiddleware({ path: '/dashboard/projects/new' } as any, { path: '/' } as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
    expect(result).toBe('/login')
  })

  it('allows authenticated user to visit /dashboard', () => {
    const auth = useAuthStore()
    auth.setToken('valid-token')

    const result = authMiddleware({ path: '/dashboard' } as any, { path: '/' } as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects authenticated user from /login to /dashboard', () => {
    const auth = useAuthStore()
    auth.setToken('valid-token')

    const result = authMiddleware({ path: '/login' } as any, { path: '/' } as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard')
    expect(result).toBe('/dashboard')
  })

  it('allows unauthenticated user to visit /login', () => {
    const auth = useAuthStore()
    auth.setToken(null)

    const result = authMiddleware({ path: '/login' } as any, { path: '/' } as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
