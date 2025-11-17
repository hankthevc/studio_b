# Studio B Mini-Apps Privacy Summary

Last updated: 16 Nov 2025

## What we collect
- **No personal data** is collected inside the HTML mini-apps. Inputs stay on-device and are discarded when you leave the session.
- **Anonymous usage events** (e.g., `tripspark:upsellClicked`) are dispatched only when a host integrates `window.MiniHost.track`. These events include the app slug and interaction metadata, never PII.
- **Subscription state** is resolved by the host via `window.MiniHost.isSubscribed`. Mini-app code never reads App Store receipts, payment details, or user identifiers.

## Host integrations
- Hosts expose the `MiniHost` bridge to trigger StoreKit 2 purchases, query subscription status, fetch the declared age category, and forward analytics.
- The `AgeCategoryProvider` lives on the host. Web code must not prompt for birthdays/ages—gating happens natively.
- Refunds and Send Consumption Information run through the host’s App Store Server API client (`ios/StudioBHost/Commerce/AppStoreServerAPIClient.swift`).

## Storage & retention
- No data persists beyond in-memory state managed by the shared `appShell`. Plans, presets, and QA logs stay local to the session unless a host explicitly exports them.
- When a host funnels analytics to Segment/Mixpanel/etc., they own storage, consent, and deletion workflows.

## Contact
Questions about privacy or data processing? Email `privacy@miniapps.studio` with the impacted slug, host app, and reproduction steps. We'll respond within 3 business days.

