# SPEC — StorySpark

## Problem
Creators burn time drafting captions and hooks tailored to each platform and tone.

## Target user
Social media creators, marketers, and founders who need scroll-stopping copy fast.

## Use cases
- Paste a rough idea, choose platform + tone, optional CTA, and instantly get hook options, caption, and hashtags.
- Copy hooks with one tap (toast confirmation) and regenerate with different tone.
- Provide clear upsell path for unlimited generations and preset banks.

## User stories
1. As a creator, I input an idea and get a highlight hook plus 2–3 alternates tailored to the platform.
2. As a user, I copy a hook or caption with one tap.
3. As someone iterating, I regenerate with a different tone without re-entering everything.
4. As a Pro subscriber, I save presets and unlock unlimited generations.

## Success criteria
- Hooks displayed within 15 seconds with loader feedback.
- Highlight card + hook list, caption card, hashtag chips, share row, upsell banner.
- Copy buttons trigger `Link copied!`-style toast.
- Error helper prompts for idea text when missing.

## Monetization
Free: limited generations/day. StorySpark Pro ($6.99/mo placeholder) unlocks unlimited runs, preset banks, and tone customization.

## MVP checklist
- [ ] Form (idea textarea, platform select, tone pills, optional CTA field)
- [ ] Deterministic hook/caption generator (logic.js)
- [ ] UI flow with highlight card, hook list with copy buttons, caption card, hashtag chips
- [ ] Share row + upsell banner
- [ ] Toast + error states consistent with TripSpark
