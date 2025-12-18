# ============================================
# YouManage Frontend - React Dockerfile (Production)
# ============================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp (if needed)
RUN apk add --no-cache python3 make g++

# Accept VITE_API_URL as build argument (from Render environment variables)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port (Render utilise une variable PORT dynamique)
EXPOSE ${PORT:-5173}

# Start production server
CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]

