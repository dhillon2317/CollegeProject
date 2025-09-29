# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8000 \
    WORKERS=4 \
    TIMEOUT=120

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/frontend/complain-analyzer-ai/dist && \
    chmod -R 755 /app && \
    chown -R 1000:1000 /app

# Copy the entire application first
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip wheel setuptools && \
    # Install direct URL requirements first
    pip install --no-cache-dir https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0.tar.gz && \
    # Install other requirements
    pip install --no-cache-dir -r requirements.txt && \
    # Install in development mode
    pip install -e .

# Make start.sh executable
RUN chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Command to run the application
CMD ["./start.sh"]
