# Base image - using slim variant for smaller size
# slim = Python + minimal OS packages (~150MB instead of ~1GB)
FROM python:3.11-slim

# Set the working directory inside the container
# All subsequent commands will run from /app
WORKDIR /app

# TODO 1: Install uv (the Python package manager)
# Hint: Use RUN with pip install
# Command: pip install uv
RUN pip install uv


# TODO 2: Copy dependency files first
# This is an optimization! Docker caches each layer.
# If dependencies don't change, this layer is reused on rebuild.
# Hint: Copy pyproject.toml and uv.lock
# Syntax: COPY <source> <destination>
COPY pyproject.toml .

COPY uv.lock .

# TODO 3: Install Python dependencies
# Hint: Use RUN with uv sync
# The --frozen flag ensures exact versions from uv.lock are used

RUN uv sync --frozen


# Copy the rest of the application code
COPY . .

WORKDIR /app/core

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

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh


# Expose port 8000 (documentation for humans, doesn't actually publish the port)
EXPOSE 8000

# TODO 6: Use the entrypoint script as the container's entrypoint
# The entrypoint runs migrations then starts the Django server
# Hint: ENTRYPOINT ["/path/to/script"]
ENTRYPOINT ["/entrypoint.sh"]
