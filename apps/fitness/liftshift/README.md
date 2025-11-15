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
