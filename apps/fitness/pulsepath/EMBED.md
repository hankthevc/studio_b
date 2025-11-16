# PulsePath Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/fitness/pulsepath/styles.css" />
<div id="pulsepath-root"></div>
<script type="module">
  import { mount } from "/apps/fitness/pulsepath/app.js";
  mount(document.getElementById("pulsepath-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `pulsepath:freeLimitHit` | `{ planCount }` | User tries second plan. |
| `pulsepath:regenerate` | `{ planCount }` | Regenerate tapped. |
| `pulsepath:upsellViewed` | `{ surface }` | Upsell shown post-plan. |
| `pulsepath:upsellClicked` | `{}` | Upgrade CTA clicked. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/pulsepath/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
