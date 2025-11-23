# RestNest

Ten-minute wind-down routines blending breath, journaling, and ambient cues.

## What it does
RestNest guides a 10-minute wind-down ritual combining breath, journaling, and sensory cues.

## Flow
- Choose tonight’s vibe, room, and time.
- Review arrival, journaling, and drift cards.
- Share with partners or regenerate.

## Free vs Pro
**Free**
- One nightly routine.
- Basic ambient suggestion.

**Pro**
- Multi-night playlists.
- Partner sharing.
- Soundscape downloads.

## Screenshot or Loom
![RestNest screenshot](../../docs/screenshots/restnest.svg)

## Who it's for
Sleep/wellness apps embedding nightly routines.

## Monetization
Free nightly routine; Pro unlocks stacks, audio, and partner sync.

## Run locally
```
python3 -m http.server 8080 -d apps/lifestyle/restnest
```

## QA checklist (Phase 2)
- [ ] Verify chips accessible.
- [ ] Check share link default text.
- [ ] Ensure upsell toggles after render.

## Monetization instrumentation
- `restnest:freeLimitHit` – Multiple routines per night.
- `restnest:regenerate` – Regenerate pressed.
- `restnest:upsellViewed` – Upsell in view.
- `restnest:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
