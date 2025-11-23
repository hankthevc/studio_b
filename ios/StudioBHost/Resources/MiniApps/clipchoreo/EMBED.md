# ClipChoreo Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/creator/clipchoreo/styles.css" />
<div id="clipchoreo-root"></div>
<script type="module">
  import { mount } from "/apps/creator/clipchoreo/app.js";
  mount(document.getElementById("clipchoreo-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `clipchoreo:freeLimitHit` | `{ planCount }` | Second board. |
| `clipchoreo:regenerate` | `{ planCount }` | Regenerate. |
| `clipchoreo:upsellViewed` | `{ surface }` | Upsell reveal. |
| `clipchoreo:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/clipchoreo/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
