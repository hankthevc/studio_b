const appConfig = {
  slug: "pitchpulse",
  hero: {
    eyebrow: "Pitch coach",
    title: "PitchPulse",
    tagline: "Draft a lightning intro with clarity cues."
  },
  form: {
    helper: "Audience + tone required.",
    ctaLabel: "Draft pitch",
    fields: [
      {
        type: "select",
        name: "audience",
        label: "Audience",
        options: [
          {
            label: "Investor",
            value: "investor"
          },
          {
            label: "Hiring manager",
            value: "hiring",
            default: true
          },
          {
            label: "Peer networking",
            value: "peer"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Confident",
            value: "confident",
            default: true
          },
          {
            label: "Warm",
            value: "warm"
          },
          {
            label: "High-energy",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time window",
        options: [
          {
            label: "20 sec",
            value: "20"
          },
          {
            label: "30 sec",
            value: "30",
            default: true
          },
          {
            label: "45 sec",
            value: "45"
          }
        ]
      },
      {
        type: "select",
        name: "focus",
        label: "Focus",
        options: [
          {
            label: "Product",
            value: "product"
          },
          {
            label: "Team",
            value: "team"
          },
          {
            label: "Traction",
            value: "traction",
            default: true
          }
        ]
      }
    ]
  },
  placeholder: "Tell PitchPulse about the audience and vibe.",
  freePlanLimit: 1,
  share: {
    label: "Share pitch",
    cta: "Copy pitch"
  },
  upsell: {
    title: "PitchPulse Pro",
    copy: "Store role profiles, rehearsal mode, and share links.",
    bullets: [
      "Save unlimited role profiles.",
      "Rehearsal timer + filler alert.",
      "Shareable pitch links."
    ],
    ctaLabel: "Upgrade for rehearsal"
  },
  plan: {
    summary: {
      title: "{{labels.audience}} pitch",
      subtitle: "Tone {{labels.tone}} \u00b7 {{labels.time}} sec \u00b7 Focus {{labels.focus}}.",
      metrics: [
        {
          label: "Hook",
          value: "3 beats"
        },
        {
          label: "Score",
          value: "8.7 clarity"
        },
        {
          label: "CTA",
          value: "Deterministic"
        }
      ]
    },
    sections: [
      {
        title: "Pitch draft",
        description: "Paragraph ready to rehearse.",
        items: [
          "Opening hook referencing {{labels.audience}} pain.",
          "Proof point tied to {{labels.focus}}.",
          "Call-to-action tailored to time."
        ]
      },
      {
        title: "Trim + polish",
        description: "Suggestions to tighten.",
        items: [
          "Remove filler words (list).",
          "Highlight phrase to emphasize.",
          "Breath/pauses cues."
        ]
      },
      {
        title: "Follow-up",
        description: "How to continue convo.",
        items: [
          "What to ask the listener.",
          "Asset to offer (deck, demo).",
          "Reminder to log takeaways."
        ]
      }
    ],
    tips: [
      "Upgrade for rehearsal timers + saved pitches.",
      "Record yourself and compare to clarity cues.",
      "Share link with mentor for feedback."
    ],
    highlight: {
      eyebrow: "Pitch pulsing",
      copy: "Practice twice before next conversation."
    },
    fields: [
      {
        type: "select",
        name: "audience",
        label: "Audience",
        options: [
          {
            label: "Investor",
            value: "investor"
          },
          {
            label: "Hiring manager",
            value: "hiring",
            default: true
          },
          {
            label: "Peer networking",
            value: "peer"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Confident",
            value: "confident",
            default: true
          },
          {
            label: "Warm",
            value: "warm"
          },
          {
            label: "High-energy",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time window",
        options: [
          {
            label: "20 sec",
            value: "20"
          },
          {
            label: "30 sec",
            value: "30",
            default: true
          },
          {
            label: "45 sec",
            value: "45"
          }
        ]
      },
      {
        type: "select",
        name: "focus",
        label: "Focus",
        options: [
          {
            label: "Product",
            value: "product"
          },
          {
            label: "Team",
            value: "team"
          },
          {
            label: "Traction",
            value: "traction",
            default: true
          }
        ]
      }
    ]
  }
};

export { appConfig };
