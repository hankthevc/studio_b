# LiftShift

AI strength coach that builds adaptive 4-day blocks with warmups, main sets, finishers, and recovery cues based on your focus, equipment, and schedule.

## What it does
- Collects focus, equipment, days per week, and desired session length.
- Generates deterministic block cards with movement lists and estimated minutes.
- Surfaces recovery/deload cues plus share/regenerate + upsell hooks.

## Who it's for
Intermediate lifters who want structured programming without spreadsheets and host apps that embed training utilities.

## Monetization
Free preview block; LiftShift Pro unlocks 8-week cycles, saved progressions, and export/share upgrades.

## Run locally
```
python3 -m http.server 8080 -d apps/fitness/liftshift
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Focus selection required; helper/focus verified when empty.
- [x] Keyboard navigation covers selects, equipment tags, sliders, CTA, share/export buttons.
- [x] Responsive at 375px; day cards and recovery list stack vertically without overflow.
- [x] Copy matches `UX_NOTES.md` across CTA, highlight, share row, upsell copy.
- [x] Color contrast + `prefers-reduced-motion` handled via shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/fitness/liftshift` (curl port 8104 on 2025-11-15).

## Monetization instrumentation
- `liftshift:freeLimitHit` – fires when the free block limit is exceeded.
- `liftshift:regenerate` – fires when the user regenerates a block.
- `liftshift:export` – fires when a Pro user exports/ tracks a block.
- `liftshift:upsellViewed` – fires whenever upsell surfaces show (post-plan, export button).
- `liftshift:upsellClicked` – fires when the upgrade CTA is tapped.

## Embed & Host Enablement
- See `EMBED.md` for integration snippet, analytics wiring, theming knobs, and rollout QA checklist.
