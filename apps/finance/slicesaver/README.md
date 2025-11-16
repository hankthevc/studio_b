# SliceSaver

Bill-splitting optimizer with fairness insights and reminder scripts.

## What it does
SliceSaver calculates group splits with fairness context and reminder scripts.

## Flow
- Select crew size and total.
- Choose tone + due to generate plan.
- Copy share note or regenerate.

## Free vs Pro
**Free**
- Single active split.
- Manual tracking.

**Pro**
- Household library.
- Balance tracker + exports.
- Automated nudges.

## Screenshot or Loom
![SliceSaver screenshot](../../docs/screenshots/slicesaver.svg)

## Who it's for
Finance/banking apps embedding smart split flows.

## Monetization
Free handles one split; Pro stores households, tracks balances, and automates reminders.

## Run locally
```
python3 -m http.server 8080 -d apps/finance/slicesaver
```

## QA checklist (Phase 2)
- [ ] Test text input validation.
- [ ] Verify share row messaging.
- [ ] Check analytics events fire.

## Monetization instrumentation
- `slicesaver:freeLimitHit` – Multiple splits.
- `slicesaver:regenerate` – Regenerate pressed.
- `slicesaver:upsellViewed` – Upsell displayed.
- `slicesaver:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
