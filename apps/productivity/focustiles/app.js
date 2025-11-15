import * as sharedUI from "../../../shared/ui.js";
import { planTiles } from "./logic.js";

const MIN_PLAN_DELAY = 360;
const FREE_PLAN_LIMIT = 3;
const energyOptions = [
  { key: "low", label: "Low" },
  { key: "steady", label: "Steady" },
  { key: "charged", label: "Charged" }
];

const state = {
  planCount: 0,
  lastFormValues: null,
  lastPlan: null,
  isSubscribed: false
};

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("focustiles-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI focus coach</p>
    <h1>FocusTiles</h1>
    <p class="tagline">Adaptive microtiles tuned to your energy.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Pick a theme to spark your tiles.</p>`;

  const upsell = buildUpsell();

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
    const tiles = planTiles(formValues);
    await loadDelay;
    state.planCount += 1;
    state.lastPlan = tiles;
    renderTiles(resultsSection, tiles, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("focustiles:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for analytics, custom rhythms, and calendar sync.");
    }
  } catch (error) {
    console.error("FocusTiles failed to generate:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not spark tiles. Try again.");
    showToast("FocusTiles hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "tile-form";
  form.innerHTML = `
    <label>
      <span>Focus theme</span>
      <select name="theme">
        <option value="deepwork" selected>Deep work</option>
        <option value="writing">Writing</option>
        <option value="study">Study</option>
        <option value="review">Review</option>
      </select>
    </label>
    <div class="energy-field">
      <span>Energy check</span>
      <div class="energy-tags">
        ${energyOptions
          .map(
            ({ key, label }, index) =>
              `<button type="button" class="energy-tag ${index === 1 ? "is-selected" : ""}" data-energy="${key}">${label}</button>`
          )
          .join("")}
      </div>
    </div>
    <label>
      <span>Block length</span>
      <input type="range" name="blockLength" min="20" max="40" step="5" value="25" />
      <div class="range-labels">
        <span>20 min</span>
        <span class="range-value" data-range="block">25 min</span>
        <span>40 min</span>
      </div>
    </label>
    <label>
      <span>Soundtrack</span>
      <select name="soundtrack">
        <option value="Lo-fi focus" selected>Lo-fi focus</option>
        <option value="Ambient calm">Ambient calm</option>
        <option value="Piano energy">Piano energy</option>
        <option value="White noise">White noise</option>
      </select>
    </label>
    <label>
      <span>Goal (optional)</span>
      <input type="text" name="goal" placeholder="e.g., outline deck" autocomplete="off" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";

  const submit = createButton({ label: "Spark My Tiles", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");

  form.append(helper, submit);

  const blockSlider = form.querySelector('input[name="blockLength"]');
  blockSlider.addEventListener("input", () => {
    const label = form.querySelector('.range-value[data-range="block"]');
    if (label) label.textContent = `${blockSlider.value} min`;
  });

  form.querySelectorAll(".energy-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".energy-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const energy = form.querySelector(".energy-tag.is-selected")?.dataset.energy || "steady";
    const values = {
      theme: formData.get("theme"),
      energy,
      blockLength: formData.get("blockLength"),
      soundtrack: formData.get("soundtrack"),
      goal: formData.get("goal")
    };

    if (!values.theme) {
      setHelper("Pick a theme to spark your tiles.");
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
    submit.textContent = isLoading ? "Stacking..." : "Spark My Tiles";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Stacking the perfect flow...</p>
    <div class="tile-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderTiles(container, plan, upsell) {
  container.innerHTML = "";

  container.append(buildTileCard(plan.tiles[0], true));

  const stackCard = createCard("tile-stack-card");
  stackCard.innerHTML = `
    <h3>Upcoming tiles</h3>
    <div class="tile-stack">
      ${plan.tiles
        .slice(1)
        .map(
          (tile) => `
            <div class="tile-row ${tile.type}">
              <div>
                <p class="tile-label">${tile.label}</p>
                <p class="tile-tip">${tile.suggestion}</p>
              </div>
              <div class="tile-meta">
                <span>${tile.duration} min</span>
                <small>${tile.soundtrack}</small>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  container.append(stackCard);

  container.append(buildFlowScoreCard(plan.flowScore));
  container.append(buildResetCard(plan.resetTip));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Set your theme first.");
        return;
      }
      startPlanning(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("focustiles:regenerate", { detail: { planCount: state.planCount } }));
    })
  );

  if (state.planCount >= 1) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("focustiles:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildTileCard(tile, isHighlight = false) {
  const card = createCard(isHighlight ? "highlight-tile" : "tile-card");
  card.innerHTML = `
    <div class="tile-header">
      <h3>${tile.label}</h3>
      <span class="duration-chip">${tile.duration} min</span>
    </div>
    <p class="tile-tip">${tile.suggestion}</p>
    <p class="tile-soundtrack">${tile.soundtrack}</p>
    <div class="tile-actions"></div>
  `;
  if (isHighlight) {
    const actions = card.querySelector(".tile-actions");
    const logButton = createButton({
      label: state.isSubscribed ? "Log session" : "Log session (Pro)",
      variant: "primary",
      type: "button",
      disabled: !state.isSubscribed
    });
    logButton.addEventListener("click", () => {
      if (state.isSubscribed) {
        window.dispatchEvent(new CustomEvent("focustiles:logSession", { detail: { tile } }));
        showToast("Session logged");
      } else {
        window.dispatchEvent(new CustomEvent("focustiles:upsellViewed", { detail: { surface: "logSession" } }));
        showToast("Upgrade for analytics & logging.");
      }
    });
    actions.append(logButton);
  }
  return card;
}

function buildFlowScoreCard(flowScore) {
  const card = createCard("flow-card");
  card.innerHTML = `
    <div class="flow-header">
      <h3>Flow score</h3>
      <span class="flow-chip">${flowScore.score}</span>
    </div>
    <p>${flowScore.description}</p>
  `;
  return card;
}

function buildResetCard(tip) {
  const card = createCard("reset-card");
  card.innerHTML = `
    <h3>Reset tip</h3>
    <p>${tip}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share with accountability buddy";

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
    label: "Save rhythm (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("focustiles:saveRhythm", { detail: { plan: state.lastPlan } }));
      showToast("Rhythm saved!");
    } else {
      window.dispatchEvent(new CustomEvent("focustiles:upsellViewed", { detail: { surface: "saveRhythm" } }));
      showToast("Upgrade for custom rhythms.");
    }
  });

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({ label: "Regenerate flow", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => {
    onRegenerate?.();
  });

  card.append(label, linkInput, shareActions, regenerate);
  return card;
}

function buildUpsell() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Unlock custom rhythms, analytics, and calendar sync with FocusTiles Pro.";

  const button = createButton({ label: "Upgrade to Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("focustiles:upsellClicked"));
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
  button.classList.add("focustiles-button", `variant-${variant}`);
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
  toast.className = "focustiles-toast";
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
