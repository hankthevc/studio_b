# ClipChoreo

Transforms an idea into a three-shot storyboard with on-screen text guidance.

## What it does
ClipChoreo converts prompts into deterministic three-shot storyboards with text overlays.

## Flow
- Enter concept/platform/pace/tone.
- Review shot cards and tips.
- Copy share link.

## Free vs Pro
**Free**
- One board/day.

**Pro**
- Unlimited boards.
- Brand kits + exports.
- Asset download stubs.

## Screenshot or Loom
![ClipChoreo screenshot](../../docs/screenshots/clipchoreo.svg)

## Who it's for
Creator tools needing polished storyboard scaffolds.

## Monetization
Free board per day; Pro adds brand kits, exports, unlimited regen.

## Run locally
```
python3 -m http.server 8080 -d apps/creator/clipchoreo
```

## QA checklist (Phase 2)
- [ ] Text input validation.
- [ ] Ensure share row uses clipboard fallback.
- [ ] Upsell gating.

## Monetization instrumentation
- `clipchoreo:freeLimitHit` – Second board.
- `clipchoreo:regenerate` – Regenerate.
- `clipchoreo:upsellViewed` – Upsell reveal.
- `clipchoreo:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
