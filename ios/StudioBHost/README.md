# StudioBHost

SwiftUI host shell that packages the Studio B HTML mini-apps inside a native catalog that can ship through the Apple Mini-Apps Partner Program.

## Structure

- `Package.swift` &mdash; Swift Package Manager manifest using the new `.iOSApplication` product so the project can be opened directly in Xcode 15+.
- `Sources/StudioBHost` &mdash; All SwiftUI views, StoreKit helpers, and manifest loaders.
- `Resources/miniapps-manifest.json` &mdash; Generated catalog data (see repo-level manifest task). Use `npm run manifest:generate` (or `npm run manifest:sync-ios`) to keep this file fresh.
- `Resources/MiniApps/*` &mdash; Bundled HTML/CSS/JS payloads. During development, point to the root repo using the supplied `MiniAppAssetResolver`.
- `Resources/commerce/miniapp-products.json` &mdash; Product catalog mapping each slug to a StoreKit product identifier. Update this whenever you introduce a new upsell.

## Getting Started

1. Install Xcode 15+ and run `xed ios/StudioBHost` (or open the folder manually).
2. Ensure the repo-level `miniapps-manifest.json` is generated (`npm run manifest:generate`) and copied into `Resources/`.
3. During development set `MINIAPP_DEV_ROOT=/absolute/path/to/miniapps-studio-b` so `MiniAppAssetResolver` loads HTML directly from the repo; omit it (or package the assets into `Resources/MiniApps/`) before shipping so App Review tests the bundled payloads.
4. Update the `bundleIdentifier` and `teamIdentifier` inside `Package.swift` to match your Apple Developer account before signing.

### Commerce configuration

**Option A – Advanced Commerce backend (`/server`):**

1. `cd server && npm install && npm start`
2. Copy `server/env.sample` to `.env` and fill in your App Store credentials.
3. Set `STUDIOB_COMMERCE_BACKEND_URL=http://localhost:8787` before running the host.

**Option B – Direct StoreKit 2 testing:**

- Set `STUDIOB_COMMERCE_MODE=storekit`.
- Provide `APPLE_APP_BUNDLE_ID`, `APPLE_AC_KEY_ID`, `APPLE_AC_ISSUER_ID`, `APPLE_AC_PRIVATE_KEY` (PEM), and `APPLE_AC_ENV`.

Without either configuration the commerce stack falls back to a deterministic mock flow so mini-apps remain interactive in development.

## Running on Device or Simulator

```
xcodebuild -scheme StudioBHost -destination 'platform=iOS Simulator,name=iPhone 15'
```

The app shows a category-filterable grid of all mini-apps. Selecting one pushes a detail screen with an embedded `WKWebView`. Subscription and analytics hooks are stubbed via `MiniHostBridge` and wired in later tasks.

### Compliance knobs
- **Declared Age Range:** `AgeCategoryProvider` hydrates from the system Declared Age Range APIs (or `STUDIOB_FAKE_AGE_RANGE` overrides). The WKWebView bridge exposes absolute bounds via `MiniHost.getAgeRange`, and UI access is blocked whenever `MiniApp.ageBand` exceeds that range.
- **Universal links:** `miniapps-index.html` plus the generated `apple-app-site-association` file (run `npm run aasa:generate`) satisfy Guideline 4.7.4. Deploy the AASA file to `https://miniapps.studio/.well-known/` and keep the Associated Domains entitlement up to date.
- **StoreKit bridge:** `CommerceManager` prefers the Advanced Commerce backend when `STUDIOB_COMMERCE_BACKEND_URL` is set, falls back to native StoreKit 2 when `STUDIOB_COMMERCE_MODE=storekit`, and otherwise uses a deterministic mock.

