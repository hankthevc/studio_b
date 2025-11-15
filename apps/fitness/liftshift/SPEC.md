# SPEC — LiftShift

## Problem
Gym-goers struggle to program progressive strength blocks that respect their equipment, schedule, and recovery without juggling spreadsheets.

## Target user
Intermediate lifters training 3–5 days per week who want structured progressions and deload cues delivered on mobile.

## Use cases
- Enter focus (strength, hypertrophy, conditioning), equipment on hand, desired session length, and days/week to instantly receive a 4-day block.
- Show each day as a card with Warmup, Main, and Finisher segments plus estimated minutes per block.
- Surface recovery guidance (deload reminder + cues) and provide a shareable link for training partners.
- Lock export/tracking features behind a Pro upsell.

## User stories
1. As a lifter, I specify focus/equipment and get a block with movements and estimated minutes ready to follow.
2. As someone tight on time, I adjust session length and see blocks adapt before training.
3. As a user who liked the plan, I regenerate with another emphasis (e.g., lower vs full body) without retyping everything.
4. As a Pro subscriber, I unlock progression tracking, saved cycles, and export to calendar/notes.

## Success criteria
- First block renders in under 30 seconds and fewer than 6 taps.
- Highlight card summarizes the cycle focus and days cards animate in sequentially.
- Recovery card presents at least two actionable cues plus deload reminder.
- Share row copies a fake short link and upsell banner appears after the first plan.

## Monetization
Free tier: one adaptive 4-day block at a time. LiftShift Pro ($7.99/mo placeholder) unlocks full 8-week cycles, progression tracking, and export options.

## MVP checklist
- [ ] Mobile-first form (focus select, equipment pills, days/week slider, session length slider, optional note)
- [ ] Deterministic mock generator backed by `callLiftShiftLLM`
- [ ] Day cards with three segments, estimated minutes, and friendly copy
- [ ] Recovery guidance card plus deload banner
- [ ] Share row with copy/regenerate + upsell banner gating exports
- [ ] Toast + error states consistent with TripSpark
