# TempoBuddy Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/fitness/tempobuddy/styles.css" />
<div id="tempobuddy-root"></div>
<script type="module">
  import { mount } from "/apps/fitness/tempobuddy/app.js";
  mount(document.getElementById("tempobuddy-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `tempobuddy:freeLimitHit` | `{ planCount }` | Second plan attempt. |
| `tempobuddy:regenerate` | `{ planCount }` | Regenerate button. |
| `tempobuddy:upsellViewed` | `{ surface }` | Upsell shown. |
| `tempobuddy:upsellClicked` | `{}` | Upgrade pressed. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/tempobuddy/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
