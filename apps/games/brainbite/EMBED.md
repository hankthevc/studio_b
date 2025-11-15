# BrainBite Embed Kit (Phase 4)

Embed BrainBite—the 60-second daily puzzle—inside host apps or in-app WebViews. Assets live under `apps/games/brainbite/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/games/brainbite/styles.css">

<div id="brainbite-root"></div>

<script type="module">
  import { initMiniApp as initBrainBite } from "/apps/games/brainbite/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("brainbite-root");
    if (mount) initBrainBite(mount);
  });

  window.addEventListener("brainbite:archiveExport", ({ detail }) => {
    hostAnalytics.track("brainbite_archiveExport", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` first for consistent tokens/buttons/toasts.
- UI targets ~400 px width; wrap the root in a centered container for wider hosts.
- Deterministic puzzles run offline—no backend needed for demos.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--bite-*` tokens in `styles.css` for colors/shadows. | Coral/pink game palette |
| Font stack | Set `--font-sans` globally before styles load to inherit host typography. | `Inter` stack |
| Copy | Hero/tagline strings live near the top of `app.js`; wrap in localization for white-label builds. | “Daily brain snack / One 60-second puzzle…” |
| Analytics | Subscribe to `brainbite:*` events to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `brainbite:freeLimitHit` | `{ puzzleCount }` | Free user exceeds bite limit. |
| `brainbite:regenerate` | `{ puzzleCount }` | User taps **New bite**. |
| `brainbite:archiveExport` | `{ puzzle }` | Pro-only “Unlock archives (Pro)” button succeeds. |
| `brainbite:shieldApplied` | `{ streak }` | Pro-only “Streak shield (Pro)” button succeeds. |
| `brainbite:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPuzzle`, `archiveButton`, `streakShield`). |
| `brainbite:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch billing modal from `brainbite:upsellClicked` and set `state.isSubscribed = true` via host wrapper after purchase.
- Wire `brainbite:archiveExport` into your archive API or content unlock flow.
- Use `brainbite:shieldApplied` to track streak protection in host leaderboards.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375 px width; ensure puzzle/streak cards stack without clipping.
2. **Choice/textarea inputs** – Confirm multiple choice buttons toggle correctly and free-answer field honors host keyboard.
3. **Clipboard** – Tap **Copy** (within share row) to validate host clipboard hooks.
4. **Upsell gating** – Free state keeps “Streak shield (Pro)” and “Unlock archives (Pro)” disabled + firing `brainbite:upsellViewed`. Simulate subscription to confirm both enable and emit `brainbite:shieldApplied` / `brainbite:archiveExport`.
5. **Analytics** – Ensure all `brainbite:*` events appear in telemetry.
6. **Offline** – Refresh with no network; deterministic puzzle should still render.

Record devices/OS/browsers plus overrides in `pods/pod-games-creator.md`.

---

## 5. White-Label Tips

- Override `:root { --bite-primary: ... }` before loading styles to match partner branding.
- Wrap hero/tagline strings with your i18n helper prior to `initMiniApp`.
- Replace deterministic share link with host deep link if required.
- Keep `prefers-reduced-motion` declarations intact to maintain accessibility compliance.

---

## 6. Rollout Checklist

- [ ] CDN/bundle entries created for `shared/` + BrainBite assets.
- [ ] `brainbite:*` events wired into analytics/billing.
- [ ] Clipboard + archive/shield flows verified in host environment.
- [ ] Billing modal wired to `brainbite:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Update Pod D log with rollout information once complete.

