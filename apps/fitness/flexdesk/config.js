const appConfig = {
  slug: "flexdesk",
  hero: {
    eyebrow: "Desk mobility coach",
    title: "FlexDesk",
    tagline: "Stack 3-minute releases that match your schedule and tension level."
  },
  form: {
    helper: "Need schedule + tension to personalize the break.",
    ctaLabel: "Build stretch break",
    fields: [
      {
        type: "text",
        name: "schedule",
        label: "Schedule anchor",
        placeholder: "e.g., 9-6 with a noon slump",
        required: true
      },
      {
        type: "select",
        name: "tension",
        label: "Tension hot spot",
        options: [
          {
            label: "Neck & shoulders",
            value: "neck",
            default: true
          },
          {
            label: "Lower back",
            value: "back"
          },
          {
            label: "Hips + glutes",
            value: "hips"
          }
        ]
      },
      {
        type: "chips",
        name: "energy",
        label: "Energy check",
        options: [
          {
            label: "Sleepy",
            value: "sleepy"
          },
          {
            label: "Stiff",
            value: "stiff",
            default: true
          },
          {
            label: "Ready to move",
            value: "energized"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Break length",
        options: [
          {
            label: "3 minutes",
            value: "3-min",
            default: true
          },
          {
            label: "5 minutes",
            value: "5-min"
          },
          {
            label: "8 minutes",
            value: "8-min"
          }
        ]
      }
    ]
  },
  placeholder: "Describe your day and tension so FlexDesk can slot the right motions.",
  freePlanLimit: 2,
  share: {
    label: "Send stretch sequence",
    cta: "Copy plan"
  },
  upsell: {
    title: "Upgrade to FlexDesk Pro",
    copy: "Unlock scheduled reminders, synced calendars, and exported stretch cards.",
    bullets: [
      "Auto-schedule micro breaks around meetings.",
      "Save favorite stacks per tension profile.",
      "Export PDF cards for office posters."
    ],
    ctaLabel: "Unlock reminders"
  },
  plan: {
    summary: {
      title: "{{labels.duration}} reset for {{labels.schedule}}",
      subtitle: "Focus on easing {{labels.tension}} while matching your {{labels.energy}} energy.",
      metrics: [
        {
          label: "Segment count",
          value: "3 mobility tiles"
        },
        {
          label: "Equipment",
          value: "Chair + desk edge"
        },
        {
          label: "Reminder",
          value: "Timer at {{labels.schedule}}"
        }
      ]
    },
    sections: [
      {
        title: "Prime posture",
        description: "Quick breath + awareness cues so your nervous system actually notices the reset.",
        items: [
          "Box breathing for 30 seconds while rolling shoulders.",
          "Neck cars focusing on {{labels.tension}} release.",
          "Desk-edge chest opener for 20 seconds."
        ]
      },
      {
        title: "Core reset",
        description: "Bodyweight moves that counter the desk slump.",
        items: [
          "Seated cat/cow with slow inhales.",
          "{{labels.tension}}-focused stretch (hold 20s x 2).",
          "Standing hip hinge pulses to fire glutes."
        ]
      },
      {
        title: "Re-entry cues",
        description: "Light activation so you return to the meeting focused.",
        items: [
          "Shake out wrists and ankles.",
          "Chair squats \u00d76 or desk pushups if energy = energized.",
          "Re-center eyes 20ft away before looking at screen."
        ]
      }
    ],
    tips: [
      "Pair each flow with water to stack hydration.",
      "Bookmark the share link for coworker nudges.",
      "Upgrade to schedule different flows morning/afternoon."
    ],
    highlight: {
      eyebrow: "Break scheduled",
      copy: "FlexDesk will remind you when it is time to move."
    },
    fields: [
      {
        type: "text",
        name: "schedule",
        label: "Schedule anchor",
        placeholder: "e.g., 9-6 with a noon slump",
        required: true
      },
      {
        type: "select",
        name: "tension",
        label: "Tension hot spot",
        options: [
          {
            label: "Neck & shoulders",
            value: "neck",
            default: true
          },
          {
            label: "Lower back",
            value: "back"
          },
          {
            label: "Hips + glutes",
            value: "hips"
          }
        ]
      },
      {
        type: "chips",
        name: "energy",
        label: "Energy check",
        options: [
          {
            label: "Sleepy",
            value: "sleepy"
          },
          {
            label: "Stiff",
            value: "stiff",
            default: true
          },
          {
            label: "Ready to move",
            value: "energized"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Break length",
        options: [
          {
            label: "3 minutes",
            value: "3-min",
            default: true
          },
          {
            label: "5 minutes",
            value: "5-min"
          },
          {
            label: "8 minutes",
            value: "8-min"
          }
        ]
      }
    ]
  }
};

export { appConfig };
