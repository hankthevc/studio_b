# RestNest Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/lifestyle/restnest/styles.css" />
<div id="restnest-root"></div>
<script type="module">
  import { mount } from "/apps/lifestyle/restnest/app.js";
  mount(document.getElementById("restnest-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `restnest:freeLimitHit` | `{ planCount }` | Multiple routines per night. |
| `restnest:regenerate` | `{ planCount }` | Regenerate pressed. |
| `restnest:upsellViewed` | `{ surface }` | Upsell in view. |
| `restnest:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/restnest/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
