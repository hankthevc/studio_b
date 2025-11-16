# MeetingMinder Embed Kit

## Quick start
```html
<link rel="stylesheet" href="/shared/styles.css" />
<link rel="stylesheet" href="/shared/app-shell.css" />
<link rel="stylesheet" href="/apps/productivity/meetingminder/styles.css" />
<div id="meetingminder-root"></div>
<script type="module">
  import { mount } from "/apps/productivity/meetingminder/app.js";
  mount(document.getElementById("meetingminder-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
| `meetingminder:freeLimitHit` | `{ planCount }` | Multiple kits same day. |
| `meetingminder:regenerate` | `{ planCount }` | Regenerate. |
| `meetingminder:upsellViewed` | `{ surface }` | Upsell revealed. |
| `meetingminder:upsellClicked` | `{}` | Upgrade CTA. |

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/meetingminder/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
