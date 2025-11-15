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
