const appConfig = {
  slug: "slicesaver",
  hero: {
    eyebrow: "Group finance buddy",
    title: "SliceSaver",
    tagline: "Split group costs with friendly scripts + fairness suggestions."
  },
  form: {
    helper: "Need at least crew size + total spend.",
    ctaLabel: "Draft the split",
    fields: [
      {
        type: "select",
        name: "crewSize",
        label: "Crew size",
        options: [
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3"
          },
          {
            label: "4",
            value: "4",
            default: true
          },
          {
            label: "5+",
            value: "5+"
          }
        ]
      },
      {
        type: "text",
        name: "total",
        label: "Total amount",
        placeholder: "e.g., $186 dinner",
        required: true
      },
      {
        type: "select",
        name: "tone",
        label: "Reminder tone",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Direct",
            value: "direct"
          },
          {
            label: "Playful",
            value: "playful",
            default: true
          }
        ]
      },
      {
        type: "select",
        name: "due",
        label: "Due date",
        options: [
          {
            label: "ASAP",
            value: "asap",
            default: true
          },
          {
            label: "Next week",
            value: "next-week"
          },
          {
            label: "End of month",
            value: "eom"
          }
        ]
      }
    ]
  },
  placeholder: "Enter crew details to draft the split.",
  freePlanLimit: 1,
  share: {
    label: "Share split",
    cta: "Copy note"
  },
  upsell: {
    title: "SliceSaver Pro",
    copy: "Save households, track balances, and auto-send nudges.",
    bullets: [
      "Household library with recurring splits.",
      "Balance tracking + ledger export.",
      "Automated reminder scripts + escalation."
    ],
    ctaLabel: "Upgrade for household mode"
  },
  plan: {
    derive: ({ values }) => {
      const crewNum = values.crewSize === "5+" ? 5 : Number(values.crewSize || 4);
      const totalRaw = (values.total || "").replace(/[^0-9.]/g, "");
      const total = totalRaw ? Number(totalRaw) : 0;
      
      // Round up to nearest 5 for "lazy" fairness if chill
      let avg = 0;
      if (crewNum > 0) {
        avg = total / crewNum;
        if (values.tone === "chill") avg = Math.ceil(avg);
        else avg = Math.ceil(avg * 100) / 100;
      }

      const scriptTone = {
        chill: "No rush, whenever you can.",
        direct: "Please Venmo by tomorrow!",
        playful: "Pizza gods require tribute 🍕."
      };

      return {
        crewNum,
        totalClean: total ? `$${total.toFixed(2)}` : values.total || "$0",
        avgDue: avg ? `$${avg.toFixed(2)}` : "$0",
        toneNote: scriptTone[values.tone] || scriptTone.playful,
        hostShare: (total - (avg * (crewNum - 1))).toFixed(2) // Host picks up the slack/rounding diff
      };
    },
    summary: {
      title: "Split for {{labels.crewSize}}",
      subtitle: "Tone: {{labels.tone}} \u00b7 Due: {{labels.due}}",
      metrics: [
        {
          label: "Per Person",
          value: "{{derived.avgDue}}"
        },
        {
          label: "Total Bill",
          value: "{{derived.totalClean}}"
        },
        {
          label: "Fairness",
          value: "Host rounds diff"
        }
      ]
    },
    sections: [
      {
        title: "The Math",
        description: "Simple breakdown.",
        items: [
          "Total: {{derived.totalClean}} / {{derived.crewNum}} people.",
          "Share: {{derived.avgDue}} each.",
          "Host covers: ${{derived.hostShare}} (accounts for rounding)."
        ]
      },
      {
        title: "Reminder script",
        description: "Tone-matched message to drop in chat.",
        items: [
          "\"Hey team, dinner came to {{derived.totalClean}}\u2014about {{derived.avgDue}} each. {{derived.toneNote}}\"",
          "Add payment links + due date.",
          "Include thank-you or joke depending on tone."
        ]
      },
      {
        title: "Follow-up plan",
        description: "Steps if not everyone pays on time.",
        items: [
          "Send soft nudge after 48h.",
          "Use accountability reminder referencing shared goal.",
          "Log who\u2019s paid in SliceSaver if Pro."
        ]
      }
    ],
    tips: [
      "Re-run with 5+ if extra people join.",
      "Use share link to drop entire plan into group chat.",
      "Upgrade to track open balances."
    ],
    highlight: {
      eyebrow: "Split ready",
      copy: "Copy the note and let friends Venmo the slice."
    },
    fields: [
      {
        type: "select",
        name: "crewSize",
        label: "Crew size",
        options: [
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3"
          },
          {
            label: "4",
            value: "4",
            default: true
          },
          {
            label: "5+",
            value: "5+"
          }
        ]
      },
      {
        type: "text",
        name: "total",
        label: "Total amount",
        placeholder: "e.g., $186 dinner",
        required: true
      },
      {
        type: "select",
        name: "tone",
        label: "Reminder tone",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Direct",
            value: "direct"
          },
          {
            label: "Playful",
            value: "playful",
            default: true
          }
        ]
      },
      {
        type: "select",
        name: "due",
        label: "Due date",
        options: [
          {
            label: "ASAP",
            value: "asap",
            default: true
          },
          {
            label: "Next week",
            value: "next-week"
          },
          {
            label: "End of month",
            value: "eom"
          }
        ]
      }
    ]
  }
};

export { appConfig };
