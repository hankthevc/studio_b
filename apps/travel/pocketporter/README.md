# PocketPorter

AI packing buddy that generates airline-compliant carry-on lists with vibe-specific categories, compliance banner, share links, and upsell hooks.

## What it does
- Collects destination, dates, vibe, airline, and notes.
- Generates deterministic packing categories with checkboxes, compliance status, weather tip, and share link.
- Mirrors TripSpark UX patterns (hero → loader → cards → upsell).

## Who it's for
Travel hosts and frequent flyers who need a polished packing assistant embedded inside their app.

## Monetization
Free unlimited quick lists; PocketPorter Pro unlocks saved wardrobes, airline auto-detection, and partner sharing history.

## Run locally
```
python3 -m http.server 8080 -d apps/travel/pocketporter
# Visit http://localhost:8080
```
