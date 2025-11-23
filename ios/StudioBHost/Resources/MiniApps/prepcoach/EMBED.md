# PrepCoach Embed Kit (Phase 4)

Embed PrepCoach—the AI mock interview round generator—directly inside host apps or WebViews. Assets live in `apps/career/prepcoach/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/career/prepcoach/styles.css">

<div id="prepcoach-root"></div>

<script type="module">
  import { initMiniApp as initPrepCoach } from "/apps/career/prepcoach/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("prepcoach-root");
    if (mount) initPrepCoach(mount);
  });

  window.addEventListener("prepcoach:export", ({ detail }) => {
    hostAnalytics.track("prepcoach_export", detail);
  });
</script>
```

**Notes**
- Always load `shared/styles.css` first for shared tokens/buttons/toasts.
- PrepCoach is tuned for ~440 px width; wrap the root in a centered container if needed.
- The interview logic is deterministic and runs offline, so no backend wiring is required for initial demos.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--pc-*` tokens in `styles.css` for color, border, or shadow updates. | Navy + accent palette |
| Font stack | Set `--font-sans` globally to inherit host typography. | `Inter` stack |
| Copy | Hero eyebrow/tagline strings live near the top of `app.js` for localization/white-labeling. | “AI mock coach / Behavioral rounds…” |
| Analytics | Subscribe to custom events (below) to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `prepcoach:freeLimitHit` | `{ planCount }` | Free user exceeds mock-round quota. |
| `prepcoach:regenerate` | `{ planCount }` | User taps **Run again**. |
| `prepcoach:export` | `{ plan }` | Pro-only “Export to doc” button succeeds. |
| `prepcoach:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postRound`, `exportButton`). |
| `prepcoach:upsellClicked` | `null` | Upgrade CTA tapped. |

**Recommended wiring**
- Launch your billing modal from `prepcoach:upsellClicked` and set `state.isSubscribed = true` in a thin wrapper after purchase completes.
- Use `prepcoach:export` to trigger host-side document generation, exports, or recruiter-sharing flows.
- Capture `prepcoach:regenerate` to measure iteration behavior or enforce enterprise limits.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375–414 px width; ensure prompt cards/copy buttons remain readable without horizontal scroll.
2. **Clipboard** – Test **Copy answer** buttons to ensure host clipboard hooks fire.
3. **Textarea focus** – Confirm the prompt textarea keeps focus after toggling between prompts/hints.
4. **Upsell gating** – With free state (default), export button stays disabled and fires `prepcoach:upsellViewed`. Simulate subscription to confirm it enables and emits `prepcoach:export`.
5. **Analytics** – Verify each `prepcoach:*` event appears in your telemetry pipeline.
6. **Offline** – Refresh without network; deterministic plan should still render.

Document devices/OS/browsers plus any overrides inside `pods/pod-finance-career.md`.

---

## 5. White-Label Tips

- Override `:root { --pc-primary: ... }` prior to loading styles for partner branding.
- Localize hero/tagline strings before calling `initMiniApp`.
- Intercept the deterministic share link in `buildShareRow` if you need host-generated short links.
- Keep `prefers-reduced-motion` declarations intact for accessibility compliance.

---

## 6. Rollout Checklist

- [ ] Assets (shared + PrepCoach) published to CDN/bundle.
- [ ] `prepcoach:*` events wired into analytics/billing.
- [ ] Clipboard + export flows confirmed in host environment.
- [ ] Billing modal wired to `prepcoach:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout completion (date, devices, overrides) in `pods/pod-finance-career.md`.

