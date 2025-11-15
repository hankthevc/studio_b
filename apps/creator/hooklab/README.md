# HookLab

AI hook + thumbnail A/B generator for YouTube/TikTok creators, matching TripSpark-level polish.

## What it does
- Collects video idea, platform, vibe, and thumbnail keyword.
- Outputs Hook A/B with tone + metric hints plus thumbnail copy, share link, upsell.
- Deterministic logic (client-side) ready to swap with real LLM later.

## Who it's for
Creators, editors, and host apps embedding lightweight creative labs.

## Monetization
Free three hook sets/day; HookLab Pro unlocks unlimited variants, saved templates, and collaboration links.

## Run locally
```
python3 -m http.server 8080 -d apps/creator/hooklab
# Visit http://localhost:8080
```
