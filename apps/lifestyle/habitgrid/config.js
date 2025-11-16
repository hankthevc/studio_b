const appConfig = {
  slug: "habitgrid",
  hero: {
    eyebrow: "Consistency coach",
    title: "HabitGrid",
    tagline: "Paint your streak grid with 3 micro habits at a time."
  },
  form: {
    helper: "Add at least one habit line. Emoji welcome.",
    ctaLabel: "Plot my grid",
    fields: [
      {
        type: "textarea",
        name: "habits",
        label: "Habits (one per line)",
        placeholder: "e.g., 10 pushups\n15 min read\nWater refill",
        required: true
      },
      {
        type: "select",
        name: "streakGoal",
        label: "Streak goal",
        options: [
          {
            label: "7 days",
            value: "7",
            default: true
          },
          {
            label: "14 days",
            value: "14"
          },
          {
            label: "21 days",
            value: "21"
          }
        ]
      },
      {
        type: "chips",
        name: "tone",
        label: "Coaching tone",
        options: [
          {
            label: "Soft",
            value: "soft"
          },
          {
            label: "Cheer squad",
            value: "cheer",
            default: true
          },
          {
            label: "Accountability buddy",
            value: "accountable"
          }
        ]
      },
      {
        type: "select",
        name: "reminder",
        label: "Reminder moment",
        options: [
          {
            label: "Morning",
            value: "morning",
            default: true
          },
          {
            label: "Lunch",
            value: "lunch"
          },
          {
            label: "Evening",
            value: "evening"
          }
        ]
      }
    ]
  },
  placeholder: "List a few habits to map your next streak.",
  freePlanLimit: 1,
  share: {
    label: "Share grid link",
    cta: "Copy grid"
  },
  upsell: {
    title: "HabitGrid Pro",
    copy: "Run multiple boards, export history, and invite accountability partners.",
    bullets: [
      "Unlimited grids + themes.",
      "CSV/PDF export of streaks.",
      "Partner mode with shared check-ins."
    ],
    ctaLabel: "Upgrade for partner mode"
  },
  plan: {
    summary: {
      title: "{{labels.streakGoal}}-day grid ready",
      subtitle: "Tone: {{labels.tone}} with reminders at {{labels.reminder}}.",
      metrics: [
        {
          label: "Habits tracked",
          value: "Up to 5"
        },
        {
          label: "Reminder",
          value: "{{labels.reminder}}"
        },
        {
          label: "Heatmap palette",
          value: "Sunrise"
        }
      ]
    },
    sections: [
      {
        title: "Grid setup",
        description: "Anchor your why and prep the squares.",
        items: [
          "Name the streak + affirmation.",
          "Assign colors for low/medium/high completeness.",
          "Pin quick-note area for reflections."
        ]
      },
      {
        title: "Daily cadence",
        description: "Micro instructions for each habit line.",
        items: [
          "Morning reminder at {{labels.reminder}} includes habit summary.",
          "Tap square to mark Partial/Full per line.",
          "Log a 1-sentence recap nightly."
        ]
      },
      {
        title: "Celebrate & iterate",
        description: "Plan celebratory beats to keep motivation high.",
        items: [
          "At day 7, drop a cheer message.",
          "Missed day? HabitGrid suggests a soft reset.",
          "End-of-streak review with highlight and next target."
        ]
      }
    ],
    tips: [
      "Keep habits drawable in <10 minutes to avoid burnout.",
      "Use share link to DM accountability partners.",
      "Upgrade for multiple grids + partner mode."
    ],
    highlight: {
      eyebrow: "Streak is primed",
      copy: "Tape the grid to your monitor or fridge for analog reinforcement."
    },
    fields: [
      {
        type: "textarea",
        name: "habits",
        label: "Habits (one per line)",
        placeholder: "e.g., 10 pushups\n15 min read\nWater refill",
        required: true
      },
      {
        type: "select",
        name: "streakGoal",
        label: "Streak goal",
        options: [
          {
            label: "7 days",
            value: "7",
            default: true
          },
          {
            label: "14 days",
            value: "14"
          },
          {
            label: "21 days",
            value: "21"
          }
        ]
      },
      {
        type: "chips",
        name: "tone",
        label: "Coaching tone",
        options: [
          {
            label: "Soft",
            value: "soft"
          },
          {
            label: "Cheer squad",
            value: "cheer",
            default: true
          },
          {
            label: "Accountability buddy",
            value: "accountable"
          }
        ]
      },
      {
        type: "select",
        name: "reminder",
        label: "Reminder moment",
        options: [
          {
            label: "Morning",
            value: "morning",
            default: true
          },
          {
            label: "Lunch",
            value: "lunch"
          },
          {
            label: "Evening",
            value: "evening"
          }
        ]
      }
    ]
  }
};

export { appConfig };
