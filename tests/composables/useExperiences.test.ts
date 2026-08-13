import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useExperiences } from '../../app/composables/useExperiences'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('useExperiences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls public experiences endpoint', async () => {
    const experiencesComposable = useExperiences()
    mockApi.mockResolvedValueOnce({ data: [] })

    await experiencesComposable.list()
    expect(mockApi).toHaveBeenCalledWith('/experiences')
  })

  it('calls adminList endpoint', async () => {
    const experiencesComposable = useExperiences()
    mockApi.mockResolvedValueOnce({ data: [] })

    await experiencesComposable.adminList()
    expect(mockApi).toHaveBeenCalledWith('/admin/experiences')
  })

  it('calls getById endpoint', async () => {
    const experiencesComposable = useExperiences()
    mockApi.mockResolvedValueOnce({ data: { id: 'exp-1' } })

    await experiencesComposable.getById('exp-1')
    expect(mockApi).toHaveBeenCalledWith('/admin/experiences/exp-1')
  })

  it('calls adminCreate with POST method and payload', async () => {
    const experiencesComposable = useExperiences()
    const payload = {
      experienceType: 'work' as const,
      organization: 'Acme Corp',
      roleTitle: 'Senior Software Engineer',
      location: 'Remote',
      startDate: '2024-01-01',
      endDate: null,
      current: true,
      summaryMarkdown: 'Building modern web apps',
      sortOrder: 1,
      highlights: [{ bodyMarkdown: 'Built CI/CD pipeline', sortOrder: 1 }],
    }

    await experiencesComposable.adminCreate(payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/experiences', {
      method: 'POST',
      body: payload,
    })
  })

  it('calls adminDelete with DELETE method', async () => {
    const experiencesComposable = useExperiences()
    await experiencesComposable.adminDelete('exp-1')
    expect(mockApi).toHaveBeenCalledWith('/admin/experiences/exp-1', {
      method: 'DELETE',
    })
  })
})
