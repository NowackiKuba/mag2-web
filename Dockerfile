# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Enable pnpm via Corepack and prepare version
RUN corepack enable && corepack prepare pnpm@8.10.2 --activate

# Copy package.json and pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm (allow lockfile refresh)
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add configuration to handle SPA routing and set the port to 5173
RUN echo 'server { \
    listen 5173; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

# Start nginx
CMD ["nginx", "-g", "daemon off;"]