import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProfile } from '../../app/composables/useProfile'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls public profile endpoint', async () => {
    const profileComposable = useProfile()
    mockApi.mockResolvedValueOnce({
      data: {
        name: 'Walfa',
        email: 'walfa@example.com',
        tagline: 'Engineer',
        bioMarkdown: 'Hello',
        location: 'Earth',
        avatarUrl: '/avatar.png',
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        twitterUrl: '',
        updatedAt: '2026-08-01T00:00:00Z',
      },
    })

    const res = await profileComposable.fetchProfile()
    expect(mockApi).toHaveBeenCalledWith('/profile')
    expect(res.data.name).toBe('Walfa')
  })

  it('calls adminGet endpoint', async () => {
    const profileComposable = useProfile()
    mockApi.mockResolvedValueOnce({ data: { name: 'Walfa Admin' } })

    await profileComposable.adminGet()
    expect(mockApi).toHaveBeenCalledWith('/admin/profile')
  })

  it('calls adminUpdate endpoint with PUT and payload', async () => {
    const profileComposable = useProfile()
    const payload = {
      name: 'Walfa',
      email: 'walfa@example.com',
      tagline: 'Software Engineer',
      bioMarkdown: 'Fullstack developer',
      location: 'Jakarta',
      avatarUrl: '/avatar.png',
      githubUrl: 'https://github.com/walfa',
      linkedinUrl: '',
      twitterUrl: '',
    }

    await profileComposable.adminUpdate(payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/profile', {
      method: 'PUT',
      body: payload,
    })
  })
})
