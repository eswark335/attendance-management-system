# Attendance Management System - Mobile APK Build

## 🚀 Quick Start for APK Generation

### Step 1: Build the Application
```bash
npm run build:mobile
```

### Step 2: Open Android Studio
```bash
npm run open:android
```

### Step 3: Generate APK
In Android Studio:
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build completion
3. Click **locate** to find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 Mobile Features
✅ Fully responsive design for all screen sizes
✅ Touch-optimized buttons and inputs
✅ Mobile-friendly navigation
✅ Optimized performance for mobile devices
✅ Works offline with cached data

## 🔧 Requirements
- Node.js 18+
- Android Studio (for APK generation)
- Java JDK 17+

## 📦 APK Output Location
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## 🎯 Testing
Install the APK on your Android device and test all features:
- Login/Register
- Dashboard navigation
- Attendance marking
- Data synchronization

## 📝 Notes
- The app requires internet connection for Firebase authentication and data sync
- First build may take 5-10 minutes
- APK size: ~15-20 MB
