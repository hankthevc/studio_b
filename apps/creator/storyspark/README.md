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
