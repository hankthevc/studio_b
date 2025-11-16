# Screenshot & Loom Capture Plan (Tier-1 Wave)

Date: 2025-11-16  
Owner: Shared Infra (Agent Atlas)  
Purpose: Replace deterministic SVG placeholders and supply real media assets for partner demos + App Store metadata.

## Capture Guidelines
1. **Environment**
   - Serve each app locally via `python3 -m http.server 8080 -d apps/<category>/<slug>` (or consolidated root server).
   - Use iPhone 15 Pro (375 × 812) viewport in Safari Responsive Design Mode or Chrome DevTools device emulation.
   - Disable browser UI chrome; ensure scrollbars are hidden for clean captures.
2. **State Prep**
   - Complete the form with realistic data for the target user.
   - Wait for the deterministic plan to render fully (summary + sections + share row + upsell visible).
   - Ensure toasts are not visible unless they are part of the story you want to show.
3. **Capture**
   - Take a PNG at 2× scale (750 × 1624) for App Store + README.
   - Record a 20–30s Loom walkthrough (hero → input → plan) where applicable.
4. **Storage**
   - Drop PNGs into `docs/screenshots-real/<slug>.png`.
   - Update `apps/<category>/<slug>/README.md` to reference the PNG instead of the SVG placeholder.
   - Link Loom URLs in the README “Screenshot or Loom” section (optional field) and in `partner-kit/showcase/index.html`.

## App-by-App Checklist
| App | Category | Shot Story | Loom Angle | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| TripSpark | Travel | Show a Lisbon culture itinerary with upsell banner visible. | Walkthrough of form submission + regenerate. | Pod A | ☐ |
| PocketPorter | Travel | Highlight compliance card + share row. | Demonstrate save-wardrobe upsell tap. | Pod A | ☐ |
| SipSync | Lifestyle | Display hydration schedule with smart bottle chip selected. | Showcase reminder settings + toasts. | Pod A | ☐ |
| MealMind | Lifestyle | Weekly plan summary + grocery shortlist cards. | Show Pro preset save attempt → upsell. | Pod B | ☐ |
| StorySpark | Creator | Hook variants card stack with share row open. | Demo regenerate and copy actions. | Pod B | ☐ |
| HookLab | Creator | Thumbnail text variants with vibe chips visible. | Record slider adjustments + upsell gating. | Pod B | ☐ |
| FocusTiles | Productivity | Tiles grid + log session CTA. | Show timer start + log session event. | Pod B | ☐ |
| PrepCoach | Career | Prompt + feedback cards plus share row. | Walkthrough of question generation + export gating. | Pod C | ☐ |
| MoneyMicro | Finance | “Can I afford this” breakdown with tip copy. | Illustrate slider change + export attempt. | Pod C | ☐ |
| BrainBite | Games | Puzzle card + streak indicator + upsell. | Show daily puzzle solve + shield event. | Pod D | ☐ |
| LiftShift | Fitness | Training block card plus upsell. | Show regenerate plan + export attempt. | Pod F | ☐ |

## Delivery Process
1. Pod owners claim their app(s) in pod logs and add a timestamped “Screenshot capture” entry.
2. After capturing media:
   - Commit PNG to `docs/screenshots-real/`.
   - Update README image reference + embed Loom link.
   - Mention capture in `STATUS_SUMMARY.md` (optional) and partner kit showcase once a Loom exists.
3. Shared Infra reviews all assets before replacing placeholders in marketing materials.

## Pending Enhancements
- Automate a checklist in CI to detect placeholder SVG references once real PNGs land.
- Add a `npm run screenshots:check` script that verifies each Tier-1 README references `docs/screenshots-real/`.
- Extend plan to Tier 2/3 after Tier-1 bundle ships.

