# SPEC — SipSync

## Problem
People forget to hydrate consistently, especially when routines change (travel, meetings, workouts), leading to fatigue and headaches.

## Target user
Wellness-focused users who want gentle hydration nudges tied to their schedule and mood.

## Use cases
- Input wake/sleep times, activity level, flavor mood, and travel toggle to receive a personalized hydration cadence.
- Show timeline card with reminder slots and ounces.
- Provide flavor/mood boosts and travel tips.
- Upsell for smart bottle sync, streak perks, and travel modes.

## User stories
1. As a user, I enter my schedule and receive timed hydration reminders with ounces.
2. As someone traveling, I toggle travel mode and see altitude/jetlag tips.
3. As a sharer, I copy the cadence to send to a friend.
4. As a Pro member, I sync smart bottle data and earn streak boosts.

## Success criteria
- Timeline delivered in <15 seconds.
- Reminder cards show time, ounces, optional flavor idea.
- Travel tip surfaces if travel toggle on or climate flagged.
- Share row copies link; upsell consistent with TripSpark.

## Monetization
Free tier: baseline reminders + timeline. SipSync Pro ($2.99/mo placeholder) adds smart bottle sync, streak perks, travel modes.

## MVP checklist
- [ ] Form (wake/sleep pickers, activity select, flavor mood tags, travel toggle)
- [ ] Deterministic cadence generator referencing inputs
- [ ] Timeline card with chips per reminder
- [ ] Flavor suggestion card + travel tip banner
- [ ] Share row / upsell components
- [ ] Toast + error states consistent with TripSpark
