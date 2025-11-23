const appConfig = {
  slug: "layoverloop",
  hero: {
    eyebrow: "Layover playbooks",
    title: "LayoverLoop",
    tagline: "Turn downtime into a micro adventure you can actually fit in."
  },
  form: {
    helper: "Need at least a city and layover length. Tweak vibes as needed.",
    ctaLabel: "Plan my layover",
    fields: [
      {
        type: "text",
        name: "city",
        label: "Layover city",
        placeholder: "e.g., Lisbon",
        required: true
      },
      {
        type: "select",
        name: "duration",
        label: "Buffer length",
        options: [
          {
            label: "2 hours",
            value: "2-hour"
          },
          {
            label: "3 hours",
            value: "3-hour",
            default: true
          },
          {
            label: "4 hours",
            value: "4-hour"
          }
        ]
      },
      {
        type: "chips",
        name: "vibe",
        label: "Layover vibe",
        options: [
          {
            label: "Recharge",
            value: "recharge"
          },
          {
            label: "Quick explore",
            value: "explore",
            default: true
          },
          {
            label: "Food run",
            value: "foodie"
          }
        ]
      },
      {
        type: "select",
        name: "transit",
        label: "Transit plan",
        options: [
          {
            label: "Walkable loop",
            value: "walkable"
          },
          {
            label: "Metro hop",
            value: "metro",
            default: true
          },
          {
            label: "Ride share",
            value: "rideshare"
          }
        ]
      },
      {
        type: "select",
        name: "budget",
        label: "Spend level",
        options: [
          {
            label: "$ keep it light",
            value: "frugal"
          },
          {
            label: "$$ balanced",
            value: "balanced",
            default: true
          },
          {
            label: "$$$ treat yourself",
            value: "treat"
          }
        ]
      }
    ]
  },
  placeholder: "Drop a city and vibe to see how to spend the spare hours.",
  freePlanLimit: 1,
  share: {
    label: "Shareable layover",
    cta: "Copy link"
  },
  upsell: {
    title: "Unlock LayoverLoop Pro",
    copy: "Offline cards, lounge reminders, and saved airport kits for every hub you pass through.",
    bullets: [
      "Offline PDF with transit timers.",
      "Lounge perk nudges + SMS buffer alerts.",
      "Save layover presets per airport."
    ],
    ctaLabel: "Upgrade for offline cards"
  },
  plan: {
    derive: ({ values }) => {
      const city = (values.city || "your city").trim();
      const durationHours = parseInt(values.duration, 10) || 3;
      
      // Heuristic: 90 mins needed for customs/transit/security buffer
      const usableTime = durationHours * 60 - 90;
      
      let planType = "Terminal Loop";
      let advice = "Stay airside. Not enough buffer to leave.";
      
      if (usableTime > 120) {
        planType = "City Dash";
        advice = "You have ~2 hours on the ground. Go!";
      } else if (usableTime > 60) {
        planType = "Near-Airport Spot";
        advice = "Pick one spot <15 min taxi ride away.";
      }

      const vibeStops = {
        recharge: ["Quiet park or library", "Hotel lobby bar", "Spa/Gym day pass"],
        explore: ["Central Plaza", "Historic Old Town", "Famous viewpoint"],
        foodie: ["Top-rated bakery", "Street food alley", "Local coffee roaster"]
      };
      
      const stops = vibeStops[values.vibe] || vibeStops.explore;

      return { 
        city, 
        planType, 
        advice, 
        stop1: stops[0],
        stop2: stops[1]
      };
    },
    summary: {
      title: "{{derived.planType}} in {{labels.city}}",
      subtitle: "Buffer: {{labels.duration}} \u00b7 Vibe: {{labels.vibe}}",
      metrics: [
        {
          label: "Strategy",
          value: "{{derived.planType}}"
        },
        {
          label: "Transit",
          value: "{{labels.transit}}"
        },
        {
          label: "Usable Time",
          value: "Check advice"
        }
      ]
    },
    sections: [
      {
        title: "Feasibility Check",
        description: "{{derived.advice}}",
        items: [
          "Transit: {{labels.transit}} mode recommended.",
          "Budget: {{labels.budget}} pace.",
          "Hard Stop: Be back at security 60 mins before flight."
        ]
      },
      {
        title: "The Loop",
        description: "If you go, hit these:",
        items: [
          "1. {{derived.stop1}} in {{derived.city}}.",
          "2. {{derived.stop2}} (only if time permits).",
          "3. Grab a souvenir/snack for the plane."
        ]
      },
      {
        title: "Return Protocol",
        description: "Don't miss the flight.",
        items: [
          "Set phone alarm for 'Head Back' time.",
          "Pre-book {{labels.transit}} return if possible.",
          "Have boarding pass screenshot ready."
        ]
      }
    ],
    tips: [
      "Set dual alarms: one for head-back, one for boarding minus 20.",
      "Screenshot the share link for offline access when Wi-Fi flakes.",
      "Swap lounges if upgrades trigger\u2014Pro remembers your perks."
    ],
    highlight: {
      eyebrow: "Micro-adventure locked",
      copy: "Keep your passport + boarding pass in the first pouch and enjoy the loop."
    },
    fields: [
      {
        type: "text",
        name: "city",
        label: "Layover city",
        placeholder: "e.g., Lisbon",
        required: true
      },
      {
        type: "select",
        name: "duration",
        label: "Buffer length",
        options: [
          {
            label: "2 hours",
            value: "2-hour"
          },
          {
            label: "3 hours",
            value: "3-hour",
            default: true
          },
          {
            label: "4 hours",
            value: "4-hour"
          }
        ]
      },
      {
        type: "chips",
        name: "vibe",
        label: "Layover vibe",
        options: [
          {
            label: "Recharge",
            value: "recharge"
          },
          {
            label: "Quick explore",
            value: "explore",
            default: true
          },
          {
            label: "Food run",
            value: "foodie"
          }
        ]
      },
      {
        type: "select",
        name: "transit",
        label: "Transit plan",
        options: [
          {
            label: "Walkable loop",
            value: "walkable"
          },
          {
            label: "Metro hop",
            value: "metro",
            default: true
          },
          {
            label: "Ride share",
            value: "rideshare"
          }
        ]
      },
      {
        type: "select",
        name: "budget",
        label: "Spend level",
        options: [
          {
            label: "$ keep it light",
            value: "frugal"
          },
          {
            label: "$$ balanced",
            value: "balanced",
            default: true
          },
          {
            label: "$$$ treat yourself",
            value: "treat"
          }
        ]
      }
    ]
  }
};

export { appConfig };
