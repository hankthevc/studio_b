# SkillSnack Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/education/skillsnack/styles.css" />
<div id="skillsnack-root"></div>
<script type="module">
  import { mount } from "/apps/education/skillsnack/app.js";
  mount(document.getElementById("skillsnack-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `skillsnack:freeLimitHit` | `{ planCount }` | Multiple snacks. |
| `skillsnack:regenerate` | `{ planCount }` | Regenerate. |
| `skillsnack:upsellViewed` | `{ surface }` | Upsell display. |
| `skillsnack:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/skillsnack/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
