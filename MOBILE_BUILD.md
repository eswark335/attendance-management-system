# Attendance Management System - Mobile Build Guide

## Prerequisites
- Node.js and npm installed
- Android Studio installed (for APK generation)
- Java JDK 17 or higher

## Steps to Build APK

### 1. Build the Angular Application
```bash
npm run build
```

### 2. Sync with Capacitor
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Generate APK in Android Studio
1. In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Wait for the build to complete
3. Click on **locate** in the notification to find the APK file
4. APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Generate Signed APK (Production)
1. Go to **Build** > **Generate Signed Bundle / APK**
2. Select **APK**
3. Create or select a keystore
4. Fill in the keystore details
5. Select **release** build variant
6. Click **Finish**

## Quick Build Script
Run this command to build and sync:
```bash
npm run build && npx cap sync android && npx cap open android
```

## Mobile Features
- Responsive design for all screen sizes
- Touch-optimized UI elements
- Mobile-friendly navigation
- Optimized for mobile performance

## Testing on Device
1. Enable USB debugging on your Android device
2. Connect device to computer
3. In Android Studio, select your device from the dropdown
4. Click Run button

## APK Location
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`
