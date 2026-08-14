import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAssets } from '../../app/composables/useAssets'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('useAssets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads a file using FormData', async () => {
    const assets = useAssets()
    const mockAsset = {
      id: 'asset-1',
      key: 'images/test.png',
      url: '/uploads/images/test.png',
      contentType: 'image/png',
      sizeBytes: 1024,
    }
    mockApi.mockResolvedValueOnce({ data: mockAsset })

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const result = await assets.upload(file)

    expect(mockApi).toHaveBeenCalledWith('/admin/assets', {
      method: 'POST',
      body: expect.any(FormData),
    })
    expect(result).toEqual(mockAsset)
  })

  it('deletes an asset by key', async () => {
    const assets = useAssets()
    mockApi.mockResolvedValueOnce(undefined)

    await assets.remove('images/test.png')
    expect(mockApi).toHaveBeenCalledWith('/admin/assets/images/test.png', {
      method: 'DELETE',
    })
  })
})
