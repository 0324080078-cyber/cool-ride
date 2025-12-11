#!/bin/bash

# CoolRides Complete Startup Script
# This script ensures all dependencies are installed and starts both backend and frontend

set -e

echo "🛺 CoolRides - Complete Startup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from cool-ride root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing Web Dependencies...${NC}"
cd web
if [ ! -d "node_modules" ]; then
    echo "Installing web dependencies (this may take a few minutes)..."
    npm install
    echo -e "${GREEN}✓ Web dependencies installed!${NC}"
else
    echo -e "${GREEN}✓ Web dependencies already installed${NC}"
fi
cd ..

echo ""
echo -e "${YELLOW}Step 2: Installing Backend Dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed!${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi
cd ..

echo ""
echo -e "${YELLOW}Step 3: Checking Environment Files...${NC}"
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        echo "Creating backend/.env from .env.example..."
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ Created backend/.env${NC}"
    fi
fi

echo ""
echo -e "${GREEN}======================================"
echo "🎉 Setup Complete!"
echo "======================================${NC}"
echo ""
echo -e "${YELLOW}To start the application:${NC}"
echo ""
echo "Open TWO terminal windows:"
echo ""
echo -e "${GREEN}Terminal 1 - Backend:${NC}"
echo "  cd $(pwd)"
echo "  npm run dev:backend"
echo ""
echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
echo "  cd $(pwd)"
echo "  npm run dev:web"
echo ""
echo -e "${YELLOW}Then visit: http://localhost:3000${NC}"
echo ""
echo -e "${RED}Note: The backend error about database is normal.${NC}"
echo -e "${RED}The app works without a database connection!${NC}"
echo ""
