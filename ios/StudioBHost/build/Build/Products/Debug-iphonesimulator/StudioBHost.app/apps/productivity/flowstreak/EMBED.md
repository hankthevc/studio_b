# FlowStreak Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/productivity/flowstreak/styles.css" />
<div id="flowstreak-root"></div>
<script type="module">
  import { mount } from "/apps/productivity/flowstreak/app.js";
  mount(document.getElementById("flowstreak-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `flowstreak:freeLimitHit` | `{ planCount }` | Second board same day. |
| `flowstreak:regenerate` | `{ planCount }` | Regenerate. |
| `flowstreak:upsellViewed` | `{ surface }` | Upsell shown. |
| `flowstreak:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/flowstreak/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
