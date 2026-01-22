# Docker Compose: Running Multi-Container Applications

In the previous lesson, you containerized the backend and frontend separately. You may have noticed a problem: **the containers can't communicate with each other**. When you run the frontend, it tries to reach `localhost:8000`, but from inside a container, `localhost` refers to the container itself.

**Docker Compose** solves this by letting you define and run multi-container applications with automatic networking between services.

**Learning Objectives:**
- Understand Docker Compose concepts (services, networking)
- Write a `docker-compose.yml` file
- Run multiple containers with a single command
- Connect frontend and backend containers
- Use Docker volumes for data persistence
- Configure services with environment variables

---

## Prerequisites

- Completed lesson-3-part-1 (Backend and Frontend Dockerfiles)
- Docker Desktop or Docker Engine with Compose plugin installed

```bash
# Verify Docker Compose is available
docker compose version
```

> **Note**: Older versions use `docker-compose` (with hyphen). The modern command is `docker compose` (with space).

---

## Part A: Understanding Docker Compose

### What is Docker Compose?

Docker Compose is a tool for defining multi-container applications in a single YAML file. Instead of running multiple `docker run` commands with complex flags, you describe your entire application stack and run it with one command.

### Key Concepts

```
docker-compose.yml
├── services:           # Define your containers
│   ├── backend:        # Service name (becomes hostname!)
│   │   ├── build:      # How to build the image
│   │   └── ports:      # Port mappings
│   └── frontend:
│       ├── build:
│       └── ports:
└── networks:           # (optional) Custom networking
```

**Important insight**: Each service name becomes a **hostname** on the internal Docker network. This means the frontend can reach the backend at `http://backend:8000` instead of `localhost:8000`.

### Basic docker-compose.yml Structure

```yaml
services:
  service-name:
    build: ./path/to/dockerfile/directory
    ports:
      - "host:container"
```

---

## Part B: Add the Backend Service (Guided)

Create a `docker-compose.yml` file in the **root** of the project (same level as `frontend/` and `backend/` folders):

```yaml
services:
  backend:
    # TODO 1: Set the build context to the backend directory
    # Syntax: build: ./relative/path


    # TODO 2: Map port 8000 from container to host
    # Syntax:
    #   ports:
    #     - "host_port:container_port"


```

### Test the Backend Service

```bash
# Build and run the backend only
docker compose up backend
```

Open http://localhost:8000/api/products/ to verify it works.

**Useful commands:**
```bash
# Run in detached mode background
docker compose up -d backend

# View logs
docker compose logs backend

# Stop services
docker compose down
```

---

## Part C: Add the Frontend Service (Your Turn)

Now add the frontend service to your `docker-compose.yml`. You have less guidance this time.

### The Challenge

1. Add a `frontend` service to your docker-compose.yml
2. Set the build context to the frontend directory
3. Map port 8080 on your host to port 80 in the container (nginx serves on port 80)

### Expected Result

After adding the frontend service, you should be able to run:

```bash
docker compose up
```

And access:
- Backend: http://localhost:8000/api/products/
- Frontend: http://localhost:8080

---


## Part D: Adding PostgreSQL with Volumes

Currently, the backend uses SQLite, which stores data in a file inside the container. When you stop the container, the data is lost. Let's add a proper database service with **persistent storage**.

### Understanding Volumes

Docker volumes persist data outside of containers:

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Host                              │
│                                                             │
│   ┌─────────────────┐         ┌─────────────────────────┐  │
│   │   postgres      │         │     Docker Volume       │  │
│   │   container     │◄───────►│     "postgres-data"     │  │
│   │   /var/lib/     │         │                         │  │
│   │   postgresql/   │         │   Data persists even    │  │
│   │   data          │         │   after container stops │  │
│   └─────────────────┘         └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Add the PostgreSQL Service

Add this `db` service to your `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: boutique
      POSTGRES_USER: boutique
      POSTGRES_PASSWORD: boutique
    # TODO: Add a volume to persist the database data
    # PostgreSQL stores data in /var/lib/postgresql/data
    # Syntax:
    #   volumes:
    #     - volume-name:/path/in/container

  backend:
    # ... your existing backend config ...
```

### Declare the Volume

At the **bottom** of your `docker-compose.yml`, you need to declare named volumes:

```yaml
services:
  # ... services here ...

# TODO: Declare the volume
# Syntax:
# volumes:
#   volume-name:
```

### Connect Backend to PostgreSQL

The backend needs to know how to connect to PostgreSQL. Add environment variables to the backend service:

```yaml
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_HOST=db          # Service name = hostname!
      - DATABASE_NAME=boutique
      - DATABASE_USER=boutique
      - DATABASE_PASSWORD=boutique
    depends_on:
      - db
```

**Key insight**: `DATABASE_HOST=db` uses the service name as the hostname. Docker Compose networking makes this work automatically.

### Why depends_on?

The backend needs the database to be running before it can connect. `depends_on` ensures the `db` container starts before `backend`.

> **Note**: `depends_on` only waits for the container to start, not for PostgreSQL to be ready to accept connections. For production, you'd add health checks.

### Test Persistence

1. Start everything:
   ```bash
   docker compose up --build
   ```

2. Create some data (register a user, place an order)

3. Stop everything:
   ```bash
   docker compose down
   ```

4. Start again:
   ```bash
   docker compose up
   ```

5. Your data should still be there!

### Verify the Volume

```bash
# List volumes
docker volume ls

# Inspect the volume
docker volume inspect boutique-couture_postgres-data
```

### Clean Up (when needed)

```bash
# Stop containers AND remove volumes (deletes data!)
docker compose down -v
```

> **Warning**: The `-v` flag removes volumes. Use with caution - this deletes all your database data.

---

## Part E: Running Your Full Stack

### Commands Reference

```bash
# Build all images
docker compose build

# Start all services
docker compose up

# Start in background
docker compose up -d

# View running services
docker compose ps

# View logs (follow mode)
docker compose logs -f

# Stop and remove containers
docker compose down

# Rebuild and restart (when you change code)
docker compose up --build
```

### Development Workflow

When you change your code:
1. Frontend changes: `docker compose up --build frontend`
2. Backend changes: `docker compose up --build backend`
3. Both: `docker compose up --build`

> **Note**: This rebuild-on-change workflow is slow. In a future lesson, we could explore **bind mounts** to mount your source code into containers for faster development with hot reload.

---

## Validation

### Checklist

- [ ] `docker-compose.yml` created in project root
- [ ] Backend service defined with correct build context and port
- [ ] Frontend service defined with correct build context and port
- [ ] PostgreSQL service defined with environment variables
- [ ] Volume declared and mounted for PostgreSQL data
- [ ] Backend configured with database environment variables
- [ ] `docker compose up` starts all three services
- [ ] Backend responds at http://localhost:8000/api/products/
- [ ] Frontend loads at http://localhost:8080
- [ ] Data persists after `docker compose down` and `up` again

### Test Full Stack

```bash
# Start everything
docker compose up --build

# In another terminal, test the API
curl http://localhost:8000/api/products/

# Open browser to http://localhost:8080
# Products should load and display
```

### Git Workflow

1. Create branch: `git checkout -b feature/docker-compose`
2. Add docker-compose.yml to git
3. Commit: `git commit -m "Add docker-compose configuration"`
4. Push and create a Pull Request

---

## Hints

<details>
<summary>Hint: Backend service build context</summary>

```yaml
services:
  backend:
    build: ./backend
```

</details>

<details>
<summary>Hint: Backend port mapping</summary>

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
```

</details>

<details>
<summary>Hint: Frontend service</summary>

```yaml
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
```

</details>

<details>
<summary>Hint: PostgreSQL volume mount</summary>

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: boutique
      POSTGRES_USER: boutique
      POSTGRES_PASSWORD: boutique
    volumes:
      - postgres-data:/var/lib/postgresql/data
```

</details>

<details>
<summary>Hint: Declaring named volumes</summary>

At the bottom of your docker-compose.yml:

```yaml
volumes:
  postgres-data:
```

</details>

<details>
<summary>Hint: Complete docker-compose.yml</summary>

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: boutique
      POSTGRES_USER: boutique
      POSTGRES_PASSWORD: boutique
    volumes:
      - postgres-data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_HOST=db
      - DATABASE_NAME=boutique
      - DATABASE_USER=boutique
      - DATABASE_PASSWORD=boutique
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  postgres-data:
```

</details>

---

## Bonus Challenges

### Challenge 1: Health Checks

`depends_on` only waits for the container to start, not for the application inside to be ready. Add a health check to ensure PostgreSQL is actually accepting connections:

```yaml
services:
  db:
    image: postgres:16-alpine
    # ... other config ...
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U boutique -d boutique"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    # ... other config ...
    depends_on:
      db:
        condition: service_healthy
```

### Challenge 2: Environment Files

Instead of listing environment variables in the docker-compose.yml, use a `.env` file:

```yaml
services:
  backend:
    env_file:
      - ./backend/.env
```

Research the format of `.env` files and how to use them securely (hint: add to `.gitignore`).

### Challenge 3: Database Initialization

When the backend starts with an empty PostgreSQL database, it needs to run migrations. Currently, migrations run during image build (with SQLite). Research how to run migrations when the container starts instead, using an entrypoint script.

---

## Going Further

- Research Docker Compose `profiles` to create different configurations (dev vs prod)
- Explore `docker compose watch` for automatic rebuilds on file changes
- Try adding a third service (like PostgreSQL or Redis)
- Learn about Docker Compose override files for environment-specific settings

---

## Troubleshooting

### "Port already in use"

Another process is using the port. Either stop it or change the host port:
```yaml
ports:
  - "8001:8000"  # Use 8001 on host instead
```

### "Cannot connect to Docker daemon"

Make sure Docker Desktop is running.

### Frontend can't reach API

1. Check both services are running: `docker compose ps`
2. Check browser console for errors
3. Verify port mappings are correct
4. Try `docker compose logs` to see service output

### Changes not appearing after rebuild

Make sure you're using `--build`:
```bash
docker compose up --build
```

Or force a fresh build:
```bash
docker compose build --no-cache
docker compose up
```

### Backend can't connect to database

1. Make sure the `db` service is running: `docker compose ps`
2. Check `DATABASE_HOST` matches the service name (`db`)
3. Check credentials match between `db` and `backend` environment variables
4. The database might not be ready yet - try restarting: `docker compose restart backend`
5. Check backend logs: `docker compose logs backend`

### Database data not persisting

1. Make sure you declared the volume at the bottom of docker-compose.yml
2. Make sure the volume is mounted in the `db` service
3. Don't use `docker compose down -v` (the `-v` flag removes volumes!)
