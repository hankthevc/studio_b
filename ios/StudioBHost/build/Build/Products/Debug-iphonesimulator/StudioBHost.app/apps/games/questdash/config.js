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
      const challengePhrases = {
        city: ["Street art snap", "Local snack dash", "Landmark selfie"],
        outdoors: ["Trail photo", "Nature sound clip", "Scavenger find"],
        home: ["DIY challenge", "Time-boxed bake-off", "Rearrange + reveal"]
      };
      const proofs = {
        photo: "Photo proof",
        video: "Video proof",
        note: "Note proof"
      };
      const settingChallenges = challengePhrases[values.setting] || challengePhrases.city;
      return {
        c1: `${settingChallenges[0]} (${proofs[values.proof] || "Proof"})`,
        c2: `${settingChallenges[1]} (${values.energy} energy)`,
        c3: `${settingChallenges[2]} (Wildcard)`,
        proofLabel: proofs[values.proof] || values.proof
      };
    },
    summary: {
      title: "{{labels.setting}} quest",
      subtitle: "Crew {{labels.crew}} \u00b7 Energy {{labels.energy}}.",
      metrics: [
        {
          label: "Challenges",
          value: "3"
        },
        {
          label: "Proof",
          value: "{{derived.proofLabel}}"
        },
        {
          label: "Bonus",
          value: "+1 wildcard"
        }
      ]
    },
    sections: [
      {
        title: "Kickoff",
        description: "Prime the crew.",
        items: [
          "Set timer + choose playlist.",
          "Read rules out loud.",
          "Assign scorekeeper."
        ]
      },
      {
        title: "Challenges",
        description: "Three deterministic prompts.",
        items: [
          "{{derived.c1}}",
          "{{derived.c2}}",
          "{{derived.c3}}"
        ]
      },
      {
        title: "Wildcard",
        description: "Final surprise move.",
        items: [
          "Wildcard twist (loser buys treat).",
          "Share photo proof in group chat.",
          "Regenerate if crew wants rematch."
        ]
      }
    ],
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
