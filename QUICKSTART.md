# CoolRides Quick Start Guide

Welcome to CoolRides! This guide will help you get started with the project.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- ✅ **Redis 6+** - [Download](https://redis.io/download)
- ✅ **Git** - [Download](https://git-scm.com/downloads)
- ✅ **Docker & Docker Compose** (optional) - [Download](https://www.docker.com/get-started)

### For Mobile Development:
- ✅ **Android Studio** (for Android)
- ✅ **Xcode** (for iOS - Mac only)

## 🚀 Quick Start (Development Mode)

### Option 1: Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/0324080078-cyber/cool-ride.git
cd cool-ride

# 2. Create environment files
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# 3. Start all services
docker-compose up -d

# 4. Access the applications
# - Backend API: http://localhost:5000
# - Web App: http://localhost:3000
# - Admin Dashboard: http://localhost:3001
```

### Option 2: Manual Setup

#### Step 1: Database Setup

```bash
# Start PostgreSQL
# Create database
createdb coolrides_db

# Start Redis
redis-server
```

#### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Update DATABASE_URL, REDIS_URL, and other settings

# Run database migrations
npm run db:migrate

# (Optional) Seed initial data
npm run db:seed

# Start development server
npm run dev
```

The backend API should now be running at http://localhost:5000

#### Step 3: Web Application Setup

```bash
# Open new terminal
cd web

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

The web app should now be running at http://localhost:3000

#### Step 4: Admin Dashboard Setup

```bash
# Open new terminal
cd admin

# Install dependencies
npm install

# Start development server
npm start
```

The admin dashboard should now be running at http://localhost:3001

#### Step 5: Mobile App Setup (Optional)

```bash
cd mobile

# Install dependencies
npm install

# For Android
npm run android

# For iOS (Mac only)
cd ios && pod install && cd ..
npm run ios
```

## 🔑 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/coolrides_db
JWT_SECRET=your-secret-key-here
REDIS_URL=redis://localhost:6379

# Optional
GOOGLE_MAPS_API_KEY=your-google-maps-key
TWILIO_ACCOUNT_SID=your-twilio-sid
FLUTTERWAVE_SECRET_KEY=your-flutterwave-key
```

### Getting API Keys

1. **Google Maps API**: [Get Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. **Twilio** (SMS): [Sign Up](https://www.twilio.com/try-twilio)
3. **Flutterwave** (Payments): [Sign Up](https://www.flutterwave.com/)

## ✅ Verify Installation

1. Check Backend API:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "CoolRides API is running"
}
```

2. Open Web App: http://localhost:3000
3. Open Admin Dashboard: http://localhost:3001

## 📱 Mobile App Development

### Android Setup

1. Install Android Studio
2. Configure Android SDK (API level 30+)
3. Create an Android Virtual Device (AVD)
4. Run: `npm run android`

### iOS Setup (Mac Only)

1. Install Xcode from App Store
2. Install CocoaPods: `sudo gem install cocoapods`
3. Install dependencies: `cd ios && pod install`
4. Run: `npm run ios`

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Check Redis is running: `redis-cli ping`
- Verify DATABASE_URL in .env

### Web app build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Mobile app build errors
- Android: `cd android && ./gradlew clean`
- iOS: `cd ios && pod deintegrate && pod install`

## 📚 Next Steps

1. Read the [API Documentation](./backend/API.md)
2. Explore the [Mobile App Guide](./mobile/README.md)
3. Check out [Contributing Guidelines](./CONTRIBUTING.md)
4. Join our community channels

## 🆘 Getting Help

- **Issues**: [GitHub Issues](https://github.com/0324080078-cyber/cool-ride/issues)
- **Email**: support@coolrides.com
- **Documentation**: See `/docs` folder

## 📝 Development Tips

1. **Hot Reload**: Backend and web apps support hot reload
2. **Database Changes**: Run migrations after schema changes
3. **API Testing**: Use the health endpoint to verify backend
4. **Mobile Testing**: Use physical device for best experience

## 🎓 Student Resources

As a student using GitHub Student Pack, you have access to:
- GitHub Pro features
- Free credits on cloud platforms (AWS, DigitalOcean, Azure)
- Free domains (.me, .tech)
- JetBrains IDEs
- And more!

Visit: https://education.github.com/pack

## 🚀 Deployment

See individual deployment guides:
- [Backend Deployment](./backend/DEPLOYMENT.md)
- [Web Deployment](./web/DEPLOYMENT.md)
- [Mobile Release](./mobile/RELEASE.md)

---

Happy coding! 🛺💨
