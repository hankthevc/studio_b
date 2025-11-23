# PulsePath

Adaptive HIIT builder that adjusts pacing to energy, gear, and burn goals.

## What it does
PulsePath assembles deterministic HIIT plans keyed to gear, goals, and current energy.

## Flow
- Select session goal, gear, and time block.
- Get a three-block plan with work/rest cues.
- Copy/share or regenerate with new intensity.

## Free vs Pro
**Free**
- One interval plan daily.
- Manual tweaks only.

**Pro**
- Adaptive difficulty + saved sessions.
- Health app export stubs.
- Unlimited daily plans.

## Screenshot or Loom
![PulsePath screenshot](../../docs/screenshots/pulsepath.svg)

## Who it's for
Fitness/connected equipment apps embedding quick HIIT brains.

## Monetization
Free plan offers one deterministic stack; Pro unlocks adaptive progressions, exports, and saves.

## Run locally
```
python3 -m http.server 8080 -d apps/fitness/pulsepath
```

## QA checklist (Phase 2)
- [ ] Slider/select validation for each field.
- [ ] Ensure share row copy works on mobile Safari.
- [ ] Confirm upsell gating after first plan.

## Monetization instrumentation
- `pulsepath:freeLimitHit` – User tries second plan.
- `pulsepath:regenerate` – Regenerate tapped.
- `pulsepath:upsellViewed` – Upsell shown post-plan.
- `pulsepath:upsellClicked` – Upgrade CTA clicked.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
