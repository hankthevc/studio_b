const appConfig = {
  slug: "questdash",
  hero: {
    eyebrow: "Adventure prompts",
    title: "QuestDash",
    tagline: "Challenge friends with deterministic quests."
  },
  form: {
    helper: "Need crew vibe & setting.",
    ctaLabel: "Roll a quest",
    fields: [
      {
        type: "select",
        name: "crew",
        label: "Crew type",
        options: [
          {
            label: "Friends",
            value: "friends",
            default: true
          },
          {
            label: "Couple",
            value: "couple"
          },
          {
            label: "Family",
            value: "family"
          }
        ]
      },
      {
        type: "chips",
        name: "energy",
        label: "Energy",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Curious",
            value: "curious",
            default: true
          },
          {
            label: "Competitive",
            value: "competitive"
          }
        ]
      },
      {
        type: "select",
        name: "setting",
        label: "Setting",
        options: [
          {
            label: "City",
            value: "city",
            default: true
          },
          {
            label: "Outdoors",
            value: "outdoors"
          },
          {
            label: "Home",
            value: "home"
          }
        ]
      },
      {
        type: "select",
        name: "proof",
        label: "Proof type",
        options: [
          {
            label: "Photo",
            value: "photo",
            default: true
          },
          {
            label: "Video",
            value: "video"
          },
          {
            label: "Note",
            value: "note"
          }
        ]
      }
    ]
  },
  placeholder: "Tell QuestDash about the crew.",
  freePlanLimit: 1,
  share: {
    label: "Share quest",
    cta: "Copy quest"
  },
  upsell: {
    title: "QuestDash Pro",
    copy: "Unlock themed challenge packs, group history, and leaderboards.",
    bullets: [
      "Theme packs (foodie, retro, travel).",
      "Group leaderboard stub.",
      "History log."
    ],
    ctaLabel: "Upgrade for packs"
  },
  plan: {
    derive: ({ values }) => {
      const challenges = {
        city: [
          "Find a red door and take a selfie.",
          "Buy the cheapest item at a local bodega.",
          "Spot a piece of street art featuring an animal."
        ],
        outdoors: [
          "Find a rock shaped like a heart.",
          "Record 10 seconds of pure bird sound.",
          "Locate a tree you can't wrap your arms around."
        ],
        home: [
          "Build a pillow fort in 3 minutes.",
          "Find the oldest expiration date in your pantry.",
          "Recreate a famous painting using household objects."
        ]
      };
      
      const selectedSet = challenges[values.setting] || challenges.city;
      
      let wildcard = "High-five a stranger (or air high-five).";
      if (values.crew === "couple") wildcard = "Compliment your partner's eyes.";
      if (values.crew === "family") wildcard = "Group hug for 10 seconds.";

      return {
        q1: selectedSet[0],
        q2: selectedSet[1],
        q3: selectedSet[2],
        wildcard,
        proofType: values.proof
      };
    },
    summary: {
      title: "Quest: {{labels.setting}} Mode",
      subtitle: "Crew: {{labels.crew}} \u00b7 Energy: {{labels.energy}}",
      metrics: [
        {
          label: "Difficulty",
          value: "{{labels.energy}}"
        },
        {
          label: "Tasks",
          value: "3 + Bonus"
        },
        {
          label: "Proof",
          value: "{{derived.proofType}}"
        }
      ]
    },
    sections: [
      {
        title: "Main Objectives",
        description: "Complete all 3 to win.",
        items: [
          "1. {{derived.q1}}",
          "2. {{derived.q2}}",
          "3. {{derived.q3}}"
        ]
      },
      {
        title: "Bonus Round",
        description: "Double points.",
        items: [
          "🌟 {{derived.wildcard}}",
          "Upload proof to group chat immediately."
        ]
      },
    tips: [
      "Upgrade for theme packs.",
      "Share link to scoreboard doc.",
      "Mix proof types for variety."
    ],
    highlight: {
      eyebrow: "Quest accepted",
      copy: "Remember: pics or it didn\u2019t happen."
    },
    fields: [
      {
        type: "select",
        name: "crew",
        label: "Crew type",
        options: [
          {
            label: "Friends",
            value: "friends",
            default: true
          },
          {
            label: "Couple",
            value: "couple"
          },
          {
            label: "Family",
            value: "family"
          }
        ]
      },
      {
        type: "chips",
        name: "energy",
        label: "Energy",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Curious",
            value: "curious",
            default: true
          },
          {
            label: "Competitive",
            value: "competitive"
          }
        ]
      },
      {
        type: "select",
        name: "setting",
        label: "Setting",
        options: [
          {
            label: "City",
            value: "city",
            default: true
          },
          {
            label: "Outdoors",
            value: "outdoors"
          },
          {
            label: "Home",
            value: "home"
          }
        ]
      },
      {
        type: "select",
        name: "proof",
        label: "Proof type",
        options: [
          {
            label: "Photo",
            value: "photo",
            default: true
          },
          {
            label: "Video",
            value: "video"
          },
          {
            label: "Note",
            value: "note"
          }
        ]
      }
    ]
  }
};

export { appConfig };
