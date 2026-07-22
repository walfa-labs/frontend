import type { ApiResponse, Experience, ExperienceInput } from '~/types/api'

export function useExperiences() {
  const api = useApi()

  const list = () =>
    api<ApiResponse<Experience[]>>('/experiences')

  const adminList = () =>
    api<ApiResponse<Experience[]>>('/admin/experiences')

  const getById = (id: string) =>
    api<ApiResponse<Experience>>(`/admin/experiences/${id}`)

  const adminCreate = (payload: ExperienceInput) =>
    api<ApiResponse<Experience>>('/admin/experiences', { method: 'POST', body: payload })

  const adminUpdate = (id: string, payload: Partial<ExperienceInput>) =>
    api<ApiResponse<Experience>>(`/admin/experiences/${id}`, { method: 'PUT', body: payload })

  const adminPatch = (id: string, payload: Partial<ExperienceInput>) =>
    api<ApiResponse<Experience>>(`/admin/experiences/${id}`, { method: 'PATCH', body: payload })

  const adminDelete = (id: string) =>
    api(`/admin/experiences/${id}`, { method: 'DELETE' })

  return { list, adminList, getById, adminCreate, adminUpdate, adminPatch, adminDelete }
}
