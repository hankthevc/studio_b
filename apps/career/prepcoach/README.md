# PrepCoach

AI mock interview coach that generates behavioral prompts, notes, and follow-ups, matching the TripSpark polish bar.

## What it does
- Collects role focus, seniority, company type, and optional strengths.
- Produces deterministic prompts with key angles, textarea draft space, coach notes, follow-up, share row, upsell.
- Keeps everything client-side with deterministic mocks for easy host integration.

## Who it's for
Career platforms or job seekers wanting mobile-first mock rounds.

## Monetization
Free three-question round; PrepCoach Pro unlocks full banks, saved answers, and recruiter-ready exports.

## Run locally
```
python3 -m http.server 8080 -d apps/career/prepcoach
# Visit http://localhost:8080
```
