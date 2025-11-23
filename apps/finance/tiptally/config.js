const appConfig = {
  slug: "tiptally",
  hero: {
    eyebrow: "Tip coach",
    title: "TipTally",
    tagline: "Calculate tip, split, and payment script instantly."
  },
  form: {
    helper: "Need bill amount + service vibe.",
    ctaLabel: "Calculate tip",
    fields: [
      {
        type: "text",
        name: "bill",
        label: "Bill amount",
        placeholder: "$84.50",
        required: true
      },
      {
        type: "select",
        name: "service",
        label: "Service vibe",
        options: [
          {
            label: "Standard",
            value: "standard",
            default: true
          },
          {
            label: "Great",
            value: "great"
          },
          {
            label: "Needs love",
            value: "meh"
          }
        ]
      },
      {
        type: "select",
        name: "split",
        label: "Split count",
        options: [
          {
            label: "1",
            value: "1"
          },
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3",
            default: true
          },
          {
            label: "4+",
            value: "4+"
          }
        ]
      },
      {
        type: "select",
        name: "roundUp",
        label: "Round-up preference",
        options: [
          {
            label: "Exact",
            value: "exact"
          },
          {
            label: "Nearest dollar",
            value: "nearest",
            default: true
          },
          {
            label: "Generous",
            value: "generous"
          }
        ]
      }
    ]
  },
  placeholder: "Add bill + vibe to tally the tip.",
  freePlanLimit: 2,
  share: {
    label: "Share payment note",
    cta: "Copy note"
  },
  upsell: {
    title: "TipTally Pro",
    copy: "Save venue presets, favorite splits, and export expenses.",
    bullets: [
      "Venue memory with local norms.",
      "Preferred splits per friend group.",
      "Expense CSV export."
    ],
    ctaLabel: "Upgrade for venue presets"
  },
  plan: {
    derive: ({ values }) => {
      const serviceTips = {
        standard: 0.18,
        great: 0.22,
        meh: 0.15
      };
      const splitNum = values.split === "4+" ? 4 : Number(values.split || 1);
      const billRaw = (values.bill || "").replace(/[^0-9.]/g, "");
      const bill = billRaw ? Number(billRaw) : 0;
      const tipRate = serviceTips[values.service] ?? 0.18;
      
      let rawTip = bill * tipRate;
      let finalTip = rawTip;
      let roundUpNote = "";

      if (values.roundUp === "nearest") {
        finalTip = Math.ceil(rawTip);
        if (finalTip > rawTip) roundUpNote = `(Rounded up +$${(finalTip - rawTip).toFixed(2)})`;
      } else if (values.roundUp === "generous") {
        finalTip = Math.ceil(rawTip + 1);
        roundUpNote = `(Boosted +$${(finalTip - rawTip).toFixed(2)})`;
      } else {
        finalTip = Math.round(rawTip * 100) / 100;
      }

      const totalWithTip = bill + finalTip;
      const perPerson = splitNum > 0 ? totalWithTip / splitNum : totalWithTip;

      return {
        billClean: bill ? `$${bill.toFixed(2)}` : values.bill || "$0.00",
        tipPercentLabel: `${Math.round(tipRate * 100)}%`,
        tipAmount: `$${finalTip.toFixed(2)}`,
        totalWithTip: `$${totalWithTip.toFixed(2)}`,
        perPerson: `$${perPerson.toFixed(2)}`,
        splitNum,
        roundUpNote
      };
    },
    summary: {
      title: "Tip: {{derived.tipAmount}}",
      subtitle: "{{derived.tipPercentLabel}} based on {{labels.service}} service.",
      metrics: [
        {
          label: "Total Pay",
          value: "{{derived.totalWithTip}}"
        },
        {
          label: "Per Person",
          value: "{{derived.perPerson}}"
        },
        {
          label: "Karma",
          value: "{{labels.roundUp}}"
        }
      ]
    },
    sections: [
      {
        title: "The Math",
        description: "Full breakdown.",
        items: [
          "Bill: {{derived.billClean}}",
          "Tip: {{derived.tipAmount}} {{derived.roundUpNote}}",
          "Total: {{derived.totalWithTip}}"
        ]
      },
      {
        title: "Split breakdown",
        description: "Per-person guidance.",
        items: [
          "Even divide + optional host credit.",
          "List cash + QR payment options.",
          "Add fairness note for shared extras."
        ]
      },
      {
        title: "Payment script",
        description: "Copy-ready note.",
        items: [
          "\"Bill was {{derived.billClean}}, tip {{derived.tipPercentLabel}} \u2192 send {{derived.perPerson}} each.\"",
          "Include `Tap to pay` or QR mention.",
          "Add thank-you or gentle nudge text."
        ]
      }
    ],
    tips: [
      "Set default service vibe inside host app.",
      "Upgrade to save venues with auto norms.",
      "Use share row for group texts."
    ],
    highlight: {
      eyebrow: "Ready to pay",
      copy: "Tap copy, drop in the group chat, done."
    },
    fields: [
      {
        type: "text",
        name: "bill",
        label: "Bill amount",
        placeholder: "$84.50",
        required: true
      },
      {
        type: "select",
        name: "service",
        label: "Service vibe",
        options: [
          {
            label: "Standard",
            value: "standard",
            default: true
          },
          {
            label: "Great",
            value: "great"
          },
          {
            label: "Needs love",
            value: "meh"
          }
        ]
      },
      {
        type: "select",
        name: "split",
        label: "Split count",
        options: [
          {
            label: "1",
            value: "1"
          },
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3",
            default: true
          },
          {
            label: "4+",
            value: "4+"
          }
        ]
      },
      {
        type: "select",
        name: "roundUp",
        label: "Round-up preference",
        options: [
          {
            label: "Exact",
            value: "exact"
          },
          {
            label: "Nearest dollar",
            value: "nearest",
            default: true
          },
          {
            label: "Generous",
            value: "generous"
          }
        ]
      }
    ]
  }
};

export { appConfig };
