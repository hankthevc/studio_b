const appConfig = {
  slug: "beatboard",
  hero: {
    eyebrow: "Hook generator",
    title: "BeatBoard",
    tagline: "Dial in vibe and get a loop-ready hook."
  },
  form: {
    helper: "Need vibe, use case, and tempo.",
    ctaLabel: "Generate hook",
    fields: [
      {
        type: "select",
        name: "vibe",
        label: "Vibe",
        options: [
          {
            label: "Dreamy",
            value: "dreamy"
          },
          {
            label: "Upbeat",
            value: "upbeat",
            default: true
          },
          {
            label: "Gritty",
            value: "gritty"
          }
        ]
      },
      {
        type: "select",
        name: "length",
        label: "Length",
        options: [
          {
            label: "5 sec",
            value: "5"
          },
          {
            label: "10 sec",
            value: "10",
            default: true
          },
          {
            label: "15 sec",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "useCase",
        label: "Use case",
        options: [
          {
            label: "Reel intro",
            value: "reel",
            default: true
          },
          {
            label: "Podcast bumper",
            value: "pod"
          },
          {
            label: "Ad sting",
            value: "ad"
          }
        ]
      },
      {
        type: "select",
        name: "energy",
        label: "Energy",
        options: [
          {
            label: "Low key",
            value: "low"
          },
          {
            label: "Medium",
            value: "medium",
            default: true
          },
          {
            label: "Hype",
            value: "high"
          }
        ]
      }
    ]
  },
  placeholder: "Pick vibe + use case.",
  freePlanLimit: 3,
  share: {
    label: "Share hook",
    cta: "Copy link"
  },
  upsell: {
    title: "BeatBoard Pro",
    copy: "Unlimited stems, favorite banks, and licensing notes.",
    bullets: [
      "Stem download placeholder.",
      "Favorite bank library.",
      "Licensing reminders."
    ],
    ctaLabel: "Upgrade for stems"
  },
  plan: {
    summary: {
      title: "{{labels.useCase}} hook",
      subtitle: "Vibe {{labels.vibe}} \u00b7 Energy {{labels.energy}}.",
      metrics: [
        {
          label: "Length",
          value: "{{labels.length}} sec"
        },
        {
          label: "Tempo",
          value: "92\u2013120 BPM"
        },
        {
          label: "Loop ready",
          value: "Yes"
        }
      ]
    },
    sections: [
      {
        title: "Sonic palette",
        description: "Baseline instrumentation suggestions.",
        items: [
          "Lead instrument referencing {{labels.vibe}}.",
          "Bass / rhythm cues.",
          "FX or ear candy idea."
        ]
      },
      {
        title: "Hook structure",
        description: "Timeline for the {{labels.length}} sec sting.",
        items: [
          "Beat 1: intro swell.",
          "Beat 2-3: motif enters.",
          "Beat 4+: stutter/loop instructions."
        ]
      },
      {
        title: "Usage tips",
        description: "How to drop it in content.",
        items: [
          "CTA overlay suggestion.",
          "Volume ducking tip.",
          "Loop instructions."
        ]
      }
    ],
    tips: [
      "Upgrade for stem download + licensing guidelines.",
      "Share link with editor or collaborator.",
      "Regenerate for different vibe."
    ],
    highlight: {
      eyebrow: "Hook framed",
      copy: "Lock tempo before final mix."
    },
    fields: [
      {
        type: "select",
        name: "vibe",
        label: "Vibe",
        options: [
          {
            label: "Dreamy",
            value: "dreamy"
          },
          {
            label: "Upbeat",
            value: "upbeat",
            default: true
          },
          {
            label: "Gritty",
            value: "gritty"
          }
        ]
      },
      {
        type: "select",
        name: "length",
        label: "Length",
        options: [
          {
            label: "5 sec",
            value: "5"
          },
          {
            label: "10 sec",
            value: "10",
            default: true
          },
          {
            label: "15 sec",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "useCase",
        label: "Use case",
        options: [
          {
            label: "Reel intro",
            value: "reel",
            default: true
          },
          {
            label: "Podcast bumper",
            value: "pod"
          },
          {
            label: "Ad sting",
            value: "ad"
          }
        ]
      },
      {
        type: "select",
        name: "energy",
        label: "Energy",
        options: [
          {
            label: "Low key",
            value: "low"
          },
          {
            label: "Medium",
            value: "medium",
            default: true
          },
          {
            label: "Hype",
            value: "high"
          }
        ]
      }
    ]
  }
};

export { appConfig };
