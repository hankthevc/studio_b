# External Audit Brief

Date: 2025-11-16  
Prepared by: Studio Director (Cursor session)

## Access
- **Repository:** https://github.com/hankthevc/studio_b (public; root contains entire mono-repo).  
  _If you prefer a zip, clone and archive the root; no submodules._
- **Local build/run:**  
  ```bash
  git clone https://github.com/hankthevc/studio_b.git
  cd studio_b
  npm ci             # installs lint tooling (Node 20+)
  python3 -m http.server 8080   # serve entire repo; visit /apps/<category>/<slug>/index.html
  # or run per-app:
  python3 -m http.server 8080 -d apps/<category>/<slug>
  ```
- **Test commands:**  
  - `npm run lint:js` – ESLint across `shared/` + `apps/`.  
  - `npm run readme:check` – ensures README/screenshot template compliance.  
  - `python -m compileall scripts` – already in CI; optional local check.

## Context
- **Languages / Frameworks:** Vanilla HTML/CSS/JS for mini-apps; modern ES modules; Python 3.12 scripts; Node tooling (eslint, glob, htmlhint/csslint). No frontend frameworks (React/Vue/etc.).  
- **Target runtimes:** Browser runtime (WebKit/WebView/Chromium). Tooling assumes Node 20, Python 3.12.  
- **Datastores / Queues / External APIs:** None. All apps use deterministic mocks (no network calls). Billing/analytics are stubs (`window.requestSubscription`, CustomEvents).  
- **Priority Areas:**  
  1. Shared app shell (`shared/appShell.js`, `shared/planBuilder.js`) – ensure gating, event dispatch, error handling.  
  2. Newly scaffolded Tier-2/Tier-3 apps (LayoverLoop → PitchPulse) for copy/paste or security hygiene issues.  
  3. CI / tooling (`.github/workflows/ci.yml`, scripts/*) for supply-chain exposure or missing checks.  
  4. Partner kit (`partner-kit/`) – analytics contract, billing mock, QA guide.

## Security & Ops
- **Secrets handling:** Repo contains no secrets. Partners are expected to inject API keys via host apps; scripts/app code never embeds credentials.  
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`). Steps: checkout → Python compileall → `npm ci` → ESLint → README checker → HTMLHint/CSSLint. No deployment automation yet.  
- **Environments:** Single branch (`main`). All runtime is static web assets; hosting environments (dev/stage/prod) not codified.  
- **Data sensitivity:** No PII/PHI. Deterministic mocks only; share links are stubbed. No compliance constraints yet.  

## Constraints
- **Do NOT:** run production migrations (none exist), call external APIs (there are none), or add third-party SDKs without review.  
- **Licensing:** All dependencies are standard OSS (eslint, glob, htmlhint, csslint, yaml). No vendored proprietary libraries.  

## Auditor Deliverables (requested)
- Prioritized findings (Critical→Low) with impact/evidence/fixes.
- Patch-ready diffs/snippets for key issues.
- Dependency & supply-chain review (vulns, outdated libs, typosquats).
- Security review: authn/z patterns (mostly custom), input handling, event dispatch, clipboard usage, XSS risks, SSRF/RCE/SQLi/XXE (unlikely but check templating), CORS/headers.
- Reliability/correctness: error handling inside shared shell, deterministic logic, regenerate flows.
- Performance: look for heavy loops or repeated DOM work; highlight opportunities (memoization, caching).
- Tests & CI/CD: comment on coverage gaps (there are no automated tests yet), reproducibility, lint scope.
- Architecture/maintainability: module boundaries, dead code, logging/observability gaps.

## Working Expectations
1. **Inventory** repo structure, languages, SBOM, dependency graph.
2. **Static review**: targeted scans/grep for risky patterns; inspect configs/IaC.
3. **Dynamic checks**: run the provided lint/test commands; no live external calls.
4. **Deep dives** into shared shell, Tier-1/Tier-2 apps, partner kit, CI/tooling.
5. **Report** per deliverables above, with actionable fixes and ready-to-apply diffs.

_If scope needs to narrow (repo is mono, but large), prioritize shared infra and the Tier‑1 Eleven apps (TripSpark, PocketPorter, SipSync, MealMind, StorySpark, HookLab, FocusTiles, PrepCoach, MoneyMicro, BrainBite, LiftShift)._ 

