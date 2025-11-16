# Analytics Contracts (Segment-ready)

Send all events through **Segment `track`** calls using the namespaces below. Each event includes a `appSlug` so downstream destinations (Mixpanel, Amplitude, etc.) can filter easily.

## Field Guidelines
- `userId` or `anonymousId` per Segment standards.
- `properties.appSlug` – slug from `ideas.yaml` (e.g., `tripspark`).
- `properties.surface` – when applicable, string describing the UI surface that triggered the event.
- `properties.planCount`, `properties.puzzleCount`, etc. – integers representing cumulative usage during the session.

## Core Event Contract (All Apps)
Every mini-app mounted through `shared/appShell.js` emits the following events automatically:

| Event | Payload | Description |
| --- | --- | --- |
| `slug:shareCopied` | `{}` | Fired when a user copies the share link from the results row. |
| `slug:regenerate` | `{}` | Triggered when the user taps **Regenerate** (share row) to request another deterministic plan. |
| `slug:freeLimitHit` | `{ count }` | Emitted when the session exceeds `freePlanLimit`. Use `properties.count` to understand how many generations occurred. |
| `slug:upsellViewed` | `{ surface }` | Dispatches when the upsell banner becomes visible. `surface` indicates where (`results`, `postPlan`, etc.). |
| `slug:upsellClicked` | `{}` | Fires when the user taps the upsell CTA (host should launch billing modal and flip subscription state). |

These five events exist for **all 30 apps** (TripSpark through PitchPulse) and should be wired into Segment before pilots begin.

## App-Specific Extensions
Some apps expose additional actions beyond the shared contract. Instrument those events to capture deeper intent:

| App | Additional Events |
| --- | --- |
| TripSpark | `tripspark:export { plan }` |
| PocketPorter | `pocketporter:saveWardrobe { plan }` |
| SipSync | `sipsync:smartBottleSync { plan }` |
| MealMind | `mealmind:export { plan }`, `mealmind:savePreset { plan }` |
| StorySpark | `storyspark:savePreset { plan }` |
| HookLab | `hooklab:export { plan }`, `hooklab:savePreset { variant }` |
| FocusTiles | `focustiles:saveRhythm { plan }`, `focustiles:logSession { tile }` |
| PrepCoach | `prepcoach:export { plan }` |
| MoneyMicro | `moneymicro:export { scenario }` |
| BrainBite | `brainbite:archiveExport { puzzle }`, `brainbite:shieldApplied { streak }` |

Future custom events (e.g., `slicesaver:reminderQueued`, `flowstreak:winLogged`) should use the same `slug:eventName` naming scheme and be added to this table once implemented.

## KPI Suggestions

| Metric | Description | Event Source |
| --- | --- | --- |
| Activation Rate | % of sessions completing first plan/puzzle. | Count of `* :regenerate` or initial plan render vs sessions. |
| Conversion Intent | # of upsell impressions per user. | `*:upsellViewed` grouped by `surface`. |
| Pro Action Rate | % of subscribed sessions using a Pro feature. | `export`, `savePreset`, `saveWardrobe`, `smartBottleSync`, etc. |
| Retention Proxy | How often free users hit the limit. | `*:freeLimitHit` aggregated per user/week. |

Use these KPIs to feed dashboards once Segment forwards to your analytics destination.

