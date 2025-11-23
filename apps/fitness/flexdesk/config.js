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
    derive: ({ values }) => {
      const moves = {
        neck: ["Chin Tucks", "Ear to Shoulder", "Neck Rotations"],
        back: ["Seated Cat-Cow", "Thoracic Twist", "Forward Fold"],
        hips: ["Seated Figure-4", "Lunge Stretch", "Glute Squeeze"]
      };
      
      const selectedMoves = moves[values.tension] || moves.neck;
      const duration = parseInt(values.duration, 10) || 3;
      const moveTime = Math.floor((duration * 60) / 3); // Seconds per move

      return {
        m1: selectedMoves[0],
        m2: selectedMoves[1],
        m3: selectedMoves[2],
        timePerMove: `${moveTime}s`
      };
    },
    summary: {
      title: "Desk Reset: {{labels.tension}}",
      subtitle: "Duration: {{labels.duration}} \u00b7 Energy: {{labels.energy}}",
      metrics: [
        {
          label: "Focus Area",
          value: "{{labels.tension}}"
        },
        {
          label: "Intensity",
          value: "{{labels.energy}}"
        },
        {
          label: "Next Break",
          value: "{{labels.schedule}}"
        }
      ]
    },
    sections: [
      {
        title: "The Routine",
        description: "Hold each for {{derived.timePerMove}}.",
        items: [
          "1. {{derived.m1}}",
          "2. {{derived.m2}}",
          "3. {{derived.m3}}"
        ]
      },
      {
        title: "Ergo Check",
        description: "Before you sit back down.",
        items: [
          "Screen at eye level?",
          "Feet flat on floor?",
          "Shoulders relaxed?"
        ]
      },
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
