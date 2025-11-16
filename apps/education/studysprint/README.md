# StudySprint

Turns study topics into 25-minute sprints with recall prompts.

## What it does
StudySprint creates 25-minute learning blocks with recall prompts and shareable summaries.

## Flow
- Enter topic, deadline, confidence, and preferred format.
- Review focus plan, recall prompts, and break card.
- Copy/share or regenerate for another topic.

## Free vs Pro
**Free**
- Manual sprint builder.

**Pro**
- Syllabus library + reminders.
- Log export.
- Unlimited sprints.

## Screenshot or Loom
![StudySprint screenshot](../../docs/screenshots/studysprint.svg)

## Who it's for
Study/productivity apps embedding pomodoro-style helpers.

## Monetization
Free sprint daily; Pro adds reminders, saved syllabi, and exports.

## Run locally
```
python3 -m http.server 8080 -d apps/education/studysprint
```

## QA checklist (Phase 2)
- [ ] Text input validation.
- [ ] Share link across browsers.
- [ ] Upsell gating.

## Monetization instrumentation
- `studysprint:freeLimitHit` – Multiple sprints.
- `studysprint:regenerate` – Regenerate button.
- `studysprint:upsellViewed` – Upsell displayed.
- `studysprint:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
