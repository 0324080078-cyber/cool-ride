# Docker Setup Guide for CoolRides

## 🚀 Quick Start with Docker

This guide will help you run the complete CoolRides application using Docker and Docker Compose.

---

## ✅ Prerequisites

Make sure you have installed:
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

Check your installation:
```bash
docker --version
docker-compose --version
```

---

## 📋 Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/0324080078-cyber/cool-ride.git
cd cool-ride
git checkout copilot/build-coolrides-app-website
```

### 2. **Configure Environment Variables**

#### Option A: Use the provided .env.docker file (Easiest)

The `.env.docker` file contains default values for Docker development. Update it with your actual API keys:

```bash
# Edit .env.docker
nano .env.docker  # or use your preferred editor
```

Update these values:
- `JWT_SECRET` - Change to a strong secret
- `JWT_REFRESH_SECRET` - Change to a strong secret  
- `GOOGLE_MAPS_API_KEY` - Add your Google Maps API key

#### Option B: Configure individual .env files

Backend configuration:
```bash
cd backend
cp .env.example .env
nano .env  # Edit with your values
```

Web configuration:
```bash
cd web
cp .env.example .env
nano .env  # Edit with your values
```

### 3. **Build and Start Services**

Build all Docker images:
```bash
docker-compose build
```

Start all services:
```bash
docker-compose up
```

Or run in detached mode (background):
```bash
docker-compose up -d
```

---

## 🌐 Access Your Application

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main CoolRides web app |
| **Backend API** | http://localhost:5000 | REST API endpoints |
| **Admin Dashboard** | http://localhost:3001 | Admin panel |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache |

---

## 🔧 Docker Commands Reference

### Start Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs backend
docker-compose logs web
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache
```

### Execute Commands in Containers
```bash
# Access backend shell
docker-compose exec backend sh

# Run migrations
docker-compose exec backend npm run migrate

# Access database
docker-compose exec postgres psql -U coolrides_user -d coolrides_db
```

---

## 📊 Service Health Checks

Check if services are healthy:
```bash
docker-compose ps
```

Expected output:
```
NAME                     STATUS         PORTS
coolrides_backend        Up (healthy)   0.0.0.0:5000->5000/tcp
coolrides_web            Up             0.0.0.0:3000->3000/tcp
coolrides_admin          Up             0.0.0.0:3001->3000/tcp
coolrides_postgres       Up (healthy)   0.0.0.0:5432->5432/tcp
coolrides_redis          Up (healthy)   0.0.0.0:6379->6379/tcp
```

---

## 🐛 Troubleshooting

### Problem: "npm ci" error or missing package-lock.json

**Solution:** ✅ Fixed! Dockerfiles now use `npm install` instead of `npm ci`.

### Problem: Port already in use

**Solution:** Stop the service using that port or change the port in docker-compose.yml
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Problem: Database connection failed

**Solution:** Wait for PostgreSQL to be healthy
```bash
# Check database status
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Problem: Frontend not compiling

**Solution:** Clear node_modules and rebuild
```bash
docker-compose down
docker-compose build --no-cache web
docker-compose up web
```

### Problem: Environment variables not loading

**Solution:** 
1. Check `.env` files exist in backend/ and web/
2. Ensure `.env.docker` exists at root
3. Restart containers: `docker-compose down && docker-compose up`

---

## 🔄 Development Workflow

### Make Code Changes

The Docker setup uses volumes, so changes are reflected immediately:
- Backend changes → nodemon auto-restarts
- Frontend changes → React hot-reload

### Install New Dependencies

```bash
# Backend dependency
docker-compose exec backend npm install package-name

# Frontend dependency
docker-compose exec web npm install package-name

# Then rebuild
docker-compose build backend
docker-compose up backend
```

### Run Database Migrations

```bash
docker-compose exec backend npm run migrate
```

### Access Database

```bash
docker-compose exec postgres psql -U coolrides_user -d coolrides_db
```

---

## 📦 Production Deployment

For production, use the production docker-compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Important Production Changes:**
1. Update all secrets in `.env` files
2. Set `NODE_ENV=production`
3. Use proper SSL certificates
4. Set up proper backup strategies
5. Use managed database services (Render, AWS RDS, etc.)

---

## 🧹 Clean Up

Remove all containers, networks, and volumes:
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ deletes all data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Services built: `docker-compose build`
- [ ] Services started: `docker-compose up`
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:5000
- [ ] Database connection working
- [ ] No errors in logs

---

## 🆘 Need Help?

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Review this guide
3. Check `.env` files are properly configured
4. Try rebuilding: `docker-compose build --no-cache`
5. Check GitHub Issues or create a new one

---

**Happy Coding! 🛺🇬🇭**
