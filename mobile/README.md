# CoolRides Mobile App

## Overview
React Native mobile application for CoolRides - Passenger and Rider apps.

## Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - Mac only)
- Java Development Kit (JDK) 11

## Installation

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Android Setup
```bash
# Install Android dependencies
cd android
./gradlew clean

# Run on Android
cd ..
npm run android
```

### 3. iOS Setup (Mac only)
```bash
# Install iOS dependencies
cd ios
pod install

# Run on iOS
cd ..
npm run ios
```

## App Structure
```
mobile/
├── src/
│   ├── screens/          # App screens
│   │   ├── passenger/    # Passenger app screens
│   │   └── rider/        # Rider app screens
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API services
│   ├── store/           # State management
│   ├── utils/           # Utility functions
│   └── assets/          # Images, fonts, etc.
├── android/             # Android native code
├── ios/                 # iOS native code
└── package.json
```

## Features

### Passenger App
- Real-time Keke booking
- Live tracking
- Payment integration
- Trip history
- Rating system

### Rider App
- Accept/reject ride requests
- Navigation
- Earnings dashboard
- Trip history
- Online/offline toggle

## Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK will be in: `android/app/build/outputs/apk/release/`

### iOS IPA
```bash
# In Xcode:
# 1. Select "Any iOS Device"
# 2. Product > Archive
# 3. Distribute App
```

## Environment Variables
Create a `.env` file:
```env
API_URL=https://api.coolrides.com
GOOGLE_MAPS_API_KEY=your_key_here
```

## Troubleshooting

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## License
MIT
