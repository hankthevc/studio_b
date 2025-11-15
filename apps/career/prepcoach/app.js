import * as sharedUI from "../../../shared/ui.js";
import { generateMockRound } from "./logic.js";

const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null
};

const companyOptions = ["startup", "mid", "enterprise"];

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("prepcoach-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI interview coach</p>
    <h1>PrepCoach</h1>
    <p class="tagline">Mock rounds with prompts, notes, and follow-ups.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Select a role to run your mock round.</p>`;

  const upsell = buildUpsellBanner();
  const form = buildForm(async (values) => {
    state.lastFormValues = values;
    await startRound(values, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startRound(values, container, upsell) {
  showLoading(container);
  try {
    await wait(360);
    const plan = generateMockRound(values);
    state.planCount += 1;
    state.lastPlan = plan;
    renderRound(container, plan, upsell);
  } catch (error) {
    console.error("PrepCoach failed:", error);
    showError(container, "Could not run your mock round. Try again.");
    showToast("PrepCoach hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "prep-form";
  form.innerHTML = `
    <label>
      <span>Role focus</span>
      <select name="role">
        <option value="product">Product</option>
        <option value="sales">Sales</option>
        <option value="ops">Operations</option>
        <option value="engineering">Engineering</option>
      </select>
    </label>
    <label>
      <span>Seniority level</span>
      <input type="range" name="seniority" min="1" max="5" step="1" value="3" />
      <div class="range-labels">
        <span>IC</span>
        <span class="range-value">Level 3</span>
        <span>Exec</span>
      </div>
    </label>
    <div class="company-field">
      <span>Company focus</span>
      <div class="company-tags">
        ${companyOptions
          .map((company, index) => `<button type="button" class="company-tag ${index === 0 ? "is-selected" : ""}" data-company="${company}">${capitalize(company)}</button>`)
          .join("")}
      </div>
    </div>
    <label>
      <span>Superpower (optional)</span>
      <input type="text" name="strengths" placeholder="e.g., influence without authority" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";
  const submit = createButton({ label: "Run Mock Round", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");
  form.append(helper, submit);

  form.querySelectorAll(".company-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".company-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.querySelector('input[name="seniority"]').addEventListener("input", (event) => {
    form.querySelector(".range-value").textContent = `Level ${event.target.value}`;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const role = formData.get("role");
    if (!role) {
      showHelper("Select a role to run this mock round.");
      return;
    }
    showHelper("");
    const company = form.querySelector(".company-tag.is-selected")?.dataset.company || "startup";
    const values = {
      role,
      seniority: formData.get("seniority"),
      company,
      strengths: formData.get("strengths")
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
    submit.textContent = isLoading ? "Reviewing..." : "Run Mock Round";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Reviewing your resume...</p>
    <div class="resume-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderRound(container, plan, upsell) {
  container.innerHTML = "";
  container.append(buildHighlightCard(plan.highlight));
  plan.prompts.forEach((prompt) => container.append(buildPromptCard(prompt)));
  container.append(buildCoachNotes(plan.coachNotes));
  container.append(buildFollowUpCard(plan.followUp));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Set your mock details first.");
        return;
      }
      startRound(state.lastFormValues, container, upsell);
    })
  );
  if (state.planCount > 0) upsell.classList.remove("is-hidden");
}

function buildHighlightCard(text) {
  const card = createCard("highlight-card");
  card.innerHTML = `
    <div class="highlight-eyebrow">Round focus</div>
    <p class="highlight-copy">${text}</p>
  `;
  return card;
}

function buildPromptCard(prompt) {
  const card = createCard("prompt-card");
  card.innerHTML = `
    <div class="prompt-header">
      <h3>Prompt ${prompt.id}</h3>
      <div class="angle-chips">
        ${prompt.angles.map((angle) => `<span>${angle}</span>`).join("")}
      </div>
    </div>
    <p class="prompt-question">${prompt.question}</p>
  `;

  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.placeholder = prompt.responseHint;

  const actions = document.createElement("div");
  actions.className = "prompt-actions";

  const copyBtn = createButton({ label: "Copy answer", variant: "outline", type: "button" });
  copyBtn.addEventListener("click", () => copyText(textarea.value || prompt.responseHint));

  actions.append(copyBtn);
  card.append(textarea, actions);
  return card;
}

function buildCoachNotes(notes) {
  const card = createCard("notes-card");
  card.innerHTML = `<h3>Coach notes</h3>`;
  const list = document.createElement("ul");
  notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    list.append(li);
  });
  card.append(list);
  return card;
}

function buildFollowUpCard(followUp) {
  const card = createCard("followup-card");
  card.innerHTML = `
    <h3>Likely follow-up</h3>
    <p>${followUp}</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share with your mentor";

  const linkInput = document.createElement("input");
  linkInput.value = link;
  linkInput.readOnly = true;
  linkInput.className = "share-link";

  const copyButton = createButton({ label: "Copy link", variant: "outline", type: "button" });
  copyButton.addEventListener("click", () => copyText(link));

  const exportButton = createButton({ label: "Export to doc (Pro)", variant: "secondary", type: "button" });
  exportButton.addEventListener("click", () => showToast("Upgrade to export answers."));

  const regenerate = createButton({ label: "Run again", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  card.append(label, linkInput, shareActions, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade for full banks, saved answers, and recruiter-ready exports.";
  const button = createButton({ label: "Upgrade to PrepCoach Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => showToast("Billing flow coming soon."));
  card.append(copy, button);
  return card;
}

function copyText(text) {
  if (!text) {
    showToast("Draft something first.");
    return;
  }
  navigator.clipboard?.writeText(text).then(
    () => showToast("Answer copied!"),
    () => {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast("Answer copied!");
    }
  );
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
  button.classList.add("prepcoach-button", `variant-${variant}`);
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
  toast.className = "prepcoach-toast";
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
