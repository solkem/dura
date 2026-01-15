# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install execution dependencies (including devDeps for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Astro site
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files for production install
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4321

# Set environment
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
