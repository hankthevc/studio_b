const appConfig = {
  slug: "clipchoreo",
  hero: {
    eyebrow: "Storyboard brain",
    title: "ClipChoreo",
    tagline: "Turn ideas into beat-perfect shot lists."
  },
  form: {
    helper: "Concept + platform required.",
    ctaLabel: "Storyboard it",
    fields: [
      {
        type: "text",
        name: "concept",
        label: "Concept",
        placeholder: "e.g., productivity hack reel",
        required: true
      },
      {
        type: "select",
        name: "platform",
        label: "Platform",
        options: [
          {
            label: "Reels",
            value: "reels",
            default: true
          },
          {
            label: "TikTok",
            value: "tiktok"
          },
          {
            label: "Shorts",
            value: "shorts"
          }
        ]
      },
      {
        type: "select",
        name: "pace",
        label: "Pace",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Snappy",
            value: "snappy",
            default: true
          },
          {
            label: "Hyper",
            value: "hyper"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Friendly",
            value: "friendly",
            default: true
          },
          {
            label: "Bold",
            value: "bold"
          },
          {
            label: "Minimal",
            value: "minimal"
          }
        ]
      }
    ]
  },
  placeholder: "Drop a concept to storyboard.",
  freePlanLimit: 1,
  share: {
    label: "Share storyboard",
    cta: "Copy deck"
  },
  upsell: {
    title: "ClipChoreo Pro",
    copy: "Unlimited boards, brand kits, and asset export.",
    bullets: [
      "Brand kit overlays.",
      "CSV shot export.",
      "Unlimited boards/day."
    ],
    ctaLabel: "Upgrade for kits"
  },
  plan: {
    summary: {
      title: "{{labels.platform}} storyboard",
      subtitle: "Concept {{labels.concept}} \u00b7 Pace {{labels.pace}}.",
      metrics: [
        {
          label: "Shots",
          value: "3"
        },
        {
          label: "Text beats",
          value: "2 overlays"
        },
        {
          label: "CTA",
          value: "Deterministic"
        }
      ]
    },
    sections: [
      {
        title: "Shot 1",
        description: "Hook + context.",
        items: [
          "Visual treatment referencing {{labels.tone}} tone.",
          "On-screen text suggestion.",
          "Beat length tied to {{labels.pace}}."
        ]
      },
      {
        title: "Shot 2",
        description: "Core content.",
        items: [
          "List key action/camera move.",
          "B-roll or overlay suggestion.",
          "Transition tip."
        ]
      },
      {
        title: "Shot 3",
        description: "Payoff + CTA.",
        items: [
          "Tie back to concept + CTA copy.",
          "Motion or sound cue.",
          "Optional Easter egg."
        ]
      }
    ],
    tips: [
      "Save share link for editors.",
      "Upgrade for brand-safe export.",
      "Regenerate for alternative tone."
    ],
    highlight: {
      eyebrow: "Storyboard locked",
      copy: "Prep props + audio before filming."
    },
    fields: [
      {
        type: "text",
        name: "concept",
        label: "Concept",
        placeholder: "e.g., productivity hack reel",
        required: true
      },
      {
        type: "select",
        name: "platform",
        label: "Platform",
        options: [
          {
            label: "Reels",
            value: "reels",
            default: true
          },
          {
            label: "TikTok",
            value: "tiktok"
          },
          {
            label: "Shorts",
            value: "shorts"
          }
        ]
      },
      {
        type: "select",
        name: "pace",
        label: "Pace",
        options: [
          {
            label: "Chill",
            value: "chill"
          },
          {
            label: "Snappy",
            value: "snappy",
            default: true
          },
          {
            label: "Hyper",
            value: "hyper"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Friendly",
            value: "friendly",
            default: true
          },
          {
            label: "Bold",
            value: "bold"
          },
          {
            label: "Minimal",
            value: "minimal"
          }
        ]
      }
    ]
  }
};

export { appConfig };
