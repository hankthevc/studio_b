import * as sharedUI from "../../../shared/ui.js";
import { planPackingList } from "./logic.js";

const FREE_PLAN_LIMIT = 1;
const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null,
  isSubscribed: false
};

const vibeOptions = [
  { key: "business", label: "Business" },
  { key: "leisure", label: "Leisure" },
  { key: "adventure", label: "Adventure" }
];

export async function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("pocketporter-app");

  // Check subscription status
  try {
    const isSubscribed = await window.MiniHost.isSubscribed("pocketporter");
    state.isSubscribed = isSubscribed;
  } catch (err) {
    console.warn("Failed to check subscription:", err);
  }

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI packing buddy</p>
    <h1>PocketPorter</h1>
    <p class="tagline">Carry-on confident lists in under a minute.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Add a destination to start packing.</p>`;

  const upsell = buildUpsellBanner();
  const form = buildForm(async (values) => {
    state.lastFormValues = values;
    await startPacking(values, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startPacking(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  try {
    await wait(380);
    const plan = await planPackingList(formValues);
    state.planCount += 1;
    state.lastPlan = plan;
    renderPlan(resultsSection, plan, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("pocketporter:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade to save wardrobes & auto-sync airlines.");
    }
  } catch (error) {
    console.error("PocketPorter failed to generate list:", error);
    showError(resultsSection, "Could not pack your bag. Try again shortly.");
    showToast("PocketPorter hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "packing-form";
  form.innerHTML = `
    <label>
      <span>Destination</span>
      <input type="text" name="destination" placeholder="City (e.g., Lisbon)" autocomplete="off" />
    </label>
    <label>
      <span>Dates</span>
      <input type="text" name="dates" placeholder="e.g., May 12-15" autocomplete="off" />
    </label>
    <div class="vibe-field">
      <span>Trip vibe</span>
      <div class="vibe-tags">
        ${vibeOptions
      .map(
        (option, index) =>
          `<button type="button" class="vibe-tag ${index === 1 ? "is-selected" : ""}" data-vibe="${option.key}">${option.label}</button>`
      )
      .join("")}
      </div>
    </div>
    <label>
      <span>Airline</span>
      <select name="airline">
        <option value="economy" selected>Mainline economy</option>
        <option value="premium">Premium economy</option>
        <option value="business">Business cabin</option>
      </select>
    </label>
    <label>
      <span>Must-pack notes (optional)</span>
      <input type="text" name="notes" placeholder="e.g., bring product samples" autocomplete="off" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";
  const submit = createButton({ label: "Pack My Bag", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");
  form.append(helper, submit);

  form.querySelectorAll(".vibe-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".vibe-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const destination = (formData.get("destination") || "").toString().trim();
    if (!destination) {
      showHelper("Add a destination to start packing.");
      return;
    }
    showHelper("");
    const vibe = form.querySelector(".vibe-tag.is-selected")?.dataset.vibe || "leisure";
    const values = {
      destination,
      dates: formData.get("dates"),
      vibe,
      airline: formData.get("airline"),
      notes: formData.get("notes")
    };
    toggleSubmit(true);
    try {
      await onSubmit(values);
    } finally {
      toggleSubmit(false);
    }
  });

  function showHelper(message) {
    helper.textContent = message;
    helper.classList.toggle("is-visible", Boolean(message));
  }

  function toggleSubmit(isLoading) {
    submit.disabled = isLoading;
    submit.textContent = isLoading ? "Packing..." : "Pack My Bag";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Curating the perfect carry-on...</p>
    <div class="luggage-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPlan(container, plan, upsell) {
  container.innerHTML = "";
  container.append(buildComplianceCard(plan.compliance, plan.airline));
  plan.categories.forEach((category) => container.append(buildCategoryCard(category)));
  container.append(buildWeatherCard(plan.weatherTip));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add trip details first.");
        return;
      }
      startPacking(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("pocketporter:regenerate", { detail: { planCount: state.planCount } }));
    })
  );
  if (state.planCount > 0) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("pocketporter:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildComplianceCard(compliance, airline) {
  const card = createCard("compliance-card");
  card.innerHTML = `
    <div class="compliance-header">
      <h3>Carry-on check</h3>
      <span>${airline}</span>
    </div>
    <p class="compliance-status ${compliance.status}">${compliance.message}</p>
    <p class="compliance-detail">Allowance: ${compliance.allowanceKg}kg · Liquids ≤ ${compliance.liquidsMl}ml</p>
  `;
  return card;
}

function buildCategoryCard(category) {
  const card = createCard("category-card");
  card.innerHTML = `
    <div class="category-header">
      <h3>${category.name}</h3>
      <span class="category-badge">${category.badge}</span>
    </div>
  `;
  const list = document.createElement("ul");
  list.className = "packing-list";
  category.items.forEach((item, index) => {
    const li = document.createElement("li");
    const id = `${category.name}-${index}`;
    li.innerHTML = `
      <label for="${id}">
        <input type="checkbox" id="${id}" ${item.required ? "checked" : ""} />
        <span>${item.label}</span>
      </label>
    `;
    list.append(li);
  });
  card.append(list);
  return card;
}

function buildWeatherCard(tip) {
  const card = createCard("weather-card");
  card.innerHTML = `
    <h3>Weather tip</h3>
    <p>${tip}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Send to travel buddies";

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

  const saveButton = createButton({
    label: "Save wardrobe (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  saveButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("pocketporter:saveWardrobe", { detail: { plan: state.lastPlan } }));
      showToast("Wardrobe saved!");
    } else {
      window.dispatchEvent(new CustomEvent("pocketporter:upsellViewed", { detail: { surface: "saveWardrobe" } }));
      showToast("Upgrade to save wardrobes.");
    }
  });

  const regenerate = createButton({ label: "Regenerate list", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  card.append(label, linkInput, copyButton, saveButton, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade to PocketPorter Pro to save wardrobes and auto-sync airline rules.";
  const button = createButton({ label: "Upgrade for saved wardrobes", variant: "primary", type: "button" });
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Connecting...";
    try {
      const result = await window.MiniHost.requestSubscription("pocketporter");
      if (result.status === "active") {
        state.isSubscribed = true;
        card.classList.add("is-hidden");
        showToast("Welcome to PocketPorter Pro!");
        const resultsSection = document.querySelector(".results");
        if (resultsSection && state.lastPlan) {
          renderPlan(resultsSection, state.lastPlan, card);
        }
      } else {
        showToast("Subscription cancelled.");
      }
    } catch (error) {
      console.error(error);
      showToast("Purchase failed. Try again.");
    } finally {
      button.disabled = false;
      button.textContent = "Upgrade for saved wardrobes";
    }
  });
  card.append(copy, button);
  return card;
}

function showError(container, message) {
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
    if (typeof onClick === "function") button.addEventListener("click", onClick);
  }
  button.classList.add("pocketporter-button", `variant-${variant}`);
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

function showToast(message) {
  if (typeof sharedUI.renderToast === "function") {
    sharedUI.renderToast(message);
    return;
  }
  if (!message) return;
  const toast = document.createElement("div");
  toast.className = "pocketporter-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => toast.remove(), 2600);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("app");
    if (root) initMiniApp(root);
  });
} else {
  const root = document.getElementById("app");
  if (root) initMiniApp(root);
}
