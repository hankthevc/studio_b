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
    derive: ({ values }) => {
      const wins = (values.wins || "")
        .split("\n")
        .map((w) => w.trim())
        .filter(Boolean)
        .slice(0, 3);
      
      while (wins.length < 3) {
        wins.push("Add a quick win to fill this slot.");
      }

      // Logic: Calculate momentum score
      let momentumScore = wins.filter(w => !w.includes("Add a quick")).length * 20;
      if (values.energy === "fire") momentumScore += 30;
      if (values.energy === "steady") momentumScore += 15;
      if (values.focus === "deep") momentumScore += 10;

      let nextStep = "Clear the decks for deep work.";
      if (values.focus === "collab") nextStep = "Prep agenda for tomorrow's sync.";
      if (values.focus === "admin") nextStep = "Batch process email for 20 mins.";
      if (values.energy === "coasting") nextStep = "Pick one easy win and sign off.";

      return {
        win1: wins[0],
        win2: wins[1],
        win3: wins[2],
        winCount: wins.filter(w => !w.includes("Add a quick")).length,
        score: Math.min(100, momentumScore),
        nextStep
      };
    },
    summary: {
      title: "Momentum Score: {{derived.score}}",
      subtitle: "Energy: {{labels.energy}} \u00b7 Focus: {{labels.focus}}",
      metrics: [
        {
          label: "Wins Logged",
          value: "{{derived.winCount}}/3"
        },
        {
          label: "Flow State",
          value: "{{derived.score}}%"
        },
        {
          label: "Next Action",
          value: "See below"
        }
      ]
    },
    sections: [
      {
        title: "Victory Board",
        description: "Today's highlights locked in.",
        items: [
          "🏆 {{derived.win1}}",
          "🥈 {{derived.win2}}",
          "🥉 {{derived.win3}}"
        ]
      },
      {
        title: "Tomorrow's Play",
        description: "Based on your {{labels.focus}} focus.",
        items: [
          "👉 {{derived.nextStep}}",
          "Protect your first 90 minutes.",
          "Review calendar for conflicts."
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
