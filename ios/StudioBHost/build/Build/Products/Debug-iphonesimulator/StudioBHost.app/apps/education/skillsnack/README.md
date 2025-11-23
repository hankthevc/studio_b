# SkillSnack

Five-minute micro-lessons for practical skills.

## What it does
SkillSnack sends practical micro-lessons aligned to skill, time, and confidence.

## Flow
- Choose skill/time/format/confidence.
- Review primer, steps, and apply cards.
- Copy/share or regenerate.

## Free vs Pro
**Free**
- One snack per day.

**Pro**
- Tracks + spaced review.
- Certification tips.
- Unlimited snacks.

## Screenshot or Loom
![SkillSnack screenshot](../../docs/screenshots/skillsnack.svg)

## Who it's for
Learning platforms or communities needing micro-content.

## Monetization
Free snack daily; Pro unlocks tracks, spaced review, and certifications.

## Run locally
```
python3 -m http.server 8080 -d apps/education/skillsnack
```

## QA checklist (Phase 2)
- [ ] Select field defaults.
- [ ] Share row functionality.
- [ ] Upsell gating.

## Monetization instrumentation
- `skillsnack:freeLimitHit` – Multiple snacks.
- `skillsnack:regenerate` – Regenerate.
- `skillsnack:upsellViewed` – Upsell display.
- `skillsnack:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
