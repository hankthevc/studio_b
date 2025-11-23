# LiftShift Embed Kit (Phase 4)

Embed LiftShift—the adaptive microcycle builder—into host apps. Assets live under `apps/fitness/liftshift/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/fitness/liftshift/styles.css">

<div id="liftshift-root"></div>

<script type="module">
  import { initMiniApp as initLiftShift } from "/apps/fitness/liftshift/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("liftshift-root");
    if (mount) initLiftShift(mount);
  });

  window.addEventListener("liftshift:export", ({ detail }) => {
    hostAnalytics.track("liftshift_export", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` first so shared tokens/buttons/toasts cascade.
- Layout targets ~440 px width; wrap the root in a centered container for wider hosts.
- Deterministic logic means LiftShift runs offline for demos.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--ls-*` tokens in `styles.css` to adjust colors/shadows. | Deep purple/amber palette |
| Font stack | Set `--font-sans` globally before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero/tagline strings live near the top of `app.js`; wrap with localization for white-label builds. | “AI strength coach…” |
| Analytics | Subscribe to `liftshift:*` events (below) to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `liftshift:freeLimitHit` | `{ planCount }` | Free user exceeds preview limit. |
| `liftshift:regenerate` | `{ planCount }` | User taps **Regenerate block**. |
| `liftshift:export` | `{ plan }` | Pro-only “Export & track (Pro)” succeeds. |
| `liftshift:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPlan`, `exportButton`). |
| `liftshift:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch billing via `liftshift:upsellClicked` and flip `state.isSubscribed = true` through a thin host wrapper once purchase completes.
- Wire `liftshift:export` into your training log, PDF export, or share workflow.
- Capture `liftshift:regenerate` to understand iteration frequency or enforce enterprise limits.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375‑414 px width; confirm cards stack vertically, no horizontal scroll.
2. **Equipment tags** – Ensure toggling works and at least one tag stays selected.
3. **Sliders** – Verify range labels update live for days/week and session minutes.
4. **Clipboard** – Tap **Copy** in share row to confirm host clipboard bridge works.
5. **Upsell gating** – Free state keeps export button disabled and fires `liftshift:upsellViewed`. Simulate subscription to confirm it enables and emits `liftshift:export`.
6. **Analytics** – Ensure all `liftshift:*` events hit your telemetry pipeline.

Log QA evidence (device/OS/browser) and overrides in `pods/pod-fitness-health.md`.

---

## 5. White-Label Tips

- Override `:root { --ls-primary: ... }` before loading styles for partner branding.
- Wrap hero/tagline strings with your i18n helper before `initMiniApp`.
- Replace deterministic share link with host deep link by intercepting `buildShareRow`.
- Keep `prefers-reduced-motion` declarations intact for accessibility compliance.

---

## 6. Rollout Checklist

- [ ] CDN/bundle entries created for `shared/` + LiftShift assets.
- [ ] `liftshift:*` events wired into analytics/billing.
- [ ] Clipboard + export flows verified in host environment.
- [ ] Billing modal wired to `liftshift:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout completion (date, devices, overrides) in `pods/pod-fitness-health.md`.

