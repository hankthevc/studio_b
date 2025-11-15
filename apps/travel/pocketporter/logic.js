const vibeCatalog = {
  business: {
    essentials: ["Passport & ID", "Corporate cards", "Laptop + charger", "Noise-canceling buds"],
    clothing: ["Tailored blazer", "Wrinkle-free shirts", "Comfort flats / loafers"],
    activities: ["Client dinner look", "Gym kit", "Notebook + pen"],
    tech: ["USB-C hub", "Travel mouse", "Portable battery"],
    documents: ["Meeting briefs", "Expense envelopes", "Backup SIM"]
  },
  leisure: {
    essentials: ["Passport & ID", "Wallet + local cards", "Mini kit: meds & SPF"],
    clothing: ["Relaxed set", "Day-to-night shoes", "Layering sweater"],
    activities: ["Swimwear", "Beach tote", "Compact camera"],
    tech: ["E-reader", "Film camera / Polaroid", "Foldable tripod"],
    documents: ["Reservations printout", "Transit passes", "Travel insurance"]
  },
  adventure: {
    essentials: ["Passport & ID", "Microfiber towel", "Mini first-aid"],
    clothing: ["Quick-dry layers", "Base thermal", "Hike socks"],
    activities: ["Trail shoes", "Collapsible bottle", "Headlamp"],
    tech: ["Action cam", "Solar battery", "Offline GPS"],
    documents: ["Permits", "Insurance", "Emergency contacts"]
  }
};

const complianceRules = {
  economy: { limitKg: 10, liquidsMl: 100 },
  premium: { limitKg: 12, liquidsMl: 100 },
  business: { limitKg: 15, liquidsMl: 100 },
  unknown: { limitKg: 8, liquidsMl: 100 }
};

const climateTips = {
  warm: "Pack breathable fabrics and decant SPF into 100ml travel bottles.",
  mild: "Layer up: lightweight knits handle fluctuating temps.",
  cool: "Add a compact packable jacket and hand warmers."
};

function determineClimate(destination = "") {
  const name = destination.toLowerCase();
  if (/(bali|hawaii|miami|tulum|cancun|rio)/.test(name)) return "warm";
  if (/(reykjavik|iceland|oslo|alps|banff|zurich)/.test(name)) return "cool";
  return "mild";
}

function normalizeForm(form = {}) {
  return {
    destination: (form.destination || "Your city").trim(),
    dates: (form.dates || "").trim(),
    vibe: vibeCatalog[form.vibe] ? form.vibe : "leisure",
    airline: (form.airline || "unknown").toLowerCase(),
    note: (form.notes || form.note || "").trim()
  };
}

export function planPackingList(formValues = {}) {
  const form = normalizeForm(formValues);
  const vibe = vibeCatalog[form.vibe];
  const climate = determineClimate(form.destination);

  const categories = buildCategories(vibe, climate);
  const compliance = buildCompliance(form.airline, categories);

  return {
    destination: form.destination,
    dates: form.dates,
    vibe: form.vibe,
    airline: form.airline,
    climate,
    categories,
    compliance,
    weatherTip: climateTips[climate],
    shareLink: buildShareLink(form.destination),
    note: form.note
  };
}

function buildCategories(vibe, climate) {
  const climateAddOn =
    climate === "warm"
      ? { essentials: ["Cooling towel"], clothing: ["Breathable linen set"] }
      : climate === "cool"
      ? { essentials: ["Travel umbrella"], clothing: ["Packable puffer"] }
      : {};

  return Object.entries(vibe).map(([category, items]) => {
    const addOns = climateAddOn[category] || [];
    return {
      name: capitalize(category),
      badge: category === "essentials" ? "Required" : "Optional",
      items: items.concat(addOns).map((label, index) => ({
        label,
        required: category === "essentials" || index === 0
      }))
    };
  });
}

function buildCompliance(airline, categories) {
  const rule = complianceRules[airline] || complianceRules.unknown;
  const requiredItems = categories
    .filter((cat) => cat.badge === "Required")
    .reduce((sum, cat) => sum + cat.items.length, 0);
  const estWeight = 0.5 * requiredItems; // kg estimate

  const status = estWeight > rule.limitKg ? "warning" : "clear";
  const message =
    status === "warning"
      ? `Estimated carry-on weight ${estWeight.toFixed(1)}kg may exceed ${rule.limitKg}kg allowance.`
      : `Carry-on weight looks safe (~${estWeight.toFixed(1)}kg). Liquids stay under ${rule.liquidsMl}ml.`;

  return {
    status,
    message,
    allowanceKg: rule.limitKg,
    liquidsMl: rule.liquidsMl
  };
}

function buildShareLink(destination) {
  const slug = destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const id = Math.random().toString(36).slice(2, 5);
  return `https://pocketporter.app/s/${slug || "trip"}-${id}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
