# HabitGrid

3–5 habit tracker with heatmap grid and friendly streak nudges.

## What it does
HabitGrid paints a three-habit heatmap with deterministic coaching copy.

## Flow
- List habits and choose streak length.
- Pick tone + reminder to generate the grid plan.
- Copy link or regenerate for another tone.

## Free vs Pro
**Free**
- Single grid.
- Basic reminder copy.

**Pro**
- Multi-grid & partner mode.
- Exports + themes.
- Unlimited regenerations.

## Screenshot or Loom
![HabitGrid screenshot](../../docs/screenshots/habitgrid.svg)

## Who it's for
Wellness/lifestyle apps embedding streak trackers.

## Monetization
Free supports one grid; Pro unlocks unlimited boards, exports, and accountability invites.

## Run locally
```
python3 -m http.server 8080 -d apps/lifestyle/habitgrid
```

## QA checklist (Phase 2)
- [ ] Ensure textarea validation messaging.
- [ ] Check share row copy on mobile.
- [ ] Verify upsell toggles after plan.

## Monetization instrumentation
- `habitgrid:freeLimitHit` – Multiple plan attempts.
- `habitgrid:regenerate` – Regenerate tapped.
- `habitgrid:upsellViewed` – Upsell shown.
- `habitgrid:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
