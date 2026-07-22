export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Initialize token from localStorage on first navigation.
  if (import.meta.client) {
    auth.init()
  }

  // Protect dashboard routes — redirect to login if not authenticated.
  if (to.path.startsWith('/dashboard') && !auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from login page.
  if (to.path === '/login' && auth.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
