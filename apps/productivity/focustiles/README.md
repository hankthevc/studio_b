# FocusTiles

Adaptive Pomodoro-inspired tile planner that aligns tile lengths to your energy and goal.

## What it does
- Collects theme, energy, block length, soundtrack, and optional goal.
- Generates highlight tile + stack, flow score, reset tip, and share link.
- Provides log/regenerate actions plus upsell for analytics/custom rhythms.

## Who it's for
Remote workers, students, and productivity host apps needing a mobile-first focus companion.

## Monetization
Free single workspace; FocusTiles Pro unlocks analytics, custom rhythms, and calendar syncing.

## Run locally
```
python3 -m http.server 8080 -d apps/productivity/focustiles
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Idea/goal optional, but theme + energy validation confirmed (helper + focus).
- [x] Keyboard navigation covers dropdown, energy tags, slider, CTA, tile buttons.
- [x] Responsive at 375px; tiles stack, flow cards scroll vertically.
- [x] Copy matches `UX_NOTES.md` (CTA, highlight labels, share copy).
- [x] Contrast + motion preferences handled via shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/productivity/focustiles` (curl port 8103 on 2025-11-14).
