const appConfig = {
  slug: "inboxzen",
  hero: {
    eyebrow: "Inbox coach",
    title: "InboxZen",
    tagline: "Summarize, triage, and respond to priority mail fast."
  },
  form: {
    helper: "Add at least two subject lines.",
    ctaLabel: "Coach my inbox",
    fields: [
      {
        type: "textarea",
        name: "emails",
        label: "Top emails (one per line)",
        placeholder: "Investor update follow-up\nOps fire drill",
        required: true
      },
      {
        type: "select",
        name: "tone",
        label: "Reply tone",
        options: [
          {
            label: "Friendly",
            value: "friendly"
          },
          {
            label: "Direct",
            value: "direct",
            default: true
          },
          {
            label: "Formal",
            value: "formal"
          }
        ]
      },
      {
        type: "select",
        name: "goal",
        label: "Goal",
        options: [
          {
            label: "Clear backlog",
            value: "clear",
            default: true
          },
          {
            label: "Prioritize",
            value: "prioritize"
          },
          {
            label: "Delegate",
            value: "delegate"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Available time",
        options: [
          {
            label: "15 min",
            value: "15"
          },
          {
            label: "30 min",
            value: "30",
            default: true
          },
          {
            label: "45+ min",
            value: "45"
          }
        ]
      }
    ]
  },
  placeholder: "Paste a few email subjects to triage.",
  freePlanLimit: 1,
  share: {
    label: "Share triage summary",
    cta: "Copy recap"
  },
  upsell: {
    title: "InboxZen Pro",
    copy: "Unlimited summaries, reusable reply presets, and CRM export.",
    bullets: [
      "Save reply templates by tone.",
      "Push actions to CRM/Todo API.",
      "Unlimited daily triage."
    ],
    ctaLabel: "Upgrade for presets"
  },
  plan: {
    summary: {
      title: "Inbox triage ready",
      subtitle: "Goal {{labels.goal}} \u00b7 Tone {{labels.tone}}.",
      metrics: [
        {
          label: "Emails parsed",
          value: "3"
        },
        {
          label: "Delegations",
          value: "1 suggestion"
        },
        {
          label: "Focus block",
          value: "{{labels.time}} min"
        }
      ]
    },
    sections: [
      {
        title: "Triage list",
        description: "Order of attack with quick reason.",
        items: [
          "Email #1 summary + action.",
          "Email #2 summary + action.",
          "Email #3 summary + action."
        ]
      },
      {
        title: "Reply prompts",
        description: "Tone-matched prompts to copy.",
        items: [
          "Prompt for top priority.",
          "Prompt for follow-up/delay.",
          "Prompt for delegate/loop-in."
        ]
      },
      {
        title: "Focus timer",
        description: "Guide to clear backlog fast.",
        items: [
          "Block calendar for {{labels.time}} minutes.",
          "Silence notifications.",
          "Reward (tea/stretch) after inbox hits target."
        ]
      }
    ],
    tips: [
      "Upgrade to save prompts per sender.",
      "Use share link for chief of staff handoffs.",
      "Regenerate when tone needs shift."
    ],
    highlight: {
      eyebrow: "Inbox calm",
      copy: "Close mail after the sprint\u2014don\u2019t re-open until next block."
    },
    fields: [
      {
        type: "textarea",
        name: "emails",
        label: "Top emails (one per line)",
        placeholder: "Investor update follow-up\nOps fire drill",
        required: true
      },
      {
        type: "select",
        name: "tone",
        label: "Reply tone",
        options: [
          {
            label: "Friendly",
            value: "friendly"
          },
          {
            label: "Direct",
            value: "direct",
            default: true
          },
          {
            label: "Formal",
            value: "formal"
          }
        ]
      },
      {
        type: "select",
        name: "goal",
        label: "Goal",
        options: [
          {
            label: "Clear backlog",
            value: "clear",
            default: true
          },
          {
            label: "Prioritize",
            value: "prioritize"
          },
          {
            label: "Delegate",
            value: "delegate"
          }
        ]
      },
      {
        type: "select",
        name: "time",
        label: "Available time",
        options: [
          {
            label: "15 min",
            value: "15"
          },
          {
            label: "30 min",
            value: "30",
            default: true
          },
          {
            label: "45+ min",
            value: "45"
          }
        ]
      }
    ]
  }
};

export { appConfig };
