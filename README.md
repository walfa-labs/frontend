# Walfa Labs Frontend

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Nuxt UI](https://img.shields.io/badge/Nuxt_UI-v4-00DC82?logo=nuxt.js&logoColor=white)](https://ui.nuxt.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest_4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-Production_Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg)](https://unlicense.org/)

A modern, high-performance portfolio and content management frontend built with **Nuxt 4**, **Vue 3.5**, **Nuxt UI v4**, and **Tailwind CSS v4**. Engineered with hybrid rendering (SSR + 1-hour SWR edge caching for public routes, client-only SPA for the authenticated dashboard), bespoke editorial design tokens, comprehensive testing suites, and hardened containerization.

Connected to the **Walfa Labs Go (Fiber)** REST API backend.

---

## Table of Contents

- [Architecture & Rendering Strategy](#architecture--rendering-strategy)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Local Development](#local-development)
- [Docker & Containerization](#docker--containerization)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Automation & Taskfile](#automation--taskfile)
- [DevSecOps & CI/CD](#devsecops--cicd)
- [Design System & Styling](#design-system--styling)
- [Production Deployment](#production-deployment)

---

## Architecture & Rendering Strategy

Walfa Labs uses Nuxt 4's hybrid rendering engine configured in [`nuxt.config.ts`](nuxt.config.ts) to provide the best balance between SEO, instant page delivery, and interactive admin functionality:

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
- 🔒 **DevSecOps Pipeline**: Automated SAST (Semgrep), SCA (Trivy + npm audit), secrets detection (Gitleaks), workflow linting (Zizmor), and CodeQL static analysis.
- 🐳 **Hardened Container**: Multi-stage Docker build running as an unprivileged `node` user with Alpine health checks.

---

## Tech Stack

| Layer | Technology | Description |
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
| **Task Automation** | [Task](https://taskfile.dev/) | Cross-platform developer task runner |

---

## Project Structure

```
walfa-labs-frontend/
├── .github/
│   └── workflows/             # CI, E2E, Release, CodeQL, and Security workflows
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
- **Optional**: [Task](https://taskfile.dev/) task runner installed globally
- **Optional**: Docker & Docker Compose for containerized development

### Environment Setup

Create your local `.env` configuration by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | Base URL for the Go Fiber REST API |
| `NUXT_PUBLIC_SITE_URL` | `https://portfolio.example.com` | Canonical base URL used for Open Graph & SEO tags |
| `NUXT_PUBLIC_SITE_NAME` | `Portfolio` | Site branding used in document `<title>` tags |

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

> **Backend Note**: In development mode, API requests to `/api/**` are automatically proxied to the local Go Fiber backend running at `http://localhost:8080/api/**`.

---

## Docker & Containerization

### Development Environment (with Hot-Reloading)

```bash
# Start container with live source binding
docker compose up --build

# Or with Task
task docker:dev
```

### Production Build & Run

```bash
# Build the multi-stage hardened image
docker build -t walfa-labs-frontend:latest .

# Run the containerized server
docker run -d --name walfa-labs-frontend -p 3000:3000 walfa-labs-frontend:latest

# Or run the production compose stack with health checks
task docker:prod
```

---

## Testing & Quality Assurance

The codebase includes comprehensive unit, integration, contract, and end-to-end testing:

```bash
# Run Vitest unit & integration tests
npm test

# Run tests with v8 code coverage reporting
npm run test:coverage

# Perform TypeScript and Vue template type-checking
npm run typecheck

# Run Playwright cross-browser end-to-end tests
npm run test:e2e

# Launch interactive Playwright UI runner
npm run test:e2e:ui
```

### Test Coverage Highlights

- **Unit & Composable Tests** (`tests/composables/`): Validates API wrapper methods, authentication bearer attachment, query parameter serialization, and error propagation.
- **Contract Tests** (`tests/integration/`): Verifies frontend DTO structures and JSON payloads match backend Go API contracts.
- **Middleware & Store Tests** (`tests/middleware/`, `tests/stores/`): Checks auth store mutations, token persistence, and route guard redirects.
- **Markdown Security Tests** (`tests/markdown.test.ts`): Ensures safe HTML rendering, link protocol validation, and XSS attack mitigation.
- **E2E Browser Tests** (`e2e/`): Validates home page rendering, navigation flows, login form workflows, SEO meta tags, and accessibility.

---

## Automation & Taskfile

This repository includes a unified [`Taskfile.yml`](Taskfile.yml) for streamlined developer operations:

| Task | Command / Action | Purpose |
|---|---|---|
| `task setup` | `npm ci` | Clean dependency installation |
| `task dev` / `task run` | `npm run dev` | Start development server on port 3000 |
| `task build` | `npm run build` | Build standalone production Nitro server |
| `task preview` | `npm run preview` | Preview production build locally |
| `task clean` | Clean script | Delete caches, `.output`, `.nuxt`, coverage & regenerate types |
| `task typecheck` | `npm run typecheck` | Run `vue-tsc` type-checking |
| `task test` | `npm run test:unit` | Execute Vitest unit test suite |
| `task test:coverage` | `npm run test:coverage` | Run Vitest with coverage report |
| `task test:e2e` | `npm run test:e2e` | Run Playwright test suite |
| `task test:all` | Unit + E2E | Run all test suites in sequence |
| `task docker:dev` | `docker compose up` | Run hot-reloading dev container |
| `task docker:build` | `docker build` | Build production Docker container |
| `task docker:prod` | `docker compose -f...` | Run production container stack |
| `task security:all` | Audit + SAST + SCA | Run local security scanner suite |
| `task ci` | Full pipeline | Run complete local CI validation suite |

---

## DevSecOps & CI/CD

The repository implements continuous security scanning and automated delivery through GitHub Actions:

- 🚀 **`ci.yml`**: Validates code quality on every push/PR via `vue-tsc` typecheck, Vitest coverage report generation, and production artifact builds.
- 🎭 **`e2e.yml`**: Executes Playwright end-to-end tests with browser caching and artifact report archiving.
- 🛡️ **`security.yml`**:
  - **SCA (Software Composition Analysis)**: `npm audit` and Aqua Security Trivy vulnerability scanner.
  - **SAST (Static Application Security Testing)**: Semgrep security audit against OWASP Top 10 rulesets.
  - **Secret Detection**: Gitleaks historical scan to prevent credential leakage.
  - **Workflow Security**: Zizmor GitHub Actions workflow analyzer.
  - **DAST (Dynamic Scanning)**: OWASP ZAP baseline dynamic scan against live container endpoints.
- 🔍 **`codeql.yml`**: GitHub CodeQL static code analysis for JavaScript and TypeScript.
- 📦 **`release.yml`**: Multi-architecture container build (`amd64`/`arm64`), GHCR publishing, and CycloneDX SBOM generation.

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

### Containerized Deployment

```bash
docker build -t walfa-labs-frontend:latest .
docker run -d \
  -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE=https://api.yourdomain.com/api/v1 \
  -e NUXT_PUBLIC_SITE_URL=https://yourdomain.com \
  --name walfa-labs-frontend \
  walfa-labs-frontend:latest
```

---

## License

This project is dedicated to the public domain under the [Unlicense](https://unlicense.org/) — see the [LICENSE](LICENSE) file for details.
