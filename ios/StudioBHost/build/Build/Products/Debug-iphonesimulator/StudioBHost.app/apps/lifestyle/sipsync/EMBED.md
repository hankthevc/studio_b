# SipSync Embed Kit (Phase 4)

Drop-in instructions for embedding SipSync—the hydration cadence coach—inside host apps or WebViews. Assets live under `apps/lifestyle/sipsync/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/lifestyle/sipsync/styles.css">

<div id="sipsync-root"></div>

<script type="module">
  import { initMiniApp as initSipSync } from "/apps/lifestyle/sipsync/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("sipsync-root");
    if (mount) initSipSync(mount);
  });

  window.addEventListener("sipsync:smartBottleSync", (event) => {
    hostAnalytics.track("sipsync_smartBottleSync", event.detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` first to inherit the design tokens used by SipSync.
- The UI targets ~420 px width; wrap the root div in a centered container for wider layouts.
- All data is deterministic and runs offline, ideal for partner demos without backend services.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--ss-*` variables in `styles.css` to swap gradient + accent colors. | Teal/pink hydration palette |
| Fonts | Set `--font-sans` before loading to inherit host typography. | `Inter` stack |
| Copy | Hero eyebrow/tagline strings live near the top of `app.js` for white-label adjustments. | “AI hydration coach / Keep your cadence on track anywhere.” |
| Analytics | Subscribe to `sipsync:*` events (below) and bridge them into host analytics/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `sipsync:freeLimitHit` | `{ planCount }` | User exceeds the free cadence limit. |
| `sipsync:regenerate` | `{ planCount }` | User regenerates via share row. |
| `sipsync:smartBottleSync` | `{ plan }` | Pro-only smart bottle sync button succeeds. |
| `sipsync:upsellViewed` | `{ surface }` | Upsell banner or gated smart bottle button becomes visible (`postPlan`, `smartBottle`). |
| `sipsync:upsellClicked` | `null` | Upgrade CTA tapped. |

**Recommended wiring**
- Launch your billing modal from `sipsync:upsellClicked` and set `state.isSubscribed = true` from the host wrapper once purchase completes.
- Use `sipsync:smartBottleSync` to call native BLE APIs or server endpoints for actual bottle integrations.
- Capture `sipsync:regenerate` to measure cadence experimentation frequency.

---

## 4. Host QA Checklist

1. **Responsive check:** Load SipSync at 375 px width; confirm no horizontal scroll and timeline list remains legible.
2. **Time inputs:** Verify native time pickers open correctly in the host environment (iOS vs Android).
3. **Clipboard bridge:** Tap **Copy** in the share row to ensure the host clipboard hook fires.
4. **Smart bottle gating:** With default (free) state, button stays disabled and fires `sipsync:upsellViewed`. Flip `state.isSubscribed = true` to confirm it enables and emits `sipsync:smartBottleSync`.
5. **Offline smoke:** Refresh under airplane mode; deterministic plan should render.
6. **Analytics visibility:** Ensure all custom events above hit your analytics console/logcat.

Log devices/OS/browsers plus any overrides in the Pod A status log after QA.

---

## 5. White-Label Tips

- Override `:root { --ss-primary: ... }` to match partner branding.
- Wrap hero/tagline strings in your localization layer before calling `initMiniApp`.
- Replace the deterministic share link with a host-generated deep link inside `buildShareRow` if needed.
- Keep `prefers-reduced-motion` styles intact to stay WCAG AA compliant.

---

## 6. Rollout Checklist

- [ ] Assets (shared + SipSync) deployed to CDN/bundle.
- [ ] Custom events bridging to analytics/billing.
- [ ] Clipboard + smart bottle flows verified in host environment.
- [ ] Billing modal wired to `sipsync:upsellClicked`.
- [ ] QA evidence captured for iOS Safari, Android Chrome, and at least one host WebView.

Add the rollout entry to `pods/pod-travel-lifestyle.md` once complete.

