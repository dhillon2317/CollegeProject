#!/bin/bash
set -euo pipefail

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Function to log errors and exit
error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}

# Check for required commands
for cmd in node npm python pip; do
    if ! command -v "$cmd" &> /dev/null; then
        error "$cmd is required but not installed"
    fi
done

# Print environment info
log "=== Environment Information ==="
log "Node.js: $(node -v)"
log "npm: $(npm -v)"
log "Python: $(python --version)"
log "pip: $(pip --version)"

# Install Python dependencies
log "=== Installing Python Dependencies ==="
python -m pip install --upgrade pip
pip install -r requirements.txt

# Install frontend dependencies
if [ -d "frontend/complain-analyzer-ai" ]; then
    log "=== Installing Frontend Dependencies ==="
    cd frontend/complain-analyzer-ai
    
    # Clean previous installations
    rm -rf node_modules package-lock.json .next
    npm cache clean --force
    
    # Install dependencies
    if ! npm install --legacy-peer-deps; then
        warn "npm install with --legacy-peer-deps failed, trying with --force..."
        npm install --force || error "Failed to install frontend dependencies"
    fi
    
    # Build frontend
    log "=== Building Frontend ==="
    if ! npm run build; then
        error "Frontend build failed"
    fi
    
    cd ../../
else
    warn "Frontend directory not found, skipping frontend build"
fi

# Create necessary directories
mkdir -p sbackend/camplaint-analyzer/models

log "=== Build Completed Successfully ==="
echo -e "\n${GREEN}✅ Build completed successfully!${NC}"
echo -e "To start the application, run: ${YELLOW}python app.py${NC}"
