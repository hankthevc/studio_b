# PitchPulse

Elevator-pitch builder scoring clarity and trimming tips.

## What it does
PitchPulse builds elevator pitches with clarity scoring and trim tips.

## Flow
- Select audience/tone/time/focus.
- Review draft, trim tips, and follow-up card.
- Copy or regenerate.

## Free vs Pro
**Free**
- One pitch saved.

**Pro**
- Role profile library.
- Rehearsal timers + share links.
- Unlimited regenerations.

## Screenshot or Loom
![PitchPulse screenshot](../../docs/screenshots/pitchpulse.svg)

## Who it's for
Career/networking products embedding pitch prep.

## Monetization
Free draft; Pro unlocks saved profiles, rehearsal, and sharing.

## Run locally
```
python3 -m http.server 8080 -d apps/career/pitchpulse
```

## QA checklist (Phase 2)
- [ ] Select defaults.
- [ ] Share row copy.
- [ ] Upsell gating.

## Monetization instrumentation
- `pitchpulse:freeLimitHit` – Multiple drafts.
- `pitchpulse:regenerate` – Regenerate pressed.
- `pitchpulse:upsellViewed` – Upsell shown.
- `pitchpulse:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
