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

## QA checklist (Phase 2)
- [x] Destination validation shows helper + focuses input.
- [x] Keyboard + screen reader labels confirmed for all inputs/buttons.
- [x] Responsive at 375px; no horizontal scroll; cards stack cleanly.
- [x] Copy matches `UX_NOTES.md` (CTA, compliance copy, share label, upsell).
- [x] Color contrast meets AA; animations respect `prefers-reduced-motion`.
- [x] Local QA server `python3 -m http.server 8080 -d apps/travel/pocketporter` (verified via curl 2025-11-14).
