# Host QA Matrix

Target environments per app:

| Tier | Device / Browser | Notes |
| --- | --- | --- |
| Primary | iPhone 15 (iOS 17) – Safari | Verify clipboard permissions, CustomEvent propagation. |
| Primary | Pixel 8 (Android 14) – Chrome | Ensure share row copy + toasts behave in mobile Chrome. |
| Primary | React Native WebView (WKWebView) | Use a minimal RN shell to confirm `window.dispatchEvent` works. |
| Secondary | Samsung S23 – Samsung Internet | Catches OEM quirks around gradients and clipboard. |
| Secondary | Desktop Edge (Chromium) | Partners embedding in desktop overlays can reuse this pass. |

## Checklist (run per app)
1. Mount the embed snippet with `themes/presets.css` loaded.
2. Complete one full flow (plan/puzzle/generation) and confirm deterministic output.
3. Trigger Pro-only button → ensure `billingMock.requestSubscription` flips `state.isSubscribed`.
4. Verify all CustomEvents fire (use DevTools logs/Segment proxy).
5. Capture screenshot/video evidence and store in `docs/qa/<app>/`.
6. Log findings below.

## Result Log Template

```
### <App Name> – YYYY-MM-DD
- Device / Browser: …
- Findings:
  - [ ] Layout
  - [ ] Clipboard
  - [ ] Billing mock
  - [ ] Analytics events seen in Segment debugger
- Notes / follow-ups:
```

Copy the template for each run and paste into `docs/qa/<app>/report.md` so we can accumulate evidence for release tags.

