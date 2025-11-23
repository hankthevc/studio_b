#!/bin/bash

# Launch simulator
echo "🚀 Launching iPhone 15 Pro simulator..."
xcrun simctl boot C2C10AB8-8693-47B7-81BA-33DFF41700E0 2>/dev/null || echo "Simulator already running"
open -a Simulator

# Build the app
echo "🔨 Building StudioBHost..."
cd /Users/HenryAppel/miniapps-studio-b/ios/StudioBHost
xcodebuild -scheme StudioBHost \
  -destination 'id=C2C10AB8-8693-47B7-81BA-33DFF41700E0' \
  -derivedDataPath ./build \
  build

# Manually package the app since xcodebuild isn't doing it for SwiftPM
echo "📦 Packaging StudioBHost.app..."
BUILD_DIR="./build/Build/Products/Debug-iphonesimulator"
APP_DIR="$BUILD_DIR/StudioBHost.app"
mkdir -p "$APP_DIR"

# Copy binary
cp "$BUILD_DIR/StudioBHost" "$APP_DIR/"

# Copy Info.plist
cp ManualInfo.plist "$APP_DIR/Info.plist"

# Copy Resources (Manifest and MiniApps)
echo "📂 Copying resources..."
cp ../../miniapps-manifest.json "$APP_DIR/"
cp -R ../../apps "$APP_DIR/"

# Install and launch
echo "📲 Installing app..."
xcrun simctl install C2C10AB8-8693-47B7-81BA-33DFF41700E0 "$APP_DIR"

echo "🎉 Launching StudioBHost with filesystem mode..."
export SIMCTL_CHILD_MINIAPP_DEV_ROOT=/Users/HenryAppel/miniapps-studio-b
export SIMCTL_CHILD_STUDIOB_COMMERCE_BACKEND_URL="http://localhost:8787"
xcrun simctl launch C2C10AB8-8693-47B7-81BA-33DFF41700E0 com.studiob.host

echo "✅ App should now be running in the simulator!"
