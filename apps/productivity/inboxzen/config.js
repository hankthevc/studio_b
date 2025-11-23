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
    derive: ({ values }) => {
      const emails = (values.emails || "")
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean)
        .slice(0, 5);
      
      while (emails.length < 3) {
        emails.push("Add another subject to triage.");
      }

      // Simulated Triage Logic
      const triage = emails.map(subject => {
        const lower = subject.toLowerCase();
        if (lower.includes("urgent") || lower.includes("asap") || lower.includes("fire")) return "🔥 Do Now";
        if (lower.includes("update") || lower.includes("fyi") || lower.includes("newsletter")) return "📥 Read Later";
        if (lower.includes("intro") || lower.includes("connect")) return "🤝 Delegate/Intro";
        return "📅 Schedule";
      });

      return {
        email1: emails[0],
        action1: triage[0],
        email2: emails[1],
        action2: triage[1],
        email3: emails[2],
        action3: triage[2],
        emailCount: emails.length
      };
    },
    summary: {
      title: "Triage Plan Generated",
      subtitle: "Goal: {{labels.goal}} \u00b7 Tone: {{labels.tone}}",
      metrics: [
        {
          label: "Top Priority",
          value: "{{derived.action1}}"
        },
        {
          label: "Batch Size",
          value: "{{derived.emailCount}} emails"
        },
        {
          label: "Est. Time",
          value: "{{labels.time}} min"
        }
      ]
    },
    sections: [
      {
        title: "Action List",
        description: "Recommended next steps based on subject keywords.",
        items: [
          "1. {{derived.email1}} \u2192 {{derived.action1}}",
          "2. {{derived.email2}} \u2192 {{derived.action2}}",
          "3. {{derived.email3}} \u2192 {{derived.action3}}"
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
