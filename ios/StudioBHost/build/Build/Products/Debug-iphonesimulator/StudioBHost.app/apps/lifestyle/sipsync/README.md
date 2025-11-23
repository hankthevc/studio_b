# SipSync

AI hydration coach that maps daily cadence, flavor boosts, travel tips, and shareable reminders in the TripSpark design language.

## What it does
- Collects wake/sleep times, activity level, flavor mood, and travel mode.
- Generates deterministic timeline cards, flavor chips, travel tip, share link, and upsell banner.
- Keeps UX lightweight for host-app WebViews.

## Who it's for
Wellness partners and users who want gentle, mobile-first hydration nudges.

## Monetization
Free baseline cadence; SipSync Pro adds smart bottle sync, streak boosts, and travel presets.

## Run locally
```
python3 -m http.server 8080 -d apps/lifestyle/sipsync
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Wake/sleep validation ensures both times exist before syncing; helper text displays with focus.
- [x] Keyboard navigation covers time inputs, selects, tags, and share buttons.
- [x] Responsive at 375px with scroll-friendly stacking; no layout shifts.
- [x] Copy/labels match `UX_NOTES.md` (CTA, highlight labels, flavor/travel copy).
- [x] Color contrast + `prefers-reduced-motion` handled via shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/lifestyle/sipsync` (verified via curl 2025-11-14).

## Monetization instrumentation
- `sipsync:freeLimitHit` – fired after the free cadence limit is exceeded.
- `sipsync:smartBottleSync` – fired when Pro users sync their smart bottle cadence.
- `sipsync:upsellViewed` – fired when upsell surfaces appear (post-plan, smart bottle button).
- `sipsync:upsellClicked` – fired when upgrade CTA is tapped.
- `sipsync:regenerate` – fired whenever the cadence is regenerated.

## Embed & Host Enablement
- Review `EMBED.md` for integration snippets, event wiring guidance, theming knobs, and rollout QA steps.

## Flow
- Set context with the mini-app form.
- Review the deterministic plan/cards it generates.
- Share, embed, or regenerate as needed.

## Free vs Pro
**Free**
- baseline reminders

**Pro**
- syncs smart bottles, tracks streak perks, and unlocks travel modes.

## Screenshot or Loom
![SipSync screenshot](../../docs/screenshots/sipsync.svg)

