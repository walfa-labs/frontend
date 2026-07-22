import type { LoginPayload, LoginResponse, RefreshResponse } from '~/types/api'

export function useAuth() {
  const api = useApi()
  const auth = useAuthStore()

  async function login(payload: LoginPayload): Promise<void> {
    const res = await api<{ data: LoginResponse }>('/auth/login', {
      method: 'POST',
      body: payload,
    })
    auth.setToken(res.data.accessToken)
  }

  async function refresh(): Promise<void> {
    try {
      const res = await api<{ data: RefreshResponse }>('/auth/refresh', { method: 'POST' })
      auth.setToken(res.data.accessToken)
    } catch {
      auth.logout()
    }
  }

  function logout() {
    auth.logout()
  }

  return { login, refresh, logout }
}
