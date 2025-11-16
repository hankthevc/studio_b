# Tier 2 / Tier 3 Polish Audit

Date: 2025-11-16  
Auditor: Studio Director (via Codex)

This audit verifies that every Tier 2/3 mini-app meets the Phase 2 (consumer polish), Phase 3 (monetization readiness), and Phase 4 (embed + host enablement) standards defined in `RUNBOOK.md`.

| App | Phase 2 QA Checklist | Phase 3 Instrumentation | Phase 4 Embed Kit | Notes |
| --- | --- | --- | --- | --- |
| **MealMind** (`apps/lifestyle/mealmind/`) | README includes validated QA checklist (validation, keyboard nav, responsive, copy, contrast, server). | Custom events documented (`mealmind:*`), Pro buttons gated. | `EMBED.md` covers snippet, analytics wiring, theming + host QA steps. | Pod Food/Productivity log updated 2025-11-15. |
| **LiftShift** (`apps/fitness/liftshift/`) | Detailed QA checklist shipped; local server reference captured. | `liftshift:*` events emitted; export gated behind subscription. | Embed doc lists snippet, analytics contract, rollout steps. | Pod Fitness log updated 2025-11-15. |
| **LayoverLoop** (`apps/travel/layoverloop/`) | README generated via Phase 2 script; device/browser QA pending. | App shell dispatches `layoverloop:freeLimitHit/regenerate/upsell*`. | `EMBED.md` documents snippet + event matrix; QA log stub in `docs/qa/layoverloop/`. | Needs copy QA + pod status entry. |
| **FlexDesk** (`apps/fitness/flexdesk/`) | Phase 2 checklist scaffolded; needs manual verification + screenshots. | Auto events `flexdesk:*` fired by app shell. | Embed kit created with theming knobs + host QA steps. | Assign Pod F to run device QA + log results. |
| **PulsePath** (`apps/fitness/pulsepath/`) | README meets template; must execute mobility QA pass. | App shell instrumentation for `pulsepath:*`. | Embed doc live with snippet + analytics guidance. | Pending energy-level copy QA + `docs/qa/pulsepath/` evidence. |
| **TempoBuddy** (`apps/fitness/tempobuddy/`) | README/QA sections auto-filled; motion/toast QA outstanding. | Events `tempobuddy:*` available via shell. | EMBED with snippet + watch-pairing notes shipped. | Needs playlist accessibility audit + pod log. |
| **HabitGrid** (`apps/lifestyle/habitgrid/`) | Phase 2 doc minted; device QA + color contrast validation open. | `habitgrid:*` events emitted (freeLimit/regenerate/upsell). | Embed kit ready with host checklist. | Next step: host clipboard test + QA evidence. |
| **RestNest** (`apps/lifestyle/restnest/`) | README follows template; run low-light accessibility QA. | `restnest:*` instrumentation via shell. | EMBED includes theme overrides + partner mode hooks. | Needs audio/soundscape placeholder QA + pod log. |
| **SliceSaver** (`apps/finance/slicesaver/`) | Template README; fairness math QA + text-input validation pending. | `slicesaver:*` events surfaced. | Embed doc w/ analytics + reminder wiring complete. | Add device QA results + ledger persistence handshake. |
| **TipTally** (`apps/finance/tiptally/`) | README includes flow/free vs pro; numeric formatting QA outstanding. | `tiptally:*` emitted via shell. | Embed instructions cover snippet/events. | Need currency localization tests + QA log. |
| **BillBreeze** (`apps/finance/billbreeze/`) | Phase 2 doc generated; run cash-flow lane visual QA. | `billbreeze:*` events handled by shell. | Embed kit includes snippet + safe-to-spend notes. | Pending ledger math verification + pod note. |
| **FlowStreak** (`apps/productivity/flowstreak/`) | README structured; requires real screenshot + keyboard nav QA. | `flowstreak:*` analytics ready. | EMBED enumerates snippet + share-row guidance. | Next: confirm chips accessible + log host QA. |
| **InboxZen** (`apps/productivity/inboxzen/`) | README templated; need textarea validation + clipboard QA. | `inboxzen:*` events available. | Embed doc lists snippet + CRM wiring suggestions. | Add QA evidence + confirm tone presets in pod log. |
| **MeetingMinder** (`apps/productivity/meetingminder/`) | Phase 2 checklist present; meeting-type select QA pending. | `meetingminder:*` instrumentation from shell. | EMBED includes snippet + calendar sync notes. | Run WebView QA + record in `docs/qa/meetingminder/`. |
| **SkillSnack** (`apps/education/skillsnack/`) | README meets template; needs swipe experience QA + screenshot. | `skillsnack:*` events dispatched. | Embed kit published w/ theming + QA steps. | Pending host run + pod EDU log. |
| **LanguageLoop** (`apps/education/languageloop/`) | README templated; audio/pronunciation cues QA open. | `languageloop:*` auto events available. | EMBED explains snippet + accent knobs. | Capture roleplay accessibility QA + doc evidence. |
| **StudySprint** (`apps/education/studysprint/`) | README structured; timeline/responsive QA outstanding. | `studysprint:*` instrumentation ready. | Embed doc lists snippet + sprint workflow. | Need pomodoro timer pass + QA log entry. |
| **ClipChoreo** (`apps/creator/clipchoreo/`) | Template README; preview layout QA needed. | `clipchoreo:*` events fired. | EMBED includes snippet + analytics mapping. | Record device QA + integrate pod Creator log. |
| **BeatBoard** (`apps/creator/beatboard/`) | README templated; audio preview QA pending. | `beatboard:*` instrumentation from shell. | EMBED highlights snippet + hook usage. | Need clipboard + share QA + doc evidence. |
| **QuestDash** (`apps/games/questdash/`) | README meets template; game-loop QA outstanding. | `questdash:*` events auto. | EMBED instructs host wiring + QA. | Capture multiplayer QA + scoreboard integration notes. |
| **PitchPulse** (`apps/career/pitchpulse/`) | README structured; voice/timer QA pending. | `pitchpulse:*` analytics ready. | EMBED provides snippet + rehearsal instructions. | Need QA evidence + Pod Finance/Career log update. |

## Outstanding Items
- Phase 2 device/browser QA plus real screenshots are pending for every newly scaffolded Tier 2/3 app; see `docs/qa/<slug>/report.md` templates.
- Monetization instrumentation is provided via shared app shell, but pods must confirm host-specific payload mapping before Phase 3 sign-off.
- Partner kit should be updated with analytics rows + showcase entries once QA evidence exists; Shared Infra to coordinate.

