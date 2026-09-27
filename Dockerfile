# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy all files
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "dist/index.js"]
