# BillBreeze Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/finance/billbreeze/styles.css" />
<div id="billbreeze-root"></div>
<script type="module">
  import { mount } from "/apps/finance/billbreeze/app.js";
  mount(document.getElementById("billbreeze-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `billbreeze:freeLimitHit` | `{ planCount }` | More than one lane. |
| `billbreeze:regenerate` | `{ planCount }` | Regenerate. |
| `billbreeze:upsellViewed` | `{ surface }` | Upsell shown. |
| `billbreeze:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/billbreeze/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
