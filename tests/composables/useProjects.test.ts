import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProjects } from '../../app/composables/useProjects'

const mockApi = vi.fn()
vi.mock('../../app/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls public list endpoint with query parameters', async () => {
    const projectsComposable = useProjects()
    mockApi.mockResolvedValueOnce({ data: [] })

    await projectsComposable.list({ featured: true })
    expect(mockApi).toHaveBeenCalledWith('/projects', {
      query: { featured: true },
    })
  })

  it('calls getBySlug with correct slug', async () => {
    const projectsComposable = useProjects()
    mockApi.mockResolvedValueOnce({ data: { slug: 'portfolio-v1', title: 'Portfolio' } })

    await projectsComposable.getBySlug('portfolio-v1')
    expect(mockApi).toHaveBeenCalledWith('/projects/portfolio-v1')
  })

  it('calls adminList endpoint', async () => {
    const projectsComposable = useProjects()
    mockApi.mockResolvedValueOnce({ data: [] })

    await projectsComposable.adminList()
    expect(mockApi).toHaveBeenCalledWith('/admin/projects')
  })

  it('calls adminCreate with POST method and payload', async () => {
    const projectsComposable = useProjects()
    const payload = {
      slug: 'new-app',
      title: 'New App',
      tagline: 'Awesome app',
      descriptionMarkdown: '# Description',
      coverImageUrl: '/img.png',
      repoUrl: 'https://github.com',
      demoUrl: 'https://example.com',
      techStack: ['Nuxt', 'Go'],
      status: 'published' as const,
      featured: true,
      sortOrder: 1,
      links: [],
    }

    await projectsComposable.adminCreate(payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/projects', {
      method: 'POST',
      body: payload,
    })
  })

  it('calls adminUpdate with PUT method and payload', async () => {
    const projectsComposable = useProjects()
    const payload = {
      slug: 'new-app',
      title: 'New App',
      tagline: 'Awesome app',
      descriptionMarkdown: '# Description',
      coverImageUrl: '/img.png',
      repoUrl: 'https://github.com',
      demoUrl: 'https://example.com',
      techStack: ['Nuxt', 'Go'],
      status: 'published' as const,
      featured: true,
      sortOrder: 1,
      links: [],
    }

    await projectsComposable.adminUpdate('proj-1', payload)
    expect(mockApi).toHaveBeenCalledWith('/admin/projects/proj-1', {
      method: 'PUT',
      body: payload,
    })
  })

  it('calls adminDelete with DELETE method', async () => {
    const projectsComposable = useProjects()
    await projectsComposable.adminDelete('proj-1')
    expect(mockApi).toHaveBeenCalledWith('/admin/projects/proj-1', {
      method: 'DELETE',
    })
  })
})
