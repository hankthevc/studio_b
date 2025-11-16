# TempoBuddy

Micro pacer that builds tempo cues, playlist BPM, and recap notes.

## What it does
TempoBuddy programs micro pacers with BPM, interval cues, and recap prompts.

## Flow
- Enter terrain, distance, goal vibe, and playlist BPM.
- TempoBuddy outputs warmup, tempo wave, and cooldown cards.
- Share link with training partners or regenerate.

## Free vs Pro
**Free**
- One pacer per day.
- Manual editing only.

**Pro**
- Adaptive pacing + saved pacers.
- Watch pairing stub + audio cues.
- Long-run block suggestions.

## Screenshot or Loom
![TempoBuddy screenshot](../../docs/screenshots/tempobuddy.svg)

## Who it's for
Running/fitness platforms needing a quick pacing assistant.

## Monetization
Free pacer daily; Pro unlocks adaptive pacing, watch pairing, and unlimited runs.

## Run locally
```
python3 -m http.server 8080 -d apps/fitness/tempobuddy
```

## QA checklist (Phase 2)
- [ ] Validate text input required state.
- [ ] Ensure share CTA works inside host app.
- [ ] Check layout for longer copy strings.

## Monetization instrumentation
- `tempobuddy:freeLimitHit` – Second plan attempt.
- `tempobuddy:regenerate` – Regenerate button.
- `tempobuddy:upsellViewed` – Upsell shown.
- `tempobuddy:upsellClicked` – Upgrade pressed.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
