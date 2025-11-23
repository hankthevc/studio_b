# Partner Kit v1

This directory bundles everything a host app needs to embed the first eleven mini-apps (TripSpark → LiftShift) with consistent analytics, billing stubs, theming presets, QA templates, and showcase links.

## Contents

| Path | Purpose |
| --- | --- |
| `analytics/contracts.md` | Segment-ready event contract for every app with sample payloads and KPI notes. |
| `billing/billingMock.js` | Lightweight subscription stub (`window.MiniHost`) so partners can simulate Pro upgrades locally. |
| `themes/presets.css` | Three CSS preset themes (`partner-default`, `partner-dark`, `partner-warm`) overriding shared tokens. |
| `qa/README.md` | Device/browser matrix and step-by-step host QA checklist for iOS Safari, Android Chrome, Samsung Internet, RN WebView, and desktop Chromium. |
| `showcase/index.html` | Demo hub linking to all eleven apps plus QR codes/instructions for easy preview. |

## Host contract quick reference
- Load every app through `shared/appShell.js` so the following bridge calls exist: `window.MiniHost.requestSubscription(slug, metadata)`, `.isSubscribed(slug)`, `.getAgeRange()` (and legacy `.getAgeCategory()`), plus `.track(eventName, props)`.
- Age gating is host-owned. Set the Declared Age Range entitlement and return the appropriate category string (`kids | teen | general | mature`) from `getAgeCategory`.
- Run `npm run manifest:generate` before shipping to refresh `miniapps-manifest.json` + `miniapps-index.html` (required for App Review Guideline 4.7) and to copy the manifest into the iOS bundle.
- Reference `docs/privacy.md`, `docs/terms.md`, and `docs/csp.md` inside your own policy center so distribution partners know how data flows and which CSP to apply inside WKWebView.

## How to Distribute

1. **Build ZIP** – `zip -r partner-kit-v1.zip partner-kit/ apps/**/EMBED.md audits/tier2_tier3_polish.md`.
2. **GitHub Release** – Tag `partner-kit-v1` and upload the ZIP so partners can download without repo access.
3. **Notion Mirror (optional)** – Copy the README tables + analytics contract into your Partner Enablement Notion space for non-technical stakeholders.

## Next Steps

- As new apps reach Phase 4, update `analytics/contracts.md`, add them to `showcase/index.html`, and refresh the QA matrix.
- Once host QA results come back, append device-specific notes in `qa/README.md` under the provided tables.

