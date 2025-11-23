# StorySpark Embed Kit (Phase 4)

Embed StorySpark—the AI hook/caption generator—directly into any host experience. Assets live in `apps/creator/storyspark/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/creator/storyspark/styles.css">

<div id="storyspark-root"></div>

<script type="module">
  import { initMiniApp as initStorySpark } from "/apps/creator/storyspark/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("storyspark-root");
    if (mount) initStorySpark(mount);
  });

  window.addEventListener("storyspark:savePreset", ({ detail }) => {
    hostAnalytics.track("storyspark_savePreset", detail);
  });
</script>
```

**Notes**
- Include `shared/styles.css` before StorySpark styles for consistent tokens/buttons/toasts.
- Layout is designed for ~420 px width; wrap the root in a centered container for wider hosts.
- Deterministic logic means StorySpark works offline for demos or sandboxes.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--sspark-*` tokens in `styles.css` to change primary colors or shadows. | Purple/orange creator palette |
| Fonts | Set `--font-sans` before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero eyebrow/tagline text lives near the top of `app.js`; wrap with localization for white-label builds. | “AI content studio / Hooks, captions, hashtags…” |
| Analytics | Subscribe to the `storyspark:*` events below and forward to the host analytics bus. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `storyspark:freeLimitHit` | `{ planCount }` | User exceeds the free spark quota. |
| `storyspark:regenerate` | `{ planCount }` | User taps **Tweak & regenerate**. |
| `storyspark:savePreset` | `{ plan }` | Pro-only preset save button succeeds. |
| `storyspark:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postPlan`, `savePreset`). |
| `storyspark:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch your billing modal from `storyspark:upsellClicked` and expose a host toggle to set `state.isSubscribed = true` after purchase.
- Capture `storyspark:savePreset` to persist highlight hooks/captions inside the host CMS.
- Listen for `storyspark:regenerate` to understand iteration behavior and enforce rate limits if needed.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375 px width to verify hook cards and hashtag chips stay within the viewport.
2. **Clipboard** – Tap each **Copy** button (hooks, caption, hashtags) to ensure host clipboard bridges fire.
3. **Tone pills** – Confirm the tone tag toggles highlight correctly and the selection is sticky between runs.
4. **Upsell flow** – Free state should keep “Save preset (Pro)” disabled and fire `storyspark:upsellViewed`. Simulate subscription to confirm it enables and emits `storyspark:savePreset`.
5. **Analytics** – Ensure all custom events hit your telemetry pipeline.
6. **Offline** – Refresh with no network; deterministic plan should still generate.

Document devices/OS/browsers plus any overrides in the Pod B log after QA.

---

## 5. White-Label Tips

- Override `:root { --sspark-primary: ... }` before the app styles for partner colors.
- Wrap hero/tagline strings with your i18n helper before calling `initMiniApp`.
- Replace the deterministic `plan.shareLink` with a host-generated deep link by intercepting `buildShareRow`.
- Keep `prefers-reduced-motion` declarations intact to maintain accessibility guarantees.

---

## 6. Rollout Checklist

- [ ] CDN/bundle published for `shared/` + StorySpark assets.
- [ ] `storyspark:*` events wired into analytics/billing.
- [ ] Clipboard + preset save flows verified inside host WebView/native wrapper.
- [ ] Billing modal wired to `storyspark:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout completion (date/devices/overrides) in `pods/pod-food-productivity.md`.

