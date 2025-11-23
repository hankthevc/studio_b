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
      const goalNotes = {
        easy: "Keep HR low, nasal breathing, smooth cadence.",
        tempo: "Controlled discomfort; lock cadence with BPM.",
        speed: "Shorter surges, strong recoveries."
      };
      const playlistCues = {
        "140": "Chill 140 BPM",
        "160": "Upbeat 160 BPM",
        "175": "Hype 175 BPM"
      };
      return {
        goalNote: goalNotes[values.goal] || "Steady pacing; listen to your body.",
        playlistNote: playlistCues[values.playlist] || `${values.playlist} BPM`
      };
    },
    summary: {
      title: "{{labels.distance}} tempo on {{labels.route}}",
      subtitle: "Goal: {{labels.goal}} with BPM {{labels.playlist}}.",
      metrics: [
        {
          label: "Intervals",
          value: "4 blocks"
        },
        {
          label: "Pace swing",
          value: "\u00b110 sec"
        },
        {
          label: "Playlist",
          value: "{{labels.playlist}} BPM"
        }
      ]
    },
    sections: [
      {
        title: "Warm & prime",
        description: "Ease into cadence and prep hills.",
        items: [
          "1 km conversational pace.",
          "Drills: skips, butt kicks, quick strides.",
          "Lock playlist volume + safety checks."
        ]
      },
      {
        title: "Tempo wave",
        description: "Alternating blocks tuned to {{labels.goal}}.",
        items: [
          "Block 1: 6 min tempo, 2 min float.",
          "Block 2: hills or surges referencing {{labels.route}}.",
          "Block 3: negative split push."
        ]
      },
      {
        title: "Send-off + recap",
        description: "Cool down and capture insights.",
        items: [
          "1 km easy jog/walk cooldown.",
          "Breathing reset + hydration cue.",
          "Dictate quick recap for future adaptive tuning."
        ]
      }
    ],
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
