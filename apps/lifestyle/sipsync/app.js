import * as sharedUI from "../../../shared/ui.js";
import { planHydration } from "./logic.js";

const FREE_PLAN_LIMIT = 1;
const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null,
  isSubscribed: false
};

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("sipsync-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI hydration coach</p>
    <h1>SipSync</h1>
    <p class="tagline">Keep your cadence on track anywhere.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Add wake and sleep times to sync hydration.</p>`;

  const upsell = buildUpsellBanner();
  const form = buildForm(async (values) => {
    state.lastFormValues = values;
    await startPlanning(values, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startPlanning(values, resultsSection, upsell) {
  showLoading(resultsSection);
  try {
    await wait(350);
    const plan = planHydration(values);
    state.planCount += 1;
    state.lastPlan = plan;
    renderPlan(resultsSection, plan, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("sipsync:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for smart bottle sync & streak boosts.");
    }
  } catch (error) {
    console.error("SipSync failed to plan hydration:", error);
    showError(resultsSection, "Could not sync your sips. Try again later.");
    showToast("SipSync hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "hydration-form";
  form.innerHTML = `
    <div class="time-row">
      <label>
        <span>Wake time</span>
        <input type="time" name="wake" value="07:00" />
      </label>
      <label>
        <span>Sleep time</span>
        <input type="time" name="sleep" value="22:30" />
      </label>
    </div>
    <label>
      <span>Activity level</span>
      <select name="activity">
        <option value="sedentary" selected>Sedentary</option>
        <option value="active">Active</option>
        <option value="training">Training day</option>
      </select>
    </label>
    <div class="flavor-field">
      <span>Flavor mood</span>
      <div class="flavor-tags">
        <button type="button" class="flavor-tag is-selected" data-flavor="crisp">Crisp</button>
        <button type="button" class="flavor-tag" data-flavor="fruity">Fruity</button>
        <button type="button" class="flavor-tag" data-flavor="herbal">Herbal</button>
      </div>
    </div>
    <label class="travel-toggle">
      <input type="checkbox" name="travel" />
      <span>Travel mode</span>
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";
  const submit = createButton({ label: "Sync My Sips", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");
  form.append(helper, submit);

  form.querySelectorAll(".flavor-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".flavor-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const wake = formData.get("wake") || "";
    const sleep = formData.get("sleep") || "";
    if (!wake || !sleep) {
      setHelper("Add wake and sleep times to sync hydration.");
      return;
    }
    setHelper("");
    const flavor = form.querySelector(".flavor-tag.is-selected")?.dataset.flavor || "crisp";
    const values = {
      wake,
      sleep,
      activity: formData.get("activity"),
      flavor,
      travel: formData.get("travel") === "on"
    };
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
    submit.textContent = isLoading ? "Syncing..." : "Sync My Sips";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Mapping your hydration cadence...</p>
    <div class="droplet-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPlan(container, plan, upsell) {
  container.innerHTML = "";

  const highlight = createCard("highlight-card");
  highlight.innerHTML = `
    <div class="highlight-eyebrow">Daily target</div>
    <h3>${(plan.targetMl / 1000).toFixed(1)} L</h3>
    <p>Wake ${plan.wake} · Sleep ${plan.sleep}</p>
  `;
  container.append(highlight);

  container.append(buildTimelineCard(plan.timeline));
  container.append(buildFlavorCard(plan.flavorIdeas));
  container.append(buildTravelCard(plan.travelTip, plan.travel));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add hydration details first.");
        return;
      }
      startPlanning(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("sipsync:regenerate", { detail: { planCount: state.planCount } }));
    })
  );

  if (state.planCount > 0) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("sipsync:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildTimelineCard(timeline) {
  const card = createCard("timeline-card");
  card.innerHTML = `<h3>Hydration cadence</h3>`;
  const list = document.createElement("ul");
  list.className = "timeline-list";
  timeline.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <p class="time-label">${entry.label}</p>
        <p class="time-flavor">${entry.flavorBoost}</p>
      </div>
      <strong>${Math.round(entry.amountMl)} ml</strong>
    `;
    list.append(li);
  });
  card.append(list);
  return card;
}

function buildFlavorCard(ideas) {
  const card = createCard("flavor-card");
  card.innerHTML = `<h3>Flavor boost ideas</h3>`;
  const chips = document.createElement("div");
  chips.className = "flavor-chips";
  ideas.forEach((idea) => {
    const span = document.createElement("span");
    span.textContent = idea;
    chips.append(span);
  });
  card.append(chips);
  return card;
}

function buildTravelCard(tip, travelEnabled) {
  if (!travelEnabled) {
    const card = createCard("travel-card");
    card.innerHTML = `<h3>Hydration note</h3><p>${tip}</p>`;
    return card;
  }
  const card = createCard("travel-card travel-active");
  card.innerHTML = `<h3>Travel mode</h3><p>${tip}</p>`;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share your cadence";

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

  const smartButton = createButton({
    label: "Sync smart bottle (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  smartButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("sipsync:smartBottleSync", { detail: { plan: state.lastPlan } }));
      showToast("Synced with your bottle!");
    } else {
      window.dispatchEvent(new CustomEvent("sipsync:upsellViewed", { detail: { surface: "smartBottle" } }));
      showToast("Upgrade to sync with smart bottles.");
    }
  });

  const regenerate = createButton({ label: "Regenerate", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  card.append(label, linkInput, copyButton, smartButton, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade for smart bottle sync, streak boosts, and travel presets.";
  const button = createButton({ label: "Upgrade to SipSync Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("sipsync:upsellClicked"));
    showToast("Billing flow coming soon.");
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
  button.classList.add("sipsync-button", `variant-${variant}`);
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
  toast.className = "sipsync-toast";
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
