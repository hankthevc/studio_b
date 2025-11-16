# InboxZen

Inbox triage coach summarizing top emails and drafting reply prompts.

## What it does
InboxZen turns a few subject lines into sorted priorities plus reply prompts.

## Flow
- Paste subjects, pick tone/goal/time.
- Review triage list + prompts.
- Copy recap or regenerate.

## Free vs Pro
**Free**
- One triage/day.

**Pro**
- Unlimited triage.
- Reply preset library.
- CRM export stub.

## Screenshot or Loom
![InboxZen screenshot](../../docs/screenshots/inboxzen.svg)

## Who it's for
Email/CRM platforms embedding smart triage.

## Monetization
Free run daily; Pro gives unlimited runs, reply presets, and exports.

## Run locally
```
python3 -m http.server 8080 -d apps/productivity/inboxzen
```

## QA checklist (Phase 2)
- [ ] Textarea validation + helper text.
- [ ] Clipboard copy check.
- [ ] Analytics events triggered.

## Monetization instrumentation
- `inboxzen:freeLimitHit` – Second triage attempt.
- `inboxzen:regenerate` – Regenerate pressed.
- `inboxzen:upsellViewed` – Upsell shown.
- `inboxzen:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
