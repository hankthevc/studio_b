# SPEC — MoneyMicro

## Problem
Everyday buyers struggle to understand how a discretionary purchase impacts their monthly budget and savings goals.

## Target user
Budget-conscious adults evaluating $50–$2,000 purchases who want clarity before checking out.

## Use cases
- Enter purchase price, down payment, financing option, savings goal, and desired timeline to see monthly impact.
- Present verdict card (On track / Tight fit / Hold off) plus a monthly timeline view and recommended adjustments.
- Provide shareable micro-report for partners or co-buyers.
- Upsell for saved scenarios, advisor-style nudges, and export.

## User stories
1. As a user, I input purchase details and instantly see whether it fits my monthly plan.
2. As someone splitting costs, I adjust contribution sliders and regenerate for clarity.
3. As a planner, I copy the scenario link.
4. As a Pro subscriber, I save scenarios and access advisor recommendations.

## Success criteria
- Calculator flow completes in under 20 seconds and <5 taps.
- Verdict card always surfaces with status chip + summary.
- Timeline rows show at least three months (current, target month, after-purchase).
- Share row copies link; upsell banner appears after first scenario.

## Monetization
Free: unlimited quick calculations. MoneyMicro Pro ($3.49/mo placeholder) unlocks saved scenarios, advisor nudges, and export.

## MVP checklist
- [ ] Form collecting price, down payment, financing select, savings goal slider, timeline tags
- [ ] Deterministic calculator backed by local logic
- [ ] Verdict card, impact timeline card, adjustment tips
- [ ] Share/regenerate row + upsell banner
- [ ] Toast + error states consistent with TripSpark
