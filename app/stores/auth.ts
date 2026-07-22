import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(t: string | null) {
    token.value = t
    if (import.meta.client) {
      if (t) {
        localStorage.setItem('auth_token', t)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  function logout() {
    setToken(null)
  }

  function init() {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth_token')
      if (stored) token.value = stored
    }
  }

  return { token, isAuthenticated, setToken, logout, init }
})
