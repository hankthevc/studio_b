# FlowStreak

Daily three-wins board that celebrates streak momentum.

## What it does
FlowStreak recaps daily wins and nudges the next focus using deterministic copy.

## Flow
- List wins + pick energy/focus.
- FlowStreak renders celebration + next focus cards.
- Copy/share or regenerate.

## Free vs Pro
**Free**
- Single user board.
- Manual logging.

**Pro**
- Calendar/task sync.
- Widgets + team share.
- Unlimited boards.

## Screenshot or Loom
![FlowStreak screenshot](../../docs/screenshots/flowstreak.svg)

## Who it's for
Productivity/inbox apps embedding daily recap surfaces.

## Monetization
Free board per day; Pro unlocks sync, widgets, and sharing.

## Run locally
```
python3 -m http.server 8080 -d apps/productivity/flowstreak
```

## QA checklist (Phase 2)
- [ ] Textarea validation.
- [ ] Share row on Safari.
- [ ] Upsell gating after first run.

## Monetization instrumentation
- `flowstreak:freeLimitHit` – Second board same day.
- `flowstreak:regenerate` – Regenerate.
- `flowstreak:upsellViewed` – Upsell shown.
- `flowstreak:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
