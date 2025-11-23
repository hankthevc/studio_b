# SPEC — BrainBite

## Problem
People crave quick cognitive hits but don't have time for long games or cluttered trivia apps.

## Target user
Puzzle lovers and casual gamers looking for a 60-second challenge embedded inside host apps.

## Use cases
- Choose difficulty and category to receive a bite-sized puzzle (logic, trivia, pattern).
- Provide instant feedback, streak tracking, and a hint/answer reveal.
- Offer shareable brag link and upsell for archives/streak shields.

## User stories
1. As a user, I select difficulty + category and get a single playable puzzle instantly.
2. As a learner, I request one hint before answering.
3. As a streak chaser, I see whether I kept my streak and copy a link to share.
4. As a Pro subscriber, I unlock archives, streak shields, and category filters.

## Success criteria
- Puzzle loads in <10 seconds post submission.
- UI shows prompt, input (or options), hint button, answer reveal, and streak summary.
- Toast confirms copy; upsell after first puzzle.
- Error helper prompts for a category if missing.

## Monetization
Free: one daily puzzle. BrainBite Pro ($2.99/mo placeholder) unlocks archives, streak shields, and category filters.

## MVP checklist
- [ ] Form with category select, difficulty pills, and puzzle type toggle
- [ ] Deterministic puzzle generator with correct answer + hint
- [ ] Puzzle card UI with input/choice, hint/reveal buttons, streak summary card
- [ ] Share/regenerate row + upsell banner
- [ ] Toast + error states consistent with TripSpark
