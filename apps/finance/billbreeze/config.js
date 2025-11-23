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
    derive: ({ values }) => {
      const lines = (values.bills || "").split("\n");
      let totalBills = 0;
      const parsedBills = [];
      
      lines.forEach(line => {
        const match = line.match(/(\$?\d+)/);
        if (match) {
          const amount = parseInt(match[1].replace("$", ""), 10);
          const label = line.replace(match[0], "").trim() || "Bill";
          totalBills += amount;
          parsedBills.push({ label, amount });
        }
      });

      // Estimate income based on cycle (very rough heuristics for now)
      let estimatedIncome = 0;
      if (values.income === "biweekly") estimatedIncome = totalBills * 2.2;
      if (values.income === "monthly") estimatedIncome = totalBills * 1.2;
      if (values.income === "irregular") estimatedIncome = totalBills * 1.1;

      const safeSpend = Math.max(0, estimatedIncome - totalBills);
      const bufferRatio = safeSpend / (estimatedIncome || 1);
      
      let healthLabel = "Healthy";
      let actionTip = "Auto-transfer $50 to savings.";
      
      if (bufferRatio < 0.1) {
        healthLabel = "Tight";
        actionTip = "Review subscriptions for cuts.";
      } else if (bufferRatio < 0.3) {
        healthLabel = "Balanced";
        actionTip = "Pad your emergency fund.";
      }

      return {
        totalBills: `$${totalBills}`,
        safeSpend: `$${Math.round(safeSpend)}`,
        billCount: parsedBills.length,
        healthLabel,
        actionTip,
        topBill: parsedBills.sort((a, b) => b.amount - a.amount)[0]?.label || "None"
      };
    },
    summary: {
      title: "{{labels.income}} Cash Flow",
      subtitle: "{{derived.healthLabel}} buffer detected.",
      metrics: [
        {
          label: "Total Bills",
          value: "{{derived.totalBills}}"
        },
        {
          label: "Safe to Spend",
          value: "{{derived.safeSpend}}"
        },
        {
          label: "Status",
          value: "{{derived.healthLabel}}"
        }
      ]
    },
    sections: [
      {
        title: "Bill Breakdown",
        description: "Your committed costs for this cycle.",
        items: [
          "Highest cost: {{derived.topBill}}",
          "Total commitment: {{derived.totalBills}}",
          "Bills tracked: {{derived.billCount}}"
        ]
      },
      {
        title: "Smart Actions",
        description: "Optimize your cash flow.",
        items: [
          "{{derived.actionTip}}",
          "Check due dates for top bill.",
          "Set calendar alert 2 days before pay."
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
