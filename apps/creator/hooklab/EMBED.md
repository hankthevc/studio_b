# HookLab Embed Kit (Phase 4)

Embed HookLab—the A/B hook + thumbnail lab—inside host creator tools. Assets live under `apps/creator/hooklab/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/creator/hooklab/styles.css">

<div id="hooklab-root"></div>

<script type="module">
  import { initMiniApp as initHookLab } from "/apps/creator/hooklab/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("hooklab-root");
    if (mount) initHookLab(mount);
  });

  window.addEventListener("hooklab:savePreset", ({ detail }) => {
    hostAnalytics.track("hooklab_savePreset", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` before HookLab styles to inherit shared tokens/buttons/toasts.
- Layout is optimized for ~420 px width. Wrap the root in a centered container for wider hosts.
- Deterministic logic lets HookLab run offline for demos.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--hl-*` tokens in `styles.css` to adjust gradients, borders, or shadows. | Pink/purple creator palette |
| Font stack | Set `--font-sans` before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero/tagline strings live near the top of `app.js`; wrap with localization for white‑label builds. | “AI hook lab / A/B hooks and thumbnail copy…” |
| Analytics | Subscribe to `hooklab:*` events (below) to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `hooklab:freeLimitHit` | `{ planCount }` | Free user exceeds hook-set quota. |
| `hooklab:regenerate` | `{ planCount }` | User taps **Regenerate vibe**. |
| `hooklab:export` | `{ plan }` | Pro-only “Export hooks (Pro)” button succeeds. |
| `hooklab:savePreset` | `{ variant }` | Pro-only “Save preset (Pro)” on highlight card. |
| `hooklab:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPlan`, `highlightPreset`, `exportButton`). |
| `hooklab:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch your billing modal from `hooklab:upsellClicked` and flip `state.isSubscribed = true` via a host wrapper after purchase completes.
- Hook `hooklab:export` and `hooklab:savePreset` into host CMS storage or collaboration APIs.
- Capture `hooklab:regenerate` to understand iteration behavior or enforce rate limits.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375 px width; verify highlight + variants + thumbnail cards stack without overflow.
2. **Clipboard** – Tap **Copy hook** and **Copy thumbnail** buttons to ensure host clipboard hooks work.
3. **Vibe tags** – Confirm vibe pills toggle correctly and selection persists across runs.
4. **Upsell gating** – In free state (default), “Save preset (Pro)” and “Export hooks (Pro)” remain disabled and fire `hooklab:upsellViewed`. Simulate subscription to confirm both enable and emit `hooklab:savePreset` / `hooklab:export`.
5. **Analytics** – Ensure all `hooklab:*` events reach your telemetry pipeline.
6. **Offline** – Refresh with network off; deterministic plan should still render.

Log devices/OS/browsers plus overrides in `pods/pod-games-creator.md`.

---

## 5. White-Label Tips

- Override `:root { --hl-primary: ... }` before the app styles for partner colors.
- Localize hero/tagline copy before calling `initMiniApp`.
- Replace deterministic share link with host deep links inside `buildShareRow` if required.
- Keep `prefers-reduced-motion` definitions intact for accessibility compliance.

---

## 6. Rollout Checklist

- [ ] CDN/bundle published for `shared/` + HookLab assets.
- [ ] `hooklab:*` events wired into analytics/billing.
- [ ] Clipboard + preset/export flows verified in host environment.
- [ ] Billing modal wired to `hooklab:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Update the Pod D log with rollout details once complete.

