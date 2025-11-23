const appConfig = {
  slug: "pitchpulse",
  hero: {
    eyebrow: "Pitch coach",
    title: "PitchPulse",
    tagline: "Draft a lightning intro with clarity cues."
  },
  form: {
    helper: "Audience + tone required.",
    ctaLabel: "Draft pitch",
    fields: [
      {
        type: "select",
        name: "audience",
        label: "Audience",
        options: [
          {
            label: "Investor",
            value: "investor"
          },
          {
            label: "Hiring manager",
            value: "hiring",
            default: true
          },
          {
            label: "Peer networking",
            value: "peer"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Confident",
            value: "confident",
            default: true
          },
          {
            label: "Warm",
            value: "warm"
          },
          {
            label: "High-energy",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time window",
        options: [
          {
            label: "20 sec",
            value: "20"
          },
          {
            label: "30 sec",
            value: "30",
            default: true
          },
          {
            label: "45 sec",
            value: "45"
          }
        ]
      },
      {
        type: "select",
        name: "focus",
        label: "Focus",
        options: [
          {
            label: "Product",
            value: "product"
          },
          {
            label: "Team",
            value: "team"
          },
          {
            label: "Traction",
            value: "traction",
            default: true
          }
        ]
      }
    ]
  },
  placeholder: "Tell PitchPulse about the audience and vibe.",
  freePlanLimit: 1,
  share: {
    label: "Share pitch",
    cta: "Copy pitch"
  },
  upsell: {
    title: "PitchPulse Pro",
    copy: "Store role profiles, rehearsal mode, and share links.",
    bullets: [
      "Save unlimited role profiles.",
      "Rehearsal timer + filler alert.",
      "Shareable pitch links."
    ],
    ctaLabel: "Upgrade for rehearsal"
  },
  plan: {
    derive: ({ values }) => {
      const hooks = {
        investor: {
          confident: "We found the secret to [Market Gap] and just hit [Metric].",
          warm: "I'm building a team to solve [Problem] because I lived it.",
          high: "Imagine if [Competitor] was actually fast. That's us."
        },
        hiring: {
          confident: "I specialize in [Skill] and drove [Result] at my last role.",
          warm: "I've admired your team's work on [Project] and want to contribute.",
          high: "I'm ready to sprint on [Goal] starting day one."
        },
        peer: {
          confident: "I'm working on [Project]—it's a bit wild but working.",
          warm: "Hey, I'm [Name]. I loved your point about [Topic].",
          high: "Let's collab! I have an idea for [Idea]."
        }
      };
      
      const selectedHook = hooks[values.audience]?.[values.tone] || hooks.investor.confident;
      const duration = parseInt(values.time, 10) || 30;
      
      return {
        hook: selectedHook,
        proof: values.focus === "traction" ? "30% MoM growth" : values.focus === "team" ? "Ex-Google founders" : "Patent-pending tech",
        cta: values.audience === "investor" ? "Are you open to a 15-min demo?" : "Can I send you my portfolio?"
      };
    },
    summary: {
      title: "Pitch Draft: {{labels.time}} sec",
      subtitle: "Audience: {{labels.audience}} \u00b7 Tone: {{labels.tone}}",
      metrics: [
        {
          label: "Opener",
          value: "Strong Hook"
        },
        {
          label: "Proof Point",
          value: "{{derived.proof}}"
        },
        {
          label: "Close",
          value: "Clear CTA"
        }
      ]
    },
    sections: [
      {
        title: "The Script",
        description: "Read this aloud.",
        items: [
          "1. Hook: \"{{derived.hook}}\"",
          "2. Proof: \"We have {{derived.proof}}.\"",
          "3. Ask: \"{{derived.cta}}\""
        ]
      },
      {
        title: "Trim + polish",
        description: "Suggestions to tighten.",
        items: [
          "Remove filler words (list).",
          "Highlight phrase to emphasize.",
          "Breath/pauses cues."
        ]
      },
      {
        title: "Follow-up",
        description: "How to continue convo.",
        items: [
          "What to ask the listener.",
          "Asset to offer (deck, demo).",
          "Reminder to log takeaways."
        ]
      }
    ],
    tips: [
      "Upgrade for rehearsal timers + saved pitches.",
      "Record yourself and compare to clarity cues.",
      "Share link with mentor for feedback."
    ],
    highlight: {
      eyebrow: "Pitch pulsing",
      copy: "Practice twice before next conversation."
    },
    fields: [
      {
        type: "select",
        name: "audience",
        label: "Audience",
        options: [
          {
            label: "Investor",
            value: "investor"
          },
          {
            label: "Hiring manager",
            value: "hiring",
            default: true
          },
          {
            label: "Peer networking",
            value: "peer"
          }
        ]
      },
      {
        type: "select",
        name: "tone",
        label: "Tone",
        options: [
          {
            label: "Confident",
            value: "confident",
            default: true
          },
          {
            label: "Warm",
            value: "warm"
          },
          {
            label: "High-energy",
            value: "high"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Time window",
        options: [
          {
            label: "20 sec",
            value: "20"
          },
          {
            label: "30 sec",
            value: "30",
            default: true
          },
          {
            label: "45 sec",
            value: "45"
          }
        ]
      },
      {
        type: "select",
        name: "focus",
        label: "Focus",
        options: [
          {
            label: "Product",
            value: "product"
          },
          {
            label: "Team",
            value: "team"
          },
          {
            label: "Traction",
            value: "traction",
            default: true
          }
        ]
      }
    ]
  }
};

export { appConfig };
