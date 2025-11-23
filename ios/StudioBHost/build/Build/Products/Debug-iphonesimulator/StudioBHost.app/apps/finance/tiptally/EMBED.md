# TipTally Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/finance/tiptally/styles.css" />
<div id="tiptally-root"></div>
<script type="module">
  import { mount } from "/apps/finance/tiptally/app.js";
  mount(document.getElementById("tiptally-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `tiptally:freeLimitHit` | `{ planCount }` | More than two calculations. |
| `tiptally:regenerate` | `{ planCount }` | Regenerate clicked. |
| `tiptally:upsellViewed` | `{ surface }` | Upsell shown. |
| `tiptally:upsellClicked` | `{}` | Upgrade pressed. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/tiptally/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
