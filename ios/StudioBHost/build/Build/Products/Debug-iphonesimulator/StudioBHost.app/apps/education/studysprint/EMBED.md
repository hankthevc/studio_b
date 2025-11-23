# StudySprint Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/education/studysprint/styles.css" />
<div id="studysprint-root"></div>
<script type="module">
  import { mount } from "/apps/education/studysprint/app.js";
  mount(document.getElementById("studysprint-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `studysprint:freeLimitHit` | `{ planCount }` | Multiple sprints. |
| `studysprint:regenerate` | `{ planCount }` | Regenerate button. |
| `studysprint:upsellViewed` | `{ surface }` | Upsell displayed. |
| `studysprint:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/studysprint/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
