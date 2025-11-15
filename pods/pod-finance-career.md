# Pod C — Finance & Career

- **Owners:** Agent Ledger
- **Apps:** `apps/career/prepcoach`, `apps/finance/moneymicro` (future tweaks), upcoming finance calculators.
- **Dependencies:** Shared RUNBOOK + TripSpark reference.

## Immediate Queue
1. **Scaffold PrepCoach** (`python3 scripts/option_b_build.py --slug prepcoach`).
2. **SPEC / UX:** Replace scaffold SPEC.md + UX_NOTES.md with the approved PrepCoach drafts (mock interview coach).
3. **Logic:** Implement deterministic prompt generator + feedback bullets in `logic.js`. Include follow-up suggestion and copyable textarea content.
4. **UI / UX:** Build hero/form, loader, highlight card, prompt cards (question, textarea, copy button), coach notes card, follow-up card, share row, upsell banner. Maintain TripSpark-style toasts + helper text.
5. **Metadata:** Update `README.md` + `apple.json`.
6. **QA:** Local server run, ensure clipboard success, export gating, regenerate.

Future tasks: monitor MoneyMicro for new requirements (log here before starting).

## Status Log
- 2025-11-14 17:20 – PrepCoach scaffolded, SPEC.md + UX_NOTES.md replaced, deterministic logic implemented.
- 2025-11-14 17:35 – PrepCoach UI/UX built (form, loader, prompt cards, notes, follow-up, share/upsell), README + apple metadata updated; QA server returned 200.

### Agent Ledger Briefing
- **Kickoff:** Scaffold `prepcoach`, replace SPEC/UX files, and confirm Monetization copy matches `ideas.yaml`.
- **First deliverable:** Prompt generator + feedback logic stub with deterministic outputs for review.
- **Build order:** PrepCoach end-to-end. If MoneyMicro tweaks arise, log the work first, then branch off so reviews stay focused.
- **Reporting:** After each stage (SPEC/UX, logic, UI, QA), log the timestamped update here and tag Studio Director if a review is needed.
- **Dependencies:** Coordinate with Agent Atlas if you require new shared UI elements (e.g., textarea components, chips).

