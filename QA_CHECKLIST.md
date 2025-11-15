# QA Checklist

Use this checklist before logging an app as Phase 1 complete or moving into consumer-ready polish.

## 1. Functional
- [ ] Form validations trigger helper text and focus the offending field.
- [ ] Loading state appears for at least 300ms with accessible `aria-hidden` animations.
- [ ] Deterministic mock data returns without throwing; regenerate path works.
- [ ] Share/copy buttons show toast confirmation and fall back to `execCommand` if clipboard API fails.
- [ ] Upsell CTA renders after the first successful generation and is gated behind free limits.

## 2. Visual
- [ ] Hero/form, cards, and CTA spacing match TripSpark reference (single column, ≤480px width).
- [ ] Buttons, cards, and toasts rely on `shared/styles.css` tokens unless intentionally overridden.
- [ ] Animations respect `prefers-reduced-motion` (shared CSS already handles this; verify visually).
- [ ] Empty/error states match UX copy in `UX_NOTES.md`.

## 3. Responsiveness & Browser
- [ ] Test in Chrome/Safari mobile emulation at 375px width.
- [ ] Verify scroll behavior for long cards (no horizontal scrolling).
- [ ] Run `python3 -m http.server 8080 -d apps/<category>/<slug>` and hit the page locally; ensure no console errors.

## 4. Accessibility
- [ ] All interactive elements are reachable via keyboard (tab order through form, cards, share buttons).
- [ ] Inputs have associated labels (already baked into templates—double-check when customizing).
- [ ] Color contrast meets WCAG AA (use shared palette or verify overrides with a quick contrast check).

## 5. Documentation & Logging
- [ ] `SPEC.md` + `UX_NOTES.md` reflect the implemented experience.
- [ ] `README.md` and `apple.json` updated with final copy/metadata.
- [ ] Pod Status Log entry records scaffold/spec, build completion, QA server timestamp.
- [ ] Push to GitHub once QA is complete (keep main in sync).

Shared Infra (Agent Atlas) runs periodic sweeps using this checklist and records results in `pods/pod-shared-infra.md`.

