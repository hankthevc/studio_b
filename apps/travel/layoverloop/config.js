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
    summary: {
      title: "{{labels.duration}} loop in {{labels.city}}",
      subtitle: "Built for a {{labels.vibe}} vibe with {{labels.transit}} transfers.",
      metrics: [
        {
          label: "Stops",
          value: "3 curated pauses"
        },
        {
          label: "Return buffer",
          value: "{{labels.transit}} buffer locked"
        },
        {
          label: "Spend",
          value: "{{labels.budget}} pace"
        }
      ]
    },
    sections: [
      {
        title: "Arrival reset",
        description: "Shake off the previous flight and ground yourself near the terminal.",
        items: [
          "Breeze through security and stash bags at the short-term locker.",
          "Walk to a {{labels.vibe}} friendly lounge or cafe for a 20-min recharge.",
          "Set an alarm for boarding minus 45 minutes so you never sprint."
        ]
      },
      {
        title: "City micro loop",
        description: "Dip into the local pulse without watching the clock every five minutes.",
        items: [
          "Hop into a {{labels.transit}} ride toward a distinct neighborhood.",
          "Follow a three-stop path: landmark, quick bite, souvenir snap.",
          "Capture a photo proof and share the short link with travel buddies."
        ]
      },
      {
        title: "Return glide path",
        description: "Reenter airport mode cool, hydrated, and aligned with boarding.",
        items: [
          "Order a ride/walk back with 70 minutes to spare.",
          "Grab a stretch + water refill before final security scan.",
          "Queue the next layover idea so future you spends zero minutes planning."
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
