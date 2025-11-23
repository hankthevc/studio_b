# BeatBoard Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/creator/beatboard/styles.css" />
<div id="beatboard-root"></div>
<script type="module">
  import { mount } from "/apps/creator/beatboard/app.js";
  mount(document.getElementById("beatboard-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `beatboard:freeLimitHit` | `{ planCount }` | More than three hooks. |
| `beatboard:regenerate` | `{ planCount }` | Regenerate button. |
| `beatboard:upsellViewed` | `{ surface }` | Upsell shown. |
| `beatboard:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/beatboard/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
