import { describe, expect, it } from 'vitest'
import type { ApiResponse, Experience, HealthResponse, Post, Profile, Project, StatsSummary } from '../../app/types/api'

describe('API Contracts & Type Integrity', () => {
  it('validates Post data contract shape', () => {
    const post: Post = {
      id: 'post-123',
      slug: 'building-cicd-with-github-actions',
      title: 'Building CI/CD with GitHub Actions',
      excerpt: 'A comprehensive guide to modern DevSecOps pipelines.',
      bodyMarkdown: '# CI/CD Guide\n\nFull article here...',
      coverImageUrl: 'https://example.com/cover.jpg',
      publishedAt: '2026-08-14T00:00:00Z',
      tags: [
        { id: 'tag-1', name: 'DevOps', slug: 'devops' },
        { id: 'tag-2', name: 'CI/CD', slug: 'cicd' },
      ],
      viewCount: 350,
      status: 'published',
    }

    expect(post.slug).toBe('building-cicd-with-github-actions')
    expect(post.status).toBe('published')
    expect(post.tags).toHaveLength(2)
  })

  it('validates Project data contract shape', () => {
    const project: Project = {
      id: 'proj-456',
      slug: 'walfa-labs-platform',
      title: 'Walfa Labs Platform',
      tagline: 'Modern Portfolio & Lab Hub',
      descriptionMarkdown: 'Detailed description with markdown formatting.',
      coverImageUrl: 'https://example.com/project.png',
      repoUrl: 'https://github.com/walfa-labs/platform',
      demoUrl: 'https://platform.walfa.dev',
      techStack: ['Nuxt 4', 'Vue 3', 'Go', 'Docker', 'Tailwind CSS'],
      links: [
        { id: 'link-1', label: 'Repository', url: 'https://github.com/walfa-labs/platform', kind: 'repo' },
        { id: 'link-2', label: 'Live Demo', url: 'https://platform.walfa.dev', kind: 'demo' },
      ],
      status: 'published',
      featured: true,
      sortOrder: 1,
      publishedAt: '2026-08-01T00:00:00Z',
    }

    expect(project.featured).toBe(true)
    expect(project.techStack).toContain('Nuxt 4')
    expect(project.links[0].kind).toBe('repo')
  })

  it('validates Experience data contract shape', () => {
    const experience: Experience = {
      id: 'exp-789',
      experienceType: 'work',
      organization: 'Tech Innovations Inc',
      roleTitle: 'Staff Infrastructure Engineer',
      location: 'Remote',
      startDate: '2024-01-01',
      endDate: null,
      current: true,
      summaryMarkdown: 'Leading architecture and security posture across core systems.',
      sortOrder: 1,
      highlights: [
        { id: 'hl-1', bodyMarkdown: 'Implemented multi-stage CI/CD pipelines', sortOrder: 1 },
        { id: 'hl-2', bodyMarkdown: 'Integrated SAST, DAST, SCA and secrets scanning', sortOrder: 2 },
      ],
    }

    expect(experience.current).toBe(true)
    expect(experience.highlights).toHaveLength(2)
  })

  it('validates Profile data contract shape', () => {
    const profile: Profile = {
      name: 'Walfa',
      email: 'contact@walfa.dev',
      tagline: 'Full-stack & Security Engineer',
      bioMarkdown: 'Passionate about robust software engineering and security.',
      location: 'Jakarta, Indonesia',
      avatarUrl: 'https://example.com/avatar.jpg',
      githubUrl: 'https://github.com/walfa',
      linkedinUrl: 'https://linkedin.com/in/walfa',
      twitterUrl: 'https://twitter.com/walfa',
      updatedAt: '2026-08-14T00:00:00Z',
    }

    expect(profile.name).toBe('Walfa')
    expect(profile.githubUrl).toContain('walfa')
  })

  it('validates ApiResponse wrapper structure', () => {
    const response: ApiResponse<StatsSummary> = {
      data: {
        publishedPosts: 12,
        publishedProjects: 8,
        featuredProjects: 3,
        yearsExperience: 5,
        totalPostViews: 8400,
      },
      meta: {
        page: 1,
        perPage: 10,
        total: 1,
      },
    }

    expect(response.data.publishedPosts).toBe(12)
    expect(response.meta?.total).toBe(1)
  })

  it('validates HealthResponse contract shape', () => {
    const health: HealthResponse = {
      status: 'ok',
      db: 'up',
    }

    expect(health.status).toBe('ok')
    expect(health.db).toBe('up')
  })
})


