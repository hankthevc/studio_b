import * as sharedUI from "../../../shared/ui.js";
import { generateHookSet } from "./logic.js";

const FREE_VARIANT_LIMIT = 3;
const state = {
  planCount: 0,
  lastPlan: null,
  lastFormValues: null,
  isSubscribed: false
};

const vibeOptions = [
  { key: "bold", label: "Bold" },
  { key: "insightful", label: "Insightful" },
  { key: "fun", label: "Fun" }
];

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("hooklab-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI hook lab</p>
    <h1>HookLab</h1>
    <p class="tagline">A/B hooks and thumbnail copy in one tap.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Describe your video idea to generate hooks.</p>`;

  const upsell = buildUpsellBanner();
  const form = buildForm(async (values) => {
    state.lastFormValues = values;
    await runGeneration(values, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function runGeneration(values, container, upsell) {
  showLoading(container);
  try {
    await wait(320);
    const plan = generateHookSet(values);
    state.planCount += 1;
    state.lastPlan = plan;
    renderPlan(container, plan, upsell);
    if (state.planCount > FREE_VARIANT_LIMIT && !state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("hooklab:freeLimitHit", { detail: { planCount: state.planCount } }));
      showToast("Upgrade for unlimited variants & templates.");
    }
  } catch (error) {
    console.error("HookLab failed:", error);
    showError(container, "Could not cook your hook set. Try again.");
    showToast("HookLab hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "hook-form";
  form.innerHTML = `
    <label>
      <span>Video idea</span>
      <textarea name="idea" rows="3" placeholder="e.g., I automated my editing workflow"></textarea>
    </label>
    <label>
      <span>Platform</span>
      <select name="platform">
        <option value="youtube" selected>YouTube</option>
        <option value="tiktok">TikTok</option>
        <option value="shorts">Shorts</option>
      </select>
    </label>
    <div class="vibe-field">
      <span>Vibe</span>
      <div class="vibe-tags">
        ${vibeOptions
          .map((vibe, index) => `<button type="button" class="vibe-tag ${index === 0 ? "is-selected" : ""}" data-vibe="${vibe.key}">${vibe.label}</button>`)
          .join("")}
      </div>
    </div>
    <label>
      <span>Thumbnail keyword</span>
      <input type="text" name="keyword" placeholder="e.g., 10x faster" />
    </label>
    <label>
      <span>Timeframe (optional)</span>
      <input type="text" name="timeframe" placeholder="e.g., 30-day" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";
  const submit = createButton({ label: "Generate Hook Set", variant: "primary", type: "submit" });
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
    const idea = (formData.get("idea") || "").toString().trim();
    if (!idea) {
      showHelper("Describe your video idea to generate hooks.");
      return;
    }
    showHelper("");
    const vibe = form.querySelector(".vibe-tag.is-selected")?.dataset.vibe || "bold";
    const values = {
      idea,
      platform: formData.get("platform"),
      vibe,
      keyword: formData.get("keyword"),
      timeframe: formData.get("timeframe")
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
    submit.textContent = isLoading ? "Mixing..." : "Generate Hook Set";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Cooking your A/B hooks...</p>
    <div class="hook-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPlan(container, plan, upsell) {
  container.innerHTML = "";
  container.append(buildHighlightCard(plan.recommended));
  container.append(buildVariantCard(plan.recommended, "A"));
  container.append(buildVariantCard(plan.alternate, "B"));
  container.append(buildThumbnailCard(plan.thumbnail));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add an idea first.");
        return;
      }
      runGeneration(state.lastFormValues, container, upsell);
      window.dispatchEvent(new CustomEvent("hooklab:regenerate", { detail: { planCount: state.planCount } }));
    })
  );
  if (state.planCount > 0) {
    upsell.classList.remove("is-hidden");
    window.dispatchEvent(new CustomEvent("hooklab:upsellViewed", { detail: { surface: "postPlan" } }));
  }
}

function buildHighlightCard(variant) {
  const card = createCard("highlight-card");
  card.innerHTML = `
    <div class="highlight-eyebrow">Recommended variant</div>
    <p class="highlight-copy">${variant.copy}</p>
    <p class="highlight-meta">${variant.tone} · ${variant.metric}</p>
  `;
  const savePreset = createButton({
    label: "Save preset (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  savePreset.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("hooklab:savePreset", { detail: { variant } }));
      showToast("Preset saved.");
    } else {
      window.dispatchEvent(new CustomEvent("hooklab:upsellViewed", { detail: { surface: "highlightPreset" } }));
      showToast("Upgrade to save presets.");
    }
  });
  card.append(savePreset);
  return card;
}

function buildVariantCard(variant, label) {
  const card = createCard("variant-card");
  card.innerHTML = `
    <div class="variant-header">
      <h3>Hook ${label}</h3>
      <span>${variant.metric}</span>
    </div>
    <p class="variant-copy">${variant.copy}</p>
    <p class="variant-tone">${variant.tone}</p>
  `;
  const copyBtn = createButton({ label: "Copy hook", variant: "outline", type: "button" });
  copyBtn.addEventListener("click", () => copyText(variant.copy, "Hook copied!"));
  card.append(copyBtn);
  return card;
}

function buildThumbnailCard(text) {
  const card = createCard("thumbnail-card");
  card.innerHTML = `
    <div class="thumbnail-header">
      <h3>Thumbnail text</h3>
      <span>${text.length} chars</span>
    </div>
    <p>${text}</p>
  `;
  const copyBtn = createButton({ label: "Copy thumbnail", variant: "secondary", type: "button" });
  copyBtn.addEventListener("click", () => copyText(text, "Thumbnail copied!"));
  card.append(copyBtn);
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share with your editor";

  const linkInput = document.createElement("input");
  linkInput.value = link;
  linkInput.readOnly = true;
  linkInput.className = "share-link";

  const copyButton = createButton({ label: "Copy link", variant: "outline", type: "button" });
  copyButton.addEventListener("click", () => copyText(link, "Link copied!"));

  const exportButton = createButton({
    label: "Export hooks (Pro)",
    variant: "secondary",
    type: "button",
    disabled: !state.isSubscribed
  });
  exportButton.addEventListener("click", () => {
    if (state.isSubscribed) {
      window.dispatchEvent(new CustomEvent("hooklab:export", { detail: { plan: state.lastPlan } }));
      showToast("Export ready!");
    } else {
      window.dispatchEvent(new CustomEvent("hooklab:upsellViewed", { detail: { surface: "exportButton" } }));
      showToast("Upgrade to export variants.");
    }
  });

  const regenerate = createButton({ label: "Regenerate vibe", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => {
    onRegenerate?.();
  });

  const actions = document.createElement("div");
  actions.className = "share-actions";
  actions.append(copyButton, exportButton);

  card.append(label, linkInput, actions, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  card.innerHTML = `
    <p>Upgrade to HookLab Pro for unlimited variants, saved templates, and collaboration links.</p>
  `;
  const button = createButton({ label: "Upgrade for unlimited hooks", variant: "primary", type: "button" });
  button.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("hooklab:upsellClicked"));
    showToast("Billing flow coming soon.");
  });
  card.append(button);
  return card;
}

function copyText(text, message) {
  if (!text) {
    showToast("Add content first.");
    return;
  }
  navigator.clipboard?.writeText(text).then(
    () => showToast(message),
    () => {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast(message);
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
  button.classList.add("hooklab-button", `variant-${variant}`);
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
  toast.className = "hooklab-toast";
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
