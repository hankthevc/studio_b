const themeConfigs = {
  deepwork: {
    label: "Deep work",
    suggestions: ["Kill notifications", "Single-tab sprint", "Stack similar tasks"],
    soundtrack: "Lo-fi focus",
    resetTip: "Walk away for 3 minutes and breathe slowly before diving back in."
  },
  writing: {
    label: "Writing",
    suggestions: ["Outline the next paragraph only", "Switch font for proofreading", "Use dictation for 5 minutes"],
    soundtrack: "Instrumental piano",
    resetTip: "Reread last 3 sentences aloud to regain momentum."
  },
  study: {
    label: "Study",
    suggestions: ["Teach back a concept out loud", "Flip your notes into questions", "Use spaced recall prompts"],
    soundtrack: "Ambient focus",
    resetTip: "Close eyes & recall key points before moving on."
  },
  review: {
    label: "Review",
    suggestions: ["Batch approvals in 10-min windows", "Use keyboard shortcuts only", "Write a 1-line summary per item"],
    soundtrack: "Minimal beats",
    resetTip: "Stretch wrists + roll shoulders before final pass."
  }
};

const energyAdjustments = {
  low: -3,
  steady: 0,
  charged: 4
};

export function planTiles(formValues = {}) {
  const normalized = normalizeForm(formValues);
  const config = themeConfigs[normalized.theme] || themeConfigs.deepwork;
  const durations = buildDurations(normalized.blockLength, normalized.energy);

  const tiles = durations.map((duration, index) => {
    const isBreak = index % 2 === 1;
    return {
      id: index + 1,
      label: isBreak ? "Reset break" : `Tile ${Math.floor(index / 2) + 1}`,
      duration,
      type: isBreak ? "break" : "focus",
      suggestion: config.suggestions[index % config.suggestions.length],
      soundtrack: normalized.soundtrack || config.soundtrack
    };
  });

  return {
    theme: normalized.theme,
    tiles,
    flowScore: buildFlowScore(normalized),
    resetTip: config.resetTip,
    shareLink: buildShareLink(normalized.theme)
  };
}

function buildDurations(blockLength, energy) {
  const focusDuration = clampDuration(blockLength);
  const breakDuration = Math.max(5, Math.round(focusDuration * 0.2));
  const tiles = [];
  for (let i = 0; i < 4; i++) {
    tiles.push(focusDuration + (i % 2 === 0 ? 0 : -3));
    tiles.push(breakDuration);
  }
  if (energy === "charged") {
    tiles[0] += 2;
  } else if (energy === "low") {
    tiles[0] -= 2;
  }
  return tiles;
}

function buildFlowScore(form) {
  const base = 78;
  const energyDelta = energyAdjustments[form.energy] || 0;
  const blockDelta = (form.blockLength - 25) * 0.5;
  const goalBonus = form.goal?.length ? 3 : 0;
  const score = Math.max(50, Math.min(98, Math.round(base + energyDelta + blockDelta + goalBonus)));

  let description = "Balanced rhythm. Expect steady focus.";
  if (score >= 90) description = "High momentum. Protect this window.";
  else if (score <= 65) description = "Gentle cadence. Keep breaks intentional.";

  return { score, description };
}

function buildShareLink(theme) {
  const slug = theme.replace(/[^a-z]/gi, "").toLowerCase() || "focus";
  const id = Math.random().toString(36).slice(2, 5);
  return `https://focustiles.app/r/${slug}-${id}`;
}

function normalizeForm(form = {}) {
  return {
    theme: themeConfigs[form.theme] ? form.theme : "deepwork",
    energy: ["low", "steady", "charged"].includes(form.energy) ? form.energy : "steady",
    blockLength: clampDuration(Number(form.blockLength) || 25),
    soundtrack: (form.soundtrack || "").trim(),
    goal: (form.goal || "").trim()
  };
}

function clampDuration(value) {
  if (Number.isNaN(value)) return 25;
  return Math.min(Math.max(value, 20), 40);
}
