# MealMind Embed Kit (Phase 4)

Embed MealMind—the 3-day preview meal planner—inside host apps or WebViews. Assets live in `apps/lifestyle/mealmind/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/lifestyle/mealmind/styles.css">

<div id="mealmind-root"></div>

<script type="module">
  import { initMiniApp as initMealMind } from "/apps/lifestyle/mealmind/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("mealmind-root");
    if (mount) initMealMind(mount);
  });

  window.addEventListener("mealmind:export", ({ detail }) => {
    hostAnalytics.track("mealmind_export", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` first to ensure shared tokens/buttons/toasts are available.
- Layout is tuned for ~420 px width. Wrap the root in a centered container for wider host layouts.
- Deterministic logic means MealMind runs offline—ideal for demos and sandboxes.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--meal-*` tokens in `styles.css` to change colors/shadows. | Green/orange meal palette |
| Font stack | Set `--font-sans` globally to inherit host typography. | `Inter` stack |
| Copy | Hero/tagline strings live near the top of `app.js`; wrap with localization for white-label builds. | “AI meal planner…Balanced weekly menus…” |
| Analytics | Subscribe to `mealmind:*` events (below) to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `mealmind:freeLimitHit` | `{ planCount }` | Free user exceeds preview limit. |
| `mealmind:regenerate` | `{ planCount }` | User taps **Tweak & regenerate**. |
| `mealmind:export` | `{ plan }` | Pro-only “Export grocery list (Pro)” button succeeds. |
| `mealmind:savePreset` | `{ plan }` | Pro-only “Save household preset (Pro)” button succeeds. |
| `mealmind:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPlan`, `highlightPreset`, `exportButton`). |
| `mealmind:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch billing from `mealmind:upsellClicked` and flip `state.isSubscribed = true` via a host wrapper once purchase completes.
- Wire `mealmind:export` to generate host-side grocery exports or deep links.
- Capture `mealmind:savePreset` to persist households/preferences in host profiles.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375 px width; confirm highlight + day cards + grocery chips stack without overflow.
2. **Household control** – Verify the +/- buttons update the hidden input and accessible value.
3. **Clipboard** – Tap **Copy** in the share row to ensure host clipboard hooks react.
4. **Upsell gating** – Free state keeps preset/export buttons disabled and firing `mealmind:upsellViewed`. Simulate subscription to confirm both enable and emit `mealmind:savePreset` / `mealmind:export`.
5. **Analytics** – Ensure all `mealmind:*` events hit your telemetry pipeline.
6. **Offline** – Refresh without network; deterministic plan should still render.

Document device/OS/browser coverage and overrides in `pods/pod-food-productivity.md`.

---

## 5. White-Label Tips

- Override `:root { --meal-primary: ... }` before loading styles for partner branding.
- Localize hero/tagline strings before calling `initMiniApp`.
- Replace deterministic share link with host deep links by intercepting `buildShareRow`.
- Keep `prefers-reduced-motion` declarations intact for accessibility compliance.

---

## 6. Rollout Checklist

- [ ] CDN/bundle entries created for `shared/` + MealMind assets.
- [ ] `mealmind:*` events wired into analytics/billing.
- [ ] Clipboard + preset/export flows verified in host environment.
- [ ] Billing modal wired to `mealmind:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout completion (date, devices, overrides) in `pods/pod-food-productivity.md`.

