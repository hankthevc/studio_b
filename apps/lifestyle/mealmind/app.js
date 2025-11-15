import * as sharedUI from "../../../shared/ui.js";
import { planMeals, formatCalories } from "./logic.js";

const MIN_PLAN_DELAY = 420;
const FREE_PLAN_LIMIT = 2;
const effortOptions = [
  { key: "speedy", label: "Speedy" },
  { key: "balanced", label: "Balanced" },
  { key: "chefy", label: "Chef-y" }
];

const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null,
  isSubscribed: false
};

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("mealmind-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI meal planner</p>
    <h1>MealMind</h1>
    <p class="tagline">Balanced weekly menus in under a minute.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Pick a diet to see a 3-day preview.</p>`;

  const upsell = buildUpsellBanner();

  const form = buildForm(async (formValues) => {
    state.lastFormValues = formValues;
    await startPlanning(formValues, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startPlanning(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  const loadDelay = delay(MIN_PLAN_DELAY);

  try {
    const plan = await planMeals(formValues);
    await loadDelay;
    state.planCount += 1;
    state.lastPlan = plan;
    renderPlan(resultsSection, plan, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("mealmind:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for full-week menus & exports.");
    }
  } catch (error) {
    console.error("MealMind failed to plan menu:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not plan your menu. Try again.");
    showToast("MealMind hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "meal-form";
  form.innerHTML = `
    <label>
      <span>Diet preference</span>
      <select name="diet" required>
        <option value="balanced" selected>Balanced</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="highProtein">High protein</option>
        <option value="plantbased">Plant-based</option>
      </select>
    </label>
    <label>
      <span>Daily calories</span>
      <input type="range" name="caloriesTarget" min="1400" max="2400" step="100" value="1800" />
      <div class="range-labels">
        <span>1400</span>
        <span class="range-value" data-range="calories">1800 cal</span>
        <span>2400</span>
      </div>
    </label>
    <div class="effort-field" aria-label="Prep effort">
      <span>Prep effort</span>
      <div class="effort-tags">
        ${effortOptions
          .map(
            ({ key, label }, index) =>
              `<button type="button" class="effort-tag ${index === 1 ? "is-selected" : ""}" data-effort="${key}">${label}</button>`
          )
          .join("")}
      </div>
    </div>
    <div class="household-field">
      <span>Household size</span>
      <div class="household-control">
        <button type="button" class="household-btn" data-action="decrement" aria-label="Decrease household">−</button>
        <span class="household-value" aria-live="polite">1</span>
        <button type="button" class="household-btn" data-action="increment" aria-label="Increase household">+</button>
      </div>
      <input type="hidden" name="householdSize" value="1" />
    </div>
    <label>
      <span>Dislikes (optional)</span>
      <input type="text" name="dislikes" placeholder="e.g., mushrooms, shellfish" autocomplete="off" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";

  const submit = createButton({ label: "Plan My Week", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");

  form.append(helper, submit);

  const range = form.querySelector('input[name="caloriesTarget"]');
  range.addEventListener("input", () => {
    const value = form.querySelector('.range-value[data-range="calories"]');
    if (value) value.textContent = `${range.value} cal`;
  });

  form.querySelectorAll(".effort-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".effort-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  const householdInput = form.querySelector('input[name="householdSize"]');
  const householdValue = form.querySelector(".household-value");
  form.querySelectorAll(".household-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.dataset.action;
      let current = Number(householdInput.value);
      current = direction === "increment" ? current + 1 : current - 1;
      current = Math.min(Math.max(current, 1), 4);
      householdInput.value = current.toString();
      householdValue.textContent = current.toString();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const effort = form.querySelector(".effort-tag.is-selected")?.dataset.effort || "balanced";
    const values = {
      diet: formData.get("diet"),
      caloriesTarget: formData.get("caloriesTarget"),
      effort,
      householdSize: formData.get("householdSize"),
      dislikes: formData.get("dislikes")
    };

    if (!values.diet) {
      setHelper("Choose a diet to plan your menu.");
      return;
    }

    setHelper("");
    toggleSubmit(true);
    try {
      await onSubmit(values);
    } finally {
      toggleSubmit(false);
    }
  });

  function setHelper(message) {
    helper.textContent = message;
    helper.classList.toggle("is-visible", Boolean(message));
  }

  function toggleSubmit(isLoading) {
    submit.disabled = isLoading;
    submit.textContent = isLoading ? "Prepping..." : "Plan My Week";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Prepping your preview menu...</p>
    <div class="utensil-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPlan(container, plan, upsell) {
  container.innerHTML = "";

  const highlightCard = createCard("highlight-card");
  highlightCard.innerHTML = `
    <div class="highlight-eyebrow">Chef's pick</div>
    <h2>${plan.highlight}</h2>
    <p class="highlight-copy">3-day preview · ${plan.diet.replace(/([A-Z])/g, " $1").trim()}</p>
  `;
  const presetButton = createButton({
    label: "Save household preset (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  presetButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("mealmind:savePreset", { detail: { plan } }));
      showToast("Preset saved!");
    } else {
      window.dispatchEvent(new CustomEvent("mealmind:upsellViewed", { detail: { surface: "highlightPreset" } }));
      showToast("Upgrade to save presets.");
    }
  });
  highlightCard.append(presetButton);
  container.append(highlightCard);

  plan.days.forEach((day) => {
    const dayCard = createCard("day-card");
    dayCard.innerHTML = `
      <div class="day-header">
        <h3>Day ${day.day}</h3>
        <span class="calories-chip">${formatCalories(day.dailyCalories)}</span>
      </div>
      <div class="meal-list">
        ${day.meals
          .map(
            (meal) => `
              <div class="meal-row">
                <div>
                  <p class="meal-label">${meal.label}</p>
                  <p class="meal-name">${meal.name}</p>
                  <p class="meal-tip">${meal.tip}</p>
                </div>
                <div class="meal-meta">
                  <span>${meal.prep}</span>
                  <strong>${formatCalories(meal.calories)}</strong>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    container.append(dayCard);
  });

  container.append(buildMacroCard(plan.macros));
  container.append(buildGroceryCard(plan.grocery, plan.saverTip));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add preferences first.");
        return;
      }
      startPlanning(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("mealmind:regenerate", { detail: { planCount: state.planCount } }));
    })
  );

  if (state.planCount >= 1) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("mealmind:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildMacroCard(macros) {
  const card = createCard("macro-card");
  card.innerHTML = `
    <div class="macro-header">
      <h3>Macro snapshot</h3>
      <span>${formatCalories(macros.calories)} target</span>
    </div>
    <div class="macro-grid">
      <div>
        <p>Protein</p>
        <strong>${macros.protein}g</strong>
      </div>
      <div>
        <p>Carbs</p>
        <strong>${macros.carbs}g</strong>
      </div>
      <div>
        <p>Fats</p>
        <strong>${macros.fats}g</strong>
      </div>
    </div>
  `;
  return card;
}

function buildGroceryCard(grocery, tip) {
  const card = createCard("grocery-card");
  card.innerHTML = `
    <div class="grocery-header">
      <h3>Grocery shortlist</h3>
      <span>Per aisle</span>
    </div>
    ${Object.entries(grocery)
      .map(
        ([category, items]) => `
          <div class="grocery-group">
            <p class="grocery-label">${category}</p>
            <div class="grocery-chips">
              ${items.map((item) => `<span>${item}</span>`).join("")}
            </div>
          </div>
        `
      )
      .join("")}
    <p class="grocery-tip">${tip}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share with your co-chef";

  const linkInput = document.createElement("input");
  linkInput.value = link;
  linkInput.readOnly = true;
  linkInput.className = "share-link";

  const copyButton = createButton({ label: "Copy", variant: "outline", type: "button" });
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied!");
    } catch (error) {
      linkInput.select();
      document.execCommand("copy");
      showToast("Link copied!");
    }
  });

  const exportButton = createButton({
    label: "Export grocery list (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("mealmind:export", { detail: { plan: state.lastPlan } }));
      showToast("Grocery list exported!");
    } else {
      window.dispatchEvent(new CustomEvent("mealmind:upsellViewed", { detail: { surface: "exportButton" } }));
      showToast("Upgrade to MealMind Pro to export.");
    }
  });

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({ label: "Tweak & regenerate", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => {
    if (typeof onRegenerate === "function") {
      onRegenerate();
    }
  });

  card.append(label, linkInput, shareActions, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade for full-week menus, saved households, and grocery exports.";

  const button = createButton({ label: "Upgrade to MealMind Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("mealmind:upsellClicked"));
    showToast("Billing flow coming soon.");
  });

  card.append(copy, button);
  return card;
}

function showErrorState(container, message) {
  container.innerHTML = `<p class="results-error">${message}</p>`;
}

function createButton(config) {
  const { label, onClick, variant = "primary", type = "button", disabled = false } = config;
  let button;
  if (typeof sharedUI.renderButton === "function") {
    button = sharedUI.renderButton({ label, onClick, variant, type, disabled });
  } else {
    button = document.createElement("button");
    button.type = type;
    button.disabled = disabled;
    button.textContent = label;
    if (typeof onClick === "function") {
      button.addEventListener("click", onClick);
    }
  }
  button.classList.add("mealmind-button", `variant-${variant}`);
  return button;
}

function createCard(className = "") {
  if (typeof sharedUI.renderCard === "function") {
    return sharedUI.renderCard(null, "", null, { className });
  }
  const card = document.createElement("article");
  card.className = ["shared-card", className].filter(Boolean).join(" ");
  return card;
}

function showToast(message, options) {
  if (typeof sharedUI.renderToast === "function") {
    sharedUI.renderToast(message, options);
    return;
  }
  if (!message) return;
  const toast = document.createElement("div");
  toast.className = "mealmind-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => toast.remove(), 2600);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("app");
    if (root) {
      initMiniApp(root);
    }
  });
} else {
  const root = document.getElementById("app");
  if (root) {
    initMiniApp(root);
  }
}
