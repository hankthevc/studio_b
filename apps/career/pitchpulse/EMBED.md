# PitchPulse Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/career/pitchpulse/styles.css" />
<div id="pitchpulse-root"></div>
<script type="module">
  import { mount } from "/apps/career/pitchpulse/app.js";
  mount(document.getElementById("pitchpulse-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `pitchpulse:freeLimitHit` | `{ planCount }` | Multiple drafts. |
| `pitchpulse:regenerate` | `{ planCount }` | Regenerate pressed. |
| `pitchpulse:upsellViewed` | `{ surface }` | Upsell shown. |
| `pitchpulse:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/pitchpulse/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
