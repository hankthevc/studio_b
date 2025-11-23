const platformStyles = {
  instagram: {
    hooks: [
      "Swipe to steal this move",
      "POV: you get your evenings back",
      "3 steps between you and {outcome}"
    ],
    captionTemplate: "You asked for {topic}, so here's the playbook. Save this for your {cta}.",
    hashtags: ["#DailySpark", "#CreatorNotes", "#InstaTips"]
  },
  tiktok: {
    hooks: [
      "I tried {topic} for 48 hours",
      "Don’t do this until you watch",
      "The {tone} way to {outcome}"
    ],
    captionTemplate: "Fast breakdown of {topic}. Drop a 🙌 if you needed this nudge.",
    hashtags: ["#TokHack", "#BuildInPublic", "#CreatorMode"]
  },
  twitter: {
    hooks: [
      "{outcome} in 3 sentences",
      "Stop doing {pain} and try this",
      "Threads aren't dead—you're just boring"
    ],
    captionTemplate: "Turn this hook into a thread start, or repurpose for your next short. {cta}.",
    hashtags: ["#ship30", "#copywriting", "#audience"]
  }
};

const toneModifiers = {
  playful: { toneWord: "playful", emoji: "✨" },
  bold: { toneWord: "bold", emoji: "🔥" },
  warm: { toneWord: "warm", emoji: "🌿" }
};

export function generateStorySpark(input = {}) {
  const form = normalizeForm(input);
  const platform = platformStyles[form.platform];
  const tone = toneModifiers[form.tone];

  const outcome = form.cta || "next launch";
  const topic = form.idea;
  const hooks = platform.hooks.map((pattern) => fillTemplate(pattern, { topic, outcome, tone: tone.toneWord }));

  return {
    platform: form.platform,
    tone: form.tone,
    highlightHook: hooks[0],
    alternateHooks: hooks.slice(1),
    caption: fillTemplate(platform.captionTemplate, { topic, outcome, cta: form.cta || "Drop a comment" }),
    hashtags: platform.hashtags,
    shareLink: buildShareLink(form.platform)
  };
}

function normalizeForm(form = {}) {
  const platform = platformStyles[form.platform] ? form.platform : "instagram";
  const tone = toneModifiers[form.tone] ? form.tone : "playful";
  const idea = clampText(form.idea || "your next idea");
  const cta = clampText(form.cta || "Drop a comment");
  return { platform, tone, idea, cta };
}

function fillTemplate(template, data) {
  return template.replace(/{(.*?)}/g, (_, key) => data[key] || "");
}

function buildShareLink(platform) {
  const id = Math.random().toString(36).slice(2, 5);
  return `https://storyspark.app/s/${platform}-${id}`;
}

function clampText(text) {
  const clean = (text || "").trim();
  if (clean.length <= 120) return clean;
  return `${clean.slice(0, 117)}...`;
}
