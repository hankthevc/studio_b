# MeetingMinder

Auto-build prep checklists and follow-ups from calendar context.

## What it does
MeetingMinder outputs prep, agenda, and follow-up cards based on meeting context.

## Flow
- Pick meeting type/goal/duration and list attendees.
- Review three cards: prep, agenda, follow-up.
- Copy plan for the invite or regenerate.

## Free vs Pro
**Free**
- Manual entry.
- One kit per meeting.

**Pro**
- Calendar sync.
- Shared notes + exports.
- Unlimited kits.

## Screenshot or Loom
![MeetingMinder screenshot](../../docs/screenshots/meetingminder.svg)

## Who it's for
Calendar/project tools embedding meeting companions.

## Monetization
Free manual kits; Pro syncs calendar data, adds exports, and unlimited saves.

## Run locally
```
python3 -m http.server 8080 -d apps/productivity/meetingminder
```

## QA checklist (Phase 2)
- [ ] Text input validation.
- [ ] Share row copy.
- [ ] Upsell gating.

## Monetization instrumentation
- `meetingminder:freeLimitHit` – Multiple kits same day.
- `meetingminder:regenerate` – Regenerate.
- `meetingminder:upsellViewed` – Upsell revealed.
- `meetingminder:upsellClicked` – Upgrade CTA.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
