# 🚨 QUICK FIX: PlatformConstants Error

## The Error
```
TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found
```

## ✅ IMMEDIATE FIX (Do This Now)

### Option 1: Run Fix Script (Easiest)
```powershell
cd mobile_app
.\fix-error.ps1
```

### Option 2: Manual Fix
```powershell
cd mobile_app

# 1. Clear everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Force package-lock.json

# 2. Reinstall
npm install

# 3. Start with clear cache
npm run start:clear
```

### Option 3: Use Reset Script
```powershell
cd mobile_app
npm run reset
```

## 📱 CRITICAL: Update Expo Go App

1. **Go to Google Play Store** (Android) or **App Store** (iOS)
2. **Search for "Expo Go"**
3. **Update to the latest version**
4. **Close Expo Go app completely**
5. **Restart your phone** (optional but recommended)

## 🔄 After Fixing

1. Close Expo Go app completely
2. Stop Metro bundler (Ctrl+C in terminal)
3. Run: `npm run start:clear`
4. Scan QR code again
5. Wait for app to load

## ⚠️ If Still Not Working

### Try Development Build
```powershell
cd mobile_app
npx expo run:android
```

This builds a custom development client with all native modules properly linked.

## 🎯 Why This Happens

1. **Expo Go version mismatch** - Most common cause
2. **Corrupted cache** - Old cached files
3. **Native module linking issues** - PlatformConstants not registered
4. **Network issues** - Tunnel mode connection problems

## ✅ Success Indicators

- ✅ No red error screen
- ✅ App loads without errors
- ✅ Navigation works
- ✅ All screens accessible

---

**Most Important**: Update Expo Go app to latest version! This fixes 90% of cases.

