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

## iOS Host Shell
- `ios/StudioBHost` ships a SwiftUI catalog that reads `miniapps-manifest.json`, enforces Declared Age Range gating, and wraps each HTML payload inside a WKWebView with the `MiniHost` JavaScript bridge.
- Set `MINIAPP_DEV_ROOT=/absolute/path/to/miniapps-studio-b` when running on Simulator so the host loads assets straight from the repo; omit it (or bundle the HTML under `ios/StudioBHost/Resources/MiniApps/`) before submitting to App Review.
- The bridge exposes `window.MiniHost.requestSubscription`, `.isSubscribed`, `.getAgeRange`, `.getAgeCategory` (legacy), and `.track`. See `shared/appShell.js` plus `partner-kit/analytics/contracts.md` for event expectations.
- Commerce mode defaults to a deterministic mock; point `STUDIOB_COMMERCE_BACKEND_URL` at `/server` (or your production backend) for Advanced Commerce initiation, or set `STUDIOB_COMMERCE_MODE=storekit` with real credentials to exercise StoreKit 2 locally.
- Associated Domains are configured via `ios/StudioBHost/StudioBHost.entitlements`. Run `node scripts/generate_aasa.mjs` to emit the `apple-app-site-association` file whenever the manifest changes and deploy it to `https://miniapps.studio/.well-known/`.

## Advanced Commerce Backend (reference)
- The `/server` directory contains an Express bootstrap (`server/index.js`) that:
  - Accepts purchase requests from the host (`POST /api/commerce/purchase`)
  - Proxies App Store Server API `sendConsumptionInformation`
  - Provides a webhook landing zone for StoreKit transaction notifications
- Copy `server/env.sample` to `.env`, fill in Apple credentials, and run `npm start` inside `server/`. Set `STUDIOB_COMMERCE_BACKEND_URL=http://localhost:8787` before launching the host to test the full loop.

## Development Workflow
1. **Scaffold / Refresh**
   - Use `python3 scripts/option_b_build.py --slug <slug>` for Tier 1 apps or `python3 scripts/generate_new_apps.py --slug <slug>` for the new app-shell based experiences.
   - Run `node scripts/phase2_refresh_readmes.mjs` after edits to normalize README structure + screenshots.
   - Run `npm run manifest:generate` whenever `apple.json` metadata changes to refresh `miniapps-manifest.json`, the iOS bundle copy, and the universal-link index.
   - CI runs `npm run manifest:check`; run it locally before committing to ensure the manifest, category slices, and bundled HTML payloads are current.
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
| `scripts/generate_manifest.mjs` | Validates every `apple.json` with `schema/miniapp.schema.json`, emits `miniapps-manifest.json`, copies it into `ios/StudioBHost/Resources/`, and builds `miniapps-index.html` for App Review submissions. |
| `scripts/sync_ios_manifest.mjs` | Convenience helper to copy an existing `miniapps-manifest.json` into the iOS bundle (no regeneration). |
| `scripts/normalize_miniapps_metadata.mjs` | One-off utility that upgrades legacy `apple.json` files into the unified schema; keep it handy when older pods migrate. |
| `scripts/generate_aasa.mjs` | Produces a deterministic `apple-app-site-association` file using every universal link in `miniapps-manifest.json`. |

Run these scripts whenever new apps land or documentation drifts so CI stays green.

## Pods at a Glance
- `pod-travel-lifestyle.md` – TripSpark, PocketPorter, LayoverLoop, SipSync, MealMind, RestNest, HabitGrid.
- `pod-food-productivity.md` – StorySpark, HookLab, FlowStreak, InboxZen, MeetingMinder, TempoBuddy, FocusTiles.
- `pod-finance-career.md` – MoneyMicro, BillBreeze, SliceSaver, TipTally, PrepCoach, PitchPulse.
- `pod-games-creator.md` – BrainBite, QuestDash, ClipChoreo, BeatBoard.
- `pod-shared-infra.md` – shared components, RUNBOOK, partner kit, QA sweeps.

Each pod file lists owners, immediate queues, blockers, and the latest status log entry per phase.

