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
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Create a non-root user and set up directories
RUN groupadd -r appuser && \
    useradd -r -g appuser -d /home/appuser -m appuser && \
    mkdir -p /app/logs /app/frontend/complain-analyzer-ai/dist && \
    chown -R appuser:appuser /app

# Copy the application files
COPY --chown=appuser:appuser . .

# Build the frontend
RUN cd /app/frontend/complain-analyzer-ai && \
    pnpm install && \
    pnpm run build

# Ensure frontend build directory exists and has correct permissions
RUN mkdir -p /app/static && \
    cp -r /app/frontend/complain-analyzer-ai/dist/* /app/static/ && \
    chown -R appuser:appuser /app/static

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PATH="/home/appuser/.local/bin:${PATH}" \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HOME=/home/appuser

# Create .local directory and set permissions
RUN mkdir -p /home/appuser/.local && \
    chown -R appuser:appuser /home/appuser && \
    chmod -R 755 /home/appuser

# Switch to non-root user
USER appuser

# Install Python dependencies as non-root user
RUN pip install --user --no-warn-script-location --upgrade pip wheel setuptools && \
    # Install direct URL requirements first
    pip install --user --no-warn-script-location --no-cache-dir https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0.tar.gz && \
    # Install other requirements
    pip install --user --no-warn-script-location --no-cache-dir -r requirements.txt && \
    # Install in development mode
    pip install --user --no-warn-script-location -e .

# Make start.sh executable
RUN chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application
CMD ["/app/start.sh"]
