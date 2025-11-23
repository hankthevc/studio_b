import { callMealMindLLM } from "../../../shared/llmClient.js";

const dietConfigs = {
  balanced: {
    highlight: "Citrus herb salmon bowls with crunchy greens.",
    meals: {
      breakfast: [
        { name: "Power oats with chia & berries", prep: "5 min prep", tip: "Stir in almond butter for protein." },
        { name: "Greek yogurt parfait", prep: "No-cook", tip: "Layer granola + citrus zest." }
      ],
      lunch: [
        { name: "Rainbow grain bowl", prep: "20 min roast", tip: "Use leftover veggies for wraps." },
        { name: "Miso soba salad", prep: "15 min simmer", tip: "Swap soba for zucchini noodles." }
      ],
      dinner: [
        { name: "Ginger miso noodles", prep: "25 min", tip: "Finish with toasted sesame oil." },
        { name: "Sheet-pan citrus salmon", prep: "30 min roast", tip: "Add broccolini for crunch." }
      ]
    },
    grocery: {
      produce: ["Baby greens", "Citrus mix", "Avocado", "Shaved carrots"],
      pantry: ["Quinoa", "Miso paste", "Sesame oil"],
      protein: ["Salmon fillets", "Greek yogurt", "Chickpeas"]
    },
    saverTip: "Roast proteins + veggies together to cut Sunday prep time in half."
  },
  vegetarian: {
    highlight: "Harissa roasted chickpea bowls with lemon tahini.",
    meals: {
      breakfast: [
        { name: "Matcha chia pudding", prep: "Overnight soak", tip: "Top with pistachios." },
        { name: "Toasted almond smoothie", prep: "5 min blend", tip: "Add spinach for iron." }
      ],
      lunch: [
        { name: "Harissa chickpea wraps", prep: "15 min sauté", tip: "Use butter lettuce cups." },
        { name: "Roasted veggie farro bowls", prep: "25 min roast", tip: "Swap farro for millet if GF." }
      ],
      dinner: [
        { name: "Coconut curry tofu", prep: "30 min simmer", tip: "Finish with lime leaves." },
        { name: "Smoky lentil tacos", prep: "25 min sauté", tip: "Serve with cabbage slaw." }
      ]
    },
    grocery: {
      produce: ["Rainbow peppers", "Fresh herbs bundle", "Baby potatoes"],
      pantry: ["Harissa paste", "Farro", "Coconut milk"],
      protein: ["Firm tofu", "Lentils", "Chickpeas"]
    },
    saverTip: "Buy chickpeas + lentils dried; soak once for the whole week."
  },
  highProtein: {
    highlight: "Crispy chili chicken with garlic broccolini.",
    meals: {
      breakfast: [
        { name: "Egg white breakfast tacos", prep: "10 min sauté", tip: "Add pickled onions." },
        { name: "Cottage cheese pancakes", prep: "15 min griddle", tip: "Top with blueberries." }
      ],
      lunch: [
        { name: "Chicken pesto pasta salad", prep: "20 min boil", tip: "Swap pasta for chickpea spirals." },
        { name: "Steakhouse mason jar salad", prep: "15 min grill", tip: "Use yogurt ranch dressing." }
      ],
      dinner: [
        { name: "Chili crunch chicken & broccoli", prep: "25 min roast", tip: "Finish with toasted garlic." },
        { name: "Miso glazed cod", prep: "20 min bake", tip: "Serve with sesame bok choy." }
      ]
    },
    grocery: {
      produce: ["Broccolini", "Baby tomatoes", "Mixed greens"],
      pantry: ["Chili crisp", "Soba noodles", "Pesto"],
      protein: ["Chicken thighs", "Cod", "Egg whites"]
    },
    saverTip: "Batch cook proteins, then swap sauces daily for variety."
  },
  plantbased: {
    highlight: "Charred veggie chimichurri bowls with crispy tempeh.",
    meals: {
      breakfast: [
        { name: "Overnight oats with tahini drizzle", prep: "5 min mix", tip: "Add orange zest." },
        { name: "Tofu scramble pita", prep: "12 min sauté", tip: "Fold in pickled jalapeños." }
      ],
      lunch: [
        { name: "Charred veggie chimichurri bowls", prep: "20 min grill", tip: "Use frozen fire-roasted veggies." },
        { name: "Sesame soba veggie jars", prep: "15 min boil", tip: "Keep dressing separate until serving." }
      ],
      dinner: [
        { name: "Coconut lime tempeh curry", prep: "30 min simmer", tip: "Add pineapple for sweetness." },
        { name: "Black bean mole bowls", prep: "25 min sauté", tip: "Top with cacao nib crunch." }
      ]
    },
    grocery: {
      produce: ["Charred corn", "Baby spinach", "Cabbage mix"],
      pantry: ["Tempeh", "Black beans", "Coconut milk"],
      protein: ["Tofu", "Tempeh", "Nut butter trio"]
    },
    saverTip: "Use one sauce (chimichurri) across bowls, wraps, and salads to reduce prep."
  }
};

const macroRatios = {
  balanced: { protein: 0.3, carbs: 0.45, fats: 0.25 },
  vegetarian: { protein: 0.25, carbs: 0.5, fats: 0.25 },
  highProtein: { protein: 0.4, carbs: 0.35, fats: 0.25 },
  plantbased: { protein: 0.3, carbs: 0.5, fats: 0.2 }
};

const mealLabels = ["Breakfast", "Lunch", "Dinner"];

export function formatCalories(amount) {
  const value = Number(amount) || 0;
  return `${Math.round(value)} cal`;
}

export async function planMeals(formValues = {}) {
  const normalized = normalizeForm(formValues);
  let llmSeed = null;
  let timeoutId;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 12000);
    llmSeed = await callMealMindLLM({
      diet: normalized.diet,
      calories: normalized.caloriesTarget,
      effort: normalized.effort,
      householdSize: normalized.householdSize,
      dislikes: normalized.dislikes,
      signal: controller.signal
    });
  } catch (error) {
    console.warn("MealMind LLM stub failed, using local generator.", error);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
  return buildPlan(normalized, llmSeed);
}

function buildPlan(form, llmSeed) {
  const config = dietConfigs[form.diet] || dietConfigs.balanced;
  const meals = normalizeMeals(llmSeed?.meals, config);
  const days = [1, 2, 3].map((dayNumber, index) => {
    const offset = index * 3;
    return buildDay({
      dayNumber,
      config,
      caloriesTarget: form.caloriesTarget,
      effort: form.effort,
      seed: meals.slice(offset, offset + 3)
    });
  });

  return {
    diet: form.diet,
    highlight: llmSeed?.meals?.[0]?.name || config.highlight,
    days,
    macros: buildMacros(form.diet, form.caloriesTarget),
    grocery: buildGroceryList(config, llmSeed),
    saverTip: config.saverTip,
    shareLink: buildShareLink(form.diet)
  };
}

function buildDay({ dayNumber, config, caloriesTarget, seed }) {
  const llmMeals = Array.isArray(seed) ? seed : [];
  const meals = mealLabels.map((label, index) => {
    const key = label.toLowerCase();
    const pool = config.meals[key];
    const base = pool[index % pool.length];
    const calorieSpread = caloriesTarget / 3;
    const adjustment = (index - 1) * 30;
    const llmMeal = llmMeals[index];
    return {
      label,
      name: llmMeal?.name || base.name,
      calories: Math.max(280, Math.round(calorieSpread + adjustment)),
      prep: llmMeal?.prep || base.prep,
      tip: llmMeal?.tip || base.tip
    };
  });

  return {
    day: dayNumber,
    meals,
    dailyCalories: meals.reduce((sum, meal) => sum + meal.calories, 0)
  };
}

function buildMacros(diet, caloriesTarget) {
  const ratio = macroRatios[diet] || macroRatios.balanced;
  const protein = Math.round(((caloriesTarget * ratio.protein) / 4) / 5) * 5;
  const carbs = Math.round(((caloriesTarget * ratio.carbs) / 4) / 5) * 5;
  const fats = Math.round(((caloriesTarget * ratio.fats) / 9) / 5) * 5;
  return {
    calories: caloriesTarget,
    protein,
    carbs,
    fats
  };
}

function buildGroceryList(config, llmSeed) {
  const shortlist = Array.isArray(llmSeed?.groceryShortlist) ? llmSeed.groceryShortlist : [];
  const grouped = {
    produce: mergeLists(config.grocery.produce, shortlist.filter((item) => /greens|berries|veggies|herbs|spinach|avocado/i.test(item))),
    pantry: mergeLists(config.grocery.pantry, shortlist.filter((item) => /oats|noodles|paste|oil|seeds|spice/i.test(item))),
    protein: mergeLists(config.grocery.protein, shortlist.filter((item) => /tofu|chicken|salmon|yogurt|beans|lentils/i.test(item)))
  };
  return grouped;
}

function mergeLists(base = [], additions = []) {
  const set = new Set(base);
  additions.forEach((item) => {
    if (item) set.add(item);
  });
  return Array.from(set).slice(0, 10);
}

function buildShareLink(diet) {
  const slug = diet.replace(/[^a-z]/gi, "").toLowerCase() || "plan";
  const id = Math.random().toString(36).slice(2, 5);
  return `https://mealmind.app/p/${slug}-${id}`;
}

function normalizeForm(form = {}) {
  return {
    diet: dietConfigs[form.diet] ? form.diet : "balanced",
    caloriesTarget: clampCalories(Number(form.caloriesTarget) || 1800),
    effort: normalizeEffort(form.effort),
    householdSize: clampHousehold(Number(form.householdSize) || 1),
    dislikes: (form.dislikes || "").trim()
  };
}

function normalizeEffort(effort) {
  const valid = ["speedy", "balanced", "chefy"];
  return valid.includes(effort) ? effort : "balanced";
}

function clampCalories(value) {
  return Math.min(Math.max(value, 1400), 2400);
}

function clampHousehold(value) {
  if (Number.isNaN(value)) return 1;
  return Math.min(Math.max(value, 1), 4);
}

function normalizeMeals(raw, config) {
  const meals = [];
  if (Array.isArray(raw)) {
    raw.slice(0, 9).forEach((item) => {
      meals.push({
        name: item?.name || "Meal",
        prep: item?.prep || "Quick prep",
        tip: item?.tip || ""
      });
    });
  }
  // Pad to exactly 9 meals using config rotation.
  const cfgMeals = [
    ...config.meals.breakfast,
    ...config.meals.lunch,
    ...config.meals.dinner
  ];
  while (meals.length < 9) {
    const base = cfgMeals[meals.length % cfgMeals.length];
    meals.push({ name: base.name, prep: base.prep, tip: base.tip });
  }
  // Clamp calories distribution later in buildDay; here just return the seed objects.
  return meals.slice(0, 9);
}
