// Shared API types — mirror backend DTOs (camelCase wire format).
// Audited against ../backend/internal/adapter/handler/dto.go on 2026-07-23.

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
// Backend ExperienceResponse does NOT include createdAt/updatedAt.

export interface ExperienceHighlight {
  id: string
  bodyMarkdown: string
  sortOrder: number
}

export interface Experience {
  id: string
  experienceType: ExperienceType
  organization: string
  roleTitle: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  summaryMarkdown: string
  sortOrder: number
  highlights: ExperienceHighlight[]
}

export interface ExperienceInput {
  experienceType: ExperienceType
  organization: string
  roleTitle: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  summaryMarkdown: string
  sortOrder: number
  highlights: Array<{ bodyMarkdown: string; sortOrder: number }>
}

// --- Project ---
// Backend ProjectResponse does NOT include createdAt/updatedAt.

export interface ProjectLink {
  id: string
  label: string
  url: string
  kind: ProjectLinkKind
}

export interface Project {
  id: string
  slug: string
  title: string
  tagline: string
  descriptionMarkdown: string
  coverImageUrl: string
  repoUrl: string
  demoUrl: string
  techStack: string[]
  links: ProjectLink[]
  status: ContentStatus
  featured: boolean
  sortOrder: number
  publishedAt: string | null
}

export interface ProjectInput {
  slug: string
  title: string
  tagline: string
  descriptionMarkdown: string
  coverImageUrl: string
  repoUrl: string
  demoUrl: string
  techStack: string[]
  status: ContentStatus
  featured: boolean
  sortOrder: number
  links: Array<{ label: string; url: string; kind: ProjectLinkKind }>
}

// --- Blog Post ---

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string
  publishedAt: string | null
  tags: Tag[]
}

export interface Post extends PostSummary {
  bodyMarkdown: string
  viewCount: number
}

export interface PostInput {
  slug: string
  title: string
  excerpt: string
  bodyMarkdown: string
  coverImageUrl: string
  status: ContentStatus
  tags: Array<{ name: string; slug: string }>
}

// --- Assets ---

export interface Asset {
  id: string
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

// Backend sends { bucket, views } — not { date, views }
export interface ViewPoint {
  bucket: string
  views: number
}

export interface TopPost {
  id: string
  slug: string
  title: string
  views: number
}

// --- Auth ---
// Backend loginResponse returns { accessToken, refreshToken }.
// Backend refreshResponse returns { accessToken }.

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
}

// --- Profile ---

export interface Profile {
  name: string
  email: string
  tagline: string
  bioMarkdown: string
  location: string
  avatarUrl: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  updatedAt: string
}

export interface ProfileInput {
  name: string
  email: string
  tagline: string
  bioMarkdown: string
  location: string
  avatarUrl: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
}
