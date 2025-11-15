# TripSpark

## What it does
TripSpark is a mobile-first AI mini-app that turns a city + vibe + budget slider into a Spark Highlight and structured 3-day itinerary. Each plan surfaces morning/afternoon/evening blocks with estimated spend, a budget overview card with saver tips, a fake short link for sharing, and a regenerate action—all powered by the mock `callTripSparkLLM` seed plus deterministic client logic so it runs fully offline.

## Who it’s for
Busy travelers (solo professionals or couples) planning short urban getaways on their phones. They want instant, balanced itineraries that feel curated, respect budgets, and can be copy‑shared with partners before they commit.

## Monetization
The first itinerary is free. Upgrading (placeholder $4.99/month) unlocks unlimited plans, export-to-calendar/notes, and premium share links. The UI exposes:
- Export button labeled “Export & share (Pro)” that triggers the upsell toast until subscribed.
- Upsell banner that appears after the first itinerary with a CTA to launch the host billing flow.

## Quick usage
1. Open `index.html` in a mobile WebView or local browser (shared styles are imported automatically).
2. Provide destination, optional dates, vibe, pace tag, and adjust the budget slider.
3. Tap **Spark My Trip** to show the loading spark animation; results include the highlight card, day cards, budget summary, and share row.
4. Tap **Copy** to copy the fake short link (toast confirms) or **Tweak & regenerate** to remix the same form values.

## QA checklist (Phase 2)
- [x] Form validations: destination required with helper + focus.
- [x] Keyboard/voiceover: labels present on inputs, buttons reachable via tab.
- [x] Responsive: verified at 375px in Chrome/Safari emulation.
- [x] Copy audit: matches `UX_NOTES.md` text, upsell copy aligned with monetization.
- [x] Accessibility: shared tokens respect `prefers-reduced-motion`; color contrast >= AA.
- [x] Local QA server: `python3 -m http.server 8080 -d apps/travel/tripspark` (2025-11-14).

## Host Integration Notes
- Initialize via `initMiniApp(containerElement)` once the host DOM is ready; the entry point attaches listeners and renders the hero/form/results stack.
- Replace the toast inside `buildUpsellBanner` with the host purchase flow and emit analytics (e.g., `tripspark.upgradeTapped`, `tripspark.subscriptionStarted`) to respect the “one free itinerary” rule.
- Swap the mock generator by wiring `shared/llmClient.callTripSparkLLM` to a real backend endpoint; keep the payload shape `{ destination, vibe, pace, budgetLevel, stayLength }` for compatibility.
- Provide clipboard and export bridges if the host needs additional permissions; both actions are centralized in `buildShareRow` for easy interception.
