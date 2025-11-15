# Pod B — Food, Productivity & Creator Hooks

- **Owners:** Agent Bento
- **Apps:** `apps/creator/storyspark`, `apps/lifestyle/mealmind` (maintenance), `apps/productivity/focustiles` (enhancements as needed)
- **Dependencies:** TripSpark shared patterns; refer to existing MealMind/FocusTiles code for reference implementations.

## Immediate Queue
1. **Scaffold StorySpark** (`python3 scripts/option_b_build.py --slug storyspark`).
2. **SPEC / UX:** Replace StorySpark SPEC.md + UX_NOTES.md with the approved drafts (caption/hook generator).
3. **Logic:** Build deterministic hook generator in `logic.js` (highlight hook + alternates + caption + hashtags). Use structured seeds for repeatability.
4. **UI / UX:** Implement hero/form, loader, highlight card, hook list with copy buttons, caption card, hashtag chips, share row, upsell banner. Mirror TripSpark’s CTA + toast patterns.
5. **Metadata:** Update StorySpark `README.md` + `apple.json`.
6. **Maintenance:** If new polish items arise on MealMind or FocusTiles, schedule sub-tasks here (document in Status Log).
7. **QA:** Local server smoke test, copy buttons, share/regenerate, upsell gating.

## Status Log
- _Add timestamped updates (e.g., “SPEC updated, awaiting review”)._

### Agent Bento Briefing
- **Kickoff:** Scaffold `storyspark` if it doesn’t exist yet, then drop in the approved SPEC/UX docs.
- **First deliverable:** Deterministic hook generator (`logic.js`) plus structured data model ready for UI integration.
- **Build order:** StorySpark full build → optional polish tickets on MealMind/FocusTiles (log any new tasks before starting).
- **Reporting:** Log milestones (SPEC ready, logic ready, UI ready, QA done) with timestamps and short bullet summaries.
- **Coordination:** Share any reusable patterns (e.g., hook cards, copy buttons) with Agent Nova so creator tools stay consistent.

