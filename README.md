# Walfa Labs - Frontend UI

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.5-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Nuxt UI](https://img.shields.io/badge/Nuxt_UI-v4-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://ui.nuxt.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest_4-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg?style=flat)](LICENSE)

A modern, high-performance portfolio and content management frontend built with **Nuxt 4**, **Vue 3.5**, **Nuxt UI v4**, and **Tailwind CSS v4**. Engineered with hybrid rendering (SSR + 1-hour SWR edge caching for public routes, client-only SPA for the authenticated dashboard), bespoke editorial design tokens, comprehensive testing suites, and hardened containerization.

Connected to the [Walfa Labs Go (Fiber) REST API Backend](../backend/README.md).

---

## Table of Contents

- [Architecture & Rendering Strategy](#architecture--rendering-strategy)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Local Development](#local-development)
- [Security & DevSecOps](#security--devsecops)
- [Configuration Reference](#configuration-reference)
- [Automation & Taskfile](#automation--taskfile)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Design System & Styling](#design-system--styling)
- [Production Deployment](#production-deployment)
- [License](#license)

---

## Architecture & Rendering Strategy

Walfa Labs uses Nuxt 4's hybrid rendering engine configured in [`nuxt.config.ts`](nuxt.config.ts) to provide the optimal balance between SEO, instant page delivery, and interactive admin functionality:

```
                                 ┌────────────────────────────────────────┐
                                 │       Incoming Client Request          │
                                 └──────────────────┬─────────────────────┘
                                                    │
                         ┌──────────────────────────┴──────────────────────────┐
                         ▼                                                     ▼
        ┌──────────────────────────────────┐                 ┌──────────────────────────────────┐
        │     Public Content Routes        │                 │    Admin & Auth Routes           │
        │  /, /about, /projects, /blog/**  │                 │    /dashboard/**, /login         │
        ├──────────────────────────────────┤                 ├──────────────────────────────────┤
        │ • Server-Side Rendered (SSR)     │                 │ • Client-Only SPA (ssr: false)   │
        │ • SWR Cached (3600s / 1 Hour)    │                 │ • Bearer Auth via Pinia + Local  │
        │ • Full SEO & Open Graph Meta     │                 │ • Dynamic Charts (@unovis/vue)   │
        │ • JSON-LD Structured Data        │                 │ • Custom Markdown Editor         │
        │ • Robots: index, follow          │                 │ • Robots: noindex, nofollow      │
        └──────────────────────────────────┘                 └──────────────────────────────────┘
```

### Route Rules Topology

| Route Pattern | Rendering Mode | Cache / Rule | Purpose |
|---|---|---|---|
| `/` | SSR | `swr: 3600` | Landing page with hero, featured projects, latest posts, and timeline |
| `/about` | SSR | `swr: 3600` | Bio, education history, and career experience |
| `/projects` / `/projects/**` | SSR | `swr: 3600` | Project portfolio showcase and detailed case studies |
| `/blog` / `/blog/**` | SSR | `swr: 3600` | Editorial blog index and full markdown article views |
| `/dashboard/**` | SPA (`ssr: false`) | Client-only | Authenticated admin management dashboard (noindex) |
| `/login` | SPA (`ssr: false`) | Client-only | Admin authentication gateway |
| `/api/**` (dev) | Proxy | `http://localhost:8080/api/**` | Direct proxy to Go Fiber backend |
| `/api/**` (prod) | CORS enabled | Ingress proxy | Same-origin API routing |

---

## Key Features

- ⚡ **Hybrid SSR + SWR Caching**: Server-rendered public pages cached for 1 hour for ultra-fast TTFB and optimal search engine crawlability.
- 🎨 **Editorial Design Language**: Viridian green primary accent (`#19594A`), warm stone surfaces, Fraunces display serif, Inter body typography, and JetBrains Mono monospace elements.
- 🌓 **Dynamic Theme System**: Seamless light and dark mode switching powered by `@nuxtjs/color-mode` and CSS custom property tokens.
- 🛡️ **Secure Admin Suite**: Complete management dashboard with JWT authentication, protected global navigation guards, and Zod form validation.
- 📊 **Interactive Analytics**: Dashboard telemetry visualizations using `@unovis/vue` for tracking post pageviews and engagement trends.
- ✍️ **Custom Markdown Studio**: Integrated client-side markdown authoring editor with real-time preview, formatting controls, and XSS sanitization.
- 💼 **Timeline & Project Showcase**: Dynamic experience highlights (Work & Education) with collapsible details and tech stack tags.
- 🧪 **Enterprise Test Suite**: 50+ unit/integration tests with Vitest + v8 coverage and cross-browser end-to-end tests with Playwright.
- 🔒 **Hardened DevSecOps**: Automated SAST (Semgrep), SCA (Trivy + npm audit), secrets detection (Gitleaks), workflow linting (Zizmor), and CodeQL static analysis.
- 🐳 **Hardened Container**: Multi-stage Docker build running as an unprivileged `node` user with Alpine health checks.

---

## Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [Nuxt 4.5](https://nuxt.com/) | Hybrid SSR/SPA Vue framework with directory-based routing |
| **UI Library** | [Nuxt UI v4](https://ui.nuxt.com/) + [Reka UI](https://reka-ui.com/) | Accessible, unstyled UI primitives styled with Tailwind v4 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | CSS-first utility engine with custom property design tokens |
| **State Management** | [Pinia 4](https://pinia.vuejs.org/) (`@pinia/nuxt`) | Centralized state for JWT authentication and UI layout state |
| **Schema Validation** | [Zod 4](https://zod.dev/) | Type-safe form validation schemas used with `UForm` |
| **Charts** | [@unovis/vue](https://unovis.dev/) | Responsive XY charts for dashboard analytics |
| **Icons** | [@nuxt/icon](https://github.com/nuxt/icon) | High-performance SVG icons from `@iconify-json/lucide` |
| **Unit Testing** | [Vitest 4](https://vitest.dev/) + `@nuxt/test-utils` | Fast unit & composable testing in happy-dom environment |
| **E2E Testing** | [Playwright](https://playwright.dev/) | Cross-browser integration testing (Chromium, Firefox, WebKit) |
| **Task Automation** | [Task](https://taskfile.dev/) | Cross-platform developer task runner (`Taskfile.yml`) |

---

## Project Directory Structure

```
├── .github/
│   └── workflows/             # CI, E2E, Release, CodeQL, and Security workflows
│       ├── ci.yml             # Typecheck, Vitest unit testing, coverage & production build
│       ├── e2e.yml            # Playwright cross-browser end-to-end test pipeline
│       ├── release.yml        # Multi-arch container build, SBOM & GitHub Release
│       └── security.yml       # Gitleaks, TruffleHog, Semgrep, Trivy, Zizmor, CodeQL
├── app/
│   ├── app.vue                # Root application template & SSR profile bootstrap
│   ├── app.config.ts          # Nuxt UI theme configuration (emerald / stone)
│   ├── assets/
│   │   └── css/main.css       # Design tokens, CSS variables & editorial typography
│   ├── components/
│   │   ├── content/           # Public display cards (PostCard, ExperienceCard, MarkdownView)
│   │   ├── dashboard/         # Admin widgets (StatCard, ResourceTable, ViewsChart)
│   │   ├── editor/            # UmoEditor.client.vue markdown authoring tool
│   │   └── landing/           # Hero, FeaturedProjects, RecentPosts, ExperienceTimeline
│   ├── composables/           # Data & API hooks (useApi, usePosts, useProjects, useProfile...)
│   ├── layouts/               # default.vue (public shell) & dashboard.vue (admin shell)
│   ├── middleware/            # auth.global.ts global client authentication route guard
│   ├── pages/                 # File-based routes (SSR public pages & SPA dashboard CRUD)
│   ├── stores/                # Pinia state stores (auth.ts, ui.ts)
│   ├── types/
│   │   └── api.ts             # TypeScript interfaces mirroring Go backend DTOs
│   └── utils/
│       └── markdown.ts        # Shared secure markdown-to-HTML parser
├── e2e/                       # Playwright end-to-end test specs
├── tests/                     # Vitest unit & integration test suites
├── Dockerfile                 # Multi-stage production container
├── Dockerfile.dev             # Hot-reloading development container
├── docker-compose.yml         # Development compose definition
├── docker-compose.prod.yml    # Production compose definition
├── nuxt.config.ts             # Nuxt 4 configuration & hybrid route rules
├── package.json               # Dependencies and scripts
├── playwright.config.ts       # Playwright E2E configuration
├── Taskfile.yml               # Unified automation tasks
└── vitest.config.ts           # Vitest unit test configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: `22.x` or `24.x` (LTS recommended)
- **Package Manager**: `npm` (v10+)
- **Task Runner**: [Taskfile](https://taskfile.dev/installation/) (`task`)
- **Docker & Docker Compose**: (Optional, for containerized development)

---

### Environment Setup

Create your local `.env` configuration by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` contains the default settings:
```env
NUXT_PUBLIC_API_BASE=/api/v1
NUXT_PUBLIC_SITE_URL=https://portfolio.example.com
NUXT_PUBLIC_SITE_NAME=Portfolio
```

---

### Local Development

Install dependencies and start the local development server:

```bash
# Clean install dependencies (also runs nuxt prepare via postinstall)
npm install

# Start development server on http://localhost:3000
npm run dev
```

Or using **Task**:

```bash
task setup    # npm ci
task run      # Starts dev server on http://localhost:3000
```

> **Backend Proxy**: In development mode, API requests to `/api/**` are automatically proxied to the local Go Fiber backend running at `http://localhost:8080/api/**`.

---

## Security & DevSecOps

This repository integrates enterprise-grade DevSecOps security controls natively in CI/CD pipelines and local task runners:

| Security Domain | Tooling | Execution Phase | Description |
|---|---|---|---|
| **Secret Detection** | Gitleaks, TruffleHog | Pre-commit & CI Pipeline | Scans repository and PR commits for leaked tokens & secrets |
| **SAST (JS/TS)** | Semgrep | CI Pipeline & Local Task | Static analysis enforcing OWASP Top 10 rules for Vue & TypeScript |
| **SAST (Deep)** | GitHub CodeQL | Scheduled & CI Pipeline | Deep semantic query scanning for DOM XSS and prototype pollution |
| **SCA (Dependencies)** | npm audit, Trivy | CI Pipeline & Local Task | Audits npm package tree & supply chain dependencies for CVEs |
| **Workflow Audit** | Zizmor | CI Security Scan | Audits GitHub Actions workflow files for privilege escalation |
| **Container Scan** | Trivy Container | Docker Build Step | Vulnerability analysis of Node.js production container image |
| **DAST (Dynamic)** | OWASP ZAP Baseline | Pull Requests & Weekly | Automated web application vulnerability scan against live routes |
| **Supply Chain** | CycloneDX SBOM | Tagged Releases to GHCR | Generates Software Bill of Materials (SBOM) for container releases |

Run all static security scans locally with:
```bash
task security:all
```

---

## Configuration Reference

All application settings are read from environment variables and configured in `nuxt.config.ts`:

| Variable | Type | Default | Description |
|---|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `string` | `/api/v1` | Base URL prefix for the backend Go REST API |
| `NUXT_PUBLIC_SITE_URL` | `string` | `https://portfolio.example.com` | Canonical base URL used for Open Graph & SEO tags |
| `NUXT_PUBLIC_SITE_NAME` | `string` | `Portfolio` | Site branding used in document `<title>` tags and headers |

---

## Automation & Taskfile

This repository includes a unified [`Taskfile.yml`](Taskfile.yml) for developer operations. Run `task --list` to view all commands:

### Development & Build
```bash
task setup            # Clean install all dependencies via npm ci
task run              # Start local development server on http://localhost:3000
task dev              # Alias for task run
task build            # Build production Nitro server bundle (.output/server/index.mjs)
task preview          # Preview the production build locally
task clean            # Deep clean all build artifacts (.output, .nuxt, caches)
task typecheck        # Run TypeScript and Vue SFC type checking with vue-tsc
```

### Testing & Code Quality
```bash
task test             # Run unit & integration tests (Vitest)
task test:unit        # Alias for task test
task test:coverage    # Run unit & integration tests with v8 code coverage reporting
task test:e2e         # Run Playwright end-to-end tests against local application
task test:e2e:ui      # Open interactive Playwright UI Test Runner
task test:e2e:report  # Open generated Playwright HTML test report
task test:all         # Run all test suites in sequence (Vitest + Playwright)
```

### Security Scans (DevSecOps)
```bash
task security:all     # Run all local security checks (audit, secrets, sast, sca)
task security:audit   # Run npm dependency vulnerability audit
task security:secrets # Scan repository for secrets using Gitleaks
task security:sast    # Run static application security testing (Semgrep SAST)
task security:sca     # Run software composition analysis using Trivy
task security:dast    # Run OWASP ZAP baseline dynamic scan against running app
task security:zizmor  # Run zizmor GitHub Actions workflow security linter
```

### Docker & Containerization
```bash
task docker:build     # Build hardened multi-stage production Docker image
task docker:run       # Run production container on port 3000
task docker:dev       # Start development container environment with hot reloading
task docker:prod      # Run production stack with health checks via docker-compose.prod.yml
task docker:stop      # Stop all running docker-compose containers
```

---

## Testing & Quality Assurance

The codebase includes comprehensive unit, integration, contract, and end-to-end testing suites.

To run the entire test suite with code coverage and browser automation:

```bash
task test:all
```

### Test Suites
- **Unit & Composable Tests** (`tests/composables/`): Validates API wrapper methods, authentication bearer attachment, query parameter serialization, and error propagation.
- **Contract Tests** (`tests/integration/`): Verifies frontend DTO structures and JSON payloads match backend Go API contracts.
- **Middleware & Store Tests** (`tests/middleware/`, `tests/stores/`): Checks auth store mutations, token persistence, and route guard redirects.
- **Markdown Security Tests** (`tests/markdown.test.ts`): Ensures safe HTML rendering, link protocol validation, and XSS attack mitigation.
- **E2E Browser Tests** (`e2e/`): Validates home page rendering, navigation flows, login form workflows, SEO meta tags, and accessibility.

---

## Design System & Styling

The visual layer is defined in [`app/assets/css/main.css`](app/assets/css/main.css) using CSS Custom Properties and Tailwind CSS v4:

```css
:root {
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Viridian green accent palette */
  --accent: #19594A;
  --accent-hover: #134238;
  --accent-light: #3B7A57;
  --accent-subtle: rgba(25, 89, 74, 0.06);
  --accent-glow: rgba(25, 89, 74, 0.12);

  /* Warm editorial surfaces */
  --bg-main: #FAFAF8;
  --bg-tint: #F4F5F1;
  --surface-panel: #FFFFFF;
  --surface-subtle: #F5F5F4;
  --surface-inset: #ECEEEA;
}
```

### Core Utility Classes

- `.editorial-heading` — High-contrast display typography with Fraunces serif and tight letter-spacing.
- `.editorial-label` — Monospace uppercase section indicators with accent coloring.
- `.card-flat`, `.card-elevated`, `.card-accent` — Structured component containers with subtle borders and elevation hover states.
- `.btn-primary`, `.btn-secondary` — Interactive buttons styled with brand tokens.
- `.tag-default` — Subtle pill badges for technology stacks and tags.
- `.prose` — Typographic styling for rendered markdown content.

---

## Production Deployment

### Standalone Node.js Server

```bash
# Build production bundle
npm run build

# Start production Nitro server (listens on HOST/PORT, defaults 0.0.0.0:3000)
node .output/server/index.mjs
```

### Multi-Stage Container Build

```bash
# Build hardened multi-stage image
docker build -t walfa-labs-frontend:latest .

# Run container with environment configuration
docker run -d \
  -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://api.yourdomain.com/api/v1 \
  -e NUXT_PUBLIC_SITE_URL=https://yourdomain.com \
  --name walfa-labs-frontend \
  walfa-labs-frontend:latest
```

---

## License

Distributed under the WTFPL (Do What The Fuck You Want To Public License). See [LICENSE](LICENSE) for details or visit <http://www.wtfpl.net/>.
