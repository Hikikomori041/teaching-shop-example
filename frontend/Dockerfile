# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# TODO: Copy package files and install dependencies
# Remember the optimization from Subject 1!
# Hint: npm ci is faster and more reliable than npm install for CI/CD
COPY package.json package-lock.json ./

RUN npm ci

# TODO: Copy source code and build the app
# Hint: The build command is "npm run build"

COPY . .

RUN npm run build


# =====================
# Stage 2: Production
# =====================
FROM nginx:alpine

# TODO: Copy the built files from the builder stage
# Hint: Vite outputs to "dist/" folder
# Hint: nginx serves files from /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx runs automatically, no CMD needed
