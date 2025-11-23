import * as sharedUI from "../../../shared/ui.js";
import { planItinerary, formatCurrency } from "./logic.js";

const MIN_PLAN_DELAY = 420;

const FREE_PLAN_LIMIT = 1;
const state = {
  planCount: 0,
  lastItinerary: null,
  lastFormValues: null,
  isSubscribed: false
};

export async function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("tripspark-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI trip planner</p>
    <h1>TripSpark</h1>
    <p class="tagline">3-day city itineraries tailored to your vibe.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Enter your destination to spark a plan.</p>`;

  const upsell = buildUpsellBanner();

  const form = buildForm(async (formValues) => {
    state.lastFormValues = formValues;
    await startPlanning(formValues, resultsSection, upsell);
  });

  // Check subscription status
  try {
    const isSubscribed = await window.MiniHost.isSubscribed("tripspark");
    state.isSubscribed = isSubscribed;
  } catch (err) {
    console.warn("Failed to check subscription:", err);
  }

  container.append(hero, form, resultsSection, upsell);
}

async function startPlanning(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  const loadDelay = delay(MIN_PLAN_DELAY);

  try {
    const itinerary = await planItinerary(formValues);
    await loadDelay;
    state.planCount += 1;
    state.lastItinerary = itinerary;
    renderItinerary(resultsSection, itinerary, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("tripspark:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for unlimited trips + exports.");
    }
  } catch (error) {
    console.error("TripSpark failed to generate itinerary:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not spark your trip. Try again in a moment.");
    showToast("TripSpark hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "trip-form";
  form.innerHTML = `
    <label>
      <span>Destination</span>
      <input type="text" name="destination" required placeholder="City (e.g., Lisbon)" autocomplete="off" />
    </label>
    <label>
      <span>Dates</span>
      <input type="text" name="dates" placeholder="Pick 3 days" autocomplete="off" />
    </label>
    <label>
      <span>Vibe</span>
      <select name="vibe">
        <option value="foodie">Foodie</option>
        <option value="culture" selected>Culture</option>
        <option value="nightlife">Nightlife</option>
        <option value="outdoors">Outdoors</option>
        <option value="gems">Hidden gems</option>
      </select>
    </label>
    <label>
      <span>Budget focus</span>
      <input type="range" name="budgetLevel" min="1" max="3" step="1" value="2" />
      <div class="range-labels">
        <span>$</span>
        <span>$$</span>
        <span>$$$</span>
      </div>
    </label>
    <div class="vibe-tags" aria-label="Trip pace">
      <button type="button" data-tag="chill" class="tag">Chill</button>
      <button type="button" data-tag="balanced" class="tag is-selected">Balanced</button>
      <button type="button" data-tag="adventurous" class="tag">Adventurous</button>
    </div>
  `;

  const formHelper = document.createElement("p");
  formHelper.className = "form-helper";
  formHelper.textContent = "";

  const submit = createButton({
    label: "Spark My Trip",
    variant: "primary",
    type: "submit"
  });
  submit.classList.add("primary-action");

  form.append(formHelper, submit);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const vibeTag = form.querySelector(".tag.is-selected")?.dataset.tag || "balanced";
    const values = {
      destination: (formData.get("destination") || "").toString().trim(),
      dates: (formData.get("dates") || "").toString().trim(),
      vibe: formData.get("vibe"),
      budgetLevel: formData.get("budgetLevel"),
      pace: vibeTag
    };

    if (!values.destination) {
      setFormHelper("Add a city to spark your plan.");
      form.querySelector('input[name="destination"]').focus();
      return;
    }

    setFormHelper("");
    toggleSubmit(true);
    try {
      await onSubmit(values);
    } finally {
      toggleSubmit(false);
    }
  });

  form.querySelectorAll(".tag").forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
      form.querySelectorAll(".tag").forEach((btn) => btn.classList.remove("is-selected"));
      tagBtn.classList.add("is-selected");
    });
  });

  function setFormHelper(message) {
    formHelper.textContent = message;
    formHelper.classList.toggle("is-visible", Boolean(message));
  }

  function toggleSubmit(isLoading) {
    submit.disabled = isLoading;
    submit.textContent = isLoading ? "Sparking..." : "Spark My Trip";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Sketching your perfect 3-day spark...</p>
    <div class="spark-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderItinerary(container, itinerary, upsell) {
  container.innerHTML = "";

  const highlightCard = createCard("highlight-card");
  highlightCard.innerHTML = `
    <div class="highlight-eyebrow">Spark Highlight</div>
    <p class="highlight-copy">${itinerary.highlight}</p>
  `;
  container.append(highlightCard);

  itinerary.days.forEach((day) => {
    const dayCard = createCard("day-card");
    dayCard.innerHTML = `
      <div class="day-header">
        <div>
          <h3>Day ${day.day}</h3>
          <p class="day-theme">${day.theme}</p>
        </div>
        <span class="day-budget">${formatCurrency(day.total)}</span>
      </div>
      <div class="segments">
        ${day.segments
        .map(
          (segment) => `
              <div class="segment-row">
                <div>
                  <p class="segment-label">${segment.label}</p>
                  <p class="segment-activity">${segment.activity}</p>
                </div>
                <span class="segment-cost">${formatCurrency(segment.cost)}</span>
              </div>
            `
        )
        .join("")}
      </div>
    `;
    container.append(dayCard);
  });

  container.append(buildBudgetSummary(itinerary.summary));
  container.append(
    buildShareRow(itinerary.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add trip details first.");
        return;
      }
      startPlanning(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("tripspark:regenerate", { detail: { planCount: state.planCount } }));
    })
  );

  if (state.planCount >= 1) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("tripspark:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildBudgetSummary(summary) {
  const card = createCard("budget-card");
  card.innerHTML = `
    <div class="budget-header">
      <h3>Budget overview</h3>
      <span>Total ${formatCurrency(summary.total)}</span>
    </div>
    <div class="budget-days">
      ${summary.perDay.map((day) => `<span>Day ${day.day}: ${formatCurrency(day.amount)}</span>`).join("")}
    </div>
    <p class="budget-tip">${summary.saverTip}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Shareable link";

  const linkInput = document.createElement("input");
  linkInput.value = link;
  linkInput.readOnly = true;
  linkInput.className = "share-link";

  const copyButton = createButton({
    label: "Copy",
    variant: "outline",
    type: "button"
  });
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
    label: "Export & share (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.dataset.analytics = "tripspark.exportTapped";
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("tripspark:export", { detail: { plan: state.lastItinerary } }));
      showToast("Export ready!");
    } else {
      window.dispatchEvent(new CustomEvent("tripspark:upsellViewed", { detail: { surface: "exportButton" } }));
      showToast("Subscribe to unlock exports.");
    }
  });

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({
    label: "Tweak & regenerate",
    variant: "outline",
    type: "button"
  });
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
  copy.innerHTML = "Subscribe to unlock unlimited trips, Pro exports, and saved itineraries.";

  const upgradeButton = createButton({
    label: "Upgrade for unlimited trips",
    variant: "primary",
    type: "button"
  });
  upgradeButton.addEventListener("click", async () => {
    upgradeButton.disabled = true;
    upgradeButton.textContent = "Connecting...";
    try {
      const result = await window.MiniHost.requestSubscription("tripspark");
      if (result.status === "active") {
        state.isSubscribed = true;
        card.classList.add("is-hidden");
        showToast("Welcome to TripSpark Pro!");
        // Re-render to unlock features if needed, or just let the next action pick it up
        const resultsSection = document.querySelector(".results");
        if (resultsSection && state.lastItinerary) {
          renderItinerary(resultsSection, state.lastItinerary, card);
        }
      } else {
        showToast("Subscription cancelled.");
      }
    } catch (error) {
      console.error(error);
      showToast("Purchase failed. Try again.");
    } finally {
      upgradeButton.disabled = false;
      upgradeButton.textContent = "Upgrade for unlimited trips";
    }
  });

  card.append(copy, upgradeButton);
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

  button.classList.add("tripspark-button", `variant-${variant}`);
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
  toast.className = "tripspark-toast";
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
