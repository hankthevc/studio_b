# SliceSaver Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/finance/slicesaver/styles.css" />
<div id="slicesaver-root"></div>
<script type="module">
  import { mount } from "/apps/finance/slicesaver/app.js";
  mount(document.getElementById("slicesaver-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `slicesaver:freeLimitHit` | `{ planCount }` | Multiple splits. |
| `slicesaver:regenerate` | `{ planCount }` | Regenerate pressed. |
| `slicesaver:upsellViewed` | `{ surface }` | Upsell displayed. |
| `slicesaver:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/slicesaver/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
