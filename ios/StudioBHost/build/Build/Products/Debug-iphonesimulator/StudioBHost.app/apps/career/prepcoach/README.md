# PrepCoach

AI mock interview coach that generates behavioral prompts, notes, and follow-ups, matching the TripSpark polish bar.

## What it does
- Collects role focus, seniority, company type, and optional strengths.
- Produces deterministic prompts with key angles, textarea draft space, coach notes, follow-up, share row, upsell.
- Keeps everything client-side with deterministic mocks for easy host integration.

## Who it's for
Career platforms or job seekers wanting mobile-first mock rounds.

## Monetization
Free three-question round; PrepCoach Pro unlocks full banks, saved answers, and recruiter-ready exports.

## Run locally
```
python3 -m http.server 8080 -d apps/career/prepcoach
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Role selection required; helper/focus behavior verified.
- [x] Keyboard navigation covers dropdown, slider, company tags, textarea, copy buttons, share row.
- [x] Responsive at 375px; prompt cards scroll vertically, no overflow.
- [x] Copy matches `UX_NOTES.md` (CTA text, highlight labels, notes/follow-up copy).
- [x] Color contrast meets AA; shared tokens handle motion preferences.
- [x] Local QA server `python3 -m http.server 8080 -d apps/career/prepcoach` (curl port 8099 on 2025-11-14).

## Monetization instrumentation
- `prepcoach:freeLimitHit` – fires when the free mock-round limit is exceeded.
- `prepcoach:regenerate` – fires whenever the user runs another round.
- `prepcoach:export` – fires when a Pro user exports answers (host should listen to trigger export flow).
- `prepcoach:upsellViewed` – fires when upsell surfaces appear (post-round, export button).
- `prepcoach:upsellClicked` – fires when the upgrade CTA is tapped.

## Embed & Host Enablement
- See `EMBED.md` for integration snippet, analytics wiring, theming knobs, and rollout QA checklist.

## Flow
- Set context with the mini-app form.
- Review the deterministic plan/cards it generates.
- Share, embed, or regenerate as needed.

## Free vs Pro
**Free**
- small question set

**Pro**
- unlocks full banks, saved answers, and recruiter export.

## Screenshot or Loom
![PrepCoach screenshot](../../docs/screenshots/prepcoach.svg)

