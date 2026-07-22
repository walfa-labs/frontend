import type { ApiResponse, StatsSummary, Tag, TopPost, ViewPoint } from '~/types/api'

export function useStats() {
  const api = useApi()

  const summary = () =>
    api<ApiResponse<StatsSummary>>('/stats/summary')

  // GET /tags — public endpoint served by StatsHandler.Tags
  const tags = () =>
    api<ApiResponse<Tag[]>>('/tags')

  const views = (params?: { from?: string; to?: string; bucket?: string }) =>
    api<ApiResponse<ViewPoint[]>>('/admin/stats/views', { query: params })

  const topPosts = (limit?: number) =>
    api<ApiResponse<TopPost[]>>('/admin/stats/top-posts', { query: { limit } })

  return { summary, tags, views, topPosts }
}
