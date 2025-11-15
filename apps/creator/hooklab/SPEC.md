# SPEC — HookLab

## Problem
Creators want fast A/B hook + thumbnail experiments without spinning up heavy creative tools.

## Target user
YouTube/TikTok creators, editors, and social marketers who test multiple hooks/thumbnails per idea.

## Use cases
- Enter video idea, platform, vibe slider, thumbnail keyword to generate Hook A + Hook B + thumbnail text.
- Copy hooks/thumbnail lines instantly and share a short link with collaborators.
- Upsell to unlock unlimited variants, saved templates, and collaboration links.

## User stories
1. As a creator, I input an idea and receive two hooks tuned to my platform/vibe within seconds.
2. As an editor, I copy Hook A, Hook B, or thumbnail text with one tap (toast confirmation).
3. As someone iterating, I regenerate with a different vibe (e.g., bold vs analytical) using previous inputs.
4. As a Pro user, I save templates and export hook boards for teammates.

## Success criteria
- Hooks/thumbnails appear <15 seconds with loader card feedback.
- Highlight card recommends a variant based on vibe selection.
- Variant cards display micro-metrics (tone, predicted CTR bump) plus copy buttons.
- Share row + upsell banner consistent with TripSpark baseline.

## Monetization
Free: 3 hook sets/day. HookLab Pro ($7.99/mo placeholder) unlocks unlimited variants, saved templates, and team collaboration.

## MVP checklist
- [ ] Form (idea textarea, platform select, vibe slider/tags, thumbnail keyword field)
- [ ] Deterministic A/B generator in `logic.js`
- [ ] UI stack with hero/form, loader, highlight card, variant cards, thumbnail card, share row, upsell
- [ ] README + `apple.json` updates
- [ ] Lint + QA + pod log
