const appConfig = {
  slug: "skillsnack",
  hero: {
    eyebrow: "Daily snack",
    title: "SkillSnack",
    tagline: "Get a swipeable micro-lesson in under five minutes."
  },
  form: {
    helper: "Skill + time required.",
    ctaLabel: "Serve snack",
    fields: [
      {
        type: "select",
        name: "skill",
        label: "Skill track",
        options: [
          {
            label: "Excel shortcuts",
            value: "excel"
          },
          {
            label: "Negotiation prompts",
            value: "negotiation",
            default: true
          },
          {
            label: "Design critique",
            value: "design"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time available",
        options: [
          {
            label: "3 min",
            value: "3"
          },
          {
            label: "5 min",
            value: "5",
            default: true
          },
          {
            label: "8 min",
            value: "8"
          }
        ]
      },
      {
        type: "select",
        name: "format",
        label: "Preferred format",
        options: [
          {
            label: "Swipe cards",
            value: "cards",
            default: true
          },
          {
            label: "Audio snippet",
            value: "audio"
          },
          {
            label: "Mini quiz",
            value: "quiz"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence level",
        options: [
          {
            label: "Just starting",
            value: "new"
          },
          {
            label: "Getting there",
            value: "mid",
            default: true
          },
          {
            label: "Proving it",
            value: "pro"
          }
        ]
      }
    ]
  },
  placeholder: "Pick skill + mood to serve today\u2019s snack.",
  freePlanLimit: 1,
  share: {
    label: "Share snack",
    cta: "Copy link"
  },
  upsell: {
    title: "SkillSnack Pro",
    copy: "Unlock learning tracks, spaced review, and certification prep.",
    bullets: [
      "Track-based progression.",
      "Spaced repetition reminders.",
      "Quiz export + certification tips."
    ],
    ctaLabel: "Upgrade for tracks"
  },
  plan: {
    summary: {
      title: "{{labels.skill}} snack",
      subtitle: "Format {{labels.format}} \u00b7 Confidence {{labels.confidence}}.",
      metrics: [
        {
          label: "Total time",
          value: "{{labels.time}} min"
        },
        {
          label: "Cards",
          value: "3 steps"
        },
        {
          label: "Challenge",
          value: "1 action"
        }
      ]
    },
    sections: [
      {
        title: "Primer",
        description: "Give context quickly.",
        items: [
          "One-liner definition.",
          "Why it matters this week.",
          "Confidence-specific encouragement."
        ]
      },
      {
        title: "Snack steps",
        description: "Three actionable beats.",
        items: [
          "Step 1 tied to {{labels.skill}}.",
          "Step 2 with tip/trick.",
          "Step 3 with mini challenge."
        ]
      },
      {
        title: "Apply + share",
        description: "Prompt to use knowledge.",
        items: [
          "Real-world micro assignment.",
          "Reflection question.",
          "Share link to accountability friend."
        ]
      }
    ],
    tips: [
      "Upgrade for track progress + history.",
      "Use share link to embed inside LMS.",
      "Regenerate for different format/mood."
    ],
    highlight: {
      eyebrow: "Snack delivered",
      copy: "Complete within {{labels.time}} minutes for best results."
    },
    fields: [
      {
        type: "select",
        name: "skill",
        label: "Skill track",
        options: [
          {
            label: "Excel shortcuts",
            value: "excel"
          },
          {
            label: "Negotiation prompts",
            value: "negotiation",
            default: true
          },
          {
            label: "Design critique",
            value: "design"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time available",
        options: [
          {
            label: "3 min",
            value: "3"
          },
          {
            label: "5 min",
            value: "5",
            default: true
          },
          {
            label: "8 min",
            value: "8"
          }
        ]
      },
      {
        type: "select",
        name: "format",
        label: "Preferred format",
        options: [
          {
            label: "Swipe cards",
            value: "cards",
            default: true
          },
          {
            label: "Audio snippet",
            value: "audio"
          },
          {
            label: "Mini quiz",
            value: "quiz"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence level",
        options: [
          {
            label: "Just starting",
            value: "new"
          },
          {
            label: "Getting there",
            value: "mid",
            default: true
          },
          {
            label: "Proving it",
            value: "pro"
          }
        ]
      }
    ]
  }
};

export { appConfig };
