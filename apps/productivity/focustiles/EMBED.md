# FocusTiles Embed Kit (Phase 4)

Everything you need to embed FocusTiles—the adaptive micro-tile planner—inside host apps or WebViews. Assets live under `apps/productivity/focustiles/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/productivity/focustiles/styles.css">

<div id="focustiles-root"></div>

<script type="module">
  import { initMiniApp as initFocusTiles } from "/apps/productivity/focustiles/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("focustiles-root");
    if (mount) initFocusTiles(mount);
  });

  window.addEventListener("focustiles:saveRhythm", ({ detail }) => {
    hostAnalytics.track("focustiles_saveRhythm", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` before the app styles to ensure shared tokens (`--font-sans`, cards, toasts) are in place.
- FocusTiles is mobile-first (~440 px). Wrap the root in a centered container if embedding in wider layouts.
- Logic is deterministic; no backend dependency is required for demos/offline testing.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--focus-*` tokens in `styles.css` for colors, borders, or gradients. | Purple/pink productivity palette |
| Font stack | Set `--font-sans` globally before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero eyebrow/tagline strings live near the top of `app.js`—wrap with localization for white-label builds. | “AI focus coach / Adaptive microtiles…” |
| Analytics | Subscribe to custom events (below) and feed them into host analytics/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `focustiles:freeLimitHit` | `{ planCount }` | Free user requests too many tile plans. |
| `focustiles:regenerate` | `{ planCount }` | User taps **Regenerate flow**. |
| `focustiles:saveRhythm` | `{ plan }` | Pro-only “Save rhythm (Pro)” button succeeds. |
| `focustiles:logSession` | `{ tile }` | Pro-only “Log session” on the highlight tile. |
| `focustiles:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPlan`, `logSession`, `saveRhythm`). |
| `focustiles:upsellClicked` | `null` | Upgrade CTA tapped. |

**Suggested wiring**
- Open your billing modal from `focustiles:upsellClicked` and flip `state.isSubscribed` via a host wrapper when purchase completes.
- Map `focustiles:saveRhythm` into calendar sync or analytics exports.
- Use `focustiles:logSession` to record highlight tile completions in host leaderboards.

---

## 4. Host QA Checklist

1. **Layout:** Load at 375‑414 px width, confirm cards stack vertically with no horizontal scroll.
2. **Slider & tags:** Verify the energy tags toggle correctly and the block-length slider updates the label.
3. **Clipboard bridge:** Tap **Copy** in the share row to confirm host clipboard hooks fire.
4. **Upsell gating:** Ensure “Log session (Pro)” and “Save rhythm (Pro)” stay disabled + fire upsell events while unsubscribed. Simulate `state.isSubscribed = true` to confirm Pro flows emit `logSession` and `saveRhythm`.
5. **Analytics tracing:** Confirm all custom events above reach host analytics/billing logs.
6. **Offline smoke:** Refresh under airplane mode; deterministic plan should still render.

Capture device/OS/browser evidence in the Pod B status log after QA.

---

## 5. White-Label Tips

- Override `:root { --focus-primary: ... }` before importing FocusTiles styles to match partner branding.
- Wrap hero/tagline strings with your i18n helper before `initMiniApp`.
- Replace the deterministic share link with a host-generated deep link by intercepting `plan.shareLink` in `buildShareRow`.
- Keep `prefers-reduced-motion` styles intact to maintain WCAG AA compliance.

---

## 6. Rollout Checklist

- [ ] CDN/bundle entries created for `shared/` + FocusTiles assets.
- [ ] Analytics/billing pipeline hooked up to `focustiles:*` events.
- [ ] Clipboard + save/log session bridges tested in host environment.
- [ ] Billing modal wired to `focustiles:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout details in `pods/pod-food-productivity.md` (date, devices, overrides) once complete.

