#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment to Render...${NC}"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "Error: render.yaml not found!"
    exit 1
fi

# Login to Render (if not already logged in)
if ! render --version &> /dev/null; then
    echo "Render CLI not found. Please install it first: https://render.com/docs/cli"
    exit 1
fi

# Deploy to Render
echo -e "${GREEN}Deploying services to Render...${NC}"
render deploy

echo -e "${GREEN}Deployment started! Check your Render dashboard for progress.${NC}"
echo -e "${GREEN}After deployment completes, update the environment variables in the frontend/.env.production file with the actual service URLs.${NC}"
