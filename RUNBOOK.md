## Operating Directive & Roadmap

All pods and agents must align to the following roadmap. Treat these phases as our source of truth for prioritization, definition of done, and hand-offs.

### Phase 0 — Foundation (Complete)
- Establish TripSpark quality bar (hero/form → loader → stacked cards → share/upsell).
- Stand up shared primitives (`shared/`), Option B scaffolder, SPEC/UX templates, RUNBOOK, and pod structure.

### Phase 1 — Portfolio Production (In Flight)
- Deliver 30 deterministic mini-apps (TripSpark + 29).
- Sequencing: Tier 1 pods first (Travel/Lifestyle, Food/Productivity/Creator, Finance/Career, Games/Creator), then Tier 2/3.
- Definition of done per app: SPEC/UX finalized, deterministic `logic.js`, TripSpark-level UI/UX, updated README + `apple.json`, lint clean, QA server run, entry logged in pod Status Log.
- GitHub: push major milestones to `main` after QA; keep repo up to date for cross-pod visibility.

### Phase 2 — Consumer Readiness
- Layer usability polish: accessibility audit, responsive tweaks, copy QA, consistent animations.
- Add per-app README sections (What it does / Flow / Free vs Pro) plus screenshots or Loom links.
- Establish integration checklist for host apps (embed instructions, theming knobs).
- Build smoke-test CI to run lint + HTML validation on PRs (see `.github/workflows/ci.yml` for current coverage).
- Use `QA_CHECKLIST.md` before closing Phase 2 tasks.

### Phase 3 — Monetization Readiness
- Harden upsell flows: consistent CTA surfaces, gating logic, instrumentation hooks.
- Define pricing tiers per app (driven by `ideas.yaml`), ensure copy matches across SPEC → UI → README.
- Prepare mock billing events / analytics stubs for eventual API wiring.
- Produce “Monetization Playbook” doc summarizing patterns host apps can reuse.

### Phase 4 — Distribution & Host Enablement
- Create embed kits: lightweight integration snippets, white-label instructions, host app QA checklist.
- Bundle showcase demos (e.g., top 5 apps) with cohesive branding for partner outreach.
- Measure readiness: manual QA matrix (devices/browsers), latency tests, share-link resilience.
- Transition to monetized pilots: document API requirements, billing hooks, success metrics.

### Operating Expectations
- Pods own execution but must reference this roadmap before starting new work.
- Status logs should reference phase + milestone (e.g., “P1-App Build complete”, “P2-Polish: copy QA done”).
- Shared Infra pod ensures CI/README updates and captures learnings back into this directive.
- No app moves to Monetization (Phase 3) until Phase 2 checklist is complete and logged.

---

## Miniapps Studio Runbook

### 1. Scaffold a New Mini-App (Option B workflow)
- From repo root `~/miniapps-studio-b`, run `python3 scripts/option_b_build.py --slug <slug>` (slug must exist in `ideas.yaml` with category metadata).
- The script creates `apps/<category>/<slug>/` containing: `index.html`, `app.js`, `styles.css`, `logic.js`, `SPEC.md`, `UX_NOTES.md`, `README.md`, and `apple.json`. It also ensures `shared/` stubs exist.
- Rerun the command safely; it only writes files that do not already exist. Delete a file first if you need to regenerate it from the scaffold.

### 2. Refine the Scaffold in Cursor
- Open the new app directory and read SPEC/UX files to confirm positioning before touching code.
- Iterate in this order for consistency:
  1. Update `SPEC.md` and `UX_NOTES.md` with finalized requirements.
  2. Implement deterministic mock logic in `logic.js` (use `shared/llmClient.js` stubs when possible).
  3. Build UI in `index.html` + `app.js`, leaning on helpers from `shared/ui.js` and tokens from `shared/styles.css`.
  4. Layer bespoke styling in the app’s `styles.css`, keeping variables prefixed with the app slug.
- After each major edit, refresh the local preview (see Section 3) and sanity-check against the UX notes.
- Keep interactions deterministic until real APIs exist; call the shared LLM stubs and shape the response inside the app.

### 3. Test Locally
- Launch a simple server from the app directory: `python3 -m http.server 8080 -d apps/<category>/<slug>`.
- Visit `http://localhost:8080` in Safari/Chrome mobile emulation to inspect layout, animation, and clipboard behavior.
- Alternatively, run from repo root: `python3 -m http.server 8080` and browse to `/apps/<category>/<slug>/`.
- Use browser dev tools to simulate iPhone widths (~375px) and low network conditions to validate loading states.

### 4. Maintain Cross-App Consistency
- Typography, buttons, cards, and toasts should come from `shared/styles.css` + `shared/ui.js` unless a product-specific variation is required.
- Reuse shared copy patterns: hero eyebrow/title/tagline, friendly CTAs, toast confirmations, upsell banners with clear value statements.
- Keep animations subtle and performant (CSS transitions only; avoid heavy JS timers).
- All monetization messaging must mirror what’s in `ideas.yaml` and SPEC.
- Before finalizing an app, compare against TripSpark to ensure polish parity: mobile-first layout, clear flow, deterministic mocks, upsell moment, and share/tweak actions where relevant.

