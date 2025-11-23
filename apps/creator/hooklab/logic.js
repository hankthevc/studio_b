const platformPresets = {
  youtube: {
    vibeBoosts: {
      bold: { metric: "+8% CTR", tone: "Bold" },
      insightful: { metric: "+5% CTR", tone: "Insightful" },
      fun: { metric: "+6% CTR", tone: "Fun" }
    },
    hooks: [
      "I tested {idea} so you don't have to",
      "{idea} in 5 steps (step 3 shocks people)",
      "Stop wasting {time}—do this instead",
      "The $0 way to fix {idea}"
    ],
    thumbnail: "Big text: {keyword} + arrow at the aha moment"
  },
  tiktok: {
    vibeBoosts: {
      bold: { metric: "+10% watch", tone: "Spicy" },
      insightful: { metric: "+6% watch", tone: "Smart" },
      fun: { metric: "+7% watch", tone: "Playful" }
    },
    hooks: [
      "POV: you finally crack {idea}",
      "{idea} but in real life",
      "This {time}-old myth just died",
      "Wait, did you know {keyword} could do this?"
    ],
    thumbnail: "Text bubble: \"{keyword}?\" + surprised face"
  },
  shorts: {
    vibeBoosts: {
      bold: { metric: "+7% completion", tone: "Direct" },
      insightful: { metric: "+4% completion", tone: "Calm" },
      fun: { metric: "+6% completion", tone: "Playful" }
    },
    hooks: [
      "If you're still doing {idea} like this, don't",
      "The {time} fix to upgrade your {idea}",
      "Watch me flip {idea} in 30 seconds"
    ],
    thumbnail: "{keyword} typed on a sticky note + stopwatch"
  }
};

export function generateHookSet(formValues = {}) {
  const form = normalizeForm(formValues);
  const preset = platformPresets[form.platform];
  const vibes = preset.vibeBoosts[form.vibe];
  const secondaryBoost = preset.vibeBoosts[cycleVibe(form.vibe)];
  const hooks = buildHooks(preset, form);

  return {
    platform: form.platform,
    vibe: form.vibe,
    recommended: {
      label: "Hook A",
      copy: hooks[0],
      metric: vibes.metric,
      tone: vibes.tone
    },
    alternate: {
      label: "Hook B",
      copy: hooks[1],
      metric: secondaryBoost.metric,
      tone: secondaryBoost.tone
    },
    thumbnail: buildThumbnail(preset.thumbnail, form.keyword),
    shareLink: buildShareLink(form.platform)
  };
}

function normalizeForm(form = {}) {
  const platform = platformPresets[form.platform] ? form.platform : "youtube";
  const vibe = platformPresets[platform].vibeBoosts[form.vibe] ? form.vibe : "bold";
  const idea = clampText(form.idea || "this topic");
  const keyword = clampText(form.keyword || "Hook");
  const time = clampText(form.timeframe || "30-day");
  return { platform, vibe, idea, keyword, time };
}

function buildHooks(preset, form) {
  const templates = preset.hooks;
  return templates.slice(0, 2).map((template, index) =>
    template
      .replace("{idea}", form.idea)
      .replace("{keyword}", form.keyword)
      .replace("{time}", index % 2 === 0 ? form.time : "weekend")
  );
}

function buildThumbnail(template, keyword) {
  return template.replace("{keyword}", keyword);
}

function buildShareLink(platform) {
  const id = Math.random().toString(36).slice(2, 5);
  return `https://hooklab.app/s/${platform}-${id}`;
}

function cycleVibe(vibe) {
  const order = ["bold", "insightful", "fun"];
  const idx = order.indexOf(vibe);
  return order[(idx + 1) % order.length];
}

function clampText(text) {
  const clean = (text || "").trim();
  if (clean.length <= 80) return clean;
  return `${clean.slice(0, 77)}...`;
}
