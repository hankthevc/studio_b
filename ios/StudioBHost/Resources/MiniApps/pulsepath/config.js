const appConfig = {
  slug: "pulsepath",
  hero: {
    eyebrow: "Interval architect",
    title: "PulsePath",
    tagline: "Auto-build HIIT/interval stacks that flex to today\u2019s energy."
  },
  form: {
    helper: "Goal + time block required. Gear optional.",
    ctaLabel: "Build my intervals",
    fields: [
      {
        type: "select",
        name: "goal",
        label: "Session goal",
        options: [
          {
            label: "Fat burn",
            value: "burn"
          },
          {
            label: "Power",
            value: "power"
          },
          {
            label: "Endurance",
            value: "endurance",
            default: true
          }
        ]
      },
      {
        type: "select",
        name: "gear",
        label: "Available gear",
        options: [
          {
            label: "Bodyweight only",
            value: "bodyweight",
            default: true
          },
          {
            label: "Dumbbells",
            value: "dumbbells"
          },
          {
            label: "Bike / rower",
            value: "erg"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time block",
        options: [
          {
            label: "15 min",
            value: "15"
          },
          {
            label: "20 min",
            value: "20",
            default: true
          },
          {
            label: "30 min",
            value: "30"
          }
        ]
      },
      {
        type: "chips",
        name: "intensity",
        label: "How do you feel?",
        options: [
          {
            label: "Need a ramp",
            value: "ramp"
          },
          {
            label: "Ready",
            value: "ready",
            default: true
          },
          {
            label: "Go hard",
            value: "hard"
          }
        ]
      }
    ]
  },
  placeholder: "Share your goal, gear, and time to get a guided circuit.",
  freePlanLimit: 1,
  share: {
    label: "Shareable circuit",
    cta: "Copy plan"
  },
  upsell: {
    title: "PulsePath Pro",
    copy: "Unlock adaptive progressions, saved circuits, and health-app exports.",
    bullets: [
      "Adaptive difficulty based on recent sessions.",
      "Export to Health / Strava placeholders.",
      "Unlimited saved playlists."
    ],
    ctaLabel: "Upgrade for adaptive mode"
  },
  plan: {
    summary: {
      title: "{{labels.duration}} PulsePath for {{labels.goal}}",
      subtitle: "Built around {{labels.gear}} gear and a {{labels.intensity}} energy start.",
      metrics: [
        {
          label: "Blocks",
          value: "3"
        },
        {
          label: "Work:Rest",
          value: "40:20"
        },
        {
          label: "Finisher",
          value: "{{labels.goal}} focus"
        }
      ]
    },
    sections: [
      {
        title: "Prime & load",
        description: "Spike heart rate gradually while prepping joints.",
        items: [
          "Dynamic warmup (high knees, inchworms, arm circles).",
          "Neuromuscular primer targeted at {{labels.goal}}.",
          "Breathing cue to lock cadence before work sets."
        ]
      },
      {
        title: "Interval stack",
        description: "Three rotating sets mixing strength + cardio.",
        items: [
          "Set A: power moves using {{labels.gear}}.",
          "Set B: cardio burst (mountain climbers, sprints, bike sprint).",
          "Set C: stability or tempo hold to lower HR slightly."
        ]
      },
      {
        title: "Finisher & cooldown",
        description: "Empty the tank safely then return to baseline.",
        items: [
          "EMOM finisher tuned to {{labels.goal}}.",
          "Cooldown sequence + mobility focus.",
          "Log how it felt to tune next session."
        ]
      }
    ],
    tips: [
      "Tap Regenerate if today\u2019s energy shifts mid-day.",
      "Upgrade to unlock Health exports + adaptive loads.",
      "Pair with TempoBuddy for music cues."
    ],
    highlight: {
      eyebrow: "HIIT ready",
      copy: "Keep water + towel nearby and honor the recoveries."
    },
    fields: [
      {
        type: "select",
        name: "goal",
        label: "Session goal",
        options: [
          {
            label: "Fat burn",
            value: "burn"
          },
          {
            label: "Power",
            value: "power"
          },
          {
            label: "Endurance",
            value: "endurance",
            default: true
          }
        ]
      },
      {
        type: "select",
        name: "gear",
        label: "Available gear",
        options: [
          {
            label: "Bodyweight only",
            value: "bodyweight",
            default: true
          },
          {
            label: "Dumbbells",
            value: "dumbbells"
          },
          {
            label: "Bike / rower",
            value: "erg"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time block",
        options: [
          {
            label: "15 min",
            value: "15"
          },
          {
            label: "20 min",
            value: "20",
            default: true
          },
          {
            label: "30 min",
            value: "30"
          }
        ]
      },
      {
        type: "chips",
        name: "intensity",
        label: "How do you feel?",
        options: [
          {
            label: "Need a ramp",
            value: "ramp"
          },
          {
            label: "Ready",
            value: "ready",
            default: true
          },
          {
            label: "Go hard",
            value: "hard"
          }
        ]
      }
    ]
  }
};

export { appConfig };
