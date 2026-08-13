import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePosts } from '../../app/composables/usePosts'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls public list endpoint with query parameters', async () => {
    const postsComposable = usePosts()
    mockApi.mockResolvedValueOnce({ data: [], meta: { page: 1, perPage: 10, total: 0 } })

    await postsComposable.list({ page: 2, perPage: 5, tag: 'vue' })
    expect(mockApi).toHaveBeenCalledWith('/blog/posts', {
      query: { page: 2, perPage: 5, tag: 'vue' },
    })
  })

  it('calls getBySlug with correct path', async () => {
    const postsComposable = usePosts()
    mockApi.mockResolvedValueOnce({ data: { slug: 'my-post', title: 'My Post' } })

    await postsComposable.getBySlug('my-post')
    expect(mockApi).toHaveBeenCalledWith('/blog/posts/my-post')
  })

  it('calls adminList endpoint', async () => {
    const postsComposable = usePosts()
    mockApi.mockResolvedValueOnce({ data: [] })

    await postsComposable.adminList()
    expect(mockApi).toHaveBeenCalledWith('/admin/blog/posts')
  })

  it('calls adminCreate with POST method and payload', async () => {
    const postsComposable = usePosts()
    const payload = {
      slug: 'new-post',
      title: 'New Post',
      excerpt: 'Intro',
      bodyMarkdown: 'Content',
      coverImageUrl: '/img.png',
      status: 'draft' as const,
      tags: [{ name: 'Nuxt', slug: 'nuxt' }],
    }
    mockApi.mockResolvedValueOnce({ data: { id: 'p1', ...payload } })

    await postsComposable.adminCreate(payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/blog/posts', {
      method: 'POST',
      body: payload,
    })
  })

  it('calls adminUpdate with PUT method and payload', async () => {
    const postsComposable = usePosts()
    const payload = {
      slug: 'updated-post',
      title: 'Updated Post',
      excerpt: 'Intro',
      bodyMarkdown: 'Content updated',
      coverImageUrl: '/img.png',
      status: 'published' as const,
      tags: [],
    }

    await postsComposable.adminUpdate('post-id-1', payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/blog/posts/post-id-1', {
      method: 'PUT',
      body: payload,
    })
  })

  it('calls adminSetStatus with PATCH method and status', async () => {
    const postsComposable = usePosts()
    await postsComposable.adminSetStatus('post-id-1', 'published')
    expect(mockApi).toHaveBeenCalledWith('/admin/blog/posts/post-id-1/status', {
      method: 'PATCH',
      body: { status: 'published' },
    })
  })

  it('calls adminDelete with DELETE method', async () => {
    const postsComposable = usePosts()
    await postsComposable.adminDelete('post-id-1')
    expect(mockApi).toHaveBeenCalledWith('/admin/blog/posts/post-id-1', {
      method: 'DELETE',
    })
  })
})
