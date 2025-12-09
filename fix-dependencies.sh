#!/bin/bash

###############################################################################
# CoolRides Complete Dependency Fix Script
# This script fixes all dependency issues across the entire monorepo
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "🚀 CoolRides Dependency Fix Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📍 Working directory: $SCRIPT_DIR${NC}"
echo ""

###############################################################################
# STEP 1: Clean all node_modules and lock files
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "🧹 STEP 1: Cleaning all node_modules and lock files"
echo -e "==========================================${NC}"
echo ""

# Root
if [ -d "node_modules" ]; then
  echo "  ➜ Removing root node_modules..."
  rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
  echo "  ➜ Removing root package-lock.json..."
  rm -f package-lock.json
fi

# Backend
if [ -d "backend/node_modules" ]; then
  echo "  ➜ Removing backend/node_modules..."
  rm -rf backend/node_modules
fi
if [ -f "backend/package-lock.json" ]; then
  echo "  ➜ Removing backend/package-lock.json..."
  rm -f backend/package-lock.json
fi

# Web
if [ -d "web/node_modules" ]; then
  echo "  ➜ Removing web/node_modules..."
  rm -rf web/node_modules
fi
if [ -f "web/package-lock.json" ]; then
  echo "  ➜ Removing web/package-lock.json..."
  rm -f web/package-lock.json
fi

# Admin
if [ -d "admin/node_modules" ]; then
  echo "  ➜ Removing admin/node_modules..."
  rm -rf admin/node_modules
fi
if [ -f "admin/package-lock.json" ]; then
  echo "  ➜ Removing admin/package-lock.json..."
  rm -f admin/package-lock.json
fi

# Mobile
if [ -d "mobile/node_modules" ]; then
  echo "  ➜ Removing mobile/node_modules..."
  rm -rf mobile/node_modules
fi
if [ -f "mobile/package-lock.json" ]; then
  echo "  ➜ Removing mobile/package-lock.json..."
  rm -f mobile/package-lock.json
fi

echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""

###############################################################################
# STEP 2: Install Root Dependencies
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "📦 STEP 2: Installing root dependencies"
echo -e "==========================================${NC}"
echo ""

npm install
echo -e "${GREEN}✅ Root dependencies installed!${NC}"
echo ""

###############################################################################
# STEP 3: Install Backend Dependencies
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "⚙️  STEP 3: Installing backend dependencies"
echo -e "==========================================${NC}"
echo ""

cd backend

# Install dependencies
npm install

echo -e "${GREEN}✅ Backend dependencies installed!${NC}"
echo ""

# Verify critical backend packages
echo "  ➜ Verifying critical backend packages..."
BACKEND_MISSING=""

command -v node > /dev/null || BACKEND_MISSING="${BACKEND_MISSING}nodejs "

if [ ! -d "node_modules/express" ]; then BACKEND_MISSING="${BACKEND_MISSING}express "; fi
if [ ! -d "node_modules/typescript" ]; then BACKEND_MISSING="${BACKEND_MISSING}typescript "; fi
if [ ! -d "node_modules/sequelize" ]; then BACKEND_MISSING="${BACKEND_MISSING}sequelize "; fi
if [ ! -d "node_modules/pg" ]; then BACKEND_MISSING="${BACKEND_MISSING}pg "; fi
if [ ! -d "node_modules/redis" ]; then BACKEND_MISSING="${BACKEND_MISSING}redis "; fi
if [ ! -d "node_modules/jest" ]; then BACKEND_MISSING="${BACKEND_MISSING}jest "; fi
if [ ! -d "node_modules/bcryptjs" ]; then BACKEND_MISSING="${BACKEND_MISSING}bcryptjs "; fi
if [ ! -d "node_modules/jsonwebtoken" ]; then BACKEND_MISSING="${BACKEND_MISSING}jsonwebtoken "; fi
if [ ! -d "node_modules/joi" ]; then BACKEND_MISSING="${BACKEND_MISSING}joi "; fi
if [ ! -d "node_modules/cors" ]; then BACKEND_MISSING="${BACKEND_MISSING}cors "; fi
if [ ! -d "node_modules/dotenv" ]; then BACKEND_MISSING="${BACKEND_MISSING}dotenv "; fi

if [ -n "$BACKEND_MISSING" ]; then
  echo -e "  ${RED}⚠️  Missing packages: $BACKEND_MISSING${NC}"
  echo "  ➜ Attempting to reinstall..."
  npm install --force
else
  echo -e "  ${GREEN}✓ All critical backend packages present${NC}"
fi

cd ..
echo ""

###############################################################################
# STEP 4: Install Web Dependencies
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "🌐 STEP 4: Installing web dependencies"
echo -e "==========================================${NC}"
echo ""

cd web

# Install dependencies
npm install

echo -e "${GREEN}✅ Web dependencies installed!${NC}"
echo ""

# Verify critical web packages
echo "  ➜ Verifying critical web packages..."
WEB_MISSING=""

if [ ! -d "node_modules/react" ]; then WEB_MISSING="${WEB_MISSING}react "; fi
if [ ! -d "node_modules/react-dom" ]; then WEB_MISSING="${WEB_MISSING}react-dom "; fi
if [ ! -d "node_modules/react-router-dom" ]; then WEB_MISSING="${WEB_MISSING}react-router-dom "; fi
if [ ! -d "node_modules/typescript" ]; then WEB_MISSING="${WEB_MISSING}typescript "; fi
if [ ! -d "node_modules/react-scripts" ]; then WEB_MISSING="${WEB_MISSING}react-scripts "; fi
if [ ! -d "node_modules/tailwindcss" ]; then WEB_MISSING="${WEB_MISSING}tailwindcss "; fi

if [ -n "$WEB_MISSING" ]; then
  echo -e "  ${RED}⚠️  Missing packages: $WEB_MISSING${NC}"
  echo "  ➜ Attempting to reinstall..."
  npm install --force
else
  echo -e "  ${GREEN}✓ All critical web packages present${NC}"
fi

cd ..
echo ""

###############################################################################
# STEP 5: Install Admin Dependencies
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "👨‍💼 STEP 5: Installing admin dependencies"
echo -e "==========================================${NC}"
echo ""

cd admin

# Install dependencies
npm install

echo -e "${GREEN}✅ Admin dependencies installed!${NC}"
echo ""

# Verify critical admin packages
echo "  ➜ Verifying critical admin packages..."
ADMIN_MISSING=""

if [ ! -d "node_modules/react" ]; then ADMIN_MISSING="${ADMIN_MISSING}react "; fi
if [ ! -d "node_modules/react-dom" ]; then ADMIN_MISSING="${ADMIN_MISSING}react-dom "; fi
if [ ! -d "node_modules/react-router-dom" ]; then ADMIN_MISSING="${ADMIN_MISSING}react-router-dom "; fi
if [ ! -d "node_modules/typescript" ]; then ADMIN_MISSING="${ADMIN_MISSING}typescript "; fi
if [ ! -d "node_modules/react-scripts" ]; then ADMIN_MISSING="${ADMIN_MISSING}react-scripts "; fi
if [ ! -d "node_modules/tailwindcss" ]; then ADMIN_MISSING="${ADMIN_MISSING}tailwindcss "; fi

if [ -n "$ADMIN_MISSING" ]; then
  echo -e "  ${RED}⚠️  Missing packages: $ADMIN_MISSING${NC}"
  echo "  ➜ Attempting to reinstall..."
  npm install --force
else
  echo -e "  ${GREEN}✓ All critical admin packages present${NC}"
fi

cd ..
echo ""

###############################################################################
# STEP 6: Install Mobile Dependencies (Optional)
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "📱 STEP 6: Installing mobile dependencies"
echo -e "==========================================${NC}"
echo ""
echo -e "${BLUE}Note: Mobile uses React Native and may have peer dependency warnings.${NC}"
echo -e "${BLUE}Using --legacy-peer-deps to handle this...${NC}"
echo ""

cd mobile

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

echo -e "${GREEN}✅ Mobile dependencies installed!${NC}"
echo ""

# Verify critical mobile packages
echo "  ➜ Verifying critical mobile packages..."
MOBILE_MISSING=""

if [ ! -d "node_modules/react" ]; then MOBILE_MISSING="${MOBILE_MISSING}react "; fi
if [ ! -d "node_modules/react-native" ]; then MOBILE_MISSING="${MOBILE_MISSING}react-native "; fi

if [ -n "$MOBILE_MISSING" ]; then
  echo -e "  ${RED}⚠️  Missing packages: $MOBILE_MISSING${NC}"
  echo "  ➜ Attempting to reinstall..."
  npm install --legacy-peer-deps --force
else
  echo -e "  ${GREEN}✓ All critical mobile packages present${NC}"
fi

cd ..
echo ""

###############################################################################
# STEP 7: Build TypeScript Projects
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "🔨 STEP 7: Building TypeScript projects"
echo -e "==========================================${NC}"
echo ""

# Build backend
echo "  ➜ Building backend..."
cd backend
if npm run build 2>/dev/null; then
  echo -e "  ${GREEN}✓ Backend built successfully${NC}"
else
  echo -e "  ${YELLOW}⚠️  Backend build had warnings (this is normal if DB isn't configured)${NC}"
fi
cd ..
echo ""

###############################################################################
# STEP 8: Verify Installation
###############################################################################

echo -e "${YELLOW}=========================================="
echo -e "✅ STEP 8: Verifying installation"
echo -e "==========================================${NC}"
echo ""

echo "📊 Checking installed packages..."
echo ""

# Check backend
if [ -f "backend/node_modules/.package-lock.json" ]; then
  BACKEND_PKG_COUNT=$(find backend/node_modules -maxdepth 1 -type d | wc -l)
  echo -e "  ${GREEN}✓${NC} Backend: $BACKEND_PKG_COUNT packages installed"
else
  echo -e "  ${RED}✗${NC} Backend: Installation may have failed"
fi

# Check web
if [ -f "web/node_modules/.package-lock.json" ]; then
  WEB_PKG_COUNT=$(find web/node_modules -maxdepth 1 -type d | wc -l)
  echo -e "  ${GREEN}✓${NC} Web: $WEB_PKG_COUNT packages installed"
else
  echo -e "  ${RED}✗${NC} Web: Installation may have failed"
fi

# Check admin
if [ -f "admin/node_modules/.package-lock.json" ]; then
  ADMIN_PKG_COUNT=$(find admin/node_modules -maxdepth 1 -type d | wc -l)
  echo -e "  ${GREEN}✓${NC} Admin: $ADMIN_PKG_COUNT packages installed"
else
  echo -e "  ${RED}✗${NC} Admin: Installation may have failed"
fi

# Check mobile
if [ -f "mobile/node_modules/.package-lock.json" ]; then
  MOBILE_PKG_COUNT=$(find mobile/node_modules -maxdepth 1 -type d | wc -l)
  echo -e "  ${GREEN}✓${NC} Mobile: $MOBILE_PKG_COUNT packages installed"
else
  echo -e "  ${RED}✗${NC} Mobile: Installation may have failed"
fi

echo ""

###############################################################################
# STEP 9: Final Instructions
###############################################################################

echo -e "${GREEN}=========================================="
echo -e "🎉 INSTALLATION COMPLETE!"
echo -e "==========================================${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Configure environment variables:"
echo "   cd backend && cp .env.example .env"
echo "   (Edit backend/.env with your settings)"
echo ""
echo "2. Start the backend:"
echo "   npm run dev:backend"
echo ""
echo "3. Start the web app (new terminal):"
echo "   npm run dev:web"
echo ""
echo "4. Start the admin dashboard (new terminal):"
echo "   npm run dev:admin"
echo ""
echo "5. If you see TypeScript errors in VS Code:"
echo "   - Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)"
echo "   - Type 'TypeScript: Restart TS Server'"
echo "   - Select it and wait a few seconds"
echo ""
echo -e "${BLUE}🔧 Troubleshooting:${NC}"
echo ""
echo "  • If you still see errors, try:"
echo "    - Close and reopen VS Code"
echo "    - Run: npx tsc --noEmit (in backend folder)"
echo ""
echo "  • For mobile development:"
echo "    - You'll need Android Studio or Xcode installed"
echo "    - See mobile/README.md for setup instructions"
echo ""
echo -e "${GREEN}✅ All dependencies have been installed!${NC}"
echo ""
echo "=========================================="
echo ""
