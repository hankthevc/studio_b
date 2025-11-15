# Pod A — Travel & Lifestyle

- **Owners:** Agent Aurora
- **Apps:** `apps/travel/pocketporter`, `apps/lifestyle/sipsync`
- **Dependencies:** None (shared primitives ready). Follow RUNBOOK + TripSpark patterns.

## Immediate Queue
1. **Scaffold** both slugs with `python3 scripts/option_b_build.py --slug pocketporter` and `--slug sipsync` (skip if already scaffolded).
2. **SPEC / UX:** Replace scaffolded SPEC.md + UX_NOTES.md with the approved drafts in this thread.
3. **Logic:** Implement deterministic planners in `logic.js` (PocketPorter: packing list generator; SipSync: hydration cadence). Keep mocks deterministic and ready to swap with `shared/llmClient.js`.
4. **UI / UX:** Build hero/form → loader → stacked cards → share row → upsell in `index.html`, `app.js`, `styles.css`. Copy TripSpark-level microcopy/animations.
5. **Metadata:** Update `README.md` + `apple.json` with final positioning.
6. **QA:** `python3 -m http.server 8080 -d apps/<category>/<slug>` and verify form validation, loader, copy-to-clipboard, regenerate, upsell gating.

## Status Log
- 2025-11-14 16:10 – Scaffolded `pocketporter` + `sipsync`; updated SPEC.md + UX_NOTES.md with approved drafts.
- 2025-11-14 16:55 – Completed deterministic logic, full UI/UX builds, README + apple metadata updates for both apps. QA server run pending.
- 2025-11-14 17:05 – QA: served both apps via `python3 -m http.server` (ports 8090/8091) and confirmed HTTP 200 responses.
- 2025-11-14 18:25 – TripSpark Phase 2 QA checklist complete; README updated with verification notes, accessibility/responsive checks recorded.
- 2025-11-14 18:35 – PocketPorter Phase 2 QA checklist complete; README updated with checklist, server check via port 8096.
- 2025-11-14 18:45 – SipSync Phase 2 QA checklist complete; README updated with verification notes, server check via port 8097.

### Agent Aurora Briefing
- **Kickoff:** Confirm scaffolds exist for `pocketporter` and `sipsync`; if not, run the Option B script for each slug.
- **First deliverable:** Updated SPEC.md + UX_NOTES.md checked in for both apps within the first work block. Post a log entry when complete.
- **Build order:** Finish PocketPorter end-to-end (logic → UI → QA), then shift to SipSync. Keep both in the same branch for easier review.
- **Reporting:** After each major milestone (SPEC ready, UI ready, QA done), add a timestamped note in the Status Log and post a summary in the pod channel.
- **Dependencies/Risks:** Flag any shared component needs to Agent Atlas before implementing custom UI so tokens stay consistent.

