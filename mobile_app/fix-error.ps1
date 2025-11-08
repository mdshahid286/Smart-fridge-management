# Fix PlatformConstants TurboModuleRegistry Error
# Run this script in PowerShell from the mobile_app directory

Write-Host "🔧 Fixing PlatformConstants Error..." -ForegroundColor Green
Write-Host ""

# Step 1: Clear all caches
Write-Host "Step 1: Clearing caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue
Write-Host "✅ Caches cleared" -ForegroundColor Green
Write-Host ""

# Step 2: Reinstall dependencies
Write-Host "Step 2: Reinstalling dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Instructions
Write-Host "Step 3: Next steps..." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Update Expo Go app on your phone to the latest version" -ForegroundColor White
Write-Host "2. Close Expo Go app completely" -ForegroundColor White
Write-Host "3. Run: npm run start:clear" -ForegroundColor White
Write-Host "4. Scan QR code again" -ForegroundColor White
Write-Host ""
Write-Host "✅ Fix script completed!" -ForegroundColor Green

