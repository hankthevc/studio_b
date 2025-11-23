# TripSpark SPEC

## Problem
Weekend city trips require sifting through dozens of tabs (blogs, TikToks, Google Maps, cost spreadsheets). Travelers want a trustworthy 3-day plan that respects their vibe and budget without spending hours curating or worrying about overspending.

## Target user
Busy professionals or couples planning a spontaneous 3-day city escape who rely on mobile devices, crave curated experiences, and need light-weight budget guardrails before booking.

## Use cases
- Collect destination, travel window, vibe, and preferred spend level and instantly receive a structured 3-day plan.
- Show morning/afternoon/evening blocks so travelers understand the pacing at a glance.
- Surface budget estimates per day plus an overall total and savings tip.
- Provide a fake short link that can be copied to coordinate with a partner.
- Trigger an upsell for unlimited itineraries + export/share after the free plan.

## User stories
1. As a traveler, I type a destination, pick my vibe, and get a balanced 3-day itinerary with highlight experiences in seconds.
2. As someone splitting costs, I want to see estimated spend per block and per day so I can adjust my budget slider confidently.
3. As a user who enjoyed the first plan, I want a clear upgrade path to unlock exports and unlimited itineraries.
4. As a host app operator, I need client logic that can later swap in real LLM responses without rewriting the UI.

## Success criteria
- Mobile user completes first itinerary flow in under 5 taps and 30 seconds.
- Every itinerary shows a Spark Highlight plus day cards with morning/afternoon/evening rows and price chips.
- Share row successfully copies a short fake link and confirms via toast.
- Upsell banner becomes visible immediately after the first itinerary renders.

## Monetization
Free tier allows one itinerary per user/device. Subscription ($4.99/month placeholder) unlocks unlimited itineraries, export to calendar/notes, and premium short-link customization. Upsell moments: post-plan banner + blocked export button.

## MVP checklist
- [ ] Mobile-first form for destination, dates, vibe, pace tag, and budget slider.
- [ ] Loading state with “spark” animation while the itinerary materializes.
- [ ] Deterministic mock generator (can be swapped with `callTripSparkLLM`) that returns 3-day data, highlight, and share link slug.
- [ ] Day cards with morning/afternoon/evening rows plus per-day totals and currency formatting.
- [ ] Budget overview module with per-day chips, total, and saver tip aligned to budget tier.
- [ ] Share row with read-only URL, copy button, and regenerate action.
- [ ] Export button gated behind the subscription upsell.
- [ ] Upsell banner explaining benefits and hooking into future billing events.
