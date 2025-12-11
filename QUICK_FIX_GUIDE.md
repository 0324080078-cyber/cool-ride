# CoolRides - Quick Fix Guide 🛺

## ✅ Complete Setup Instructions

### Problem: Frontend showing "Cannot GET /" error

**Solution:** You were accessing the backend (port 5000) instead of the frontend (port 3000)!

---

## 🚀 **How to Start CoolRides Properly**

### **Option 1: Automated Setup (EASIEST)**

```bash
# Run the setup script
./START_COOLRIDES.sh
```

This will:
- ✅ Install all web dependencies
- ✅ Install all backend dependencies
- ✅ Create .env files
- ✅ Show you how to start the app

### **Option 2: Manual Setup**

**Step 1: Install Dependencies**
```bash
# Install web dependencies
cd web
npm install
cd ..

# Install backend dependencies  
cd backend
npm install
cd ..
```

**Step 2: Start Backend (Terminal 1)**
```bash
npm run dev:backend
```

You'll see:
```
🛺 CoolRides API Server
🚀 Environment: development
🌐 URL: http://localhost:5000
```

**Database warnings are normal and OK!**

**Step 3: Start Frontend (Terminal 2 - New Terminal)**
```bash
npm run dev:web
```

You'll see:
```
webpack compiled successfully
```

**Step 4: Open Browser**
```
Visit: http://localhost:3000
```

---

## 🎯 **Important URLs**

| Service | URL | What It Does |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | ✅ **THIS IS YOUR WEBSITE** |
| **Backend API** | http://localhost:5000 | API only (shows "Cannot GET /") |
| Admin | http://localhost:3001 | Admin panel (optional) |

---

## ⚠️ **Common Errors & Fixes**

### Error: "Cannot GET /"
**Problem:** You're accessing http://localhost:5000 (backend)  
**Solution:** Use http://localhost:3000 (frontend) instead!

### Error: "Port 3000 is already in use"
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev:web
```

### Error: "npm: command not found"
```bash
# Install Node.js first
# Visit: https://nodejs.org/
```

### Error: "node_modules not found"
```bash
# Install dependencies
cd web
npm install
```

### Database Connection Errors
**These are normal!** The app works without a database.
- Landing page: ✅ Works
- Login/Register: ✅ Works  
- Dashboard: ✅ Works
- Booking: ✅ Works

---

## 🧪 **Testing Your App**

### **1. Check if it's running:**
```bash
# You should see these processes:
# Terminal 1: Backend running on port 5000
# Terminal 2: Frontend running on port 3000
```

### **2. Test the website:**
1. Open browser: http://localhost:3000
2. You should see: **CoolRides landing page**
3. Click "Sign Up" → **Registration page opens**
4. Fill form and submit → **Dashboard appears**

### **3. Test ride booking:**
1. From Dashboard → Click "Book a Ride"
2. Select pickup: "Ho Central Market"
3. Select dropoff: "Ho Teaching Hospital"  
4. Click "Get Fare Estimate" → **Price shown**
5. Click "Book Ride Now" → **Trip created!**

---

## 📱 **What Works Right Now**

✅ **Landing Page** - Beautiful homepage  
✅ **User Registration** - Sign up as Passenger/Rider  
✅ **Login System** - Secure authentication  
✅ **Dashboard** - User home with stats  
✅ **Book Ride** - Select locations & book trips  
✅ **Active Trip** - Track ongoing rides  
✅ **Trip History** - View past trips  
✅ **Profile** - Edit account info  

---

## 🔧 **Still Having Issues?**

### **Full Reset:**
```bash
# Stop all running processes (Ctrl+C in both terminals)

# Clean install
cd web
rm -rf node_modules package-lock.json
npm install

cd ../backend  
rm -rf node_modules package-lock.json
npm install

# Start fresh
cd ..
npm run dev:backend  # Terminal 1
npm run dev:web      # Terminal 2
```

### **Check Logs:**
```bash
# Backend logs (Terminal 1)
# Should show: "Server running on port 5000"

# Frontend logs (Terminal 2)
# Should show: "webpack compiled successfully"
```

---

## 🎉 **Success Checklist**

- [ ] Backend started without crashing
- [ ] Frontend started without errors
- [ ] http://localhost:3000 shows landing page
- [ ] Can click "Sign Up" button
- [ ] Can register a new account
- [ ] Can login and see dashboard
- [ ] Can book a ride

**If all checked:** 🎉 **YOUR APP IS WORKING!**

---

## 💡 **Pro Tips**

1. **Always use port 3000** for the website
2. **Port 5000 is API only** - won't show a webpage
3. **Database errors are normal** - app works without it
4. **Use 2 terminals** - one for backend, one for frontend
5. **Restart if stuck** - Ctrl+C then start again

---

## 📞 **Quick Commands Reference**

```bash
# Setup everything
./START_COOLRIDES.sh

# Start backend
npm run dev:backend

# Start frontend
npm run dev:web

# Install web dependencies
cd web && npm install

# Install backend dependencies
cd backend && npm install

# Pull latest changes
git pull origin copilot/build-coolrides-app-website
```

---

**Built with ❤️ for Ho Township, Ghana 🇬🇭🛺**
