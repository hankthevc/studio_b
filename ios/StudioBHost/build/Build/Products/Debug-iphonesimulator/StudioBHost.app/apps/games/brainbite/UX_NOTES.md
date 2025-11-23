# BrainBite UX Notes

## Flow
1. Hero `BrainBite` with eyebrow `Daily brain snack`.
2. Form fields: category select (Logic, Trivia, Pattern, Wordplay), difficulty pills (Chill, Tricky, Spicy), puzzle type toggle (Multiple choice / Free answer).
3. CTA `Serve My Bite` triggers loader with bouncing dots.
4. Results show puzzle card (prompt + input UI + Submit, hint + reveal buttons), streak summary card, share row, upsell banner.
5. Error helper: `Pick a category for your bite.` Hint button reveals clue text inline; Reveal answer flips card state.

## Wireframe
```
BrainBite 🧠
Daily brain snack
[Category ▼]
[Difficulty pills]
[Type toggle]
[ Serve My Bite ]

-- Loader --
┌ card ┐
| Mixing up a bite... |
| ● ● ●               |
└─────┘

-- Result --
Puzzle card:
Prompt text
Input or options
[Hint] [Reveal] [Submit]
Streak summary card
Share row + Upsell
```

## Copy
- CTA: `Serve My Bite`
- Loader: `Mixing your next brain bite...`
- Hint button: `Hint`
- Reveal button: `Reveal answer`
- Submit button: `Check answer`
- Streak header: `Streak status`
- Share label: `Share your brag`
- Upsell: `Unlock archives, streak shields, and custom categories.`
- Error helper: `Pick a category for your bite.`
