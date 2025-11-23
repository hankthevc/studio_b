import * as sharedUI from "../../../shared/ui.js";
import { planProgram, formatMinutes } from "./logic.js";

const MIN_PLAN_DELAY = 420;
const FREE_PLAN_LIMIT = 1;
const equipmentOptions = ["bodyweight", "dumbbells", "barbell", "kettlebells", "cables", "bands"];

const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null,
  isSubscribed: false
};

export async function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("liftshift-app");

  // Check subscription status
  try {
    const isSubscribed = await window.MiniHost.isSubscribed("liftshift");
    state.isSubscribed = isSubscribed;
  } catch (err) {
    console.warn("Failed to check subscription:", err);
  }

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI strength coach</p>
    <h1>LiftShift</h1>
    <p class="tagline">Adaptive strength blocks in under a minute.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Dial in your focus to build the block.</p>`;

  const upsell = buildUpsellBanner();

  const form = buildForm(async (formValues) => {
    state.lastFormValues = formValues;
    await startPlanning(formValues, resultsSection, upsell);
  });

  const markSubscribed = () => {
    state.isSubscribed = true;
    upsell.classList.add("is-hidden");
    if (state.lastPlan) {
      renderProgram(resultsSection, state.lastPlan, upsell);
    }
  };

  window.addEventListener("MiniHostBridge:subscriptionUpdate", (event) => {
    const slug = event?.detail?.slug;
    if (!slug || slug === "liftshift") {
      markSubscribed();
    }
  });

  container.append(hero, form, resultsSection, upsell);
  container.addEventListener("subscription:activated", markSubscribed);
}

async function startPlanning(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  const loadDelay = delay(MIN_PLAN_DELAY);

  try {
    const program = await planProgram(formValues);
    await loadDelay;
    state.planCount += 1;
    state.lastPlan = program;
    renderProgram(resultsSection, program, upsell);
    if (state.planCount > FREE_PLAN_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("liftshift:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for full cycles & exports.");
    }
  } catch (error) {
    console.error("LiftShift failed to build program:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not build your block. Try again shortly.");
    showToast("LiftShift hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "program-form";
  form.innerHTML = `
    <label>
      <span>Focus</span>
      <select name="focus">
        <option value="strength" selected>Strength</option>
        <option value="hypertrophy">Hypertrophy</option>
        <option value="conditioning">Conditioning</option>
      </select>
    </label>
    <div class="equipment-field" aria-label="Equipment on hand">
      <span>Equipment</span>
      <div class="equipment-tags">
        ${equipmentOptions
      .map(
        (eq, index) =>
          `<button type="button" class="equipment-tag ${index === 0 ? "is-selected" : ""}" data-equipment="${eq}">${eq.replace(/^\w/, (c) =>
            c.toUpperCase()
          )}</button>`
      )
      .join("")}
      </div>
    </div>
    <label>
      <span>Days / week</span>
      <input type="range" name="daysPerWeek" min="3" max="4" step="1" value="4" />
      <div class="range-labels">
        <span>3</span>
        <span class="range-value" data-range="days">4 days</span>
      </div>
    </label>
    <label>
      <span>Session length</span>
      <input type="range" name="sessionMinutes" min="30" max="75" step="5" value="45" />
      <div class="range-labels">
        <span>30 min</span>
        <span class="range-value" data-range="session">45 min</span>
      </div>
    </label>
    <label>
      <span>Notes (optional)</span>
      <input type="text" name="note" placeholder="e.g., focus on deadlift drive" autocomplete="off" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";

  const submit = createButton({ label: "Build My Block", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");

  form.append(helper, submit);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const equipment = Array.from(form.querySelectorAll(".equipment-tag.is-selected")).map((btn) => btn.dataset.equipment);
    const values = {
      focus: formData.get("focus"),
      equipment,
      daysPerWeek: formData.get("daysPerWeek"),
      sessionMinutes: formData.get("sessionMinutes"),
      note: formData.get("note")
    };

    if (!values.focus) {
      setHelper("Select a focus to build your block.");
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

  form.querySelectorAll(".equipment-tag").forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
      tagBtn.classList.toggle("is-selected");
      if (!form.querySelector(".equipment-tag.is-selected")) {
        tagBtn.classList.add("is-selected");
      }
    });
  });

  form.querySelectorAll('input[type="range"]').forEach((range) => {
    range.addEventListener("input", () => {
      const label = form.querySelector(`.range-value[data-range="${range.name === "daysPerWeek" ? "days" : "session"}"]`);
      if (!label) return;
      if (range.name === "daysPerWeek") {
        label.textContent = `${range.value} day${Number(range.value) > 1 ? "s" : ""}`;
      } else {
        label.textContent = `${range.value} min`;
      }
    });
  });

  function setHelper(message) {
    helper.textContent = message;
    helper.classList.toggle("is-visible", Boolean(message));
  }

  function toggleSubmit(isLoading) {
    submit.disabled = isLoading;
    submit.textContent = isLoading ? "Building..." : "Build My Block";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Racking plates for your next progression...</p>
    <div class="plate-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderProgram(container, program, upsell) {
  container.innerHTML = "";

  const highlightCard = createCard("highlight-card");
  highlightCard.innerHTML = `
    <div class="highlight-eyebrow">Cycle focus</div>
    <h2>${program.programName}</h2>
    <p class="highlight-copy">${program.summary}</p>
    <div class="highlight-meta">
      <span>${program.days.length} day block</span>
      <span>${formatMinutes(program.sessionMinutes)} avg</span>
    </div>
  `;
  container.append(highlightCard);

  program.days.forEach((day) => {
    const dayCard = createCard("day-card");
    dayCard.innerHTML = `
      <div class="day-header">
        <div>
          <h3>Day ${day.day}</h3>
          <p class="day-title">${day.title}</p>
        </div>
        <span class="minutes-chip">${formatMinutes(day.estMinutes)}</span>
      </div>
      <div class="segments">
        ${day.segments
        .map(
          (segment) => `
              <div class="segment">
                <p class="segment-label">${segment.label}</p>
                <ul>
                  ${segment.movements.map((move) => `<li>${move}</li>`).join("")}
                </ul>
              </div>
            `
        )
        .join("")}
      </div>
    `;
    container.append(dayCard);
  });

  container.append(buildRecoveryCard(program.recovery));
  container.append(
    buildShareRow(program.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Set your focus first.");
        return;
      }
      startPlanning(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("liftshift:regenerate", { detail: { planCount: state.planCount } }));
    })
  );

  if (state.planCount >= 1 && !state.isSubscribed) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("liftshift:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildRecoveryCard(recovery) {
  const card = createCard("recovery-card");
  card.innerHTML = `
    <div class="recovery-header">
      <h3>Recovery cues</h3>
      <span>${recovery.cues.length} tips</span>
    </div>
    <ul class="recovery-list">
      ${recovery.cues.map((cue) => `<li>${cue}</li>`).join("")}
    </ul>
    <p class="deload">${recovery.deload}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share with your crew";

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
    label: "Export & track (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("liftshift:export", { detail: { plan: state.lastPlan } }));
      showToast("Export ready!");
    } else {
      window.dispatchEvent(new CustomEvent("liftshift:upsellViewed", { detail: { surface: "exportButton" } }));
      showToast("Upgrade to export and track.");
    }
  });

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({ label: "Regenerate block", variant: "outline", type: "button" });
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
  copy.innerHTML = "Upgrade for 8-week cycles, progression tracking, and exports.";

  const button = createButton({ label: "Upgrade to LiftShift Pro", variant: "primary", type: "button" });
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Connecting...";
    try {
      const result = await window.MiniHost.requestSubscription("liftshift");
      if (result.status === "active") {
        state.isSubscribed = true;
        card.classList.add("is-hidden");
        showToast("Welcome to LiftShift Pro!");
        const resultsSection = document.querySelector(".results");
        if (resultsSection && state.lastPlan) {
          renderProgram(resultsSection, state.lastPlan, card);
        }
        container.dispatchEvent(new Event("subscription:activated"));
      } else {
        showToast("Subscription cancelled.");
      }
    } catch (error) {
      console.error(error);
      showToast("Purchase failed. Try again.");
    } finally {
      button.disabled = false;
      button.textContent = "Upgrade to LiftShift Pro";
    }
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
  button.classList.add("liftshift-button", `variant-${variant}`);
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
  toast.className = "liftshift-toast";
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
