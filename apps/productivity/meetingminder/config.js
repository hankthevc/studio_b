const appConfig = {
  slug: "meetingminder",
  hero: {
    eyebrow: "Meeting companion",
    title: "MeetingMinder",
    tagline: "Prep smarter, leave with tidy follow-ups."
  },
  form: {
    helper: "Meeting type + attendees required.",
    ctaLabel: "Draft prep kit",
    fields: [
      {
        type: "select",
        name: "meetingType",
        label: "Meeting type",
        options: [
          {
            label: "1:1",
            value: "1-1"
          },
          {
            label: "Team sync",
            value: "team",
            default: true
          },
          {
            label: "Client",
            value: "client"
          }
        ]
      },
      {
        type: "text",
        name: "attendees",
        label: "Key attendees",
        placeholder: "e.g., Alex (PM), Priya (Design)",
        required: true
      },
      {
        type: "select",
        name: "goal",
        label: "Goal",
        options: [
          {
            label: "Decide",
            value: "decide",
            default: true
          },
          {
            label: "Align",
            value: "align"
          },
          {
            label: "Status",
            value: "status"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Duration",
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
            label: "60 min",
            value: "60"
          }
        ]
      }
    ]
  },
  placeholder: "Tell MeetingMinder about the meeting.",
  freePlanLimit: 1,
  share: {
    label: "Share prep kit",
    cta: "Copy plan"
  },
  upsell: {
    title: "MeetingMinder Pro",
    copy: "Sync across calendars, shared notes, and action exports.",
    bullets: [
      "Calendar auto-ingest.",
      "Shared notes & templates.",
      "Action-item export."
    ],
    ctaLabel: "Upgrade for sync"
  },
  plan: {
    derive: ({ values }) => {
      const attendees = (values.attendees || "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      
      const count = attendees.length;
      const primary = attendees[0] || "Team";
      
      let template = "General Sync";
      if (values.meetingType === "1-1") template = "Growth & Blockers";
      if (values.meetingType === "client") template = "Relationship & Upsell";
      if (values.goal === "decide") template = "DACI Framework";

      return {
        primaryAttendee: primary,
        attendeeCount: count,
        templateName: template,
        timeCheck: Math.floor(values.duration / 2)
      };
    },
    summary: {
      title: "{{derived.templateName}} Agenda",
      subtitle: "{{labels.meetingType}} \u00b7 {{labels.duration}} min \u00b7 {{derived.attendeeCount}} people",
      metrics: [
        {
          label: "Format",
          value: "{{derived.templateName}}"
        },
        {
          label: "Halftime",
          value: "@ {{derived.timeCheck}} min"
        },
        {
          label: "Key Person",
          value: "{{derived.primaryAttendee}}"
        }
      ]
    },
    sections: [
      {
        title: "Pre-meeting checklist",
        description: "What to prep before joining.",
        items: [
          "Scan last notes + highlight blockers.",
          "Collect metrics or artifacts tied to {{labels.goal}}.",
          "Draft opener tailored to {{derived.attendee1}} and {{derived.attendee2}}."
        ]
      },
      {
        title: "Live agenda beats",
        description: "Structure the conversation.",
        items: [
          "Warm take + expectations.",
          "Decision or alignment block.",
          "Time-check reminder at halfway."
        ]
      },
      {
        title: "Follow-up script",
        description: "Capture next steps.",
        items: [
          "Summarize outcomes + owners.",
          "Send doc/recording link.",
          "Schedule next touchpoint if needed."
        ]
      }
    ],
    tips: [
      "Drop share link into meeting invite.",
      "Upgrade to auto-import attendees/goals.",
      "Regenerate when agenda pivots."
    ],
    highlight: {
      eyebrow: "Ready to run",
      copy: "Arrive five minutes early to skim this prep kit."
    },
    fields: [
      {
        type: "select",
        name: "meetingType",
        label: "Meeting type",
        options: [
          {
            label: "1:1",
            value: "1-1"
          },
          {
            label: "Team sync",
            value: "team",
            default: true
          },
          {
            label: "Client",
            value: "client"
          }
        ]
      },
      {
        type: "text",
        name: "attendees",
        label: "Key attendees",
        placeholder: "e.g., Alex (PM), Priya (Design)",
        required: true
      },
      {
        type: "select",
        name: "goal",
        label: "Goal",
        options: [
          {
            label: "Decide",
            value: "decide",
            default: true
          },
          {
            label: "Align",
            value: "align"
          },
          {
            label: "Status",
            value: "status"
          }
        ]
      },
      {
        type: "select",
        name: "duration",
        label: "Duration",
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
            label: "60 min",
            value: "60"
          }
        ]
      }
    ]
  }
};

export { appConfig };
