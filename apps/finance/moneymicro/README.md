# MoneyMicro

Micro affordability calculator that shows the monthly impact of a purchase versus your savings goal.

## What it does
- Captures purchase price, down payment, financing plan, goal, and timeline.
- Calculates verdict (On track/Tight fit/Hold off), timeline rows, and smart saver tip.
- Provides share/regenerate controls plus upsell for saved scenarios.

## Who it's for
Consumers and host apps that need an embeddable “can I afford this?” moment ahead of checkout.

## Monetization
Free unlimited quick calcs; MoneyMicro Pro unlocks saved scenarios, advisor nudges, and export.

## Run locally
```
python3 -m http.server 8080 -d apps/finance/moneymicro
# Visit http://localhost:8080
```

## QA checklist (Phase 2)
- [x] Price input required; helper + focus verified.
- [x] Keyboard navigation covers price/down payment inputs, selects, slider, share buttons.
- [x] Responsive at 375px; verdict/timeline cards stack vertically.
- [x] Copy matches `UX_NOTES.md` (CTA, verdict states, tip copy, share label).
- [x] Color contrast respects AA, and animations honor `prefers-reduced-motion`.
- [x] Local QA server `python3 -m http.server 8080 -d apps/finance/moneymicro` (curl port 8101 on 2025-11-14).

## Monetization instrumentation
- `moneymicro:freeLimitHit` – fires when a free user exceeds the saved scenario limit.
- `moneymicro:regenerate` – fires whenever the user re-runs a scenario.
- `moneymicro:export` – fires when a Pro user exports or saves a scenario.
- `moneymicro:upsellViewed` – fires when upsell surfaces show (post-scenario + export button).
- `moneymicro:upsellClicked` – fires when the upgrade CTA is tapped.

## Embed & Host Enablement
- Review `EMBED.md` for drop-in snippet, analytics wiring guidance, theming knobs, and rollout QA checklist.
