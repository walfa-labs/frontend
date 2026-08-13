import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../app/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with null token and unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets token and updates isAuthenticated', () => {
    const store = useAuthStore()
    store.setToken('test-jwt-token')
    expect(store.token).toBe('test-jwt-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('persists token to localStorage', () => {
    const store = useAuthStore()
    store.setToken('jwt-12345')
    expect(localStorage.getItem('auth_token')).toBe('jwt-12345')

    store.setToken(null)
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('clears token on logout', () => {
    const store = useAuthStore()
    store.setToken('jwt-token-active')
    expect(store.isAuthenticated).toBe(true)

    store.logout()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('loads token from localStorage during init()', () => {
    localStorage.setItem('auth_token', 'persisted-jwt-token')
    const store = useAuthStore()
    store.init()
    expect(store.token).toBe('persisted-jwt-token')
    expect(store.isAuthenticated).toBe(true)
  })
})
