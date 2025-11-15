const rolePrompts = {
  product: [
    {
      question: "Tell me about a time you aligned stakeholders around a roadmap pivot.",
      angles: ["Vision", "Data signals", "Managing pushback"]
    },
    {
      question: "Describe a launch that underperformed. What did you do next?",
      angles: ["Ownership", "Learning loop", "Customer empathy"]
    },
    {
      question: "Walk through a complex decision you made without perfect data.",
      angles: ["Framework", "Trade-offs", "Influence"]
    }
  ],
  sales: [
    {
      question: "Share a deal that looked lost but you turned around.",
      angles: ["Discovery", "Objection handling", "Urgency"]
    },
    {
      question: "Explain how you prioritize accounts when pipeline is light.",
      angles: ["ICP focus", "Cadence", "Collaboration"]
    },
    {
      question: "Tell me about a time you mentored a teammate.",
      angles: ["Coaching", "Process", "Results"]
    }
  ],
  ops: [
    {
      question: "Describe a process you rebuilt to remove bottlenecks.",
      angles: ["Diagnosis", "Change mgmt", "Metrics"]
    },
    {
      question: "Walk me through a cross-functional fire drill you led.",
      angles: ["Prioritization", "Communication", "Calm"]
    },
    {
      question: "Share how you introduced automation without breaking quality.",
      angles: ["Stakeholders", "Risk mitigation", "Rollout"]
    }
  ],
  engineering: [
    {
      question: "Tell me about a technical decision that faced strong debate.",
      angles: ["Trade-offs", "Collaboration", "Outcome"]
    },
    {
      question: "Share a time you improved reliability for a critical system.",
      angles: ["Incident analysis", "Long-term fix", "Metrics"]
    },
    {
      question: "How do you mentor junior engineers on ownership?",
      angles: ["Feedback loops", "Modeling behavior", "Results"]
    }
  ]
};

const companyFlairs = {
  startup: "Lean teams, fast iteration, scrappy mindset.",
  mid: "Balancing scale with experimentation.",
  enterprise: "Stakeholder alignment across many layers."
};

export function generateMockRound(formValues = {}) {
  const form = normalizeForm(formValues);
  const prompts = rolePrompts[form.role];
  const selected = prompts.slice(0, 3).map((prompt, index) => ({
    id: index + 1,
    question: prompt.question,
    angles: prompt.angles,
    responseHint: buildResponseHint(form, prompt, index)
  }));

  return {
    role: form.role,
    seniority: form.seniority,
    company: form.company,
    highlight: `Focus on ${form.role} stories that emphasize ${companyFlairs[form.company]}`,
    prompts: selected,
    coachNotes: [
      "Structure answers with Situation → Action → Impact.",
      `Embed metrics (even directional) to show ${form.seniority} level.`,
      `Mirror ${form.company} expectations by highlighting collaboration style.`
    ],
    followUp: buildFollowUp(form.role),
    shareLink: buildShareLink(form.role)
  };
}

function normalizeForm(form = {}) {
  const role = rolePrompts[form.role] ? form.role : "product";
  const company = companyFlairs[form.company] ? form.company : "startup";
  const seniority = clamp(Number(form.seniority) || 3);
  const strengths = (form.strengths || "").trim();
  return { role, company, seniority, strengths };
}

function clamp(value) {
  return Math.min(Math.max(value, 1), 5);
}

function buildResponseHint(form, prompt, index) {
  if (!form.strengths) return `Anchor on ${prompt.angles[0].toLowerCase()} and paint the outcome.`;
  return `Tie your strength in ${form.strengths} to ${prompt.angles[index % prompt.angles.length].toLowerCase()}.`;
}

function buildFollowUp(role) {
  switch (role) {
    case "sales":
      return "How do you forecast accuracy when leadership pressure rises?";
    case "ops":
      return "What metrics signal that a process change is no longer working?";
    case "engineering":
      return "Describe how you keep code quality high while shipping fast.";
    default:
      return "Walk me through the most recent product experiment that changed your roadmap.";
  }
}

function buildShareLink(role) {
  const id = Math.random().toString(36).slice(2, 5);
  return `https://prepcoach.app/s/${role}-${id}`;
}
