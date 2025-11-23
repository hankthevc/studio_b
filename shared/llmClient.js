// Shared LLM client stubs. Replace with real API wiring once backend is ready.

const MOCK_MIN_DELAY = 180;
const MOCK_MAX_DELAY = 420;
const DEFAULT_API_BASE = "https://studiob-ju5gpsd3k-henrys-projects-fb6e6763.vercel.app";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateLLMResponse(builder) {
  const delay = MOCK_MIN_DELAY + Math.random() * (MOCK_MAX_DELAY - MOCK_MIN_DELAY);
  await sleep(delay);
  return builder();
}

export async function callTripSparkLLM(payload = {}) {
  const apiBase = resolveApiBase();
  if (!apiBase || typeof fetch !== "function") {
    return simulateTripSpark(payload);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${apiBase}/api/ai/tripspark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("TripSpark LLM request failed, falling back to mock.", error);
    return simulateTripSpark(payload);
  }
}

export async function callLiftShiftLLM(payload = {}) {
  const apiBase = resolveApiBase();
  if (!apiBase || typeof fetch !== "function") {
    return simulateLiftShift(payload);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${apiBase}/api/ai/liftshift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("LiftShift LLM request failed, falling back to mock.", error);
    return simulateLiftShift(payload);
  }
}

export async function callMealMindLLM(payload = {}) {
  const apiBase = resolveApiBase();
  if (!apiBase || typeof fetch !== "function") {
    return simulateMealMind(payload);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${apiBase}/api/ai/mealmind`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("MealMind LLM request failed, falling back to mock.", error);
    return simulateMealMind(payload);
  }
}

export async function callPocketPorterLLM(payload = {}) {
  const apiBase = resolveApiBase();
  if (!apiBase || typeof fetch !== "function") {
    return simulatePocketPorter(payload);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${apiBase}/api/ai/pocketporter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("PocketPorter LLM request failed, falling back to mock.", error);
    return simulatePocketPorter(payload);
  }
}

export async function callFocusTilesLLM(payload = {}) {
  const apiBase = resolveApiBase();
  if (!apiBase || typeof fetch !== "function") {
    return await simulateFocusTiles(payload);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${apiBase}/api/ai/focustiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("FocusTiles LLM request failed, falling back to mock.", error);
    return await simulateFocusTiles(payload);
  }
}

export function throwNotImplemented(operationName = "LLM call") {
  throw new Error(`${operationName} not implemented`);
}

function resolveApiBase() {
  if (typeof window !== "undefined" && window.MINIAPPS_API_BASE) {
    return window.MINIAPPS_API_BASE;
  }
  if (typeof process !== "undefined" && process.env?.STUDIOB_COMMERCE_BACKEND_URL) {
    return process.env.STUDIOB_COMMERCE_BACKEND_URL;
  }
  return DEFAULT_API_BASE;
}

function simulateLiftShift(payload = {}) {
  const focus = (payload.focus || "strength").toLowerCase();
  const duration = payload.duration || 45;

  let title = "Strength base";
  let mainSet = ["3 x 10 goblet squats", "3 x 12 push-ups", "3 x 12 rows"];

  if (focus.includes("hypertrophy")) {
    title = "Volume pump";
    mainSet = ["4 x 12 DB bench press", "4 x 12 bulgarian split squats", "3 x 15 face pulls"];
  } else if (focus.includes("conditioning")) {
    title = "Engine builder";
    mainSet = ["EMOM 10: 15 KB swings", "4 rounds: 400m run + 20 lunges", "Tabata push-ups"];
  }

  return simulateLLMResponse(() => ({
    programName: `LiftShift ${title}`,
    summary: "Offline mode: Standard block based on your focus.",
    days: [
      {
        day: 1,
        title: `${title} A`,
        estMinutes: duration,
        segments: [
          { label: "Warmup", movements: ["2 min jump rope", "World's greatest stretch"] },
          { label: "Main set", movements: mainSet },
          { label: "Finisher", movements: ["1 min plank", "30 sec mountain climbers"] }
        ]
      }
    ],
    recovery: {
      cues: ["Hydrate", "Sleep 8h", "Stretch hip flexors"],
      deload: "Deload if performance stalls."
    }
  }));
}

function simulateTripSpark(payload = {}) {
  const destination = payload.destination || "your dream city";
  return simulateLLMResponse(() => ({
    sparkHighlight: `Signature rooftop evening in ${destination}`,
    days: [1, 2, 3].map((dayNumber) => ({
      day: dayNumber,
      theme: ["Arrival vibes", "Explore like a local", "Signature send-off"][dayNumber - 1],
      highlights: [
        `Morning spotlight ${dayNumber}`,
        `Afternoon wander ${dayNumber}`,
        `Evening signature ${dayNumber}`
      ]
    }))
  }));
}

function simulateMealMind(payload = {}) {
  const dietaryPref = payload.diet || "balanced";
  return simulateLLMResponse(() => ({
    diet: dietaryPref,
    meals: [
      { name: "Power oats", prep: "5 min", tip: "Chia, berries, almond butter." },
      { name: "Rainbow bowl", prep: "15 min", tip: "Greens, grains, roasted veggies." },
      { name: "Ginger miso noodles", prep: "20 min", tip: "Tofu, broccoli, toasted sesame." },
      { name: "Protein snack box", prep: "No cook", tip: "Nuts, yogurt, berries." },
      { name: "Veggie wraps", prep: "10 min", tip: "Use hummus base." },
      { name: "Crispy tofu rice", prep: "25 min", tip: "Finish with chili crisp." },
      { name: "Sheet-pan chicken", prep: "30 min", tip: "Add roasted broccoli." },
      { name: "Miso cod", prep: "20 min", tip: "Serve with bok choy." },
      { name: "Overnight oats", prep: "5 min", tip: "Add citrus zest." }
    ],
    groceryShortlist: ["Rolled oats", "Tofu", "Greens", "Berry medley", "Sesame seeds"]
  }));
}

function simulatePocketPorter(payload = {}) {
  const destination = payload.destination || "your city";
  return simulateLLMResponse(() => ({
    categories: [
      {
        name: "Essentials",
        badge: "Required",
        items: [
          { label: "Passport & ID", required: true },
          { label: "Wallet + cards", required: true },
          { label: "Phone + charger", required: true }
        ]
      },
      {
        name: "Clothing",
        badge: "Optional",
        items: [
          { label: "Base layers", required: false },
          { label: "Versatile shoes", required: false }
        ]
      }
    ],
    compliance: {
      status: "clear",
      message: "Carry-on weight looks safe.",
      allowanceKg: 10,
      liquidsMl: 100
    },
    weatherTip: `Pack layers suited for ${destination}.`
  }));
}

async function simulateFocusTiles(payload = {}) {
  const blockLength = payload.blockLength || 25;
  return await simulateLLMResponse(() => ({
    tiles: Array.from({ length: 8 }, (_, index) => {
      const isBreak = index % 2 === 1;
      return {
        label: isBreak ? "Reset break" : `Tile ${Math.floor(index / 2) + 1}`,
        type: isBreak ? "break" : "focus",
        duration: isBreak ? Math.max(5, Math.round(blockLength * 0.2)) : blockLength,
        suggestion: isBreak ? "Stand, stretch, hydrate." : "Single-task; write next step only.",
        soundtrack: "Lo-fi focus"
      };
    }),
    flowScore: { score: 82, description: "Balanced rhythm. Expect steady focus." },
    resetTip: "Close eyes for 60s; breathe 4-7-8."
  }));
}
