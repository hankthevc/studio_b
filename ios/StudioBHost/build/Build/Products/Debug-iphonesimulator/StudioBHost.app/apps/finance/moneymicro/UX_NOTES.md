# MoneyMicro UX Notes

## Flow
1. **Hero + form.** Eyebrow `AI finance check`, title `MoneyMicro`, tagline about affordability clarity. Form fields: purchase price input, down payment input, financing select (Cash, 6-month, 12-month), savings goal slider, timeline tags (3/6/12 months), optional note.
2. **CTA interaction.** `Check Impact` validates price, shows loading card with coin animation, then reveals results.
3. **Results state.** Stack includes verdict card (status chip + summary), impact timeline card (Month vs Balance), Adjustment tips card, share row, upsell banner.
4. **Regenerate.** Button refreshes using last inputs for quick scenario tweaks.
5. **Error states.** Missing price triggers helper text `Add a price to check impact.` Copy fallback same as TripSpark.

## Wireframe
```
MoneyMicro 💸
AI finance check
[Price input] [Down payment]
[Financing dropdown]
Goal slider (0 → 5k)
Timeline tags (3 / 6 / 12 mo)
[Optional note]
[ Check Impact ]

-- Loading --
┌ card ┐
| Crunching the monthly ripple...
| ● ● ●
└──────┘

-- Results --
Verdict card (chip + summary)
Timeline card (rows for Month 0 / Goal / After purchase)
Adjustment tips card
Share row (link + buttons)
Upsell banner
```

## Copy
- Eyebrow: `AI finance check`
- CTA: `Check Impact`
- Loader: `Crunching the monthly ripple...`
- Verdict states: `On track`, `Tight fit`, `Hold off`
- Timeline header: `Impact timeline`
- Adjustment header: `Smart saver tip`
- Share label: `Share this scenario`
- Export CTA: `Save & export (Pro)`
- Upsell: `Upgrade for saved scenarios and advisor nudges.`
- Error helper: `Add a price to check impact.`
