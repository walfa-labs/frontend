import type { AuthTokens, LoginPayload } from '~/types/api'

export function useAuth() {
  const api = useApi()
  const auth = useAuthStore()

  async function login(payload: LoginPayload): Promise<void> {
    const res = await api<AuthTokens>('/auth/login', {
      method: 'POST',
      body: payload,
    })
    auth.setToken(res.token)
  }

  async function refresh(): Promise<void> {
    try {
      const res = await api<AuthTokens>('/auth/refresh', { method: 'POST' })
      auth.setToken(res.token)
    } catch {
      auth.logout()
    }
  }

  function logout() {
    auth.logout()
  }

  return { login, refresh, logout }
}
