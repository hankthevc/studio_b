# Device & Host QA Rollout Plan

Date: 2025-11-16  
Owner: Shared Infra (Agent Atlas)  
Scope: Record deterministic QA evidence for every app and keep partner-facing docs in sync.

## Target Matrix
| Priority | Device / Browser | Notes |
| --- | --- | --- |
| P0 | iPhone 15 / iOS 17 Safari (WKWebView) | Validate hero/form layout, share row clipboard, upsell events, billing mock trigger. |
| P0 | Pixel 8 / Android 14 Chrome (WebView) | Confirm input focus, toast placement, clipboard fallback. |
| P0 | React Native WKWebView shell (iOS) | Ensure `window.dispatchEvent` propagates to host hybrid app. |
| P1 | Samsung S23 / Samsung Internet | Catch OEM gradient/clipboard quirks. |
| P1 | Desktop Edge (Chromium overlay) | For partners embedding inside desktop companion apps. |

## Execution Steps
1. **Assign Apps:** Each pod is responsible for its app set (see table below). Log the assignment + due date inside the pod file.
2. **Test Flow:** For every device/browser combination:
   - Launch the app via local dev server (or lightweight host shell).
   - Complete one generation (form → plan) and attempt any Pro action to verify gating + analytics events.
   - Test clipboard copy, regenerate, and upsell CTA (should fire `slug:upsellClicked`).
3. **Record Evidence:**
   - Add a row to `docs/qa/<slug>/report.md` with date, device/browser, pass/fail, findings.
   - Drop screenshots or screen recordings into `docs/qa/<slug>/evidence/` (create directory as needed).
4. **Integrate Results:**
   - Update `apps/<category>/<slug>/README.md` QA checklist if new issues surface.
   - Note completion in the relevant pod log and in `STATUS_SUMMARY.md` if it closes a blocker.

## Ownership Matrix
| Pod | Apps | Status |
| --- | --- | --- |
| Pod A (Travel & Lifestyle) | TripSpark, PocketPorter, SipSync, LayoverLoop, RestNest, HabitGrid | ☐ Not started |
| Pod B (Food/Productivity/Creator) | MealMind, FlowStreak, InboxZen, StorySpark, HookLab | ☐ Not started |
| Pod C (Finance/Career) | MoneyMicro, SliceSaver, BillBreeze, TipTally, PrepCoach, PitchPulse | ☐ Not started |
| Pod D (Games/Creator) | BrainBite, QuestDash, ClipChoreo, BeatBoard | ☐ Not started |
| Pod F (Fitness/Health) | LiftShift, FlexDesk, PulsePath, TempoBuddy | ☐ Not started |
| Pod Shared Infra | QA sweeps for cross-pod support + verification of `docs/qa` completeness | ☐ Not started |

## Partner Kit Sync
Once QA evidence exists:
1. Update `partner-kit/qa/README.md` with real device/browser notes and any host overrides.
2. Add links to screenshots/Looms inside `partner-kit/showcase/index.html` cards.
3. Annotate the analytics contract if new events were observed during QA.

## Automation Backlog
- Script to flag `docs/qa/<slug>/report.md` files that still only contain placeholder rows.
- CI gate that requires Tier-1 apps to have at least one P0 device run logged before release tagging.
- Optional GitHub issue generator per pod summarizing outstanding QA devices.

