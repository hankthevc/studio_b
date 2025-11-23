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

## QA checklist (Phase 2)
- [x] Idea textarea required; helper/focus tested.
- [x] Keyboard navigation covers textarea, select, vibe tags, CTA, copy buttons.
- [x] Responsive at 375px; variant cards stack cleanly and scroll vertically.
- [x] Copy matches `UX_NOTES.md` (CTA, highlight label, share copy, upsell).
- [x] Color contrast + motion preferences handled via shared tokens.
- [x] Local QA server `python3 -m http.server 8080 -d apps/creator/hooklab` (curl port 8100 on 2025-11-14).

## Monetization instrumentation
- `hooklab:freeLimitHit` – emitted when free plan exceeds three hook sets.
- `hooklab:regenerate` – emitted when the user runs another set.
- `hooklab:export` – emitted when a Pro user exports hooks.
- `hooklab:savePreset` – emitted when a Pro user saves the recommended variant.
- `hooklab:upsellViewed` – emitted when upsell surfaces show (post-plan, export, highlight preset).
- `hooklab:upsellClicked` – emitted when the upgrade CTA is tapped.

## Embed & Host Enablement
- Review `EMBED.md` for integration snippet, analytics wiring, theming knobs, and rollout QA checklist.

## Flow
- Set context with the mini-app form.
- Review the deterministic plan/cards it generates.
- Share, embed, or regenerate as needed.

## Free vs Pro
**Free**
- three hooks/day

**Pro**
- offers deeper variants, saved templates, and collaboration links.

## Screenshot or Loom
![HookLab screenshot](../../docs/screenshots/hooklab.svg)

