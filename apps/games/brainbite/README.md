# BrainBite

Daily micro-puzzle that serves one tailored challenge with hints, streak tracking, and share links.

## What it does
- Collects category, difficulty, and puzzle type.
- Generates deterministic puzzle prompt, input (choice/free), hint, reveal, and streak summary.
- Offers share/regenerate controls plus upsell for archives/streak shields.

## Who it's for
Host apps needing a snackable cognitive moment that keeps users returning daily.

## Monetization
Free daily bite; BrainBite Pro unlocks archives, streak shields, and custom categories.

## Run locally
```
python3 -m http.server 8080 -d apps/games/brainbite
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Idea/category required; helper/focus verified when empty.
- [x] Keyboard navigation covers select, difficulty tags, type toggle, submit, hint/reveal/copy buttons.
- [x] Responsive at 375px; puzzle + streak cards stack vertically with comfortable scroll.
- [x] Copy/labels match `UX_NOTES.md` (button text, toasts, share copy, upsell).
- [x] Contrast + motion handled via shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/games/brainbite` (curl port 8102 on 2025-11-14).

## Monetization instrumentation
- `brainbite:freeLimitHit` – fires when a free user runs more than three bites.
- `brainbite:regenerate` – fires each time the user requests another puzzle.
- `brainbite:archiveExport` – fires when a Pro user unlocks/downloads archives.
- `brainbite:shieldApplied` – fires when a Pro user protects their streak.
- `brainbite:upsellViewed` – fires when upsell surfaces show (post-puzzle, archive button, streak shield).
- `brainbite:upsellClicked` – fires when the upgrade CTA is tapped.
