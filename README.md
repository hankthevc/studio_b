# miniapps-studio-b

Portfolio of 30 Apple Mini App–style experiences designed to showcase agentic AI craftsmanship. TripSpark is the reference implementation; every other app must match or exceed that polish.

## Roadmap Snapshot
Phases defined in `RUNBOOK.md` (Operating Directive):

1. **Foundation** – shared UI tokens, scaffolder, pod structure (complete).
2. **Portfolio Production** – build the 30 deterministic apps (TripSpark + 29 in `ideas.yaml`).
3. **Consumer Readiness** – accessibility, responsive polish, copy QA, screenshots.
4. **Monetization Readiness** – consistent upsells, pricing copy, instrumentation hooks.
5. **Distribution & Host Enablement** – embed kits, demos, analytics readiness.

All pods log progress inside `pods/` using the roadmap phases as reference.

## Getting Started
```bash
git clone https://github.com/hankthevc/studio_b.git
cd studio_b
# scaffold any new app (slug must exist in ideas.yaml)
python3 scripts/option_b_build.py --slug <slug>
```

Each app lives in `apps/<category>/<slug>/` with `index.html`, `app.js`, `styles.css`, `logic.js`, `SPEC.md`, `UX_NOTES.md`, `README.md`, and `apple.json`.

## Development Workflow
1. Update SPEC/UX documents.
2. Implement deterministic mocks in `logic.js`.
3. Build UI (`app.js`, `styles.css`) using shared helpers (`shared/ui.js`, `shared/styles.css`).
4. Test locally via `python3 -m http.server 8080 -d apps/<category>/<slug>` and mobile emulation.
5. Run `read_lints` (or equivalent) on touched directories and log milestones in the pod Status Log.

## Continuous Integration
`.github/workflows/ci.yml` runs on every push/PR:

- Compiles Python scripts (`python -m compileall scripts`).
- Lints all HTML entrypoints with HTMLHint.

Extend this workflow as we move into Phase 2/3 polish.

## Pods at a Glance
- `pod-travel-lifestyle.md` – PocketPorter, SipSync, Travel extensions.
- `pod-food-productivity.md` – StorySpark, MealMind, FocusTiles.
- `pod-finance-career.md` – PrepCoach, MoneyMicro, future finance tools.
- `pod-games-creator.md` – BrainBite, HookLab, experimental creators.
- `pod-shared-infra.md` – shared components, RUNBOOK updates, QA sweeps.

Each pod file lists owners, immediate queues, and status logs.

