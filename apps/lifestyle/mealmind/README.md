# MealMind

AI meal planner delivering 3-day preview menus, macro snapshots, and grocery shortlists based on diet, calories, and prep effort.

## What it does
- Collects diet, calorie target, effort, household size, and dislikes.
- Generates deterministic meal cards (breakfast/lunch/dinner), macro overview, and grocery shortlist.
- Provides share/regenerate actions plus upsell flows for full-week unlocks.

## Who it's for
Health-conscious users and host apps offering wellness utilities that need quick, embeddable planning.

## Monetization
Free 3-day preview; MealMind Pro unlocks full weeks, saved households, seasonal swaps, and grocery exports.

## Run locally
```
python3 -m http.server 8080 -d apps/lifestyle/mealmind
# Visit http://localhost:8080
```
