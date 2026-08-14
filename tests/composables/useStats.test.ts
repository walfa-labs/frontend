import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStats } from '../../app/composables/useStats'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('useStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls health endpoint', async () => {
    const statsComposable = useStats()
    mockApi.mockResolvedValueOnce({
      status: 'ok',
      db: 'up',
    })

    const res = await statsComposable.health()
    expect(mockApi).toHaveBeenCalledWith('/health')
    expect(res.status).toBe('ok')
    expect(res.db).toBe('up')
  })

  it('calls summary endpoint', async () => {
    const statsComposable = useStats()
    mockApi.mockResolvedValueOnce({
      data: {
        publishedPosts: 5,
        publishedProjects: 10,
        featuredProjects: 3,
        yearsExperience: 4,
        totalPostViews: 1250,
      },
    })

    const res = await statsComposable.summary()
    expect(mockApi).toHaveBeenCalledWith('/stats/summary')
    expect(res.data.publishedPosts).toBe(5)
  })

  it('calls tags endpoint', async () => {
    const statsComposable = useStats()
    mockApi.mockResolvedValueOnce({ data: [{ id: '1', name: 'Vue', slug: 'vue' }] })

    await statsComposable.tags()
    expect(mockApi).toHaveBeenCalledWith('/tags')
  })

  it('calls views endpoint with params', async () => {
    const statsComposable = useStats()
    mockApi.mockResolvedValueOnce({ data: [{ bucket: '2026-08-01', views: 10 }] })

    await statsComposable.views({ from: '2026-08-01', to: '2026-08-14', bucket: 'day' })
    expect(mockApi).toHaveBeenCalledWith('/admin/stats/views', {
      query: { from: '2026-08-01', to: '2026-08-14', bucket: 'day' },
    })
  })

  it('calls topPosts endpoint with limit', async () => {
    const statsComposable = useStats()
    mockApi.mockResolvedValueOnce({ data: [] })

    await statsComposable.topPosts(5)
    expect(mockApi).toHaveBeenCalledWith('/admin/stats/top-posts', {
      query: { limit: 5 },
    })
  })
})
