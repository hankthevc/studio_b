# SPEC — PocketPorter

## Problem
Carry-on travelers juggle weather apps, airline rules, and personal routines, leading to forgotten essentials and overweight bags.

## Target user
Frequent flyers and weekenders who want a confident, airline-compliant packing list in under a minute.

## Use cases
- Input destination, dates, trip vibe, and airline to get a category-organized packing list.
- Highlight must-pack vs optional items, plus compliance callouts (liquids, weight).
- Provide a short share link for partners.
- Upsell to save wardrobes, recurring trips, and automatic airline reminders.

## User stories
1. As a traveler, I enter destination + dates and get climate-aware categories with item counts.
2. As a carry-on flyer, I see a compliance banner telling me if I’m over limits before I pack.
3. As someone coordinating with a partner, I copy a short link or regenerate for a different vibe.
4. As a subscriber, I save favorite wardrobes for one-tap reuse.

## Success criteria
- First list generated in <25 seconds and <6 taps.
- Each result shows categories with checkboxes and Required/Optional badges.
- Compliance banner surfaces if weather swings or airline limits are tight.
- Share link copies successfully with toast; upsell appears after first plan.

## Monetization
Free tier: unlimited quick lists with manual tweaks. PocketPorter Pro ($3.99/mo placeholder) unlocks saved wardrobes, airline auto-detection, and partner sharing history.

## MVP checklist
- [ ] Mobile-first form (destination input, date picker stub, vibe tags, airline select, optional note)
- [ ] Deterministic list generator tied to climate + vibe seeds
- [ ] Category cards with inline checkboxes + badge chips
- [ ] Compliance/alert banner
- [ ] Share row (readonly URL + copy + regenerate)
- [ ] Upsell banner triggered after first plan
