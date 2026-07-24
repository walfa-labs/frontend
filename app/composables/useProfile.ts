import type { ApiResponse, Profile, ProfileInput } from '~/types/api'

export function useProfile() {
  const api = useApi()

  const fetchProfile = () =>
    api<ApiResponse<Profile>>('/profile')

  const adminGet = () =>
    api<ApiResponse<Profile>>('/admin/profile')

  const adminUpdate = (payload: ProfileInput) =>
    api<ApiResponse<Profile>>('/admin/profile', { method: 'PUT', body: payload })

  return { fetchProfile, adminGet, adminUpdate }
}

// Shared reactive profile state — fetched once during SSR, available synchronously.
// Call ensureProfile() in app.vue setup to populate; use useProfileState() everywhere else.
export const useProfileState = () => {
  const profile = useState<Profile | null>('profile', () => null)
  return profile
}

export async function ensureProfile() {
  const profile = useProfileState()
  if (profile.value) return profile.value

  const config = useRuntimeConfig()
  try {
    const res = await $fetch<ApiResponse<Profile>>(
      `${config.public.apiBase}/profile`,
    )
    profile.value = res.data
  } catch {
    // Leave null — components handle null gracefully
  }
  return profile.value
}
