import type { ApiResponse, StatsSummary, TopPost, ViewPoint } from '~/types/api'

export function useStats() {
  const api = useApi()

  const summary = () =>
    api<ApiResponse<StatsSummary>>('/stats/summary')

  const views = (params?: { from?: string; to?: string; bucket?: string }) =>
    api<ApiResponse<ViewPoint[]>>('/admin/stats/views', { query: params })

  const topPosts = (limit?: number) =>
    api<ApiResponse<TopPost[]>>('/admin/stats/top-posts', { query: { limit } })

  return { summary, views, topPosts }
}
