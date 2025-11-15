# MealMind UX Notes

## Flow
1. **Hero + form.** Eyebrow `AI meal planner`, title `MealMind`, tagline about weekly balance. Form collects diet select, calorie slider (1400–2400), prep effort pills (Speedy/Balanced/Chef-y), household size stepper, and optional dislikes input.
2. **CTA interaction.** `Plan My Week` validates diet selection, disables CTA, shows loading card with utensil animation.
3. **Results.** Loader swaps for highlight card (“Chef’s pick”), day cards (Day 1–3 with meals), Macro snapshot card, Grocery shortlist card, share row, and upsell banner.
4. **Regenerate.** Button rebuilds plan using previous form values.
5. **Error/empty states.** Missing diet/calories show helper text `Choose a diet to plan your menu.` Clipboard fallback matches TripSpark.

## Wireframe
```
MealMind 🥗
AI meal planner
[Diet ▼]
[Calories slider + labels]
[Effort pills]
[Household stepper]
[Dislikes input]
[ Plan My Week ]

-- Loading --
┌ card ┐
| Prepping your preview menu...
| 🍴  🍴  🍴
└─────┘

-- Results --
Highlight card (Chef’s pick)
Day cards (Day X / Breakfast-Lunch-Dinner rows)
Macro snapshot card
Grocery shortlist card
Share row (link + Copy + Export)
Upsell banner
```

## Copy
- Eyebrow: `AI meal planner`
- CTA: `Plan My Week`
- Loader: `Prepping your preview menu...`
- Highlight eyebrow: `Chef’s pick`
- Meal labels: `Breakfast`, `Lunch`, `Dinner`
- Macro header: `Macro snapshot`
- Grocery header: `Grocery shortlist`
- Share label: `Share with your co-chef`
- Export CTA: `Export grocery list (Pro)`
- Upsell: `Upgrade for full-week menus, saved households, and grocery exports.`
- Error helper: `Choose a diet to plan your menu.`
