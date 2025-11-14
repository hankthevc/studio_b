// Shared LLM client stubs. Replace with real API wiring once backend is ready.

const MOCK_MIN_DELAY = 180;
const MOCK_MAX_DELAY = 420;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateLLMResponse(builder) {
  const delay = MOCK_MIN_DELAY + Math.random() * (MOCK_MAX_DELAY - MOCK_MIN_DELAY);
  await sleep(delay);
  return builder();
}

// TODO: Invoke production TripSpark planner endpoint when backend is implemented.
export async function callTripSparkLLM(payload = {}) {
  const destination = payload.destination || "your dream city";
  return simulateLLMResponse(() => ({
    destination,
    summary: `3-day spark itinerary for ${destination}`,
    vibe: payload.vibe || "balanced",
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

// TODO: Swap with LiftShift strength program generator once API access is granted.
export async function callLiftShiftLLM(payload = {}) {
  const focus = payload.focus || "full body";
  const duration = payload.duration || 25;
  return simulateLLMResponse(() => ({
    workoutTitle: `LiftShift ${focus} boost`,
    estMinutes: duration,
    blocks: [
      { title: "Warmup ignition", movements: ["2 min jump rope", "World's greatest stretch"] },
      { title: "Power circuit", movements: ["3 x 10 goblet squats", "3 x 12 push-ups", "3 x 12 rows"] },
      { title: "Finisher", movements: ["1 min plank", "30 sec mountain climbers"] }
    ]
  }));
}

// TODO: Connect to MealMind recipe planner; keep payload shape consistent with backend spec.
export async function callMealMindLLM(payload = {}) {
  const dietaryPref = payload.diet || "balanced";
  return simulateLLMResponse(() => ({
    diet: dietaryPref,
    meals: [
      { name: "Power oats", calories: 420, notes: "Chia, berries, almond butter." },
      { name: "Rainbow bowl", calories: 520, notes: "Greens, grains, roasted veggies." },
      { name: "Ginger miso noodles", calories: 610, notes: "Tofu, broccoli, toasted sesame." }
    ],
    groceryShortlist: ["Rolled oats", "Tofu", "Seasonal greens", "Berry medley", "Sesame seeds"]
  }));
}

export function throwNotImplemented(operationName = "LLM call") {
  throw new Error(`${operationName} not implemented`);
}
