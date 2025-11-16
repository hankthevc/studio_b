# BillBreeze

Turns recurring bills into a cash-flow lane with alerts and 'safe to spend' coaching.

## What it does
BillBreeze visualizes recurring bills as a cash-flow lane with tips and safe-spend guidance.

## Flow
- Select income cadence and list bills.
- Review lane overview, focus bills, and next actions.
- Share link or regenerate when bills change.

## Free vs Pro
**Free**
- Track up to 6 bills.
- Manual updates.

**Pro**
- Unlimited bills.
- Projected balances + exports.
- Push alerts.

## Screenshot or Loom
![BillBreeze screenshot](../../docs/screenshots/billbreeze.svg)

## Who it's for
Neobank/budgeting apps embedding cash-flow clarity.

## Monetization
Free lane covers basic bills; Pro unlocks unlimited entries, alerts, and exports.

## Run locally
```
python3 -m http.server 8080 -d apps/finance/billbreeze
```

## QA checklist (Phase 2)
- [ ] Textarea validation + helper copy.
- [ ] Long strings wrap in cards.
- [ ] Events fire via share/regenerate.

## Monetization instrumentation
- `billbreeze:freeLimitHit` – More than one lane.
- `billbreeze:regenerate` – Regenerate.
- `billbreeze:upsellViewed` – Upsell shown.
- `billbreeze:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
