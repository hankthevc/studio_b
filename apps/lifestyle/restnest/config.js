const appConfig = {
  slug: "restnest",
  hero: {
    eyebrow: "Wind-down guide",
    title: "RestNest",
    tagline: "End the day with a structured, cozy routine."
  },
  form: {
    helper: "Need vibe + time block to craft the flow.",
    ctaLabel: "Craft wind-down",
    fields: [
      {
        type: "chips",
        name: "eveningFeel",
        label: "Tonight feels",
        options: [
          {
            label: "Wired",
            value: "wired"
          },
          {
            label: "Meh",
            value: "meh",
            default: true
          },
          {
            label: "Calm",
            value: "calm"
          }
        ]
      },
      {
        type: "select",
        name: "room",
        label: "Where are you winding down?",
        options: [
          {
            label: "Bedroom",
            value: "bedroom",
            default: true
          },
          {
            label: "Living room",
            value: "living"
          },
          {
            label: "Hotel / travel",
            value: "travel"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time available",
        options: [
          {
            label: "8 minutes",
            value: "8"
          },
          {
            label: "10 minutes",
            value: "10",
            default: true
          },
          {
            label: "15 minutes",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "partner",
        label: "Solo or partner?",
        options: [
          {
            label: "Solo",
            value: "solo",
            default: true
          },
          {
            label: "Partner",
            value: "partner"
          }
        ]
      }
    ]
  },
  placeholder: "Tell RestNest how tonight feels.",
  freePlanLimit: 1,
  share: {
    label: "Share wind-down",
    cta: "Copy link"
  },
  upsell: {
    title: "RestNest Pro",
    copy: "Unlock multi-night stacks, soundscapes, and partner sharing.",
    bullets: [
      "Save favorite routines + audio cues.",
      "Multi-night playlist builder.",
      "Partner sync invites."
    ],
    ctaLabel: "Upgrade for multi-night"
  },
  plan: {
    summary: {
      title: "{{labels.duration}} RestNest",
      subtitle: "Mood {{labels.eveningFeel}} \u00b7 Room {{labels.room}}.",
      metrics: [
        {
          label: "Breath cycles",
          value: "4"
        },
        {
          label: "Prompts",
          value: "3 short cues"
        },
        {
          label: "Soundscape",
          value: "Soft rain"
        }
      ]
    },
    sections: [
      {
        title: "Arrival",
        description: "Signal to your body that night mode is here.",
        items: [
          "Dim lights + start ambient noise.",
          "3-minute breath ladder (4-7-8).",
          "Stretch or child\u2019s pose if tension remains."
        ]
      },
      {
        title: "Journaling + release",
        description: "Download the day to clear mind loops.",
        items: [
          "Two-sentence gratitude prompt.",
          "Parking lot note for tomorrow\u2019s brain.",
          "If {{labels.partner}} mode, share one highlight each."
        ]
      },
      {
        title: "Drift cues",
        description: "Close with sensory signal.",
        items: [
          "Apply calming scent or lotion.",
          "Play playlist tuned to {{labels.eveningFeel}}.",
          "Set wake-up intention."
        ]
      }
    ],
    tips: [
      "Wired nights benefit from longer breath sections.",
      "Screenshot routine to keep near bedside.",
      "Upgrade for multi-night stacks + partner sync."
    ],
    highlight: {
      eyebrow: "Nest ready",
      copy: "Phone goes on Do Not Disturb from here."
    },
    fields: [
      {
        type: "chips",
        name: "eveningFeel",
        label: "Tonight feels",
        options: [
          {
            label: "Wired",
            value: "wired"
          },
          {
            label: "Meh",
            value: "meh",
            default: true
          },
          {
            label: "Calm",
            value: "calm"
          }
        ]
      },
      {
        type: "select",
        name: "room",
        label: "Where are you winding down?",
        options: [
          {
            label: "Bedroom",
            value: "bedroom",
            default: true
          },
          {
            label: "Living room",
            value: "living"
          },
          {
            label: "Hotel / travel",
            value: "travel"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time available",
        options: [
          {
            label: "8 minutes",
            value: "8"
          },
          {
            label: "10 minutes",
            value: "10",
            default: true
          },
          {
            label: "15 minutes",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "partner",
        label: "Solo or partner?",
        options: [
          {
            label: "Solo",
            value: "solo",
            default: true
          },
          {
            label: "Partner",
            value: "partner"
          }
        ]
      }
    ]
  }
};

export { appConfig };
