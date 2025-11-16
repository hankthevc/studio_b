# miniapps-studio-b

Portfolio of 30 Apple Mini App–style experiences designed to showcase agentic AI craftsmanship. TripSpark is the reference implementation; every other app must match or exceed that polish.

## Roadmap Snapshot
Detailed expectations live in `RUNBOOK.md`:

1. **Foundation** – shared UI tokens, scaffolder, pod structure (complete).
2. **Portfolio Production** – ship the 30 deterministic apps defined in `ideas.yaml`.
3. **Consumer Readiness** – accessibility, responsive polish, copy QA, deterministic screenshots.
4. **Monetization Readiness** – consistent upsells, pricing copy, analytics contracts, billing mocks.
5. **Distribution & Host Enablement** – embed kits, partner demos, pilot QA matrix, release readiness.

Pods must log every milestone inside `pods/` with the phase label (`P2-Polish`, `P3-Monetization`, etc.).

## Development Workflow
1. **Scaffold / Refresh**
   - Use `python3 scripts/option_b_build.py --slug <slug>` for Tier 1 apps or `python3 scripts/generate_new_apps.py --slug <slug>` for the new app-shell based experiences.
   - Run `node scripts/phase2_refresh_readmes.mjs` after edits to normalize README structure + screenshots.
2. **Spec + UX**
   - Update `SPEC.md` and `UX_NOTES.md` first. TripSpark is the visual + copy bar.
3. **Deterministic Logic**
   - Build deterministic plans in `logic.js` using `shared/planBuilder.js` or `shared/deterministic.js`.
4. **UI Build**
   - Wire `index.html`, `app.js`, and `styles.css`. Favor `shared/appShell.js`, `shared/app-shell.css`, and tokens in `shared/styles.css`.
5. **Monetization & Events**
   - Gate Pro surfaces using `freePlanLimit`, emit CustomEvents documented in the app README + `partner-kit/analytics/contracts.md`.
6. **QA + Logging**
   - Smoke test via `python3 -m http.server 8080 -d apps/<category>/<slug>`.
   - Update the relevant pod log, QA checklist, and `docs/qa/<slug>/report.md`.

## Continuous Integration
`.github/workflows/ci.yml` enforces the shared expectations on every push/PR:

1. `python -m compileall scripts` – keeps scaffolding scripts syntax-safe.
2. `npm ci` – installs tooling (`eslint`, `yaml`, `glob`).
3. `npm run lint:js` – ESLint sweep across `shared/` and `apps/`.
4. `npm run readme:check` – dry-runs `scripts/phase2_refresh_readmes.mjs --check` to ensure every README & screenshot matches the Phase 2 template.
5. HTMLHint/CSSLint stubs remain for legacy entrypoints; extend as host requirements grow.

CI fails fast if READMEs drift, new apps miss shared shells, or scripts throw.

## Pushing this repo to your own GitHub account
1. `git remote -v` to confirm `origin` (already set to `https://github.com/hankthevc/studio_b.git`).
2. To push from local `main`:
   ```bash
   git status   # ensure clean or staged
   git add .
   git commit -m "Describe your update"
   git push origin main
   ```
3. If you created a new branch (e.g., `feature/pod-b-polish`):
   ```bash
   git push -u origin feature/pod-b-polish
   ```
4. Troubleshooting:
   - `error: remote origin already exists` → remote is configured; skip `git remote add`.
   - `src refspec <branch> does not match` → branch hasn't been created locally; run `git checkout -b <branch>` first.
   - Authentication prompts: ensure GitHub CLI or PAT is configured for https pushes on this machine.

## Phase 2 automation
| Script | Purpose |
| --- | --- |
| `scripts/generate_new_apps.py` | Reads `docs/new-apps.yaml` + `ideas.yaml` to scaffold app-shell based mini-apps (config, logic, README, SPEC/UX, EMBED, styles, apple metadata). |
| `scripts/phase2_refresh_readmes.mjs` | Normalizes every app README (What it does / Flow / Free vs Pro / Screenshot), generates deterministic SVG placeholders in `docs/screenshots/`, and supports a `--check` CI mode. |

Run these scripts whenever new apps land or documentation drifts so CI stays green.

## Pods at a Glance
- `pod-travel-lifestyle.md` – TripSpark, PocketPorter, LayoverLoop, SipSync, MealMind, RestNest, HabitGrid.
- `pod-food-productivity.md` – StorySpark, HookLab, FlowStreak, InboxZen, MeetingMinder, TempoBuddy, FocusTiles.
- `pod-finance-career.md` – MoneyMicro, BillBreeze, SliceSaver, TipTally, PrepCoach, PitchPulse.
- `pod-games-creator.md` – BrainBite, QuestDash, ClipChoreo, BeatBoard.
- `pod-shared-infra.md` – shared components, RUNBOOK, partner kit, QA sweeps.

Each pod file lists owners, immediate queues, blockers, and the latest status log entry per phase.

