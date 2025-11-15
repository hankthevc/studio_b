# Pod D — Games & Creator Experiments

- **Owners:** Agent Nova
- **Apps:** `apps/games/brainbite` (live), next creator apps like `hooklab`, `clipchoreo`, plus experimental Tier 3 concepts.

## Immediate Queue
1. **BrainBite maintenance:** keep puzzle seeds tidy, log content updates here, and note any shared component requests.
2. **Scaffold HookLab** (`python3 scripts/option_b_build.py --slug hooklab`) once StorySpark is stable or in parallel if bandwidth allows.
3. **SPEC / UX:** Replace HookLab SPEC.md + UX_NOTES.md with approved drafts (A/B hook generator + thumbnail text).
4. **Logic:** Build deterministic hook/thumbnails generator in `logic.js`. Structure similar to StorySpark but focused on A/B sets.
5. **UI / UX:** Implement hero/form, loader, highlight card, variant cards with copy buttons, share row, upsell.
6. **Metadata:** Update README/apple for each new app.
7. **QA:** Local server tests, copy/regenerate flows, upsell gating.

## Status Log
- 2025-11-14 17:40 – BrainBite puzzle seeds reviewed; no content change required.
- 2025-11-14 17:50 – HookLab scaffolded, SPEC/UX updated, deterministic logic implemented.
- 2025-11-14 18:05 – HookLab UI/UX completed (form, loader, highlight, variants, thumbnail, share/upsell), README + apple updated, QA server returned 200.

### Agent Nova Briefing
- **Kickoff:** Maintain BrainBite seeds (log any new puzzles) and prep to scaffold `hooklab` once StorySpark stabilizes.
- **First deliverable:** HookLab SPEC/UX updates plus deterministic logic outline for A/B hook + thumbnail suggestions.
- **Build order:** Keep BrainBite content tidy in parallel, then execute HookLab (logic → UI → QA).
- **Reporting:** Log milestones in the Status Log and note whether BrainBite or HookLab work is being updated.
- **Collab:** Sync with Agent Bento on shared creator UI patterns so StorySpark and HookLab feel cohesive.

