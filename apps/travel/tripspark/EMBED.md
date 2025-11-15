# TripSpark Embed Kit (Phase 4)

Use this playbook to drop TripSpark into any host app without re-implementing the UI stack. All snippets assume the static assets in `apps/travel/tripspark/` are accessible from your CDN or packaged inside a WebView bundle.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/travel/tripspark/styles.css">

<div id="tripspark-root"></div>

<script type="module">
  import { initMiniApp as initTripSpark } from "/apps/travel/tripspark/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mountNode = document.getElementById("tripspark-root");
    if (mountNode) initTripSpark(mountNode);
  });

  // Example: forward analytics to host
  window.addEventListener("tripspark:export", (event) => {
    window.hostAnalytics.track("tripspark_export", event.detail);
  });
</script>
```

**Hosting tips**
- Load `shared/styles.css` first so the design tokens cascade before the app-specific styles.
- Keep the module import path relative to wherever the assets are served (ESM is already supported).
- Wrap the mini-app in a container (`max-width: 420px`) if the host layout is wider than mobile.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS custom properties | Override any of the `--ts-*` variables inside `styles.css` to adjust primary/secondary colors, shadows, or radii. | Mint + coral gradient |
| Font stack | Inherit host font by setting `--font-sans` globally before loading TripSpark styles. | `"Inter", -apple-system, BlinkMacSystemFont` |
| Copy | Hero eyebrow/tagline text lives near the top of `app.js`. Update once for any white-label variants. | “AI trip spark” / “3-day highlight in one tap.” |
| Analytics hook | Attach listeners to the custom events documented below. | `window.addEventListener("tripspark:*", handler)` |

---

## 3. Custom Events (Host Integration)

TripSpark emits deterministic `CustomEvent`s on `window`. Payloads live under `event.detail`.

| Event | Detail Shape | When it fires |
| --- | --- | --- |
| `tripspark:freeLimitHit` | `{ planCount: number }` | After the user exceeds the free itinerary limit. |
| `tripspark:regenerate` | `{ planCount: number }` | Each time the user tweaks & regenerates. |
| `tripspark:export` | `{ plan: object }` | When a Pro user taps **Export & share (Pro)**. |
| `tripspark:upsellViewed` | `{ surface: string }` | When an upsell surface becomes visible (`postPlan`, `exportButton`). |
| `tripspark:upsellClicked` | `null` | When the upgrade CTA is tapped. |

**Recommended wiring**
- Map `tripspark:export` into your share/export pipeline (e.g., show native share sheet, create calendar entry).
- Use `tripspark:upsellViewed` to trigger host billing modals or impression analytics.
- Gating logic already lives in TripSpark; simply flip `state.isSubscribed` inside the host wrapper when the customer upgrades.

---

## 4. Host QA Checklist

1. **Mounting:** Load the mini-app in a WebView at 375px width; confirm there is no horizontal scroll.
2. **Clipboard bridge:** Verify the “Copy short link” button fires and the host clipboard bridge reports success/failure.
3. **Offline guard:** Toggle airplane mode—TripSpark uses deterministic mocks, so the UI should still render after a refresh.
4. **Analytics tap-through:** Ensure each custom event above is visible to your analytics bus.
5. **Subscription flow:** Simulate the upgrade flow by setting `state.isSubscribed = true` (temporary dev flag) and confirm the export button enables.
6. **Regenerate latency:** TripSpark waits ~320ms before rendering; ensure host spinners/pull-to-refresh do not conflict.

Document QA evidence in your pod log (device, OS, browser) so we can reproduce issues quickly.

---

## 5. White-Label Notes

- **Brand color swap:** Override `:root { --ts-primary: <hex>; --ts-secondary: <hex>; }` before the TripSpark CSS import to match partner palettes.
- **Copy localization:** Wrap hero/tagline strings with your i18n function before calling `initMiniApp` if the host handles translations.
- **Share links:** `plan.shareLink` is a deterministic stub. Replace it with a host-generated deep link before displaying inside `buildShareRow`.
- **Accessibility:** TripSpark honors `prefers-reduced-motion`. Maintain that attribute to pass WCAG AA when embedding.

---

## 6. Rollout Checklist

- [ ] CDN/cache entry created for `shared/` + TripSpark assets.
- [ ] Host analytics receiving `tripspark:*` events.
- [ ] Billing modal launched from `tripspark:upsellClicked`.
- [ ] Export flow wired to calendar/notes integration.
- [ ] QA sign-off on iOS Safari, Android Chrome, and at least one in-app WebView.

Once the above is complete, log the rollout in `pods/pod-travel-lifestyle.md` with device coverage and any host-specific overrides.

