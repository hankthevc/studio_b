# StorySpark

AI hook + caption generator that turns rough ideas into platform-ready copy with highlight hooks, alternates, captions, hashtags, share links, and upsell moments.

## What it does
- Collects an idea/draft, platform (IG/TikTok/Twitter), tone, and optional CTA.
- Generates deterministic highlight + alternate hooks, caption, and hashtag set.
- Mirrors TripSpark-quality UX: hero/form → loader → card stack → share/upsell.

## Who it's for
Creators, marketers, and host apps that embed lightweight AI copy helpers.

## Monetization
Free limited sparks per day; StorySpark Pro unlocks unlimited runs, preset banks, and tone tweaks.

## Run locally
```
python3 -m http.server 8080 -d apps/creator/storyspark
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Idea textarea required; helper shows + focus returns when empty.
- [x] Keyboard navigation hits textarea, select, tone pills, CTA, copy buttons.
- [x] Responsive layout tested at 375px; hook list scrolls vertically only.
- [x] Copy matches `UX_NOTES.md` (CTA, highlight labels, toasts, share copy).
- [x] Color contrast + `prefers-reduced-motion` inherited from shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/creator/storyspark` (verified via curl 2025-11-14).
