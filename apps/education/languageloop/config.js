const appConfig = {
  slug: "languageloop",
  hero: {
    eyebrow: "Phrase coach",
    title: "LanguageLoop",
    tagline: "Loop through quick roleplays tailored to context."
  },
  form: {
    helper: "Language + scenario required.",
    ctaLabel: "Start loop",
    fields: [
      {
        type: "select",
        name: "language",
        label: "Language",
        options: [
          {
            label: "Spanish",
            value: "spanish",
            default: true
          },
          {
            label: "French",
            value: "french"
          },
          {
            label: "Japanese",
            value: "japanese"
          }
        ]
      },
      {
        type: "select",
        name: "scenario",
        label: "Scenario",
        options: [
          {
            label: "Coffee shop",
            value: "coffee",
            default: true
          },
          {
            label: "Taxi",
            value: "taxi"
          },
          {
            label: "Networking",
            value: "networking"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence level",
        options: [
          {
            label: "New",
            value: "new"
          },
          {
            label: "Getting comfy",
            value: "mid",
            default: true
          },
          {
            label: "Ready to flex",
            value: "pro"
          }
        ]
      },
      {
        type: "select",
        name: "accent",
        label: "Accent focus",
        options: [
          {
            label: "Neutral",
            value: "neutral",
            default: true
          },
          {
            label: "Local flair",
            value: "local"
          }
        ]
      }
    ]
  },
  placeholder: "Pick a language + scenario to loop.",
  freePlanLimit: 1,
  share: {
    label: "Share loop",
    cta: "Copy loop"
  },
  upsell: {
    title: "LanguageLoop Pro",
    copy: "Unlimited loops, accent notes, and offline packs.",
    bullets: [
      "Save favorite loops.",
      "Accent + cultural notes.",
      "Offline packs for travel."
    ],
    ctaLabel: "Upgrade for packs"
  },
  plan: {
    summary: {
      title: "{{labels.language}} loop",
      subtitle: "Scenario {{labels.scenario}} \u00b7 Confidence {{labels.confidence}}.",
      metrics: [
        {
          label: "Turns",
          value: "3 exchanges"
        },
        {
          label: "Accent focus",
          value: "{{labels.accent}}"
        },
        {
          label: "Vocab",
          value: "4 keywords"
        }
      ]
    },
    sections: [
      {
        title: "Warm-up phrases",
        description: "Ease in before roleplay.",
        items: [
          "Greeting line with transliteration.",
          "Polite filler or cultural note.",
          "Confidence-specific encouragement."
        ]
      },
      {
        title: "Roleplay loop",
        description: "Three call-and-response prompts.",
        items: [
          "Prompt 1: order/ask.",
          "Prompt 2: clarification.",
          "Prompt 3: closing."
        ]
      },
      {
        title: "Accent + culture",
        description: "How to sound natural.",
        items: [
          "Accent cue for {{labels.accent}} focus.",
          "Cultural reminder for scenario.",
          "Optional follow-up question."
        ]
      }
    ],
    tips: [
      "Repeat loop twice for retention.",
      "Upgrade for offline pack before traveling.",
      "Share link with study buddy."
    ],
    highlight: {
      eyebrow: "Loop ready",
      copy: "Practice aloud; set a timer for 5 minutes."
    },
    fields: [
      {
        type: "select",
        name: "language",
        label: "Language",
        options: [
          {
            label: "Spanish",
            value: "spanish",
            default: true
          },
          {
            label: "French",
            value: "french"
          },
          {
            label: "Japanese",
            value: "japanese"
          }
        ]
      },
      {
        type: "select",
        name: "scenario",
        label: "Scenario",
        options: [
          {
            label: "Coffee shop",
            value: "coffee",
            default: true
          },
          {
            label: "Taxi",
            value: "taxi"
          },
          {
            label: "Networking",
            value: "networking"
          }
        ]
      },
      {
        type: "chips",
        name: "confidence",
        label: "Confidence level",
        options: [
          {
            label: "New",
            value: "new"
          },
          {
            label: "Getting comfy",
            value: "mid",
            default: true
          },
          {
            label: "Ready to flex",
            value: "pro"
          }
        ]
      },
      {
        type: "select",
        name: "accent",
        label: "Accent focus",
        options: [
          {
            label: "Neutral",
            value: "neutral",
            default: true
          },
          {
            label: "Local flair",
            value: "local"
          }
        ]
      }
    ]
  }
};

export { appConfig };
