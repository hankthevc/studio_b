# MealMind

AI meal planner delivering 3-day preview menus, macro snapshots, and grocery shortlists based on diet, calories, and prep effort.

## What it does
- Collects diet, calorie target, effort, household size, and dislikes.
- Generates deterministic meal cards (breakfast/lunch/dinner), macro overview, and grocery shortlist.
- Provides share/regenerate actions plus upsell flows for full-week unlocks.

## Who it's for
Health-conscious users and host apps offering wellness utilities that need quick, embeddable planning.

## Monetization
Free 3-day preview; MealMind Pro unlocks full weeks, saved households, seasonal swaps, and grocery exports.

## Run locally
```
python3 -m http.server 8080 -d apps/lifestyle/mealmind
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Diet required; helper/focus verified on empty submit.
- [x] Keyboard navigation covers selects, range slider, effort/household buttons, CTA, share/export buttons.
- [x] Responsive at 375px; day cards stack, grocery chips wrap without overflow.
- [x] Copy matches `UX_NOTES.md` (CTA text, highlight copy, toasts).
- [x] Color contrast + motion preferences respect shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/lifestyle/mealmind` (curl port 8097 on 2025-11-14).

## Monetization instrumentation
- `mealmind:freeLimitHit` – fires when a free user plans beyond the preview limit.
- `mealmind:regenerate` – fires whenever the user tweaks/regenerates a plan.
- `mealmind:export` – fires when a Pro user exports the grocery list.
- `mealmind:savePreset` – fires when a Pro user saves the household preset.
- `mealmind:upsellViewed` – fires when upsell surfaces show (post-plan, preset button, export button).
- `mealmind:upsellClicked` – fires when the upgrade CTA is tapped.

## Embed & Host Enablement
- See `EMBED.md` for integration snippet, analytics wiring, theming knobs, and rollout QA checklist.
