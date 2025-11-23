# HabitGrid Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/lifestyle/habitgrid/styles.css" />
<div id="habitgrid-root"></div>
<script type="module">
  import { mount } from "/apps/lifestyle/habitgrid/app.js";
  mount(document.getElementById("habitgrid-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `habitgrid:freeLimitHit` | `{ planCount }` | Multiple plan attempts. |
| `habitgrid:regenerate` | `{ planCount }` | Regenerate tapped. |
| `habitgrid:upsellViewed` | `{ surface }` | Upsell shown. |
| `habitgrid:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/habitgrid/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
