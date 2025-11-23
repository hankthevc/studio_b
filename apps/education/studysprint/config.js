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
    derive: ({ values }) => {
      const topic = (values.topic || "Topic").trim();
      return {
        q1: `Define "${topic}" in your own words (no jargon).`,
        q2: `How does "${topic}" connect to the previous chapter/concept?`,
        q3: `Create a real-world analogy for "${topic}".`
      };
    },
    summary: {
      title: "Sprint: {{labels.topic}}",
      subtitle: "Format: {{labels.format}} \u00b7 Confidence: {{labels.confidence}}",
      metrics: [
        {
          label: "Focus Block",
          value: "25 min"
        },
        {
          label: "Output",
          value: "{{labels.format}}"
        },
        {
          label: "Active Recall",
          value: "3 Qs"
        }
      ]
    },
    sections: [
      {
        title: "1. Ingest (10 min)",
        description: "High-speed absorption.",
        items: [
          "Scan headers and bold terms.",
          "Read summary first, then details.",
          "Don't highlight—write questions instead."
        ]
      },
      {
        title: "2. Synthesize (10 min)",
        description: "Create {{labels.format}}.",
        items: [
          "Close the book/tab.",
          "Draft your {{labels.format}} from memory.",
          "Only check source to fill gaps."
        ]
      },
      {
        title: "3. Recall (5 min)",
        description: "Test yourself immediately.",
        items: [
          "{{derived.q1}}",
          "{{derived.q2}}",
          "{{derived.q3}}"
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
