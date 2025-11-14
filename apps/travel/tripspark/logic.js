import { callTripSparkLLM } from "../../../shared/llmClient.js";

const vibeIdeas = {
  foodie: {
    segments: [
      "Chef-led market tour",
      "Progressive tapas crawl",
      "Hidden speakeasy pairing"
    ],
    highlight: "Reserve-only tasting counter run by a local chef"
  },
  culture: {
    segments: [
      "Iconic museum with skip-the-line pass",
      "Street art walking loop",
      "Opera house night tour"
    ],
    highlight: "Private docent walk through the city's design district"
  },
  nightlife: {
    segments: ["Sunset rooftop mixer", "Neo-disco club hop", "Secret vinyl bar"],
    highlight: "Guest-list access to a rooftop DJ set"
  },
  outdoors: {
    segments: ["Guided sunrise hike", "Bike and picnic loop", "Nighttime river cruise"],
    highlight: "Clifftop golden-hour picnic with local guide"
  },
  gems: {
    segments: [
      "Neighborhood espresso crawl",
      "Indie bookstore salon",
      "Underground supper club"
    ],
    highlight: "Invite-only courtyard dinner with resident artists"
  }
};

const saverTips = {
  1: "Bundle museum passes to shave 15% off entrances.",
  2: "Book hero experiences 10 days ahead for dynamic pricing.",
  3: "Leverage premium lounge perks for free transfers."
};

const budgetMultipliers = {
  1: 90,
  2: 130,
  3: 190
};

const segmentLabels = ["Morning", "Afternoon", "Evening"];
const fallbackSaverTip = "Pre-book entry times to skip lines and surprise fees.";

export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `$${value.toFixed(0)}`;
}

export async function planItinerary(formValues = {}) {
  const normalized = normalizeForm(formValues);
  let llmSeed = null;

  try {
    llmSeed = await callTripSparkLLM({
      operation: "PLAN_TRIP",
      destination: normalized.destination,
      vibe: normalized.vibe,
      pace: normalized.pace,
      budgetLevel: normalized.budgetLevel,
      stayLength: 3
    });
  } catch (error) {
    // Continue with local seed if the stub throws so the UI never blocks.
    console.warn("TripSpark LLM stub failed, falling back to local generator.", error);
  }

  return buildItineraryFromSeed(normalized, llmSeed);
}

function buildItineraryFromSeed(form, llmSeed) {
  const baseBudget = budgetMultipliers[form.budgetLevel];
  const daySeeds = Array.isArray(llmSeed?.days) ? llmSeed.days : [];
  const highlight = llmSeed?.sparkHighlight || vibeIdeas[form.vibe].highlight;

  const days = [1, 2, 3].map((dayNumber, index) =>
    buildDayPlan({
      dayNumber,
      vibe: form.vibe,
      baseBudget: baseBudget + dayNumber * 12,
      destination: form.destination,
      seedDay: daySeeds[index]
    })
  );

  return {
    destination: form.destination,
    dates: form.dates,
    vibe: form.vibe,
    pace: form.pace,
    budgetLevel: form.budgetLevel,
    highlight,
    days,
    summary: buildSummary(days, form.budgetLevel),
    shareLink: buildShareLink(form.destination)
  };
}

function buildDayPlan({ dayNumber, vibe, baseBudget, destination, seedDay = {} }) {
  const idea = vibeIdeas[vibe];
  const seedHighlights = Array.isArray(seedDay.highlights) ? seedDay.highlights : [];
  const segments = segmentLabels.map((label, index) => {
    const activityBase = seedHighlights[index] || idea.segments[index] || pickRandom(idea.segments);
    return {
      label,
      activity: `${activityBase} in ${destination}`,
      cost: generateCost(baseBudget)
    };
  });

  const total = segments.reduce((sum, segment) => sum + segment.cost, 0);
  return {
    day: dayNumber,
    theme: seedDay.theme || `Signature day ${dayNumber}`,
    segments,
    total
  };
}

function buildSummary(days, budgetLevel) {
  const total = days.reduce((sum, day) => sum + day.total, 0);
  return {
    total,
    perDay: days.map((day) => ({ day: day.day, amount: day.total })),
    saverTip: saverTips[budgetLevel] || fallbackSaverTip
  };
}

function buildShareLink(destination) {
  const slug = slugifyDestination(destination);
  const randomId = Math.random().toString(36).slice(2, 5);
  return `https://tripspark.app/s/${slug}-${randomId}`;
}

function generateCost(baseBudget) {
  const wiggle = Math.round(Math.random() * 24 - 12);
  return Math.max(25, Math.round(baseBudget / 3 + wiggle));
}

function pickRandom(entries) {
  return entries[Math.floor(Math.random() * entries.length)];
}

function normalizeForm(form = {}) {
  const destination = (form.destination || "Your city").trim() || "Your city";
  const vibe = normalizeVibe(form.vibe);
  const budgetLevel = clampBudget(Number(form.budgetLevel || 2));
  return {
    destination,
    dates: (form.dates || "").trim(),
    vibe,
    pace: form.pace || "balanced",
    budgetLevel
  };
}

function normalizeVibe(vibe) {
  return vibeIdeas[vibe] ? vibe : "culture";
}

function clampBudget(level) {
  if (Number.isNaN(level)) return 2;
  return Math.min(Math.max(level, 1), 3);
}

function slugifyDestination(destination) {
  return destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-") || "city";
}
