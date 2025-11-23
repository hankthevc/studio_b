# SPEC — PrepCoach

## Problem
Job seekers struggle to practice behavioral interviews with actionable feedback on mobile.

## Target user
Professionals preparing for interviews who want structured prompts, drafting space, and quick coaching tips.

## Use cases
- Choose role focus, seniority, and company type to receive three behavioral prompts.
- Provide editable response area with AI critique bullets and likely follow-up question.
- Offer share/export gating with upsell.

## User stories
1. As a candidate, I pick role focus and get tailored prompts instantly.
2. As I draft, I receive AI critique bullets to tighten my answer.
3. As a user, I copy my draft or share the prompt (export gated to Pro).
4. As a subscriber, I save answers and unlock more prompts.

## Success criteria
- Prompts appear <20 seconds with loader feedback.
- Each prompt card includes question, key angle chips, textarea, and copy button.
- Feedback card surfaces 2–3 coaching bullets plus follow-up suggestion.
- Share row + upsell consistent with TripSpark; error helper prompts for role selection.

## Monetization
Free: 3 questions/day. PrepCoach Pro ($8.99/mo placeholder) unlocks full banks, saved answers, recruiter export.

## MVP checklist
- [ ] Form (role select, seniority slider, company tags, optional strengths input)
- [ ] Deterministic prompt generator with feedback bullets (logic.js)
- [ ] UI stack (hero/form, loader, highlight card, prompt cards, feedback card, follow-up, share row, upsell)
- [ ] README + `apple.json` updates
- [ ] Lint + QA server run + pod status log entry
