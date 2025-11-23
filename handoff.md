# Studio B – Handoff (current checkpoint)

## Vision
Studio B is a mini-app platform (WeChat-style) with a native iOS host that runs lightweight web mini-apps. Goal: become an early mover in Apple’s Mini Apps Partner Program by:
- Advanced Commerce API: custom in-app purchase flows with 15% commission (vs 30%).
- Declared Age Range compliance.
- Proper `apple.json` manifests per mini-app.

## Current Backend & Host
- Backend (production): `https://studiob-ju5gpsd3k-henrys-projects-fb6e6763.vercel.app`
  - AI endpoints: `/api/ai/tripspark`, `/mealmind`, `/pocketporter`, `/focustiles`, `/liftshift`.
  - Commerce endpoints: `/api/commerce/purchase`, `/subscriptions`, `/consumption`, `/analytics/*`.
- iOS host default backend: set in `ios/StudioBHost/Sources/StudioBHost/Commerce/AdvancedCommerceBackendClient.swift` (same URL above).
- Declared Age Range and manifest loading wired; `run_simulator.sh` builds/packages.

## Codebase State (summary)
- Manifests synced: `npm run manifest:generate && npm run manifest:sync-ios` executed; bundled mini-apps current.
- Lint: `npm run lint:js` clean.
- Shared guardrail: `shared/planBuilder.js` trims/caps user inputs to 120 chars for all deterministic apps.
- Monetized apps hardened with AI + fallbacks:
  - TripSpark, LiftShift, MealMind, PocketPorter, FocusTiles.
  - Client AI calls have 12s abort + mock fallback; server AI timeout 20s with trimmed token budgets.
  - Upsell state fixed for LiftShift; others follow shared app shell pattern.
- Deterministic apps normalized:
  - FlowStreak, HabitGrid, HookLab, InboxZen, LanguageLoop, LayoverLoop, MeetingMinder, MoneyMicro, PitchPulse, QuestDash, RestNest, SipSync, SkillSnack, SliceSaver, StorySpark, StudySprint, TipTally, FlexDesk, PrepCoach, TempoBuddy.
  - Each derives from user input to replace placeholders with concrete content; clamps long text; shows counts/metrics from input.

## What was changed recently (high level)
- Backend default updated to latest deploy.
- AI endpoints validated (no auth protection).
- Guardrails added per app (see “Per-app notes”).
- Repeated manifest generation to keep iOS bundle in sync.

## Per-app notes (non-monetized, alphabetical highlights)
- FlowStreak: derives top 3 wins and displays them; metrics reflect win count.
- HabitGrid: derives habits; shows in setup/cadence; metrics reflect habit count.
- HookLab: clamps idea/keyword/time text.
- InboxZen: derives top emails; metrics reflect parsed count.
- LanguageLoop: derives warm-up phrase and vocab per scenario; metrics show keywords.
- LayoverLoop: derives city/vibe stops; metrics and loop use them.
- MeetingMinder: derives attendees; opener references them; follow-up metric “3 owners.”
- MoneyMicro: guards zero/negative financing, raises caps, prevents divide-by-zero.
- PitchPulse: derives three pitch beats (hook/proof/CTA) per audience/time/focus.
- QuestDash: setting/vibe-specific challenges + proof label.
- RestNest: derives breath routine and soundscape per mood/room.
- SipSync: caps reminders to 6 entries.
- SkillSnack: primer + three steps per skill derived.
- SliceSaver: derives crew count, clean total, avg due, tone note; scripts/metrics use numbers.
- StorySpark: clamps idea/CTA text.
- StudySprint: derives recall prompts from topic.
- TipTally: derives bill/tip/split math; scripts/metrics use clean amounts.
- FlexDesk: derives tension-specific moves and energy cues.
- PrepCoach: clamps strengths text length.
- TempoBuddy: derives goal/playlist notes for cues.

## Monetized apps (AI-backed)
- TripSpark: AI itinerary with normalized seed (3 days, non-empty highlight); fallback budgets.
- LiftShift: AI strength block; ensures warmup/main/finisher; clamps session minutes; upsell hide fixed.
- MealMind: AI meals (9 total), grocery list capped; fallback padding.
- PocketPorter: AI categories/compliance/weather; required-first sorting; fallbacks.
- FocusTiles: AI tiles normalized to 8 focus/break; default reset tip.

## Testing/Verification
- Lint: `npm run lint:js`
- Manifest: `npm run manifest:generate && npm run manifest:sync-ios` (already run)
- Simulator: `./run_simulator.sh` (host uses latest manifests/apps); logs via `xcrun simctl spawn <sim-id> log stream --predicate 'processImagePath contains "StudioBHost"' --level debug`.
- AI endpoint sanity (current prod): curl POST to `/api/ai/tripspark` etc. (all responding).

## Outstanding items to reach consumer-ready
1) Simulator smokes:
   - For 5 monetized apps: confirm AI content appears (no placeholders), upsell hides on Pro, share/export flows OK.
   - For deterministic apps: verify derived content shows correctly, no text overflow, inputs reasonable defaults.
2) Age gating: test with `STUDIOB_FAKE_AGE_RANGE` to confirm catalog blocking.
3) Analytics: confirm plan generation/upsell/Pro events hit `/api/analytics/events` for the 5 monetized apps.
4) Content QA: tighten any copy/spacing found during smokes; capture screenshots/Looms for docs/partner kit.
5) AI tuning (if needed): adjust prompts/temp/max_tokens per app if outputs feel generic or slow.

## Key files
- Backend AI/commerce: `server/index.js`
- Host backend default: `ios/StudioBHost/Sources/StudioBHost/Commerce/AdvancedCommerceBackendClient.swift`
- Shared input clamp: `shared/planBuilder.js`
- Monetized app logic: 
  - `apps/travel/tripspark/logic.js`
  - `apps/fitness/liftshift/logic.js`
  - `apps/lifestyle/mealmind/logic.js`
  - `apps/travel/pocketporter/logic.js`
  - `apps/productivity/focustiles/logic.js`
- Deterministic app configs: see `apps/*/*/config.js` or `logic.js` per app.

## How to run
- `./run_simulator.sh` (uses manifests/apps from repo and default backend)
- Env override: `STUDIOB_COMMERCE_BACKEND_URL` to point elsewhere if needed.
- Logs: `xcrun simctl spawn <sim-id> log stream --predicate 'processImagePath contains "StudioBHost"' --level debug`.

## Role & expectations
- You (user) provide high-level vision and direction; prefer CLI/scripts over Xcode UI.
- Next AI should continue in the same style: small, safe deltas; rerun lint + manifest after changes.

## Deployment
- Backend deploy via `npx vercel --prod --yes` in `server/` (envs must include OPENAI_API_KEY, commerce envs).
- Current prod URL: `https://studiob-ju5gpsd3k-henrys-projects-fb6e6763.vercel.app`

## Risks
- AI outputs may still need prompt tuning per app.
- Pro upsell states: LiftShift fixed; others rely on shared shell patterns—verify in smokes.
- No automated E2E; manual verification required.

## Quick start for next AI
1) Pull latest; ensure backend envs set if redeploying.
2) Run `npm run lint:js` and `npm run manifest:generate && npm run manifest:sync-ios` after edits.
3) Smoke the 5 monetized apps in simulator; adjust prompts/guards if outputs weak.
4) Continue content QA and capture evidence (screenshots/Looms) for partner docs.
