const appConfig = {
  slug: "billbreeze",
  hero: {
    eyebrow: "Cash-flow lane",
    title: "BillBreeze",
    tagline: "Visualize upcoming bills and safe-to-spend guidance."
  },
  form: {
    helper: "Need pay cycle + at least one bill.",
    ctaLabel: "Plot my bills",
    fields: [
      {
        type: "select",
        name: "income",
        label: "Income cycle",
        options: [
          {
            label: "Biweekly",
            value: "biweekly",
            default: true
          },
          {
            label: "Monthly",
            value: "monthly"
          },
          {
            label: "Irregular",
            value: "irregular"
          }
        ]
      },
      {
        type: "textarea",
        name: "bills",
        label: "Bills (one per line amount + name)",
        placeholder: "$120 internet\n$220 car",
        required: true
      },
      {
        type: "select",
        name: "stress",
        label: "Stress level",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Kinda stressed",
            value: "medium",
            default: true
          },
          {
            label: "High alert",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "goal",
        label: "Primary goal",
        options: [
          {
            label: "Avoid overdraft",
            value: "overdraft",
            default: true
          },
          {
            label: "Save more",
            value: "save"
          },
          {
            label: "Pay debt faster",
            value: "debt"
          }
        ]
      }
    ]
  },
  placeholder: "Enter a couple bills to sketch the lane.",
  freePlanLimit: 1,
  share: {
    label: "Share cash-flow lane",
    cta: "Copy lane"
  },
  upsell: {
    title: "BillBreeze Pro",
    copy: "Unlimited bills, projected balances, and PDF export.",
    bullets: [
      "Unlimited bill lanes per account.",
      "Safe-to-spend push alerts.",
      "PDF export for advisor convos."
    ],
    ctaLabel: "Upgrade for projections"
  },
  plan: {
    summary: {
      title: "{{labels.income}} lane",
      subtitle: "Stress {{labels.stress}} \u00b7 Goal {{labels.goal}}.",
      metrics: [
        {
          label: "Bills mapped",
          value: "Up to 6"
        },
        {
          label: "Safe spend",
          value: "Auto-estimated"
        },
        {
          label: "Alerts",
          value: "2 upcoming"
        }
      ]
    },
    sections: [
      {
        title: "Lane overview",
        description: "High-level view of upcoming cash.",
        items: [
          "Income drop + starting balance stub.",
          "Bill timeline with due-date ordering.",
          "Safe-to-spend band after each bill."
        ]
      },
      {
        title: "Focus bills",
        description: "Callouts for upcoming charges.",
        items: [
          "Highlight highest amount + autopay note.",
          "List actionable steps (renegotiate, pay early).",
          "Add nudge for emergency buffer."
        ]
      },
      {
        title: "Next best actions",
        description: "Keep stress manageable.",
        items: [
          "Set alert 3 days prior to each bill.",
          "Transfer $25 to buffer if safe.",
          "If stress high, ping coach/expert."
        ]
      }
    ],
    tips: [
      "Paste lane screenshot into budgeting doc.",
      "Use share link for partners or advisors.",
      "Upgrade for PDF exports + unlimited bills."
    ],
    highlight: {
      eyebrow: "Lane smoothed",
      copy: "You have visibility for the next cycle."
    },
    fields: [
      {
        type: "select",
        name: "income",
        label: "Income cycle",
        options: [
          {
            label: "Biweekly",
            value: "biweekly",
            default: true
          },
          {
            label: "Monthly",
            value: "monthly"
          },
          {
            label: "Irregular",
            value: "irregular"
          }
        ]
      },
      {
        type: "textarea",
        name: "bills",
        label: "Bills (one per line amount + name)",
        placeholder: "$120 internet\n$220 car",
        required: true
      },
      {
        type: "select",
        name: "stress",
        label: "Stress level",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Kinda stressed",
            value: "medium",
            default: true
          },
          {
            label: "High alert",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "goal",
        label: "Primary goal",
        options: [
          {
            label: "Avoid overdraft",
            value: "overdraft",
            default: true
          },
          {
            label: "Save more",
            value: "save"
          },
          {
            label: "Pay debt faster",
            value: "debt"
          }
        ]
      }
    ]
  }
};

export { appConfig };
