# PocketPorter UX Notes

## Flow
1. **Hero + form:** Eyebrow `AI packing buddy`, title `PocketPorter`, tagline about optimized carry-ons. Form fields: destination text, optional dates, vibe tags (Business/Leisure/Adventure), airline select, optional must-pack notes.
2. **CTA interaction:** `Pack My Bag` validates destination, disables CTA, shows loading card with animated luggage icons.
3. **Results:** Compliance banner, category cards (Essentials, Clothing, Activities, Tech, Documents), weather tip card, share row, upsell banner.
4. **Regenerate:** Button rebuilds using last inputs/vibe.
5. **Error states:** Missing destination triggers helper `Add a destination to start packing.` Clipboard fallback mirrors TripSpark.

## Wireframe
```
PocketPorter ✈️
AI packing buddy
[Destination][Dates]
[Vibe pills]
[Airline select]
[Must-pack notes]
[ Pack My Bag ]

-- Loading --
┌ card ┐
| Curating the perfect carry-on... |
| 🧳  🧳  🧳                        |
└──────┘

-- Results --
Compliance banner (icon + summary)
Category cards with checkboxes/badges
Weather tip card
Share row + upsell banner
```

## Copy
- CTA: `Pack My Bag`
- Loader: `Curating the perfect carry-on...`
- Compliance header: `Carry-on check`
- Category labels: `Essentials`, `Clothing`, `Activities`, `Tech`, `Documents`
- Share label: `Send to travel buddies`
- Upsell: `Save wardrobes & auto-sync airlines`
- Error helper: `Add a destination to start packing.`
