# TripSpark UX Notes

## Flow
1. **Hero + form.** Small hero (eyebrow "AI trip planner", title, tagline) followed by a single-column form: destination text input, optional dates input, vibe select, budget slider, pace tags, then CTA.
2. **CTA interaction.** Tapping `Spark My Trip` either validates missing destination (inline message) or moves to a loading card with animated spark dots + reassuring copy.
3. **Results state.** Loading card is replaced with:
   - Spark Highlight banner (delight hook) summarizing a standout activity for the city/vibe.
   - Three stacked day cards showing morning/afternoon/evening rows and per-day total chips.
   - Budget overview card with per-day breakdown and "Smart saver tip."
   - Share row containing read-only short link, copy action, and Pro-only export button.
4. **Upsell + regenerate.** After the first itinerary, upsell banner slides in under results. A "Tweak & regenerate" button rebuilds the itinerary using the last inputs (no extra form steps).
5. **Error/empty states.** If no destination is entered, the submit button shakes subtly and a helper line says "Add a city to spark your plan." Clipboard failures fall back to select + copy instructions.

Hook moment: Spark Highlight card fades in with a tiny spark icon + gradient border before day cards animate upward.

## Wireframes

```
+--------------------------------------------------+
| TripSpark ✨                                      |
| 3-day plans, zero spreadsheets                   |
| [Destination        ]                             |
| [Dates ▼]   [Select vibe ▼]                      |
| Budget slider:  $   $$   $$$                      |
| Pace tags:  ( ) Chill  (•) Balanced  ( ) Bold     |
| [ Spark My Trip ]                                 |
+--------------------------------------------------+

-- Loading --
┌ spark loader card ┐
| Sketching your perfect 3-day spark... |
| ●  ●  ●                               |
└──────────────────────────────────────┘

-- Results --
┌ Spark Highlight 🔥 ┐
| Tapas crawl with chef intro          |
└──────────────────────────────────────┘
┌ Day 1 card ┐ Morning ... $45         |
| Afternoon ... $35                    |
| Evening ... $60                      |
| Day total chip: $140                 |
└──────────────────────────────────────┘
(repeat Day 2 + Day 3)

Budget overview card
[Day1 $140][Day2 $155][Day3 $135]  Total $430
Smart saver tip text

Shareable link: tripspark.app/s/lisbon-9xq
[Copy]  [Export & share (Pro)]
[Tweak & regenerate]

Upsell banner: "Upgrade for unlimited trips + exports" [Upgrade button]
```

## Copy
- Title: `TripSpark`
- Eyebrow: `AI trip planner`
- Tagline: `3-day city itineraries tailored to your vibe.`
- Destination placeholder: `City (e.g., Lisbon)`
- Dates placeholder: `Pick 3 days`
- Vibe select options: `Foodie`, `Culture`, `Nightlife`, `Outdoors`, `Hidden gems`
- Budget slider labels: `$`, `$$`, `$$$`
- Pace tags: `Chill`, `Balanced`, `Adventurous`
- Primary CTA: `Spark My Trip`
- Loading copy: `Sketching your perfect 3-day spark...`
- Highlight eyebrow: `Spark Highlight`
- Day row labels: `Morning`, `Afternoon`, `Evening`
- Budget summary header: `Budget overview`
- Saver tip label: `Smart saver tip`
- Share label: `Shareable link`
- Copy toast: `Link copied!`
- Export CTA: `Export & share (Pro)`
- Upsell body: `Subscribe to unlock unlimited trips and calendar exports.`
- Upsell button: `Upgrade for unlimited trips`
- Regenerate button: `Tweak & regenerate`
- Empty error: `Add a city to spark your plan.`
