# FlexDesk Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/fitness/flexdesk/styles.css" />
<div id="flexdesk-root"></div>
<script type="module">
  import { mount } from "/apps/fitness/flexdesk/app.js";
  mount(document.getElementById("flexdesk-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `flexdesk:freeLimitHit` | `{ planCount }` | User requests more than two flows. |
| `flexdesk:regenerate` | `{ planCount }` | Regenerate tapped. |
| `flexdesk:upsellViewed` | `{ surface }` | Upsell revealed. |
| `flexdesk:upsellClicked` | `{}` | Upgrade CTA tapped. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/flexdesk/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
