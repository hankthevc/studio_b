const appConfig = {
  slug: "flowstreak",
  hero: {
    eyebrow: "Momentum board",
    title: "FlowStreak",
    tagline: "Log three wins, get next micro goals."
  },
  form: {
    helper: "Give FlowStreak a few wins or planned focus.",
    ctaLabel: "Build my board",
    fields: [
      {
        type: "textarea",
        name: "wins",
        label: "Wins or focus areas",
        placeholder: "Ship homepage copy\nInbox zero\nWalk outside",
        required: true
      },
      {
        type: "select",
        name: "energy",
        label: "Energy meter",
        options: [
          {
            label: "Coasting",
            value: "coasting"
          },
          {
            label: "Steady",
            value: "steady",
            default: true
          },
          {
            label: "On fire",
            value: "fire"
          }
        ]
      },
      {
        type: "chips",
        name: "focus",
        label: "Tomorrow focus",
        options: [
          {
            label: "Deep work",
            value: "deep"
          },
          {
            label: "Collab",
            value: "collab"
          },
          {
            label: "Admin",
            value: "admin",
            default: true
          }
        ]
      }
    ]
  },
  placeholder: "List today\u2019s wins to paint the board.",
  freePlanLimit: 1,
  share: {
    label: "Share streak",
    cta: "Copy board"
  },
  upsell: {
    title: "FlowStreak Pro",
    copy: "Sync calendar tasks, add widgets, and unlock team sharing.",
    bullets: [
      "Calendar + task sync.",
      "Homescreen widgets.",
      "Team leaderboard."
    ],
    ctaLabel: "Upgrade for sync"
  },
  plan: {
    summary: {
      title: "Wins locked",
      subtitle: "Energy {{labels.energy}} \u00b7 Next focus {{labels.focus}}.",
      metrics: [
        {
          label: "Win streak",
          value: "3-day default"
        },
        {
          label: "Mood",
          value: "{{labels.energy}}"
        },
        {
          label: "Cue",
          value: "Keep grid green"
        }
      ]
    },
    sections: [
      {
        title: "Celebrated wins",
        description: "Mirror back the entries with friendly copy.",
        items: [
          "Win #1 shoutout.",
          "Win #2 highlight.",
          "Win #3 celebration."
        ]
      },
      {
        title: "Momentum bar",
        description: "Encourage tomorrow\u2019s focus.",
        items: [
          "Focus suggestion referencing {{labels.focus}}.",
          "Micro goal tied to next steps.",
          "Accountability tip."
        ]
      },
      {
        title: "Share & remind",
        description: "Keep the streak alive.",
        items: [
          "Share link to buddy.",
          "Schedule reminder at 8pm.",
          "Upgrade to sync calendar tasks."
        ]
      }
    ],
    tips: [
      "Keep wins specific and measurable.",
      "Use share row for Slack/Teams check-ins.",
      "Upgrade for widgets + team view."
    ],
    highlight: {
      eyebrow: "Streak alive",
      copy: "Tomorrow\u2019s board awaits."
    },
    fields: [
      {
        type: "textarea",
        name: "wins",
        label: "Wins or focus areas",
        placeholder: "Ship homepage copy\nInbox zero\nWalk outside",
        required: true
      },
      {
        type: "select",
        name: "energy",
        label: "Energy meter",
        options: [
          {
            label: "Coasting",
            value: "coasting"
          },
          {
            label: "Steady",
            value: "steady",
            default: true
          },
          {
            label: "On fire",
            value: "fire"
          }
        ]
      },
      {
        type: "chips",
        name: "focus",
        label: "Tomorrow focus",
        options: [
          {
            label: "Deep work",
            value: "deep"
          },
          {
            label: "Collab",
            value: "collab"
          },
          {
            label: "Admin",
            value: "admin",
            default: true
          }
        ]
      }
    ]
  }
};

export { appConfig };
