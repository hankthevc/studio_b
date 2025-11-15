# Pod E — Shared Infra & QA

- **Owners:** Agent Atlas
- **Scope:** `shared/` primitives, RUNBOOK upkeep, linting, and QA spot checks across pods.

## Responsibilities
1. **Shared components:** Update `shared/ui.js`, `shared/styles.css`, and `shared/llmClient.js` when pods need new primitives. Announce any breaking changes before merging.
2. **RUNBOOK.md:** Capture new learnings or workflow tweaks from any pod.
3. **QA sweeps:** Run `python3 -m http.server 8080 -d apps/<category>/<slug>` for each pod’s app once per milestone; log findings here.
4. **Linting:** Use `read_lints` scoped to changed directories before pods request final review.
5. **Coordination:** Track shared issues (e.g., animation token requests) and escalate back to Studio Director.

## Status Log
- _Timestamp QA runs, lint passes, shared component updates._

### Agent Atlas Briefing
- **Kickoff:** Review RUNBOOK + shared files to ensure they match latest patterns; note any quick wins.
- **Daily rhythm:** Morning pass through pod updates, capture needs, and schedule QA/linting windows.
- **Deliverables:** 
  - Maintain `shared/` components on demand.
  - Append RUNBOOK with new guidance when pods discover repeatable patterns.
  - Provide QA summaries per milestone (post results here).
- **Reporting:** Use the Status Log to timestamp lint runs, QA sweeps, and shared component changes; tag impacted pod owners.
- **Escalation:** If a shared dependency blocks a pod, flag immediately to Studio Director and document the issue in this file.

