# QuestDash

Generates micro adventure challenges with photo-proof prompts.

## What it does
QuestDash creates micro adventure quests with shareable prompts.

## Flow
- Choose crew, energy, setting, and proof.
- QuestDash outputs kickoff, challenges, and wildcard cards.
- Copy/share or regenerate for another round.

## Free vs Pro
**Free**
- One quest/day.

**Pro**
- Theme packs.
- Leaderboard/history.
- Unlimited quests.

## Screenshot or Loom
![QuestDash screenshot](../../docs/screenshots/questdash.svg)

## Who it's for
Social/party apps embedding mini challenges.

## Monetization
Free daily quest; Pro unlocks themes, history, and leaderboards.

## Run locally
```
python3 -m http.server 8080 -d apps/games/questdash
```

## QA checklist (Phase 2)
- [ ] Chip accessibility.
- [ ] Share row functionality.
- [ ] Upsell gating.

## Monetization instrumentation
- `questdash:freeLimitHit` – Multiple quests.
- `questdash:regenerate` – Regenerate pressed.
- `questdash:upsellViewed` – Upsell shown.
- `questdash:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
