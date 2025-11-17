# WKWebView Content Security Policy (CSP) Guidance

The mini-apps ship as static HTML, CSS, and JS. Apply a tight CSP when hosting them inside WKWebView/SFSafariViewController:

```
default-src 'none';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-src 'none';
base-uri 'none';
form-action 'none';
```

## Rationale
- **No remote eval**: All logic is packaged locally, so `script-src 'self'` + no `unsafe-eval` keeps the attack surface small.
- **Inline styles**: `shared/appShell.css` uses scoped inline styles for loaders; allow `'unsafe-inline'` on styles only.
- **Images & fonts**: Mini-apps reference assets next to the HTML bundle. `data:` covers the deterministic SVG screenshots.
- **Networking**: Everything is deterministic/offline, so `connect-src 'self'` disables unapproved network calls. Hosts may add telemetry endpoints if needed.

## WKWebView configuration checklist
1. Set `configuration.preferences.javaScriptCanOpenWindowsAutomatically = false`.
2. Disable arbitrary loads unless you explicitly proxy remote assets.
3. Use `WKContentRuleList` to block external trackers if you embed third-party experiences later.
4. Pair the CSP with `WKWebpagePreferences.limitsNavigationsToAppBoundDomains = true` for production builds.

Document any CSP deviations inside `EMBED.md` for the affected app so host reviewers understand why a relaxed policy is required.

