# Subject 1: Backend Docker

In this exercise, you will containerize the Django backend using Docker. You'll learn how to write a Dockerfile, build an image, and run a container.

**Learning Objectives:**
- Understand Docker concepts (images vs containers)
- Write a Dockerfile for a Python/Django application
- Optimize Docker builds with layer caching
- Run containers with port mapping

---

## Prerequisites: Installing Docker

Before starting, you need Docker installed on your machine.

### Installation

- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### Verify Installation

```bash
# Check Docker is installed
docker --version

# Test Docker works (downloads a small test image)
docker run hello-world
```

If you see "Hello from Docker!" - you're ready to proceed.

---

## Part A: Understanding Docker Concepts

### Images vs Containers

```
Dockerfile  →  docker build  →  Image  →  docker run  →  Container
(recipe)                       (template)               (running instance)
```

- **Dockerfile**: A text file with instructions to build an image
- **Image**: A read-only template (like a snapshot of your app)
- **Container**: A running instance of an image

### Dockerfile Instructions

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `FROM` | Base image to start from | `FROM python:3.11-slim` |
| `WORKDIR` | Set working directory inside container | `WORKDIR /app` |
| `COPY` | Copy files from host to image | `COPY . .` |
| `RUN` | Execute command during build | `RUN pip install -r requirements.txt` |
| `EXPOSE` | Document which port the app uses | `EXPOSE 8000` |
| `CMD` | Default command when container starts | `CMD ["python", "app.py"]` |

---

## Part B: Create a .dockerignore File

Just like `.gitignore`, a `.dockerignore` file tells Docker which files to exclude when copying files into the image. This makes builds faster and images smaller.

Create `backend/.dockerignore`:

```
# Python artifacts
__pycache__/
*.pyc
*.pyo
*.egg-info/
.eggs/

# Virtual environment
.venv/
venv/

# Database (we don't want to include our local db)
*.sqlite3

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/

# Tests and docs (optional, keep if you want to run tests in container)
# tests/
# docs/
```

**Why exclude these?**
- `__pycache__/` and `*.pyc`: Compiled Python files - rebuilt anyway
- `.venv/`: Local virtual environment - dependencies reinstalled in container
- `db.sqlite3`: Local database - data shouldn't be baked into image
- `.git/`: Not needed for running the app

---

## Part C: Create the Dockerfile

Now create the Dockerfile for the Django backend. Create `backend/Dockerfile`:

```dockerfile
# Base image - using slim variant for smaller size
# slim = Python + minimal OS packages (~150MB instead of ~1GB)
FROM python:3.11-slim

# Set the working directory inside the container
# All subsequent commands will run from /app
WORKDIR /app

# TODO 1: Install uv (the Python package manager)
# Hint: Use RUN with pip install
# Command: pip install uv


# TODO 2: Copy dependency files first
# This is an optimization! Docker caches each layer.
# If dependencies don't change, this layer is reused on rebuild.
# Hint: Copy pyproject.toml and uv.lock
# Syntax: COPY <source> <destination>


# TODO 3: Install Python dependencies
# Hint: Use RUN with uv sync
# The --frozen flag ensures exact versions from uv.lock are used


# Copy the rest of the application code
COPY . .

# TODO 4: Change to the Django project directory
# Hint: Use WORKDIR to change directory
# The manage.py file is in the core/ subdirectory


# TODO 5: Copy the entrypoint script and make it executable
# The entrypoint script will run migrations at startup (needed for Docker Compose with PostgreSQL later)
# Create a file called entrypoint.sh with:
#   #!/bin/sh
#   set -e
#   uv run python manage.py migrate
#   exec uv run python manage.py runserver 0.0.0.0:8000
# Hint: COPY the script to /entrypoint.sh and use RUN chmod +x to make it executable


# Expose port 8000 (documentation for humans, doesn't actually publish the port)
EXPOSE 8000

# TODO 6: Use the entrypoint script as the container's entrypoint
# The entrypoint runs migrations then starts the Django server
# Hint: ENTRYPOINT ["/path/to/script"]

```

---

## Part D: Build the Image

From the `backend/` directory, build your Docker image:

```bash
cd backend

# Build the image and tag it as "boutique-backend"
docker build -t boutique-backend .
```

**Understanding the command:**
- `docker build`: Build an image from a Dockerfile
- `-t boutique-backend`: Tag (name) the image
- `.`: Use the current directory as build context

### What happens during build?

Docker executes each instruction and creates a **layer** for each step:
1. Downloads the base Python image (cached after first time)
2. Creates `/app` directory
3. Installs uv
4. Copies dependency files
5. Installs dependencies (cached if requirements unchanged!)
6. Copies application code
7. Runs migrations
8. Saves the final image

### Troubleshooting

If the build fails:
- Read the error message carefully
- Check which step failed
- Verify your Dockerfile syntax
- Make sure all files exist

---

## Part E: Run the Container

Now run your container:

```bash
# Run the container
docker run -p 8000:8000 boutique-backend
```

**Understanding the command:**
- `docker run`: Create and start a container from an image
- `-p 8000:8000`: Map port 8000 on your host to port 8000 in the container
- `boutique-backend`: The image to run

### Test it works

Open your browser to http://localhost:8000/api/products/

You should see the JSON response from your API!

### Useful Docker commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# List images
docker images

# Remove an image
docker rmi boutique-backend
```

---

## Optimization Tips

### 1. Layer Caching

Docker caches each layer. If a layer doesn't change, it's reused. This is why we copy dependency files **before** copying the source code:

```dockerfile
# Good: Dependencies rarely change, this layer is cached
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

# Source code changes often, but only this layer needs rebuild
COPY . .
```

If you copied everything first, changing any file would invalidate the cache and reinstall all dependencies.

### 2. Base Image Selection

| Image | Size | Use case |
|-------|------|----------|
| `python:3.11` | ~1 GB | Full Python with build tools |
| `python:3.11-slim` | ~150 MB | Python without build tools |
| `python:3.11-alpine` | ~50 MB | Minimal, but may have compatibility issues |

We use `slim` for a good balance of size and compatibility.

### 3. Database Note

> **Important**: SQLite stores data in a file (`db.sqlite3`). When you stop and remove a container, this file is lost! Each `docker run` starts fresh.
>
> This is actually good for development and testing (clean state), but for persistent data in production, you'd use:
> - Docker volumes (mount a host directory)
> - A separate database container (PostgreSQL, MySQL)
>
> We'll explore these options in a future lesson.

---

## Validation

### Local validation

- [ ] `.dockerignore` created in `backend/`
- [ ] `Dockerfile` created in `backend/`
- [ ] Image builds successfully: `docker build -t boutique-backend .`
- [ ] Container runs: `docker run -p 8000:8000 boutique-backend`
- [ ] API responds at http://localhost:8000/api/products/

### Check your image size

```bash
docker images boutique-backend
```

With `python:3.11-slim`, expect around 200-300 MB.

### Git workflow

1. Create a new branch: `git checkout -b feature/docker-backend`
2. Add the Dockerfile and .dockerignore
3. Commit: `git commit -m "Add Dockerfile for backend"`
4. Push and create a Pull Request

---

## Hints

<details>
<summary>Hint for TODO 1 (Install uv)</summary>

```dockerfile
RUN pip install uv
```

</details>

<details>
<summary>Hint for TODO 2 (Copy dependency files)</summary>

```dockerfile
COPY pyproject.toml uv.lock ./
```

The `./` means "current directory in the container" (which is `/app` because of WORKDIR).

</details>

<details>
<summary>Hint for TODO 3 (Install dependencies)</summary>

```dockerfile
RUN uv sync --frozen
```

</details>

<details>
<summary>Hint for TODO 4 (Change directory)</summary>

```dockerfile
WORKDIR /app/core
```

</details>

<details>
<summary>Hint for TODO 5 (Entrypoint script)</summary>

First, create `backend/entrypoint.sh`:
```bash
#!/bin/sh
set -e
uv run python manage.py migrate
exec uv run python manage.py runserver 0.0.0.0:8000
```

Then in the Dockerfile:
```dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
```

Note: We use `0.0.0.0` instead of `localhost` because the container needs to accept connections from outside (your host machine).

</details>

<details>
<summary>Hint for TODO 6 (Use entrypoint)</summary>

```dockerfile
ENTRYPOINT ["/entrypoint.sh"]
```

The entrypoint script runs migrations at startup, which is needed when using Docker Compose with a database container (like PostgreSQL).

</details>

---

## Going Further

Once your basic Docker setup works:

- Try rebuilding after changing only source code - notice how dependency installation is cached
- Compare image sizes with different base images (`python:3.11` vs `python:3.11-slim`)
- Try running the container in detached mode: `docker run -d -p 8000:8000 boutique-backend`
- Explore `docker logs <container_id>` to see container output
