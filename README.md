# CoolRides - Professional Keke Transport Platform

<div align="center">
  <h3>🛺 Connecting Riders & Passengers in Ho Township, Ghana</h3>
  <p>A modern, production-ready ride-sharing platform for Keke (Pragia/Tricycle) transportation</p>
</div>

---

## 🌟 Overview

**CoolRides** is a comprehensive digital transportation platform similar to Uber and Bolt, specifically designed for Ho Township's Keke (Pragia) transport network. The platform includes mobile apps for passengers and riders, a web application, and an admin dashboard with real-time tracking, dynamic pricing, and integrated payment systems.

## ✨ Key Features

### For Passengers
- 📱 **Easy Booking** - Book a Keke ride in seconds
- 🗺️ **Real-time Tracking** - Track your rider's location live
- 💰 **Transparent Pricing** - See fare before booking
- ⭐ **Rating System** - Rate your ride experience
- 🔒 **Safety Features** - Share trip with contacts, SOS button
- 💳 **Multiple Payment Options** - Cash, Mobile Money (MTN MoMo, Vodafone Cash)

### For Riders (Keke Drivers)
- 💵 **Earnings Dashboard** - Track daily/weekly earnings
- 🚦 **Online/Offline Toggle** - Control when you receive requests
- 📊 **Trip History** - View all completed trips
- ⭐ **Rating System** - Build your reputation
- 🗺️ **Navigation** - Get directions to pickup and destination

### For Admins
- 👥 **User Management** - Manage passengers and riders
- ✅ **Rider Verification** - Verify driver credentials
- 📈 **Analytics Dashboard** - Monitor platform metrics
- 🚨 **Safety Monitoring** - Track trips and handle emergencies

## 🏗️ Architecture

```
coolrides/
├── mobile/          # React Native apps (Passenger & Rider)
├── web/             # React web application
├── admin/           # Admin dashboard
├── backend/         # Node.js + Express API
└── docker/          # Docker configurations
```

## 🚀 Tech Stack

### Frontend
- **Mobile**: React Native (iOS & Android)
- **Web**: React.js + TypeScript
- **Admin**: React.js + TypeScript
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Socket.io (WebSocket)
- **Authentication**: JWT + OTP

### Infrastructure
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Cloud Storage**: AWS S3 / Cloudinary

### Third-Party Services
- **Maps**: Google Maps API / Mapbox
- **Payments**: Flutterwave, Paystack
- **SMS**: Twilio / Hubtel
- **Push Notifications**: Firebase Cloud Messaging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 6+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Android Studio** (for mobile development)
- **Xcode** (for iOS development - Mac only)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/0324080078-cyber/cool-ride.git
cd cool-ride
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### 3. Environment Configuration

Create `.env` files in each directory:

**Backend** (`backend/.env`):
```env
# See backend/.env.example for all configuration options
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/coolrides
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

**Web** (`web/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-key
```

### 4. Database Setup

```bash
# Run migrations
cd backend
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Start Development Servers

**Terminal 1 - Backend API:**
```bash
npm run dev:backend
```

**Terminal 2 - Web Application:**
```bash
npm run dev:web
```

**Terminal 3 - Admin Dashboard:**
```bash
npm run dev:admin
```

**Terminal 4 - Mobile App:**
```bash
cd mobile
npm run android  # For Android
# or
npm run ios      # For iOS (Mac only)
```

## 📱 Mobile App Development

### Android Setup
1. Install Android Studio
2. Configure Android SDK
3. Start an Android emulator or connect a device
4. Run: `cd mobile && npm run android`

### iOS Setup (Mac only)
1. Install Xcode
2. Install CocoaPods: `sudo gem install cocoapods`
3. Install iOS dependencies: `cd mobile/ios && pod install`
4. Run: `cd mobile && npm run ios`

### Building APK
```bash
cd mobile/android
./gradlew assembleRelease
```

## 🌐 Web Access

- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📊 Database Schema

### Core Tables
- `users` - Base user information
- `passengers` - Passenger profiles
- `riders` - Rider/driver profiles
- `vehicles` - Keke vehicle information
- `trips` - Ride booking and tracking
- `payments` - Payment transactions
- `reviews` - Ratings and reviews

## 💳 Pricing Structure

### Daytime (6:00 AM - 10:00 PM)
- **Base Fare**: 3 GHS
- Additional charges based on time/distance

### Nighttime (10:00 PM - 3:00 AM)
- **Starting Fare**: 15 GHS
- **Maximum Fare**: 20+ GHS
- Surge pricing based on:
  - Distance to destination
  - Demand levels
  - High-risk/remote area surcharges
  - Rider availability

## 🔐 Security Features

- JWT authentication with refresh tokens
- OTP verification for phone numbers
- API rate limiting
- Password hashing with bcrypt
- HTTPS/SSL encryption
- Number masking for privacy
- Trip sharing with emergency contacts
- SOS emergency button
- Live GPS monitoring

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Run backend tests
npm run test:backend

# Run web tests
npm run test:web

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Using Docker

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment

See detailed deployment guides:
- [Backend Deployment](./backend/DEPLOYMENT.md)
- [Web Deployment](./web/DEPLOYMENT.md)
- [Mobile App Release](./mobile/RELEASE.md)

## 📱 App Distribution

### Android
- **APK Download**: Available in releases
- **Google Play Store**: [Coming Soon]

### iOS
- **App Store**: [Coming Soon]

## 📖 Documentation

- [API Documentation](./backend/API.md)
- [Mobile App Guide](./mobile/README.md)
- [Web Application Guide](./web/README.md)
- [Admin Dashboard Guide](./admin/README.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 Legal

- [Terms of Service](./docs/TERMS.md)
- [Privacy Policy](./docs/PRIVACY.md)
- [Rider Agreement](./docs/RIDER_AGREEMENT.md)

## 🆘 Support

- **Email**: support@coolrides.com
- **Phone**: +233 XX XXX XXXX
- **In-App**: Use the support chat feature

## 📈 Roadmap

### Version 1.0 (MVP) - Current
- [x] User registration and authentication
- [x] Real-time ride booking
- [x] Dynamic pricing (day/night)
- [x] Payment integration
- [x] Rating system
- [x] Admin dashboard
- [x] Mobile apps (Android & iOS)

### Version 1.1 - Planned
- [ ] Scheduled rides
- [ ] Ride pooling
- [ ] Package delivery service
- [ ] Corporate accounts
- [ ] Voice booking
- [ ] AI demand prediction

## 👥 Team

Built with ❤️ for Ho Township, Ghana

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p>Made with 💙 for the people of Ho Township</p>
  <p>© 2024 CoolRides. All rights reserved.</p>
</div>