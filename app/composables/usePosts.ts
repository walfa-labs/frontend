import type { ApiResponse, PageMeta, Post, PostInput, PostSummary } from '~/types/api'

export function usePosts() {
  const api = useApi()

  const list = (params?: { page?: number; perPage?: number; tag?: string }) =>
    api<ApiResponse<PostSummary[]> & { meta: PageMeta }>('/blog/posts', { query: params })

  const getBySlug = (slug: string) =>
    api<ApiResponse<Post>>(`/blog/posts/${slug}`)

  const adminList = () =>
    api<ApiResponse<Post[]>>('/admin/blog/posts')

  const getById = (id: string) =>
    api<ApiResponse<Post>>(`/admin/blog/posts/${id}`)

  const adminCreate = (payload: PostInput) =>
    api<ApiResponse<Post>>('/admin/blog/posts', { method: 'POST', body: payload })

  const adminUpdate = (id: string, payload: PostInput) =>
    api<ApiResponse<Post>>(`/admin/blog/posts/${id}`, { method: 'PUT', body: payload })

  const adminPatch = (id: string, payload: Partial<PostInput>) =>
    api<ApiResponse<Post>>(`/admin/blog/posts/${id}`, { method: 'PATCH', body: payload })

  // Backend has a dedicated status endpoint: PATCH /admin/blog/posts/:id/status
  const adminSetStatus = (id: string, status: 'draft' | 'published') =>
    api<ApiResponse<Post>>(`/admin/blog/posts/${id}/status`, { method: 'PATCH', body: { status } })

  const adminDelete = (id: string) =>
    api(`/admin/blog/posts/${id}`, { method: 'DELETE' })

  return { list, getBySlug, adminList, getById, adminCreate, adminUpdate, adminPatch, adminSetStatus, adminDelete }
}
