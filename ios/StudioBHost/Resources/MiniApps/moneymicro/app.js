import * as sharedUI from "../../../shared/ui.js";
import { planScenario, formatCurrency } from "./logic.js";

const MIN_PLAN_DELAY = 360;
const FREE_SCENARIO_LIMIT = 2;
const timelineTags = [
  { key: "three", label: "3 mo" },
  { key: "six", label: "6 mo" },
  { key: "twelve", label: "12 mo" }
];

const state = {
  calcCount: 0,
  lastFormValues: null,
  lastScenario: null,
  isSubscribed: false
};

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("moneymicro-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI finance check</p>
    <h1>MoneyMicro</h1>
    <p class="tagline">See the monthly ripple before you tap buy.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Enter a purchase price to check its impact.</p>`;

  const upsell = buildUpsell();

  const form = buildForm(async (formValues) => {
    state.lastFormValues = formValues;
    await startCalculation(formValues, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startCalculation(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  const loadDelay = delay(MIN_PLAN_DELAY);

  try {
    const scenario = planScenario(formValues);
    await loadDelay;
    state.calcCount += 1;
    state.lastScenario = scenario;
    renderScenario(resultsSection, scenario, upsell);
    if (state.calcCount > FREE_SCENARIO_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("moneymicro:freeLimitHit", { detail: { calcCount: state.calcCount } }));
      showToast("Upgrade for unlimited saved scenarios & advisors.");
    }
  } catch (error) {
    console.error("MoneyMicro failed to calculate:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not crunch the numbers. Try again.");
    showToast("MoneyMicro hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "finance-form";
  form.innerHTML = `
    <label>
      <span>Purchase price</span>
      <input type="number" name="price" placeholder="$1,200" inputmode="decimal" min="0" />
    </label>
    <label>
      <span>Down payment</span>
      <input type="number" name="downPayment" placeholder="$200" inputmode="decimal" min="0" />
    </label>
    <label>
      <span>Financing</span>
      <select name="financing">
        <option value="cash" selected>Pay in full</option>
        <option value="six">6-month plan</option>
        <option value="twelve">12-month plan</option>
      </select>
    </label>
    <label>
      <span>Savings goal</span>
      <input type="range" name="goal" min="500" max="5000" step="250" value="2000" />
      <div class="range-labels">
        <span>$500</span>
        <span class="range-value" data-range="goal">$2,000</span>
        <span>$5,000</span>
      </div>
    </label>
    <div class="timeline-field">
      <span>Timeline</span>
      <div class="timeline-tags">
        ${timelineTags
          .map(
            ({ key, label }, index) =>
              `<button type="button" class="timeline-tag ${index === 1 ? "is-selected" : ""}" data-timeline="${key}">${label}</button>`
          )
          .join("")}
      </div>
    </div>
    <label>
      <span>Note (optional)</span>
      <input type="text" name="note" placeholder="Why you're considering it" autocomplete="off" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";

  const submit = createButton({ label: "Check Impact", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");

  form.append(helper, submit);

  const goalSlider = form.querySelector('input[name="goal"]');
  goalSlider.addEventListener("input", () => {
    const label = form.querySelector('.range-value[data-range="goal"]');
    if (label) label.textContent = formatCurrency(goalSlider.value);
  });

  form.querySelectorAll(".timeline-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".timeline-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const timeline = form.querySelector(".timeline-tag.is-selected")?.dataset.timeline || "six";
    const values = {
      price: formData.get("price"),
      downPayment: formData.get("downPayment"),
      financing: formData.get("financing"),
      goal: formData.get("goal"),
      timeline,
      note: formData.get("note")
    };

    if (!values.price || Number(values.price) <= 0) {
      setHelper("Add a price to check impact.");
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
    submit.textContent = isLoading ? "Crunching..." : "Check Impact";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Crunching the monthly ripple...</p>
    <div class="coin-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderScenario(container, scenario, upsell) {
  container.innerHTML = "";

  container.append(buildVerdictCard(scenario));
  container.append(buildTimelineCard(scenario.timelineRows));
  container.append(buildTipCard(scenario.tip));
  container.append(
    buildShareRow(scenario.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add purchase details first.");
        return;
      }
      startCalculation(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("moneymicro:regenerate", { detail: { calcCount: state.calcCount } }));
    })
  );

  if (state.calcCount >= 1) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("moneymicro:upsellViewed", { detail: { surface: "postScenario" } }));
  }
}

function buildVerdictCard(scenario) {
  const card = createCard("verdict-card");
  card.innerHTML = `
    <div class="verdict-chip status-${scenario.status.key}">${scenario.status.label}</div>
    <p class="verdict-summary">${scenario.summary}</p>
  `;
  return card;
}

function buildTimelineCard(rows) {
  const card = createCard("timeline-card");
  card.innerHTML = `
    <div class="timeline-header">
      <h3>Impact timeline</h3>
      <span>Goal vs after purchase</span>
    </div>
    <div class="timeline-rows">
      ${rows
        .map(
          (row) => `
            <div class="timeline-row">
              <div>
                <p class="timeline-label">${row.label}</p>
              </div>
              <div class="timeline-values">
                <span>${row.goal}</span>
                <span>${row.impact}</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  return card;
}

function buildTipCard(tip) {
  const card = createCard("tip-card");
  card.innerHTML = `
    <h3>Smart saver tip</h3>
    <p>${tip}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share this scenario";

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
    label: "Save & export (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("moneymicro:export", { detail: { scenario: state.lastScenario } }));
      showToast("Scenario exported!");
    } else {
      window.dispatchEvent(new CustomEvent("moneymicro:upsellViewed", { detail: { surface: "exportButton" } }));
      showToast("Upgrade for saved scenarios.");
    }
  });

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({ label: "Adjust & rerun", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  card.append(label, linkInput, shareActions, regenerate);
  return card;
}

function buildUpsell() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade for saved scenarios, advisor nudges, and export.";

  const button = createButton({ label: "Upgrade to MoneyMicro Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("moneymicro:upsellClicked"));
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
  button.classList.add("moneymicro-button", `variant-${variant}`);
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
  toast.className = "moneymicro-toast";
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
