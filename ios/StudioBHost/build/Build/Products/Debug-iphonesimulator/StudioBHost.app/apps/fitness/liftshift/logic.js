import { callLiftShiftLLM } from "../../../shared/llmClient.js";

const focusConfigs = {
  strength: {
    cycleName: "Power build block",
    summary: "Heavier compounds with crisp finishers and enforced tempo control.",
    dayTitles: ["Upper power ignition", "Lower force stack", "Push / pull reset", "Full-body finisher"],
    segments: {
      warmup: ["2 min jump rope", "Cossack squats x8", "World's greatest stretch", "Band pull-aparts x20", "Cat-cow flow x6"],
      main: [
        "4 x 5 incline presses @ RPE8",
        "4 x 4 trap bar deadlifts",
        "3 x 6 tempo goblet squats",
        "3 x 8 weighted pull-ups",
        "3 x 10 barbell hip thrusts",
        "3 x 6 push presses"
      ],
      finisher: [
        "3 rounds sled push 20m",
        "EMOM 6 min: kettlebell swings + plank",
        "Bike sprint x15s / recover 45s",
        "Farmer carry ladder 40m/30m/20m"
      ]
    },
    recoveryCues: ["90s foam roll quads & glutes", "Protein-forward meal within 45 min", "Sleep 7.5h+ before next block"],
    deload: "Deload after week 4 → drop volume 30%."
  },
  hypertrophy: {
    cycleName: "Volume sculpt series",
    summary: "Higher rep brackets, super-sets, and pump finishers dialed into your gear.",
    dayTitles: ["Upper push pump", "Lower volume drive", "Upper pull density", "Metabolic finisher"],
    segments: {
      warmup: ["Band dislocates x12", "Bretzel stretch each side", "Hip airplanes x6", "Row erg 3 min"],
      main: [
        "4 x 10 dumbbell bench (3-1 tempo)",
        "4 x 12 Bulgarian split squats",
        "4 x 12 cable rows + face pulls superset",
        "3 x 15 leg press with pauses",
        "3 x 12 lateral raises drop set",
        "3 x 15 RDLs with straps"
      ],
      finisher: [
        "3 rounds battle rope 30s",
        "Descending push-up ladder",
        "Bike sprint + walking lunges combo",
        "Core tri-set: hollow holds, dead bugs, suitcase crunch"
      ]
    },
    recoveryCues: ["Hydrate 3L today", "Carbs around training window", "Light walk in the evening."],
    deload: "Deload after week 5 → swap to tempo isometrics."
  },
  conditioning: {
    cycleName: "Engine acceleration",
    summary: "Interval work blending bodyweight strength with cardio bursts.",
    dayTitles: ["Aerobic primer", "Power intervals", "Hybrid grinder", "Engine finisher"],
    segments: {
      warmup: ["Assault bike 4 min easy", "Inchworm walkouts x8", "Hip openers x10", "Scap push-ups x15"],
      main: [
        "EMOM 15: 12 cal row / 10 burpees",
        "4 rounds: 400m run + 20 wall balls",
        "Every 4 min x5: 15 KB swings + 12 box jumps",
        "AMRAP 12: 10 push press + 10 sit-ups + 10 lunges",
        "5 x 2 min ski erg @ RPE8, rest 1 min"
      ],
      finisher: [
        "Tabata bike sprints",
        "Core ladder: V-ups / mountain climbers",
        "Jump rope 5 min cadence play",
        "Breath ladder: box breathing 4-4-4-4"
      ]
    },
    recoveryCues: ["Contrast shower to calm nervous system", "Electrolytes post-session", "Walk + nasal breathing cooldown."],
    deload: "Deload after 3 hard weeks → reduce intervals by half."
  }
};

export function formatMinutes(minutes) {
  const value = Number(minutes) || 0;
  return `~${Math.round(value)} min`;
}

export async function planProgram(formValues = {}) {
  const normalized = normalizeForm(formValues);
  let llmSeed = null;
  let timeoutId;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 12000);
    
    // Retry logic for transient LLM errors (e.g. JSON parsing)
    let attempts = 0;
    while (attempts < 3) {
      try {
        llmSeed = await callLiftShiftLLM({
          focus: normalized.focus,
          duration: normalized.sessionMinutes,
          equipment: normalized.equipment,
          daysPerWeek: normalized.daysPerWeek,
          note: normalized.note,
          signal: controller.signal
        });
        break; // Success
      } catch (err) {
        attempts++;
        if (attempts >= 3) throw err; // Throw after max retries
        await new Promise(r => setTimeout(r, 1000 * attempts)); // Backoff
      }
    }
  } catch (error) {
    console.warn("LiftShift LLM stub failed, using local generator.", error);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
  return buildProgram(normalized, llmSeed);
}

function buildProgram(form, llmSeed) {
  const config = focusConfigs[form.focus] || focusConfigs.strength;
  const totalDays = clampDays(form.daysPerWeek);
  const days = normalizeLLMDays({
    llmSeed,
    totalDays,
    config,
    form
  });

  return {
    programName: llmSeed?.programName || llmSeed?.workoutTitle || config.cycleName,
    summary: llmSeed?.summary || config.summary,
    focus: form.focus,
    days,
    sessionMinutes: form.sessionMinutes,
    recovery: buildRecovery(config, form, llmSeed?.recovery),
    shareLink: buildShareLink(form.focus)
  };
}

function buildDayPlan({ dayNumber, config, form, seedBlock = {} }) {
  const title =
    seedBlock.title ||
    config.dayTitles[(dayNumber - 1) % config.dayTitles.length] ||
    `Signature day ${dayNumber}`;

  const structuredSegments = normalizeSegments(seedBlock.segments);
  const allSeedMoves = Array.isArray(seedBlock.movements) ? seedBlock.movements : [];
  const warmupMoves =
    structuredSegments.warmup.length > 0
      ? structuredSegments.warmup
      : selectMovements(allSeedMoves, config.segments.warmup, 0, 2);
  const mainMoves =
    structuredSegments.main.length > 0
      ? structuredSegments.main
      : selectMovements(allSeedMoves, config.segments.main, 2, 5);
  const finisherMoves =
    structuredSegments.finisher.length > 0
      ? structuredSegments.finisher
      : selectMovements(allSeedMoves, config.segments.finisher, 5, 8);

  const sessionMinutes = Math.max(20, Math.min(clampSession(form.sessionMinutes) + dayNumber * 2, clampSession(form.sessionMinutes) + 6));
  return {
    day: dayNumber,
    title,
    emphasis: seedBlock.title || config.summary,
    estMinutes: sessionMinutes,
    segments: [
      { label: "Warmup", movements: warmupMoves },
      { label: "Main set", movements: mainMoves },
      { label: "Finisher", movements: finisherMoves }
    ]
  };
}

function normalizeSegments(rawSegments) {
  const result = { warmup: [], main: [], finisher: [] };
  if (!Array.isArray(rawSegments)) {
    return result;
  }
  rawSegments.forEach((segment) => {
    if (!segment || !Array.isArray(segment.movements)) return;
    const label = (segment.label || "").toLowerCase();
    if (label.includes("warm")) {
      result.warmup.push(...segment.movements);
    } else if (label.includes("finish")) {
      result.finisher.push(...segment.movements);
    } else {
      result.main.push(...segment.movements);
    }
  });
  return result;
}

function buildRecovery(config, form, llmRecovery = null) {
  const cues = Array.isArray(llmRecovery?.cues) && llmRecovery.cues.length ? llmRecovery.cues : [...config.recoveryCues];
  if (form.sessionMinutes > 50) {
    cues.push("Add parasympathetic breath work post-session (4-7-8 x4).");
  }
  return {
    deload: llmRecovery?.deload || config.deload,
    cues: cues.slice(0, 4)
  };
}

function selectMovements(seedList, fallbackList, startIndex, endIndex) {
  const slice = seedList.slice(startIndex, endIndex);
  if (slice.length >= endIndex - startIndex && slice.length > 0) {
    return slice;
  }
  return pickSet(fallbackList, Math.max(2, endIndex - startIndex));
}

function pickSet(source, count) {
  const copy = [...source];
  const selections = [];
  while (selections.length < count) {
    if (copy.length === 0) {
      selections.push(source[Math.floor(Math.random() * source.length)]);
    } else {
      const index = Math.floor(Math.random() * copy.length);
      selections.push(copy.splice(index, 1)[0]);
    }
  }
  return selections;
}

function buildShareLink(focus) {
  const slug = focus.replace(/[^a-z]/gi, "").toLowerCase() || "cycle";
  const id = Math.random().toString(36).slice(2, 5);
  return `https://liftshift.fit/s/${slug}-${id}`;
}

function normalizeForm(form = {}) {
  return {
    focus: focusConfigs[form.focus] ? form.focus : "strength",
    equipment: normalizeEquipment(form.equipment),
    daysPerWeek: clampDays(Number(form.daysPerWeek) || 4),
    sessionMinutes: clampSession(Number(form.sessionMinutes) || 45),
    note: (form.note || "").trim()
  };
}

function normalizeEquipment(equipment = []) {
  if (typeof equipment === "string") {
    equipment = equipment.split(",").map((item) => item.trim());
  }
  const fallback = ["bodyweight"];
  const normalized = Array.from(new Set(equipment.filter(Boolean)));
  return normalized.length ? normalized : fallback;
}

function clampDays(days) {
  if (Number.isNaN(days)) return 4;
  return Math.min(Math.max(days, 3), 4);
}

function clampSession(minutes) {
  if (Number.isNaN(minutes)) return 45;
  return Math.min(Math.max(minutes, 30), 75);
}

function normalizeLLMDays({ llmSeed, totalDays, config, form }) {
  const llmDays = Array.isArray(llmSeed?.days) ? llmSeed.days : [];
  return Array.from({ length: totalDays }, (_, index) => {
    const dayNumber = index + 1;
    const seedBlock = llmDays[index] || {};
    return buildDayPlan({
      dayNumber,
      config,
      form,
      seedBlock
    });
  });
}
