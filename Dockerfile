# ==============================================================================
# Stage 1: Base & Dependencies
# ==============================================================================
FROM node:22-alpine AS deps
WORKDIR /app

# Install build dependencies if needed (e.g. for native modules)
RUN apk add --no-cache libc6-compat

# Copy package files for dependency caching
COPY package.json package-lock.json ./

# Clean install all dependencies (including devDependencies needed for build)
RUN npm ci

# ==============================================================================
# Stage 2: Builder
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

# Generate Nuxt Nitro production build (.output/)
RUN npm run build

# ==============================================================================
# Stage 3: Hardened Production Runtime
# ==============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NUXT_TELEMETRY_DISABLED=1

# Security: Run as non-root user (built-in 'node' user in official Node images)
USER node

# Copy built server output and public assets with proper non-root ownership
COPY --from=builder --chown=node:node /app/.output ./.output

# Expose standard Nuxt / Nitro application port
EXPOSE 3000

# Health check using Alpine's built-in wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the standalone Nitro Node production server
CMD ["node", ".output/server/index.mjs"]
