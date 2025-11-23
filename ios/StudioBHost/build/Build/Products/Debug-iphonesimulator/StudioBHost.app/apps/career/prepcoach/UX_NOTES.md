# PrepCoach UX Notes

## Flow
1. **Hero + form:** Eyebrow `AI interview coach`, title `PrepCoach`, tagline about mock rounds. Form: role dropdown (PM/Sales/Ops/Eng), seniority slider, company focus tags (Startup/Mid/Enterprise), optional strengths input.
2. **CTA:** `Run Mock Round` validates role, shows resume-style loader.
3. **Results:** Highlight card (`Round focus`), prompt cards (question, key angle chips, textarea, copy button), feedback card (`Coach notes` bullets), follow-up card, share row (copy link + export gated), upsell banner.
4. **Regenerate:** Button rebuilds using last inputs.
5. **Error states:** Missing role shows helper `Select a role to run this mock round.` Clipboard fallback mirrors TripSpark.

## Wireframe
```
PrepCoach 🎤
AI interview coach
[Role ▼]
[Seniority slider]
[Company tags]
[Strengths input]
[ Run Mock Round ]

Loader card (resume icon)

Highlight card: Round focus
Prompt cards (textarea + copy)
Coach notes card
Likely follow-up card
Share row + Upsell
```

## Copy
- CTA: `Run Mock Round`
- Loader: `Reviewing your resume...`
- Highlight eyebrow: `Round focus`
- Prompt buttons: `Copy answer`
- Feedback header: `Coach notes`
- Follow-up header: `Likely follow-up`
- Share label: `Share with your mentor`
- Export CTA: `Export to doc (Pro)`
- Upsell: `Unlock full banks & recruiter exports`
- Error helper: `Select a role to run this mock round.`
