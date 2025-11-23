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
    derive: ({ values }) => {
      const phrases = {
        spanish: {
          coffee: ["Quisiera un café, por favor.", "¿Tiene leche de avena?", "¡Gracias, muy amable!"],
          taxi: ["A la estación de tren, por favor.", "¿Acepta tarjeta?", "Pare aquí, gracias."],
          networking: ["Hola, soy [Nombre].", "¿A qué te dedicas?", "Mucho gusto en conocerte."]
        },
        french: {
          coffee: ["Je voudrais un café, s'il vous plaît.", "Avez-vous du lait d'avoine ?", "Merci beaucoup !"],
          taxi: ["À la gare, s'il vous plaît.", "Acceptez-vous la carte ?", "Arrêtez-vous ici, merci."],
          networking: ["Bonjour, je m'appelle [Nom].", "Que faites-vous dans la vie ?", "Enchanté(e)."]
        },
        japanese: {
          coffee: ["コーヒーをください (Koohii o kudasai).", "オーツミルクはありますか (Ootsu miruku wa arimasu ka)?", "ありがとう (Arigatou)."],
          taxi: ["駅までお願いします (Eki made onegaishimasu).", "カードは使えますか (Kaado wa tsukaemasu ka)?", "ここで止めてください (Koko de tomete kudasai)."],
          networking: ["はじめまして、[名前]です (Hajimemまして, [Namae] desu).", "お仕事は何ですか (Oshigoto wa nan desu ka)?", "よろしくおねがいします (Yoroshiku onegaishimasu)."]
        }
      };

      const langSet = phrases[values.language] || phrases.spanish;
      const scenarioSet = langSet[values.scenario] || langSet.coffee;

      return {
        p1: scenarioSet[0],
        p2: scenarioSet[1],
        p3: scenarioSet[2]
      };
    },
    summary: {
      title: "{{labels.language}} Loop",
      subtitle: "Scenario: {{labels.scenario}} \u00b7 Focus: {{labels.accent}}",
      metrics: [
        {
          label: "Scenario",
          value: "{{labels.scenario}}"
        },
        {
          label: "Difficulty",
          value: "{{labels.confidence}}"
        },
        {
          label: "Phrases",
          value: "3 Core"
        }
      ]
    },
    sections: [
      {
        title: "Core Phrases",
        description: "Repeat each 3 times.",
        items: [
          "1. {{derived.p1}}",
          "2. {{derived.p2}}",
          "3. {{derived.p3}}"
        ]
      },
      {
        title: "Practice Tips",
        description: "Focus on {{labels.accent}}.",
        items: [
          "Record yourself and play it back.",
          "Focus on vowel clarity.",
          "Don't rush—speed comes later."
        ]
      },
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
