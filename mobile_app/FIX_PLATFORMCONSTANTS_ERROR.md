# 🔧 Fix PlatformConstants TurboModuleRegistry Error

## Error
```
TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found. 
Verify that a module by this name is registered in the native binary.
```

## Quick Fix (Try These in Order)

### Step 1: Clear All Caches
```powershell
cd mobile_app
npm run start:clear
```

### Step 2: Delete node_modules and Reinstall
```powershell
cd mobile_app
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Step 3: Clear Expo Cache
```powershell
cd mobile_app
npx expo start --clear
```

### Step 4: Update Expo Go App
- **On your phone**: Update Expo Go app to the latest version
- **Check version**: Open Expo Go → Settings → About
- **Latest version**: Should support Expo SDK 54

### Step 5: Restart Everything
1. Close Expo Go app completely
2. Stop Metro bundler (Ctrl+C)
3. Restart: `npm run start:clear`
4. Scan QR code again

### Step 6: If Still Not Working - Rebuild
```powershell
cd mobile_app
npx expo prebuild --clean
```

---

## Complete Fix Script

Run this PowerShell script:

```powershell
cd mobile_app

# Step 1: Clear all caches
Write-Host "Clearing caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue

# Step 2: Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Step 3: Clear Expo cache and start
Write-Host "Starting Expo with clear cache..." -ForegroundColor Yellow
npx expo start --clear --tunnel
```

---

## Alternative: Use Development Build

If Expo Go continues to have issues, create a development build:

```powershell
cd mobile_app
npx expo run:android
```

This builds a custom development client with all native modules properly linked.

---

## Common Causes

1. **Expo Go Version Mismatch**: Expo Go app is outdated
2. **Cache Corruption**: Old cached files causing conflicts
3. **Native Module Issues**: PlatformConstants not registered
4. **Network Issues**: Tunnel mode connection problems

---

## Verify Fix

After applying fixes, check:
1. ✅ Expo Go app is latest version
2. ✅ All caches cleared
3. ✅ Dependencies reinstalled
4. ✅ App starts without errors
5. ✅ No TurboModuleRegistry errors in console

---

**Status**: Follow steps 1-6 in order until error is resolved.

