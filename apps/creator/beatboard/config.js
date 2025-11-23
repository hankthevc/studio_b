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
    derive: ({ values }) => {
      // Simulation: "Mix" instruments based on vibe
      const vibeMap = {
        dreamy: { bpm: "85-95", lead: "Analog Synth Pad", bass: "Sub sine", fx: "Tape hiss + Reverb" },
        upbeat: { bpm: "115-124", lead: "Plucky Marimba", bass: "Funky slap", fx: "Vocal chop" },
        gritty: { bpm: "130-140", lead: "Distorted 808", bass: "Reese", fx: "Bitcrusher" }
      };
      
      const selectedVibe = vibeMap[values.vibe] || vibeMap.upbeat;
      let energyMod = "";
      if (values.energy === "high") energyMod = "(Overdriven)";
      if (values.energy === "low") energyMod = "(Filtered)";

      const timeline = [];
      const len = parseInt(values.length, 10);
      timeline.push(`0:00 - Intro: ${selectedVibe.lead} fade in`);
      timeline.push(`0:${Math.floor(len / 2)} - Drop: ${selectedVibe.bass} ${energyMod}`);
      timeline.push(`0:${len} - Cut: Hard stop for loop`);

      return {
        bpm: selectedVibe.bpm,
        lead: selectedVibe.lead,
        bass: selectedVibe.bass,
        fx: selectedVibe.fx,
        timeline1: timeline[0],
        timeline2: timeline[1],
        timeline3: timeline[2]
      };
    },
    summary: {
      title: "{{labels.useCase}} Mix",
      subtitle: "Vibe {{labels.vibe}} \u00b7 Energy {{labels.energy}}",
      metrics: [
        {
          label: "Target BPM",
          value: "{{derived.bpm}}"
        },
        {
          label: "Key Element",
          value: "{{derived.lead}}"
        },
        {
          label: "Loopable",
          value: "Yes"
        }
      ]
    },
    sections: [
      {
        title: "Sonic Palette",
        description: "Instrumentation mix.",
        items: [
          "Lead: {{derived.lead}}",
          "Bass: {{derived.bass}}",
          "Ear Candy: {{derived.fx}}"
        ]
      },
      {
        title: "Arrangement",
        description: "Timeline for {{labels.length}} sec clip.",
        items: [
          "{{derived.timeline1}}",
          "{{derived.timeline2}}",
          "{{derived.timeline3}}"
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
