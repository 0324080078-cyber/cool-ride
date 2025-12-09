# Installation Troubleshooting Guide

## Common Issues and Solutions

### 1. Dependency Conflict Errors (ERESOLVE)

**Issue:** npm shows dependency resolution errors when installing packages.

**Solution:**

#### Option A: Install Without Mobile (Recommended for Backend/Web Development)
The mobile app is still in early development. For now, install only the backend, web, and admin:

```bash
# From project root
npm install
npm run install:backend
npm run install:web
npm run install:admin
```

#### Option B: Install Mobile Separately (Optional)
If you want to work on the mobile app:

```bash
# Install mobile dependencies with legacy peer deps
npm run install:mobile

# OR manually
cd mobile
npm install --legacy-peer-deps
```

---

### 2. "Missing script: install:all" Error

**Issue:** Running `npm run install:all` from a subdirectory (like `/admin` or `/backend`).

**Solution:** Always run the `install:all` script from the **project root**:

```bash
# Make sure you're in the project root
cd /path/to/cool-ride

# Then run
npm run install:all
```

---

### 3. React Native Version Conflicts

**Issue:** `react-native-maps` requires React >= 18.3.1 but project has 18.2.0

**Solution:** This has been fixed in the latest commit. Make sure you pull the latest changes:

```bash
git pull origin copilot/build-coolrides-app-website
```

The mobile package.json now uses:
- React 18.3.1 (updated from 18.2.0)
- React Native 0.76.6 (updated from 0.72.0)
- Compatible react-native-maps version

---

## Recommended Installation Flow

### For Backend/Web Development (90% of users)

```bash
# 1. Clone the repository
git clone https://github.com/0324080078-cyber/cool-ride.git
cd cool-ride

# 2. Checkout the development branch
git checkout copilot/build-coolrides-app-website

# 3. Install backend, web, and admin
npm install
npm run install:backend
npm run install:web
npm run install:admin

# 4. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database and API keys

# 5. Start development servers
npm run dev:backend   # Terminal 1: http://localhost:5000
npm run dev:web       # Terminal 2: http://localhost:3000
npm run dev:admin     # Terminal 3: http://localhost:3001
```

### For Mobile Development (Advanced)

```bash
# After completing the steps above, install mobile:
npm run install:mobile

# Setup React Native environment (see mobile/README.md)
# - Install Android Studio (for Android development)
# - Install Xcode (for iOS development, Mac only)
# - Install Watchman, CocoaPods, etc.

# Run mobile app
cd mobile
npm run android  # For Android
npm run ios      # For iOS (Mac only)
```

---

## System Requirements

### Minimum Requirements
- **Node.js:** 18.x or higher
- **npm:** 9.x or higher (10.x recommended)
- **PostgreSQL:** 14.x or higher
- **Redis:** 6.x or higher

### Check Your Versions
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
psql --version    # Should be 14.x or higher
redis-server --version  # Should be 6.x or higher
```

### Upgrade npm if Needed
```bash
npm install -g npm@latest
```

---

## Docker Installation (Alternative)

If you have Docker installed, you can skip manual installation:

```bash
# From project root
docker-compose up -d

# This will start:
# - PostgreSQL database
# - Redis cache
# - Backend API (http://localhost:5000)
# - Web app (http://localhost:3000)
# - Admin dashboard (http://localhost:3001)
```

---

## Workspace Structure

The project uses npm workspaces. Here's what gets installed where:

```
cool-ride/
├── node_modules/          # Root dependencies
├── backend/
│   └── node_modules/      # Backend-specific dependencies
├── web/
│   └── node_modules/      # Web app dependencies
├── admin/
│   └── node_modules/      # Admin dashboard dependencies
└── mobile/
    └── node_modules/      # Mobile app dependencies (optional)
```

---

## Getting Help

### Check Installation Status
```bash
# From project root
npm run install:backend && echo "✅ Backend installed"
npm run install:web && echo "✅ Web installed"
npm run install:admin && echo "✅ Admin installed"
```

### Clean Installation (Nuclear Option)
If nothing works, try a clean install:

```bash
# Remove all node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf web/node_modules web/package-lock.json
rm -rf admin/node_modules admin/package-lock.json
rm -rf mobile/node_modules mobile/package-lock.json

# Reinstall
npm install
npm run install:backend
npm run install:web
npm run install:admin
```

### Still Having Issues?

1. Check that you're on the correct branch:
   ```bash
   git branch --show-current
   # Should show: copilot/build-coolrides-app-website
   ```

2. Make sure you have the latest code:
   ```bash
   git pull origin copilot/build-coolrides-app-website
   ```

3. Check Node.js version:
   ```bash
   node --version
   # Should be v18.x or higher
   ```

4. Try using `--legacy-peer-deps` flag:
   ```bash
   npm install --legacy-peer-deps
   ```

5. Open an issue on GitHub with:
   - Error message (full log)
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Operating system
   - Steps you've tried

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install root dependencies |
| `npm run install:all` | Install backend, web, admin (not mobile) |
| `npm run install:backend` | Install backend only |
| `npm run install:web` | Install web app only |
| `npm run install:admin` | Install admin only |
| `npm run install:mobile` | Install mobile only (with --legacy-peer-deps) |
| `npm run dev:backend` | Start backend server |
| `npm run dev:web` | Start web app |
| `npm run dev:admin` | Start admin dashboard |

---

**Last Updated:** December 9, 2025  
**Branch:** copilot/build-coolrides-app-website  
**Status:** Backend 100% complete, Frontend in development
