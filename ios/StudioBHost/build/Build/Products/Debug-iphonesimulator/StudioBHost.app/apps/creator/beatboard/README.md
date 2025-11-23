# BeatBoard

Produces short audio hooks tuned to vibe sliders for reels or pods.

## What it does
BeatBoard outputs descriptive hook briefs for short-form content.

## Flow
- Pick vibe/length/use case/energy.
- Review sonic palette, hook structure, and tips.
- Share or regenerate.

## Free vs Pro
**Free**
- Three hooks/day.

**Pro**
- Unlimited hooks.
- Stems & favorites.
- Licensing notes.

## Screenshot or Loom
![BeatBoard screenshot](../../docs/screenshots/beatboard.svg)

## Who it's for
Creator/music tools needing deterministic prompts.

## Monetization
Free includes three hooks; Pro unlocks stems, favorites, unlimited runs.

## Run locally
```
python3 -m http.server 8080 -d apps/creator/beatboard
```

## QA checklist (Phase 2)
- [ ] Dropdown defaults.
- [ ] Clipboard share.
- [ ] Upsell gating.

## Monetization instrumentation
- `beatboard:freeLimitHit` – More than three hooks.
- `beatboard:regenerate` – Regenerate button.
- `beatboard:upsellViewed` – Upsell shown.
- `beatboard:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
