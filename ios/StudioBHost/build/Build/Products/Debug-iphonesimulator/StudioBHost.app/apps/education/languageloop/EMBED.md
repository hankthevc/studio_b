# LanguageLoop Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/education/languageloop/styles.css" />
<div id="languageloop-root"></div>
<script type="module">
  import { mount } from "/apps/education/languageloop/app.js";
  mount(document.getElementById("languageloop-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `languageloop:freeLimitHit` | `{ planCount }` | Second loop. |
| `languageloop:regenerate` | `{ planCount }` | Regenerate button. |
| `languageloop:upsellViewed` | `{ surface }` | Upsell view. |
| `languageloop:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/languageloop/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
