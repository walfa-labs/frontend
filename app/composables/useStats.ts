import type { ApiResponse, HealthResponse, StatsSummary, Tag, TopPost, ViewPoint } from '~/types/api'

export function useStats() {
  const api = useApi()

  // GET /health — public liveness & DB connectivity check
  const health = () =>
    api<HealthResponse>('/health')

  const summary = () =>
    api<ApiResponse<StatsSummary>>('/stats/summary')

  // GET /tags — public endpoint served by StatsHandler.Tags
  const tags = () =>
    api<ApiResponse<Tag[]>>('/tags')

  const views = (params?: { from?: string; to?: string; bucket?: string }) =>
    api<ApiResponse<ViewPoint[]>>('/admin/stats/views', { query: params })

  const topPosts = (limit?: number) =>
    api<ApiResponse<TopPost[]>>('/admin/stats/top-posts', { query: { limit } })

  return { health, summary, tags, views, topPosts }
}

