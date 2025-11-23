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
    derive: ({ values }) => {
      const concept = values.concept || "Viral Video";
      const shots = {
        chill: ["Static Tripod", "Slow Pan", "Handheld (Steady)"],
        snappy: ["Whip Pan", "Crash Zoom", "Jump Cut"],
        hyper: ["Speed Ramp", "360 Spin", "Glitch Transition"]
      };
      
      const selectedShots = shots[values.pace] || shots.snappy;
      
      return {
        shot1: selectedShots[0],
        shot2: selectedShots[1],
        shot3: selectedShots[2],
        hook: `POV: ${concept}`,
        cta: values.platform === "tiktok" ? "Link in bio" : "Subscribe for more"
      };
    },
    summary: {
      title: "Shot List: {{labels.concept}}",
      subtitle: "Platform: {{labels.platform}} \u00b7 Pace: {{labels.pace}}",
      metrics: [
        {
          label: "Vibe",
          value: "{{labels.tone}}"
        },
        {
          label: "Cuts",
          value: "3 Main"
        },
        {
          label: "Audio",
          value: "Trending"
        }
      ]
    },
    sections: [
      {
        title: "Shot 1: The Hook (0-3s)",
        description: "Grab attention instantly.",
        items: [
          "Camera: {{derived.shot1}}.",
          "Action: Face camera, hold prop.",
          "Text Overlay: \"{{derived.hook}}\""
        ]
      },
      {
        title: "Shot 2: The Value (3-15s)",
        description: "Deliver the core message.",
        items: [
          "Camera: {{derived.shot2}}.",
          "Action: Demo the process or show result.",
          "Voiceover: Explain the \"Why\"."
        ]
      },
      {
        title: "Shot 3: The Payoff (15s+)",
        description: "Close the loop.",
        items: [
          "Camera: {{derived.shot3}}.",
          "Action: Reveal final result.",
          "Text Overlay: \"{{derived.cta}}\""
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
