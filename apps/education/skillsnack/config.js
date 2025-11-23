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
          "Win: Learn 'Ctrl+Arrow' (Jump to edge).",
          "Why: Stops infinite scrolling.",
          "Try: Open a sheet, hold Ctrl, tap arrows."
        ],
        negotiation: [
          "Win: The 'Mirror' technique.",
          "Why: Builds rapport without agreeing.",
          "Try: Repeat the last 3 words they said as a question."
        ],
        design: [
          "Win: The 'Squint Test'.",
          "Why: Reveals hierarchy instantly.",
          "Try: Squint at your screen. What stands out first? Is it the right thing?"
        ]
      };
      const selectedSteps = steps[values.skill] || steps.negotiation;
      return {
        primer: primers[values.skill] || primers.negotiation,
        step1: selectedSteps[0],
        step2: selectedSteps[1],
        step3: selectedSteps[2]
      };
    },
    summary: {
      title: "{{labels.skill}} Snack",
      subtitle: "Format: {{labels.format}} \u00b7 Time: {{labels.time}} min",
      metrics: [
        {
          label: "Micro-Skill",
          value: "Unlocked"
        },
        {
          label: "Confidence",
          value: "{{labels.confidence}}"
        },
        {
          label: "Action",
          value: "Ready"
        }
      ]
    },
    sections: [
      {
        title: "The Concept",
        description: "{{derived.primer}}",
        items: [
          "Focus on one small mechanic.",
          "Ignore the complex edge cases for now.",
          "Goal: Use it once today."
        ]
      },
      {
        title: "Your Snack",
        description: "3-beat progression:",
        items: [
          "1. {{derived.step1}}",
          "2. {{derived.step2}}",
          "3. {{derived.step3}}"
        ]
      },
      {
        title: "Retention",
        description: "Make it stick.",
        items: [
          "Teach this to one other person.",
          "Write it on a sticky note.",
          "Use it in your next {{labels.skill}} session."
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
