# LayoverLoop

2–4 hour layover playbooks with lounge picks, micro detours, and buffer math.

## What it does
LayoverLoop stitches together 2–4 hour airport gaps into intentional micro adventures with buffer math, lounge cues, and deterministic share links.

## Flow
- Pick a layover city, length, vibe, and transit comfort.
- LayoverLoop sketches arrival reset, city loop, and return glide cards.
- Copy/share the plan or regenerate until the vibe hits.

## Free vs Pro
**Free**
- One fresh layover loop per day.
- Transit timers and buffer reminders baked in.

**Pro**
- Offline PDF cards + SMS buffer alerts.
- Saved airport presets + lounge perk reminders.
- Unlimited regenerations.

## Screenshot or Loom
![LayoverLoop screenshot](../../docs/screenshots/layoverloop.svg)

## Who it's for
Travel/loyalty apps that need a turnkey layover concierge.

## Monetization
Free plan covers one loop per day; Pro unlocks offline cards, saved presets, and lounge perk nudges.

## Run locally
```
python3 -m http.server 8080 -d apps/travel/layoverloop
```

## QA checklist (Phase 2)
- [ ] Verify share link copy works inside host WebView clipboard bridges.
- [ ] Simulate `state.isSubscribed` toggles to ensure upsell banner gating.
- [ ] Check layout at 360–420px widths (cards should stack cleanly).

## Monetization instrumentation
- `layoverloop:freeLimitHit` – User regenerates more than one loop.
- `layoverloop:regenerate` – Tap Regenerate in share row.
- `layoverloop:upsellViewed` – Upsell banner enters view.
- `layoverloop:upsellClicked` – Upgrade CTA tapped.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
