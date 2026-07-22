export function useApi() {
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    // credentials: 'include' is only meaningful in the browser (for httpOnly cookies).
    // On the server (SSR), it causes fetch errors. Set it only on client.
    credentials: import.meta.client ? 'include' : undefined,
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
