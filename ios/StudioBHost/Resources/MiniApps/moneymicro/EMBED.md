# MoneyMicro Embed Kit (Phase 4)

Embed MoneyMicro—the micro affordability checker—inside any host experience. Assets live under `apps/finance/moneymicro/`.

---

## 1. Quick Start Snippet

```html
<link rel="stylesheet" href="/shared/styles.css">
<link rel="stylesheet" href="/apps/finance/moneymicro/styles.css">

<div id="moneymicro-root"></div>

<script type="module">
  import { initMiniApp as initMoneyMicro } from "/apps/finance/moneymicro/app.js";

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("moneymicro-root");
    if (mount) initMoneyMicro(mount);
  });

  window.addEventListener("moneymicro:export", ({ detail }) => {
    hostAnalytics.track("moneymicro_export", detail);
  });
</script>
```

**Notes**
- Load `shared/styles.css` first to pull in shared tokens/buttons/toasts.
- MoneyMicro is mobile-first (~420 px). Wrap the root in a centered container if embedding in wider views.
- Logic is deterministic, so the app runs offline for demos or sandbox testing.

---

## 2. Configuration & Theming

| Knob | Description | Default |
| --- | --- | --- |
| CSS variables | Override `--money-*` tokens in `styles.css` to adjust colors/shadows. | Blue/orange finance palette |
| Font stack | Set `--font-sans` globally before loading styles to inherit host typography. | `Inter` stack |
| Copy | Hero/tagline strings live near the top of `app.js`; wrap with localization for white-label builds. | “AI finance check / See the monthly ripple…” |
| Analytics | Subscribe to `moneymicro:*` events below to integrate with host telemetry/billing. | None |

---

## 3. Custom Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `moneymicro:freeLimitHit` | `{ calcCount }` | Free user exceeds saved-scenario limit. |
| `moneymicro:regenerate` | `{ calcCount }` | User taps **Adjust & rerun**. |
| `moneymicro:export` | `{ scenario }` | Pro-only “Save & export (Pro)” button succeeds. |
| `moneymicro:upsellViewed` | `{ surface }` | Upsell surfaces visible (`postScenario`, `exportButton`). |
| `moneymicro:upsellClicked` | `null` | Upgrade CTA tapped. |

**Integration tips**
- Launch your billing modal from `moneymicro:upsellClicked` and set `state.isSubscribed = true` via a host wrapper once the upgrade finishes.
- Use `moneymicro:export` to generate host-side PDFs, notes entries, or checkout tags.
- Capture `moneymicro:regenerate` to monitor iteration behavior or enforce rate limits.

---

## 4. Host QA Checklist

1. **Layout** – Load at 375 px width; ensure verdict/timeline/grocery cards stack without overflow.
2. **Slider & tags** – Verify the savings slider updates its label and timeline chips toggle correctly.
3. **Clipboard** – Tap **Copy** in the share row; confirm host clipboard hooks fire.
4. **Upsell gating** – With free state (default), “Save & export (Pro)” stays disabled and fires `moneymicro:upsellViewed`. Simulate subscription to confirm it enables and emits `moneymicro:export`.
5. **Analytics** – Confirm all custom events appear in your telemetry pipeline.
6. **Offline** – Refresh without network; deterministic plan should still render.

Document device/OS/browser coverage plus overrides in `pods/pod-finance-career.md`.

---

## 5. White-Label Tips

- Override `:root { --money-primary: ... }` before importing styles to match partner branding.
- Wrap hero/tagline strings with your i18n helper prior to `initMiniApp`.
- Replace the deterministic share link with a host-generated deep link by intercepting `buildShareRow`.
- Preserve `prefers-reduced-motion` settings to keep WCAG compliance intact.

---

## 6. Rollout Checklist

- [ ] Assets (shared + MoneyMicro) deployed to CDN/bundle.
- [ ] `moneymicro:*` events wired into analytics/billing.
- [ ] Clipboard + export flows verified in host environment.
- [ ] Billing modal wired to `moneymicro:upsellClicked`.
- [ ] QA evidence logged for iOS Safari, Android Chrome, and at least one host WebView.

Log rollout completion (date, devices, overrides) in `pods/pod-finance-career.md`.

