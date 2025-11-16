const appConfig = {
  slug: "studysprint",
  hero: {
    eyebrow: "Sprint planner",
    title: "StudySprint",
    tagline: "Break a topic into a 25-minute focused block."
  },
  form: {
    helper: "Topic and deadline required.",
    ctaLabel: "Plan sprint",
    fields: [
      {
        type: "text",
        name: "topic",
        label: "Topic",
        placeholder: "e.g., Photosynthesis chapter 3",
        required: true
      },
      {
        type: "select",
        name: "deadline",
        label: "Deadline",
        options: [
          {
            label: "Tomorrow",
            value: "tomorrow",
            default: true
          },
          {
            label: "This week",
            value: "week"
          },
          {
            label: "Later",
            value: "later"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence",
        options: [
          {
            label: "Lost",
            value: "low"
          },
          {
            label: "Okay",
            value: "ok",
            default: true
          },
          {
            label: "Solid",
            value: "solid"
          }
        ]
      },
      {
        type: "select",
        name: "format",
        label: "Format",
        options: [
          {
            label: "Handwritten notes",
            value: "notes"
          },
          {
            label: "Flash cards",
            value: "cards",
            default: true
          },
          {
            label: "Mind map",
            value: "map"
          }
        ]
      }
    ]
  },
  placeholder: "Share a topic + deadline.",
  freePlanLimit: 1,
  share: {
    label: "Share sprint",
    cta: "Copy sprint"
  },
  upsell: {
    title: "StudySprint Pro",
    copy: "Save syllabi, push reminders, and export study logs.",
    bullets: [
      "Syllabus library.",
      "Push reminder integration.",
      "CSV/PDF study logs."
    ],
    ctaLabel: "Upgrade for reminders"
  },
  plan: {
    summary: {
      title: "{{labels.topic}} sprint",
      subtitle: "Deadline {{labels.deadline}} \u00b7 Confidence {{labels.confidence}}.",
      metrics: [
        {
          label: "Sprint length",
          value: "25 min"
        },
        {
          label: "Break",
          value: "5 min"
        },
        {
          label: "Format",
          value: "{{labels.format}}"
        }
      ]
    },
    sections: [
      {
        title: "Focus plan",
        description: "Structure the 25 min.",
        items: [
          "5 min skim + highlight unknowns.",
          "12 min deep dive with {{labels.format}} output.",
          "8 min recall practice."
        ]
      },
      {
        title: "Recall prompts",
        description: "Questions to self-test.",
        items: [
          "Prompt 1 referencing topic.",
          "Prompt 2 bridging concept.",
          "Prompt 3 stretching to application."
        ]
      },
      {
        title: "Break + next step",
        description: "Close the loop.",
        items: [
          "5 min break instructions.",
          "Log retention feel.",
          "Set next sprint if needed."
        ]
      }
    ],
    tips: [
      "Use share link for accountability group.",
      "Upgrade for reminder scheduling.",
      "Regenerate to tweak prompts."
    ],
    highlight: {
      eyebrow: "Sprint queued",
      copy: "Silence notifications and start the timer."
    },
    fields: [
      {
        type: "text",
        name: "topic",
        label: "Topic",
        placeholder: "e.g., Photosynthesis chapter 3",
        required: true
      },
      {
        type: "select",
        name: "deadline",
        label: "Deadline",
        options: [
          {
            label: "Tomorrow",
            value: "tomorrow",
            default: true
          },
          {
            label: "This week",
            value: "week"
          },
          {
            label: "Later",
            value: "later"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence",
        options: [
          {
            label: "Lost",
            value: "low"
          },
          {
            label: "Okay",
            value: "ok",
            default: true
          },
          {
            label: "Solid",
            value: "solid"
          }
        ]
      },
      {
        type: "select",
        name: "format",
        label: "Format",
        options: [
          {
            label: "Handwritten notes",
            value: "notes"
          },
          {
            label: "Flash cards",
            value: "cards",
            default: true
          },
          {
            label: "Mind map",
            value: "map"
          }
        ]
      }
    ]
  }
};

export { appConfig };
