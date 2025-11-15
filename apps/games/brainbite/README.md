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
