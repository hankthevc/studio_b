const appConfig = {
  slug: "tempobuddy",
  hero: {
    eyebrow: "Run/ride pacer",
    title: "TempoBuddy",
    tagline: "Design interval cues + playlist tempos in under a minute."
  },
  form: {
    helper: "Need a route/distance to pace. Playlist/BPM optional.",
    ctaLabel: "Build pacer",
    fields: [
      {
        type: "text",
        name: "route",
        label: "Route or terrain",
        placeholder: "e.g., park loop with hill",
        required: true
      },
      {
        type: "select",
        name: "distance",
        label: "Distance / time",
        options: [
          {
            label: "3 mi / 5 km",
            value: "5k"
          },
          {
            label: "5 mi / 8 km",
            value: "8k",
            default: true
          },
          {
            label: "Long run 10+ km",
            value: "long"
          }
        ]
      },
      {
        type: "chips",
        name: "goal",
        label: "Goal vibe",
        options: [
          {
            label: "Easy build",
            value: "easy"
          },
          {
            label: "Tempo",
            value: "tempo",
            default: true
          },
          {
            label: "Speed play",
            value: "speed"
          }
        ]
      },
      {
        type: "select",
        name: "playlist",
        label: "Playlist BPM",
        options: [
          {
            label: "Chill 140 BPM",
            value: "140"
          },
          {
            label: "Upbeat 160 BPM",
            value: "160",
            default: true
          },
          {
            label: "Hype 175 BPM",
            value: "175"
          }
        ]
      }
    ]
  },
  placeholder: "Share your route + vibe to get tempo cues.",
  freePlanLimit: 1,
  share: {
    label: "Share pacer link",
    cta: "Copy link"
  },
  upsell: {
    title: "TempoBuddy Pro",
    copy: "Adaptive pacing, watch pairing placeholders, and long-run blocks.",
    bullets: [
      "Adaptive cues based on prior recaps.",
      "Audio export + watch pairing stub.",
      "Unlimited tempo plans per day."
    ],
    ctaLabel: "Unlock adaptive pacing"
  },
  plan: {
    derive: ({ values }) => {
      const distanceMap = {
        "5k": "5km",
        "8k": "8km",
        "long": "10km+"
      };
      const bpm = values.playlist || "160";
      
      let planName = "Base Builder";
      let cue1 = "Steady state @ RPE 4";
      let cue2 = "Form check: shoulders down";
      
      if (values.goal === "tempo") {
        planName = "Threshold Run";
        cue1 = "2km @ 10k race pace";
        cue2 = "Recover 90s jog";
      } else if (values.goal === "speed") {
        planName = "Fartlek Fun";
        cue1 = "1 min fast / 1 min slow x 5";
        cue2 = "Focus on turnover (180spm)";
      }

      return {
        planName,
        distLabel: distanceMap[values.distance],
        cue1,
        cue2,
        bpm
      };
    },
    summary: {
      title: "{{derived.planName}}",
      subtitle: "Dist: {{derived.distLabel}} \u00b7 Music: {{derived.bpm}} BPM",
      metrics: [
        {
          label: "Focus",
          value: "{{labels.goal}}"
        },
        {
          label: "Terrain",
          value: "{{labels.route}}"
        },
        {
          label: "Cadence",
          value: "~{{derived.bpm}} spm"
        }
      ]
    },
    sections: [
      {
        title: "Warm Up (10 min)",
        description: "Mobilize before you go.",
        items: [
          "Walk 5 mins.",
          "Dynamic leg swings.",
          "Easy jog to sync with music."
        ]
      },
      {
        title: "Main Set",
        description: "The work.",
        items: [
          "Set 1: {{derived.cue1}}.",
          "Cue: {{derived.cue2}}.",
          "Repeat if feeling good."
        ]
      },
    tips: [
      "Match strides to playlist BPM for steadier pacing.",
      "Use share row to text pacer to accountability buddy.",
      "Upgrade for watch cues + adaptive tempo surfaces."
    ],
    highlight: {
      eyebrow: "Tempo locked",
      copy: "Hit start and let the cues guide the session."
    },
    fields: [
      {
        type: "text",
        name: "route",
        label: "Route or terrain",
        placeholder: "e.g., park loop with hill",
        required: true
      },
      {
        type: "select",
        name: "distance",
        label: "Distance / time",
        options: [
          {
            label: "3 mi / 5 km",
            value: "5k"
          },
          {
            label: "5 mi / 8 km",
            value: "8k",
            default: true
          },
          {
            label: "Long run 10+ km",
            value: "long"
          }
        ]
      },
      {
        type: "chips",
        name: "goal",
        label: "Goal vibe",
        options: [
          {
            label: "Easy build",
            value: "easy"
          },
          {
            label: "Tempo",
            value: "tempo",
            default: true
          },
          {
            label: "Speed play",
            value: "speed"
          }
        ]
      },
      {
        type: "select",
        name: "playlist",
        label: "Playlist BPM",
        options: [
          {
            label: "Chill 140 BPM",
            value: "140"
          },
          {
            label: "Upbeat 160 BPM",
            value: "160",
            default: true
          },
          {
            label: "Hype 175 BPM",
            value: "175"
          }
        ]
      }
    ]
  }
};

export { appConfig };
