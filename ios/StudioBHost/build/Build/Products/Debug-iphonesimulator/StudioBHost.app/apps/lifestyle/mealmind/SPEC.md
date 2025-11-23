# SPEC — MealMind

## Problem
Busy professionals want balanced meals with grocery guidance without juggling recipes, macros, and prep time.

## Target user
Health-conscious individuals planning for themselves or small households who need quick weekly direction on mobile.

## Use cases
- Enter diet preference, calorie target, prep effort, and household size to receive a 3-day preview plan.
- Show per-meal cards (breakfast/lunch/dinner) with calories, prep notes, and quick tips.
- Provide macro snapshot and grocery shortlist grouped by aisle.
- Offer upsell for full-week unlock, saved profiles, and grocery export.

## User stories
1. As a user, I choose diet + effort level and instantly see meal cards for the next three days.
2. As a shopper, I copy the grocery shortlist into Notes with one tap.
3. As someone tweaking goals, I regenerate with a different calorie target without re-entering everything.
4. As a Pro subscriber, I unlock 7-day plans, saved households, and grocery exports.

## Success criteria
- Plan renders in under 30 seconds with loader referencing prep.
- Results include highlight card, day cards, macro overview, grocery shortlist, share row, and upsell.
- Copy button confirms with toast; upsell banner appears after first plan.
- Error helper prompts user to pick a diet/calorie target before generating.

## Monetization
Free: rolling 3-day preview. MealMind Pro ($5.99/mo placeholder) unlocks full weeks, saved profiles, seasonal swaps, and grocery exports.

## MVP checklist
- [ ] Mobile-first form (diet select, calories slider, prep effort pills, household size stepper, dislikes input)
- [ ] Deterministic plan generator backed by `callMealMindLLM`
- [ ] Day cards grouped by meals with calories + prep tags
- [ ] Macro snapshot card + grocery shortlist chips
- [ ] Share/regenerate row and upsell banner
- [ ] Toast + error states consistent with TripSpark
