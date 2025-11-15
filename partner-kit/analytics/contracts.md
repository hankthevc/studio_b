# Analytics Contracts (Segment-ready)

Send all events through **Segment `track`** calls using the namespaces below. Each event includes a `appSlug` so downstream destinations (Mixpanel, Amplitude, etc.) can filter easily.

## Field Guidelines
- `userId` or `anonymousId` per Segment standards.
- `properties.appSlug` – slug from `ideas.yaml` (e.g., `tripspark`).
- `properties.surface` – when applicable, string describing the UI surface that triggered the event.
- `properties.planCount`, `properties.puzzleCount`, etc. – integers representing cumulative usage during the session.

## Event Matrix

| App | Events & Sample Payload |
| --- | --- |
| TripSpark | `tripspark:freeLimitHit { planCount }`, `tripspark:regenerate { planCount }`, `tripspark:export { plan }`, `tripspark:upsellViewed { surface }`, `tripspark:upsellClicked {}` |
| PocketPorter | `pocketporter:freeLimitHit { planCount }`, `pocketporter:regenerate { planCount }`, `pocketporter:saveWardrobe { plan }`, `pocketporter:upsellViewed { surface }`, `pocketporter:upsellClicked {}` |
| SipSync | `sipsync:freeLimitHit { planCount }`, `sipsync:regenerate { planCount }`, `sipsync:smartBottleSync { plan }`, `sipsync:upsellViewed { surface }`, `sipsync:upsellClicked {}` |
| MealMind | `mealmind:freeLimitHit { planCount }`, `mealmind:regenerate { planCount }`, `mealmind:export { plan }`, `mealmind:savePreset { plan }`, `mealmind:upsellViewed { surface }`, `mealmind:upsellClicked {}` |
| StorySpark | `storyspark:freeLimitHit { planCount }`, `storyspark:regenerate { planCount }`, `storyspark:savePreset { plan }`, `storyspark:upsellViewed { surface }`, `storyspark:upsellClicked {}` |
| HookLab | `hooklab:freeLimitHit { planCount }`, `hooklab:regenerate { planCount }`, `hooklab:export { plan }`, `hooklab:savePreset { variant }`, `hooklab:upsellViewed { surface }`, `hooklab:upsellClicked {}` |
| FocusTiles | `focustiles:freeLimitHit { planCount }`, `focustiles:regenerate { planCount }`, `focustiles:saveRhythm { plan }`, `focustiles:logSession { tile }`, `focustiles:upsellViewed { surface }`, `focustiles:upsellClicked {}` |
| PrepCoach | `prepcoach:freeLimitHit { planCount }`, `prepcoach:regenerate { planCount }`, `prepcoach:export { plan }`, `prepcoach:upsellViewed { surface }`, `prepcoach:upsellClicked {}` |
| MoneyMicro | `moneymicro:freeLimitHit { calcCount }`, `moneymicro:regenerate { calcCount }`, `moneymicro:export { scenario }`, `moneymicro:upsellViewed { surface }`, `moneymicro:upsellClicked {}` |
| BrainBite | `brainbite:freeLimitHit { puzzleCount }`, `brainbite:regenerate { puzzleCount }`, `brainbite:archiveExport { puzzle }`, `brainbite:shieldApplied { streak }`, `brainbite:upsellViewed { surface }`, `brainbite:upsellClicked {}` |
| LiftShift | `liftshift:freeLimitHit { planCount }`, `liftshift:regenerate { planCount }`, `liftshift:export { plan }`, `liftshift:upsellViewed { surface }`, `liftshift:upsellClicked {}` |

## KPI Suggestions

| Metric | Description | Event Source |
| --- | --- | --- |
| Activation Rate | % of sessions completing first plan/puzzle. | Count of `* :regenerate` or initial plan render vs sessions. |
| Conversion Intent | # of upsell impressions per user. | `*:upsellViewed` grouped by `surface`. |
| Pro Action Rate | % of subscribed sessions using a Pro feature. | `export`, `savePreset`, `saveWardrobe`, `smartBottleSync`, etc. |
| Retention Proxy | How often free users hit the limit. | `*:freeLimitHit` aggregated per user/week. |

Use these KPIs to feed dashboards once Segment forwards to your analytics destination.

