import type { ApiResponse, Project, ProjectInput } from '~/types/api'

export function useProjects() {
  const api = useApi()

  // Backend returns full Project[] for both public and admin list — no separate summary type.
  const list = (params?: { featured?: boolean }) =>
    api<ApiResponse<Project[]>>('/projects', { query: params })

  const getBySlug = (slug: string) =>
    api<ApiResponse<Project>>(`/projects/${slug}`)

  const adminList = () =>
    api<ApiResponse<Project[]>>('/admin/projects')

  const getById = (id: string) =>
    api<ApiResponse<Project>>(`/admin/projects/${id}`)

  const adminCreate = (payload: ProjectInput) =>
    api<ApiResponse<Project>>('/admin/projects', { method: 'POST', body: payload })

  const adminUpdate = (id: string, payload: ProjectInput) =>
    api<ApiResponse<Project>>(`/admin/projects/${id}`, { method: 'PUT', body: payload })

  const adminPatch = (id: string, payload: Partial<ProjectInput>) =>
    api<ApiResponse<Project>>(`/admin/projects/${id}`, { method: 'PATCH', body: payload })

  const adminDelete = (id: string) =>
    api(`/admin/projects/${id}`, { method: 'DELETE' })

  return { list, getBySlug, adminList, getById, adminCreate, adminUpdate, adminPatch, adminDelete }
}
