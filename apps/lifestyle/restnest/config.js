const appConfig = {
  slug: "restnest",
  hero: {
    eyebrow: "Wind-down guide",
    title: "RestNest",
    tagline: "End the day with a structured, cozy routine."
  },
  form: {
    helper: "Need vibe + time block to craft the flow.",
    ctaLabel: "Craft wind-down",
    fields: [
      {
        type: "chips",
        name: "eveningFeel",
        label: "Tonight feels",
        options: [
          {
            label: "Wired",
            value: "wired"
          },
          {
            label: "Meh",
            value: "meh",
            default: true
          },
          {
            label: "Calm",
            value: "calm"
          }
        ]
      },
      {
        type: "select",
        name: "room",
        label: "Where are you winding down?",
        options: [
          {
            label: "Bedroom",
            value: "bedroom",
            default: true
          },
          {
            label: "Living room",
            value: "living"
          },
          {
            label: "Hotel / travel",
            value: "travel"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time available",
        options: [
          {
            label: "8 minutes",
            value: "8"
          },
          {
            label: "10 minutes",
            value: "10",
            default: true
          },
          {
            label: "15 minutes",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "partner",
        label: "Solo or partner?",
        options: [
          {
            label: "Solo",
            value: "solo",
            default: true
          },
          {
            label: "Partner",
            value: "partner"
          }
        ]
      }
    ]
  },
  placeholder: "Tell RestNest how tonight feels.",
  freePlanLimit: 1,
  share: {
    label: "Share wind-down",
    cta: "Copy link"
  },
  upsell: {
    title: "RestNest Pro",
    copy: "Unlock multi-night stacks, soundscapes, and partner sharing.",
    bullets: [
      "Save favorite routines + audio cues.",
      "Multi-night playlist builder.",
      "Partner sync invites."
    ],
    ctaLabel: "Upgrade for multi-night"
  },
  plan: {
    derive: ({ values }) => {
      const breathByMood = {
        wired: { name: "4-7-8 Relax Breath", desc: "Inhale 4, hold 7, exhale 8 to calm the nervous system." },
        meh: { name: "Box Breathing", desc: "Inhale 4, hold 4, exhale 4, hold 4 for focus." },
        calm: { name: "Coherent Breathing", desc: "Gentle 6-second inhale, 6-second exhale." }
      };
      
      const soundByRoom = {
        bedroom: "Pink Noise or Heavy Rain",
        living: "Lo-fi Beats or Fireplace",
        travel: "Brown Noise (masks hotel sounds)"
      };

      const selectedBreath = breathByMood[values.eveningFeel] || breathByMood.meh;
      const selectedSound = soundByRoom[values.room] || "Soft Rain";

      return {
        breathName: selectedBreath.name,
        breathDesc: selectedBreath.desc,
        sound: selectedSound,
        journalPrompt: values.partner === "partner" ? "Share one win and one worry with your partner." : "Write down 3 things that can wait until tomorrow."
      };
    },
    summary: {
      title: "{{labels.duration}}-Min Wind Down",
      subtitle: "Mood: {{labels.eveningFeel}} \u00b7 Room: {{labels.room}}",
      metrics: [
        {
          label: "Breathwork",
          value: "{{derived.breathName}}"
        },
        {
          label: "Audio",
          value: "{{derived.sound}}"
        },
        {
          label: "Mode",
          value: "{{labels.partner}}"
        }
      ]
    },
    sections: [
      {
        title: "1. Reset (2 min)",
        description: "Shift gears physically.",
        items: [
          "Phone away (or Do Not Disturb).",
          "Put on {{derived.sound}}.",
          "Do 5 cycles of {{derived.breathName}}: {{derived.breathDesc}}"
        ]
      },
      {
        title: "2. Unload (3 min)",
        description: "Clear mental RAM.",
        items: [
          "{{derived.journalPrompt}}",
          "Review tomorrow's first task so you don't loop on it.",
          "Stretch: Neck rolls and forward fold."
        ]
      },
      {
        title: "3. Drift (Remaining)",
        description: "Prepare for sleep.",
        items: [
          "Dim lights to 20%.",
          "Cool the room if possible.",
          "Read fiction (paper/Kindle, no blue light)."
        ]
      }
    ],
    tips: [
      "Wired nights benefit from longer breath sections.",
      "Screenshot routine to keep near bedside.",
      "Upgrade for multi-night stacks + partner sync."
    ],
    highlight: {
      eyebrow: "Nest ready",
      copy: "Phone goes on Do Not Disturb from here."
    },
    fields: [
      {
        type: "chips",
        name: "eveningFeel",
        label: "Tonight feels",
        options: [
          {
            label: "Wired",
            value: "wired"
          },
          {
            label: "Meh",
            value: "meh",
            default: true
          },
          {
            label: "Calm",
            value: "calm"
          }
        ]
      },
      {
        type: "select",
        name: "room",
        label: "Where are you winding down?",
        options: [
          {
            label: "Bedroom",
            value: "bedroom",
            default: true
          },
          {
            label: "Living room",
            value: "living"
          },
          {
            label: "Hotel / travel",
            value: "travel"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Time available",
        options: [
          {
            label: "8 minutes",
            value: "8"
          },
          {
            label: "10 minutes",
            value: "10",
            default: true
          },
          {
            label: "15 minutes",
            value: "15"
          }
        ]
      },
      {
        type: "select",
        name: "partner",
        label: "Solo or partner?",
        options: [
          {
            label: "Solo",
            value: "solo",
            default: true
          },
          {
            label: "Partner",
            value: "partner"
          }
        ]
      }
    ]
  }
};

export { appConfig };
