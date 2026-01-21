# Subject 2: Frontend Docker

In this exercise, you will containerize the React frontend using Docker. This time with less guidance - you'll need to apply what you learned from the backend and figure out some things on your own.

**Learning Objectives:**
- Create a multi-stage Docker build
- Serve a production React build with nginx
- Optimize image size with multi-stage builds

---

## Part A: Multi-Stage Builds

For the frontend, we need two different things:
1. **Build step**: Node.js + npm to compile TypeScript and bundle the app
2. **Runtime**: A web server to serve the static files

We could include Node.js in the final image, but that's wasteful - we only need it during build. **Multi-stage builds** solve this:

```
Stage 1 (builder)          Stage 2 (production)
┌─────────────────┐        ┌─────────────────┐
│ Node.js 20      │        │ nginx           │
│ npm install     │   →    │ dist/ files     │
│ npm run build   │        │ ~25 MB          │
│ ~500 MB         │        └─────────────────┘
└─────────────────┘
```

**Syntax:**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# ... build steps ...

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

The `--from=builder` copies files from the first stage. Only the final stage ends up in the image.

---

## Part B: Your Tasks

### Task 1: Create a .dockerignore

Create `frontend/.dockerignore` to exclude unnecessary files.

**Think about:** What files shouldn't be copied into the Docker build context?
- Dependencies that will be reinstalled?
- Build outputs that will be regenerated?
- Version control files?

### Task 2: Create the Dockerfile

Create `frontend/Dockerfile` using a multi-stage build:

```dockerfile
# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# TODO: Copy package files and install dependencies
# Remember the optimization from Subject 1!
# Hint: npm ci is faster and more reliable than npm install for CI/CD


# TODO: Copy source code and build the app
# Hint: The build command is "npm run build"


# =====================
# Stage 2: Production
# =====================
FROM nginx:alpine

# TODO: Copy the built files from the builder stage
# Hint: Vite outputs to "dist/" folder
# Hint: nginx serves files from /usr/share/nginx/html


EXPOSE 80

# nginx runs automatically, no CMD needed
```

### Task 3: Build and Run

```bash
cd frontend

# Build the image
docker build -t boutique-frontend .

# Run the container
docker run -p 8080:80 boutique-frontend
```

Open http://localhost:8080 to see your app.

> **Note**: The frontend will show API errors because it can't reach the backend. The containers are isolated - we'll connect them in a future lesson with Docker networking.

---

## Part C: Bonus Challenges

### Challenge 1: Compare Image Sizes

Build two versions and compare:

1. **Single-stage** (Node.js for everything):
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   RUN npm install -g serve
   EXPOSE 3000
   CMD ["serve", "-s", "dist", "-l", "3000"]
   ```

2. **Multi-stage** (your implementation with nginx)

Compare sizes with `docker images`. What's the difference?

### Challenge 2: npm ci vs npm install

Research the difference between `npm ci` and `npm install`. Why is `npm ci` preferred for Docker builds and CI/CD?

---

## Validation

### Local validation

- [ ] `.dockerignore` created in `frontend/`
- [ ] `Dockerfile` created in `frontend/`
- [ ] Image builds successfully: `docker build -t boutique-frontend .`
- [ ] Container runs: `docker run -p 8080:80 boutique-frontend`
- [ ] Frontend loads at http://localhost:8080

### Check your image size

```bash
docker images boutique-frontend
```

With a proper multi-stage build using nginx:alpine:
- **Linux (amd64)**: ~50 MB
- **macOS Apple Silicon (arm64)**: ~100-200 MB (base images are larger on arm64)

If your image is over 500 MB, you might have included Node.js in the final stage.

### Git workflow

1. Create a new branch: `git checkout -b feature/docker-frontend`
2. Add the Dockerfile and .dockerignore
3. Commit: `git commit -m "Add Dockerfile for frontend"`
4. Push and create a Pull Request

---

## Hints

<details>
<summary>Hint: .dockerignore contents</summary>

Think about excluding:
- `node_modules/` - reinstalled in container
- `dist/` - rebuilt during build
- `.git/` - not needed
- Any IDE or OS files (`.vscode/`, `.DS_Store`)

</details>

<details>
<summary>Hint: Copy package files first</summary>

```dockerfile
COPY package*.json ./
RUN npm ci
```

The `package*.json` glob copies both `package.json` and `package-lock.json`.

</details>

<details>
<summary>Hint: Copy from builder stage</summary>

```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```

</details>

<details>
<summary>Hint: Full multi-stage Dockerfile structure</summary>

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

</details>

---

## Networking Note

> **About connecting frontend and backend:**
>
> Right now, your frontend and backend run in separate, isolated containers. The frontend tries to call the API at `localhost:8000`, but from inside the container, `localhost` refers to the container itself - not your host machine.
>
> Docker provides networking features to connect containers. We'll explore this in a future lesson when we introduce **Docker Compose** - a tool for defining and running multi-container applications.

---

## Going Further

- Research nginx configuration to enable client-side routing (SPA history fallback)
- Try adding a health check to your Dockerfile: `HEALTHCHECK CMD curl -f http://localhost/ || exit 1`
- Explore `docker build --target builder` to only build a specific stage
