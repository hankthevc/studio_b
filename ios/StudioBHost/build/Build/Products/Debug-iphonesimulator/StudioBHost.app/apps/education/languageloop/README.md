# LanguageLoop

Phrase-practice loops with roleplay prompts and pronunciation tips.

## What it does
LanguageLoop builds short roleplays anchored to context, confidence, and accent goals.

## Flow
- Pick language + scenario + confidence.
- Read warm-up, roleplay, and accent cards.
- Copy or regenerate for another scenario.

## Free vs Pro
**Free**
- One loop/day.

**Pro**
- Unlimited loops.
- Accent/culture notes.
- Offline packs.

## Screenshot or Loom
![LanguageLoop screenshot](../../docs/screenshots/languageloop.svg)

## Who it's for
Language-learning apps needing quick practice modules.

## Monetization
Free loop daily; Pro adds unlimited loops, accent packs, and offline storage.

## Run locally
```
python3 -m http.server 8080 -d apps/education/languageloop
```

## QA checklist (Phase 2)
- [ ] Select defaults.
- [ ] Share row functioning.
- [ ] Upsell gating.

## Monetization instrumentation
- `languageloop:freeLimitHit` – Second loop.
- `languageloop:regenerate` – Regenerate button.
- `languageloop:upsellViewed` – Upsell view.
- `languageloop:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
