#!/bin/bash

echo "Fixing AgentGPT dependencies..."

# Stop containers if running
docker-compose down

# Create a temporary Dockerfile to fix the platform container
cat > platform/Dockerfile.temp << EOL
FROM reworkd/platform-base:latest

WORKDIR /app/src

COPY pyproject.toml poetry.lock /app/src/

RUN pip install --no-cache-dir langchain==0.0.267 lanarky==0.7.8

COPY . /app/src/

# Install current package dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

CMD ["uvicorn", "reworkd_platform.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOL

# Use the temporary Dockerfile
cp platform/Dockerfile platform/Dockerfile.bak
cp platform/Dockerfile.temp platform/Dockerfile

echo "Dependencies fixed. Now run 'docker-compose up --build' to restart with correct dependencies."
