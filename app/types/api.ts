// Shared API types — mirror backend DTOs (camelCase wire format).
// See DESIGN.md §7 for contract examples.

// --- Common ---

export interface PageMeta {
  page: number
  perPage: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PageMeta
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Array<{ field: string; issue: string }>
  }
}

// --- Enums ---

export type ExperienceType = 'work' | 'education'
export type ContentStatus = 'draft' | 'published'
export type ProjectLinkKind = 'repo' | 'demo' | 'docs' | 'other'

// --- Tag ---

export interface Tag {
  id: string
  name: string
  slug: string
}

// --- Experience ---

export interface ExperienceHighlight {
  id?: string
  bodyMarkdown: string
  sortOrder: number
}

export interface Experience {
  id: string
  experienceType: ExperienceType
  organization: string
  roleTitle: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  summaryMarkdown: string
  highlights: ExperienceHighlight[]
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ExperienceInput = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
}

// --- Project ---

export interface ProjectLink {
  id?: string
  label: string
  url: string
  kind: ProjectLinkKind
}

export interface Project {
  id: string
  slug: string
  title: string
  tagline: string | null
  descriptionMarkdown: string
  coverImageUrl: string | null
  repoUrl: string | null
  demoUrl: string | null
  techStack: string[]
  links: ProjectLink[]
  status: ContentStatus
  featured: boolean
  sortOrder: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectSummary {
  id: string
  slug: string
  title: string
  tagline: string | null
  coverImageUrl: string | null
  techStack: string[]
  featured: boolean
  status: ContentStatus
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
}

// --- Blog Post ---

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  bodyMarkdown: string
  coverImageUrl: string | null
  status: ContentStatus
  viewCount: number
  publishedAt: string | null
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImageUrl: string | null
  publishedAt: string | null
  tags: Tag[]
}

export type PostInput = Omit<Post, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'> & {
  id?: string
}

// --- Assets ---

export interface Asset {
  key: string
  url: string
  contentType: string
  sizeBytes: number
}

// --- Stats ---

export interface StatsSummary {
  publishedPosts: number
  publishedProjects: number
  featuredProjects: number
  yearsExperience: number
  totalPostViews: number
}

export interface ViewPoint {
  date: string
  views: number
}

export interface TopPost {
  id: string
  slug: string
  title: string
  viewCount: number
}

// --- Auth ---

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthTokens {
  token: string
  refreshToken?: string
}
