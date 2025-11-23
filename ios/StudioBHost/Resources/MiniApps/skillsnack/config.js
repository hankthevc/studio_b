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
    derive: ({ values }) => {
      const primers = {
        excel: "Speed through sheets with fewer clicks.",
        negotiation: "Handle objections with calm structure.",
        design: "Sharpen eye for critique and feedback."
      };
      const steps = {
        excel: [
          "Step 1: learn a new shortcut in 1 minute.",
          "Step 2: apply to a real sheet.",
          "Step 3: mini challenge: remove 3 clicks."
        ],
        negotiation: [
          "Step 1: mirror + label once.",
          "Step 2: anchor calmly with data.",
          "Step 3: ask a calibrated question."
        ],
        design: [
          "Step 1: pick one component to critique.",
          "Step 2: note hierarchy/spacing issues.",
          "Step 3: propose a single improvement."
        ]
      };
      const selectedSteps = steps[values.skill] || steps.negotiation;
      return {
        primer: primers[values.skill] || primers.negotiation,
        s1: selectedSteps[0],
        s2: selectedSteps[1],
        s3: selectedSteps[2]
      };
    },
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
          "{{derived.primer}}",
          "Why it matters this week.",
          "Confidence-specific encouragement."
        ]
      },
      {
        title: "Snack steps",
        description: "Three actionable beats.",
        items: [
          "{{derived.s1}}",
          "{{derived.s2}}",
          "{{derived.s3}}"
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
