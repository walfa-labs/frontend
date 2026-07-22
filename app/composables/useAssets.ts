import type { ApiResponse, Asset } from '~/types/api'

export function useAssets() {
  const api = useApi()

  async function upload(file: File): Promise<Asset> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api<ApiResponse<Asset>>('/admin/assets', {
      method: 'POST',
      body: formData,
    })
    return res.data
  }

  function remove(key: string) {
    return api(`/admin/assets/${key}`, { method: 'DELETE' })
  }

  return { upload, remove }
}
