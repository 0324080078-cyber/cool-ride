# 🚀 How to Start CoolRides Application

This guide will help you get the CoolRides platform up and running quickly.

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (optional for development)
- Redis server (optional for development)

---

## ⚡ Quick Start (3 Steps)

### **Step 1: Clone and Install Dependencies**

```bash
# Clone the repository
git clone https://github.com/0324080078-cyber/cool-ride.git
cd cool-ride
git checkout copilot/build-coolrides-app-website

# Install dependencies (RECOMMENDED: use the automated script)
./fix-dependencies.sh

# OR manually:
npm run install:all
```

### **Step 2: Configure Environment Variables**

```bash
# Copy the environment template
cd backend
cp .env.example .env

# Edit the .env file with your settings (optional for development)
# The app will use sensible defaults if not configured
```

**For quick testing, you can skip database configuration.** The app will show a connection error but won't crash, allowing you to see the frontend.

### **Step 3: Start the Application**

Open **3 separate terminals** and run:

```bash
# Terminal 1: Start Backend API
npm run dev:backend

# Terminal 2: Start Web Application
npm run dev:web

# Terminal 3: Start Admin Dashboard (optional)
npm run dev:admin
```

**Access the applications:**
- 🌐 **Web App**: http://localhost:3000
- 🖥️ **Admin Dashboard**: http://localhost:3001
- 📡 **Backend API**: http://localhost:5000
- 📊 **API Health Check**: http://localhost:5000/health

---

## 🎯 What You'll See

### **Frontend (Web App) - http://localhost:3000**

The web application will load successfully and show:
- ✅ Professional landing page
- ✅ Navigation menu (Home, How It Works, Pricing, Safety, Become a Rider, Contact)
- ✅ Hero section with CTA buttons
- ⚠️ "Coming Soon" pages for features (Authentication, Booking, etc.)

**Why "Coming Soon"?**
The pages are placeholders. The next development phase will add:
- Authentication UI (Login, Register, OTP)
- Booking interface with Google Maps
- Trip tracking and history
- Payment integration

### **Backend API - http://localhost:5000**

#### **With Database Configured:**
- ✅ All 30+ API endpoints available
- ✅ Full authentication, trip booking, payment features
- ✅ WebSocket real-time updates
- ✅ Database models synchronized

#### **Without Database (Quick Test Mode):**
- ⚠️ Database connection error shown in console
- ⚠️ API endpoints won't work yet
- ✅ Server still runs (won't crash)
- ✅ Frontend is fully accessible

---

## 🗄️ Database Setup (Optional for Testing Frontend)

If you want to test the backend API:

### **Option 1: Use Docker (Easiest)**

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# The backend will automatically connect
```

### **Option 2: Install Locally**

**Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb coolrides_db
```

**Install Redis:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# macOS
brew install redis
brew services start redis
```

**Update `.env` with your credentials:**
```bash
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/coolrides_db
REDIS_URL=redis://localhost:6379
```

---

## 🐛 Troubleshooting

### **Issue: Backend crashes with "Cannot read properties of null"**

**Cause:** Missing `.env` file or empty `DATABASE_URL`

**Solution:**
```bash
cd backend
cp .env.example .env

# For quick testing without database, use SQLite:
echo "DATABASE_URL=sqlite::memory:" >> .env

# OR use the provided default:
# DATABASE_URL=postgresql://coolrides_user:coolrides_pass@localhost:5432/coolrides_db
```

### **Issue: "Coming Soon" on all pages**

**This is expected!** The frontend is a work in progress. What's complete:
- ✅ Landing page
- ✅ Navigation structure
- ✅ API integration layer
- ⏳ Authentication UI (coming next)
- ⏳ Booking interface (coming next)
- ⏳ Maps integration (coming next)

### **Issue: Frontend shows blank page**

**Don't open `index.html` directly!** React apps need a dev server.

```bash
cd web
npm start
# Visit http://localhost:3000
```

### **Issue: Port already in use**

```bash
# Kill processes on ports
sudo lsof -ti:5000 | xargs kill  # Backend
sudo lsof -ti:3000 | xargs kill  # Web
sudo lsof -ti:3001 | xargs kill  # Admin
```

### **Issue: Dependencies not installed**

```bash
# Clean and reinstall everything
./fix-dependencies.sh

# OR manually:
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm run install:all
```

### **Issue: TypeScript errors in VS Code**

```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P (Cmd+Shift+P on Mac)
# Type: "TypeScript: Restart TS Server"
# Select and press Enter
```

---

## 📱 What's Working Now

### ✅ **Backend API (100% Complete)**
- 30+ REST API endpoints
- 5 Controllers (Auth, Trip, User, Rider, Payment)
- JWT authentication
- Dynamic pricing engine
- Payment processing structure
- WebSocket real-time support

### ✅ **Frontend (60% Complete)**
- React 18 + TypeScript
- Professional landing page
- Responsive design
- API service layer
- Routing infrastructure

### ⏳ **Coming Next**
- Web authentication UI
- Google Maps integration
- Booking interface
- Mobile apps (React Native)
- SMS OTP integration

---

## 🎓 For Students

### **GitHub Student Pack Benefits**
Take advantage of free resources:
- **DigitalOcean**: $200 credit (deploy your app)
- **AWS Educate**: Free tier access
- **Namecheap**: Free `.me` domain
- **JetBrains**: Free IDEs (WebStorm, IntelliJ)
- **GitHub Pro**: Free while student

### **Learning Path**
1. ✅ Start backend (even without database)
2. ✅ Explore the frontend landing page
3. ✅ Read the API documentation (`backend/API.md`)
4. ⏳ Set up database for full backend testing
5. ⏳ Test API endpoints with Postman/cURL
6. ⏳ Learn from the code structure

---

## 📚 Additional Resources

- **API Documentation**: `backend/API.md`
- **Deployment Guide**: `backend/DEPLOYMENT.md`
- **Troubleshooting**: `INSTALL_TROUBLESHOOTING.md`
- **Installation Success**: `INSTALLATION_SUCCESS.md`
- **Project Status**: `PROJECT_STATUS.md`
- **Development Roadmap**: `ROADMAP.md`

---

## 💡 Pro Tips

1. **Use VS Code with extensions**:
   - ESLint
   - Prettier
   - TypeScript and JavaScript
   - Thunder Client (API testing)

2. **Keep terminals organized**:
   ```bash
   # Use VS Code split terminals
   # Terminal 1: Backend
   # Terminal 2: Web
   # Terminal 3: Admin
   ```

3. **Hot reloading is enabled**:
   - Backend: Auto-restarts on file changes
   - Frontend: Auto-refreshes browser on changes

4. **Test the API**:
   ```bash
   # Check if backend is running
   curl http://localhost:5000/health
   ```

---

## ✅ Success Checklist

After following this guide, you should have:
- [x] Dependencies installed (4000+ packages)
- [x] Backend server running on port 5000
- [x] Web app accessible at http://localhost:3000
- [x] Professional landing page visible
- [x] Navigation working
- [ ] Database connected (optional)
- [ ] API endpoints tested (optional)

---

## 🆘 Still Need Help?

1. Check `INSTALL_TROUBLESHOOTING.md`
2. Review error messages in terminal
3. Verify Node.js version: `node -v` (should be 18+)
4. Ensure ports 3000, 3001, 5000 are free
5. Try the automated fix script: `./fix-dependencies.sh`

---

**🎉 Congratulations!** You're now ready to explore the CoolRides platform!

**Next Steps:**
- Explore the landing page features
- Read through the codebase
- Set up database for full backend access
- Start building new features!

---

**Built with ❤️ for Ho Township, Ghana 🇬🇭🛺**
