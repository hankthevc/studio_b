# FlexDesk

Desk-friendly stretch stacks that unlock posture and circulation between meetings.

## What it does
FlexDesk keeps remote teams limber with deterministic stretch stacks tuned to schedule, tension, and energy.

## Flow
- Enter schedule anchor + tension area.
- Pick energy + duration to see a three-card sequence.
- Copy/share or regenerate with a new vibe.

## Free vs Pro
**Free**
- Two flows per day.
- Manual reminders only.

**Pro**
- Calendar sync for auto-inserted breaks.
- Unlimited flows and saved stacks.
- PDF exports for wellness perks.

## Screenshot or Loom
![FlexDesk screenshot](../../docs/screenshots/flexdesk.svg)

## Who it's for
Employee experience teams embedding mobility nudges into their apps.

## Monetization
Free tier covers two flows/day; Pro adds reminders, saved stacks, and exports.

## Run locally
```
python3 -m http.server 8080 -d apps/fitness/flexdesk
```

## QA checklist (Phase 2)
- [ ] Confirm input focus/validation when schedule is empty.
- [ ] Verify chips are keyboard selectable.
- [ ] Check upsell banner toggles after second generation.

## Monetization instrumentation
- `flexdesk:freeLimitHit` – User requests more than two flows.
- `flexdesk:regenerate` – Regenerate tapped.
- `flexdesk:upsellViewed` – Upsell revealed.
- `flexdesk:upsellClicked` – Upgrade CTA tapped.

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
