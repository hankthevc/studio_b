# LiftShift UX Notes

## Flow
1. **Hero + form.** Eyebrow `AI strength coach`, title `LiftShift`, tagline about progressive blocks. Form fields: focus select, equipment pill picker, days/week slider, session length slider, optional note input.
2. **CTA interaction.** `Build My Block` validates focus selection, disables button, and transitions into a loading card with animated barbell plates.
3. **Results state.** Loader fades into:
   - Cycle highlight card summarizing the block theme and top cue.
   - Four stacked day cards with headers (`Day 1 — Upper Power`) including Warmup/Main/Finisher segments and estimated minutes chip.
   - Recovery card containing deload reminder + recovery cues.
   - Share row (readonly short link + Copy + Export gated + Regenerate).
4. **Upsell.** After the first block, upsell banner appears promoting LiftShift Pro benefits.
5. **Error/empty.** Missing focus shows helper text `Select a focus to build your block.` Clipboard fallback matches TripSpark pattern.

## Wireframe (mobile)
```
LiftShift 💪
AI strength coach
[Focus ▼]
[Equipment chips]
[ Days/week slider ]
[ Session length slider ]
[ Notes (optional) ]
[ Build My Block ]

-- Loading --
┌ loading card ┐
| Racking plates...        |
| ● ● ●                    |
└──────────────────────────┘

-- Results --
┌ Cycle highlight ┐
| Strength focus summary    |
└──────────────────────────┘
┌ Day card ┐ Warmup/Main/Finisher + minutes chip
└──────────┘ (repeat for day 2–4)
Recovery cues card
Share row: link + buttons
Upsell banner: Unlock 8-week cycles
```

## Copy
- Title: `LiftShift`
- Eyebrow: `AI strength coach`
- Tagline: `Adaptive strength blocks in under a minute.`
- CTA: `Build My Block`
- Loader copy: `Racking plates for your next progression...`
- Highlight eyebrow: `Cycle focus`
- Segment labels: `Warmup`, `Main set`, `Finisher`
- Recovery header: `Recovery cues`
- Share label: `Share with your crew`
- Export CTA: `Export & track (Pro)`
- Upsell copy: `Upgrade for 8-week cycles, progression tracking, and export.`
- Error helper: `Select a focus to build your block.`
