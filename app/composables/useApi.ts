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
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
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
