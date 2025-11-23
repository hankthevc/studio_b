# TipTally

Tip + split calculator with local norms and round-up nudges.

## What it does
TipTally removes friction from tipping + splitting with deterministic math and friendly scripts.

## Flow
- Enter bill, service vibe, split count, and round-up preference.
- Review tip math, split breakdown, and script cards.
- Copy the share note or regenerate.

## Free vs Pro
**Free**
- Two calculations per day.
- Manual venue entry.

**Pro**
- Venue presets.
- Preferred splits.
- Expense export.

## Screenshot or Loom
![TipTally screenshot](../../docs/screenshots/tiptally.svg)

## Who it's for
Finance/payment apps embedding tip calculators.

## Monetization
Free tier covers two runs/day; Pro unlocks presets, exports, and unlimited runs.

## Run locally
```
python3 -m http.server 8080 -d apps/finance/tiptally
```

## QA checklist (Phase 2)
- [ ] Validate bill input formatting.
- [ ] Ensure analytics fire.
- [ ] Clipboard copy across Safari/Chrome.

## Monetization instrumentation
- `tiptally:freeLimitHit` – More than two calculations.
- `tiptally:regenerate` – Regenerate clicked.
- `tiptally:upsellViewed` – Upsell shown.
- `tiptally:upsellClicked` – Upgrade pressed.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
