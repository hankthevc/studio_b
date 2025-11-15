# SPEC — FocusTiles

## Problem
Generic timers ignore personal focus rhythms, making deep work either too short or exhausting.

## Target user
Knowledge workers and students who operate in Pomodoro-style sprints and want adaptive recommendations.

## Use cases
- Input focus theme, energy level, block length, and optional goal to receive a tile-based schedule (focus/break tiles) for the next 2 hours.
- Show each tile card with duration, suggested soundtrack, and micro tip.
- Provide flow score + reset tip plus share/regenerate controls.
- Upsell for analytics, custom rhythms, and calendar sync.

## User stories
1. As a user, I select theme + energy and get a recommended tile sequence instantly.
2. As someone logging sessions, I tap `Log session` and see a toast confirmation.
3. As a tinkerer, I regenerate when energy changes without re-entering everything.
4. As a Pro subscriber, I unlock saved rhythms and focus analytics.

## Success criteria
- Flow completes in under 15 seconds and <5 taps.
- Tiles animate in sequentially with start buttons and chip durations.
- Flow score card displays summary chip; share row copy works; upsell after first plan.
- Error helper prompts for focus theme before generating.

## Monetization
Free: single adaptive workspace. FocusTiles Pro ($4.99/mo placeholder) unlocks analytics, custom rhythms, and calendar sync.

## MVP checklist
- [ ] Form (theme select, energy pills, block length slider, optional goal input, soundtrack select)
- [ ] Deterministic tile generator and flow score logic
- [ ] Tile stack UI with CTA to log session
- [ ] Flow score + reset tip card, share/regenerate + upsell
- [ ] Toast + error states consistent with TripSpark
