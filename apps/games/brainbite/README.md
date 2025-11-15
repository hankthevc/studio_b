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
