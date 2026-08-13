import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../app/stores/auth'

describe('useApi integration & auth headers', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('provides authenticated state for api requests', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()

    auth.setToken('jwt-token-xyz')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.token).toBe('jwt-token-xyz')
  })

  it('handles auth logout state cleanup', () => {
    const auth = useAuthStore()
    auth.setToken('jwt-token-xyz')
    expect(auth.isAuthenticated).toBe(true)

    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()
  })
})
