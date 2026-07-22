export function useApi() {
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      if (auth.token) {
        options.headers = { ...options.headers, Authorization: `Bearer ${auth.token}` }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
        if (import.meta.client) {
          navigateTo('/login')
        }
      }
    },
  })
}
