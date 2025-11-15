# PocketPorter Embed Kit (Phase 4)

Use these instructions to embed PocketPorter inside any host app or mobile WebView without rewriting the packing workflow. All assets referenced below live in `apps/travel/pocketporter/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/travel/pocketporter/styles.css">

<div id="pocketporter-root"></div>

<script type="module">
  import { initMiniApp as initPocketPorter } from "/apps/travel/pocketporter/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("pocketporter-root");
    if (mount) initPocketPorter(mount);
  });

  window.addEventListener("pocketporter:saveWardrobe", (event) => {
    hostAnalytics.track("pocketporter_saveWardrobe", event.detail);
  });
</script>
```

**Hosting notes**
- Load `shared/styles.css` first so global tokens (`--font-sans`, spacing, toasts) are available.
- PocketPorter is mobile-first (≈420 px). Wrap the root div in a centered container if the host layout is wider.
- All logic is deterministic, so it runs offline; no backend dependency is required for demos.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--pp-*` variables in `styles.css` to change gradients, borders, or card shadows. | Coral/purple travel palette |
| Font | Set `--font-sans` before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero eyebrow/tagline live near the top of `app.js`; adjust for white-label variants. | “AI packing buddy / Carry-on confident lists” |
| Analytics | Subscribe to `window` custom events listed below and forward to your analytics bus. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `pocketporter:freeLimitHit` | `{ planCount }` | User exceeds the free wardrobe limit. |
| `pocketporter:regenerate` | `{ planCount }` | User re-runs a list from the share row. |
| `pocketporter:saveWardrobe` | `{ plan }` | Pro-only “Save wardrobe” button succeeds. |
| `pocketporter:upsellViewed` | `{ surface }` | Upsell banner or gated button becomes visible (`postPlan`, `saveWardrobe`). |
| `pocketporter:upsellClicked` | `null` | Upgrade CTA tapped. |

**Suggested wiring**
- Trigger your billing modal from `pocketporter:upsellClicked` and flip `state.isSubscribed` from the host wrapper when the customer upgrades.
- Use `pocketporter:saveWardrobe` to persist the generated plan to the user’s profile.
- Listen for `pocketporter:regenerate` to log content refreshes or enforce enterprise-level limits.

---

## 4. Host QA Checklist

1. **Mount verification:** Load in an iOS/Android WebView at 375 px; confirm no horizontal scroll and gradient backgrounds render correctly.
2. **Clipboard bridge:** Tap **Copy** in the share row and ensure the host clipboard integration fires success/failure callbacks.
3. **Airline compliance copy:** Validate the compliance card text updates when the airline select changes.
4. **Upsell gating:** With `state.isSubscribed = false` (default), confirm “Save wardrobe (Pro)” is disabled and fires upsell events. Then simulate `true` and verify the button enables and emits `pocketporter:saveWardrobe`.
5. **Offline smoke:** Refresh with network throttled/offline—deterministic logic should still render.
6. **Analytics tracing:** Ensure each custom event is visible in your analytics console/logcat.

Record devices, OS, and browsers in the Pod A log after QA sign-off.

---

## 5. White-Label Tips

- **Brand colors:** Override `:root { --pp-primary: ...; --pp-secondary: ...; }` before loading the PocketPorter CSS.
- **Copy localization:** Swap hero/tagline strings by wrapping them in your host translation layer prior to calling `initMiniApp`.
- **Share links:** `plan.shareLink` is a deterministic stub—replace the displayed value with a host-generated short link if needed.
- **Accessibility:** The app honors `prefers-reduced-motion`; keep that media query intact to pass WCAG AA.

---

## 6. Rollout Checklist

- [ ] Assets published to CDN/bundle alongside `shared/`.
- [ ] Custom events piped into analytics + billing triggers.
- [ ] Host clipboard + share link flows verified.
- [ ] Upsell CTA launches host purchase modal.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Once complete, document the rollout in `pods/pod-travel-lifestyle.md` with date, device coverage, and any host overrides.

