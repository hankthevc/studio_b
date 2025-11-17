# Studio B Mini-Apps Terms of Use

Effective: 16 Nov 2025

## 1. Scope
These terms govern the HTML/CSS/JS mini-apps contained in the `miniapps-studio-b` repository. When a third-party host embeds a mini-app, their terms and privacy policy also apply.

## 2. License
- Mini-app payloads are provided for evaluation, prototyping, and pilot integrations.
- You may not redistribute the apps without including attribution to Studio B and keeping this `docs/terms.md` file accessible to end users.
- Reverse engineering for security review is allowed, but do not remove branding or shared analytics hooks.

## 3. Commerce & Subscriptions
- All monetary transactions run through the host app’s StoreKit 2 integration.
- Studio B never stores payment data. Refunds, cancellations, and tax handling are performed by the embedding host.
- When a purchase completes, the host must emit `MiniHostBridge:subscriptionUpdate` so the mini-app can unlock Pro experiences deterministically.

## 4. Acceptable Use
- Do not upload user PII, medical advice, or regulated financial data into text inputs—mini-apps are designed for lifestyle productivity scenarios only.
- Do not attempt to bypass the declared age range or expose native APIs through custom JavaScript.
- Keep payload sizes under 50 KB per Apple 4.7 guidance; hosts may refuse to load outsized bundles.

## 5. Support & Contact
For bug reports or takedown requests, email `support@miniapps.studio`. Include:
1. The mini-app slug (e.g., `tripspark`).
2. Host application/bundle identifier.
3. Steps to reproduce, screenshots, and device details.

We typically respond within 2 business days.

