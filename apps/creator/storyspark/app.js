import * as sharedUI from "../../../shared/ui.js";
import { generateStorySpark } from "./logic.js";

const state = {
  lastPlan: null,
  planCount: 0,
  lastFormValues: null
};

const toneOptions = [
  { key: "playful", label: "Playful" },
  { key: "bold", label: "Bold" },
  { key: "warm", label: "Warm" }
];

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("storyspark-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">AI content studio</p>
    <h1>StorySpark</h1>
    <p class="tagline">Hooks, captions, hashtags—ready in seconds.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Drop an idea or headline to get sparks.</p>`;

  const upsell = buildUpsellBanner();
  const form = buildForm(async (values) => {
    state.lastFormValues = values;
    await startGenerating(values, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startGenerating(values, resultsSection, upsell) {
  showLoading(resultsSection);
  try {
    await wait(320);
    const plan = generateStorySpark(values);
    state.planCount += 1;
    state.lastPlan = plan;
    renderPlan(resultsSection, plan, upsell);
  } catch (error) {
    console.error("StorySpark failed:", error);
    showError(resultsSection, "Could not spark your hooks. Try again.");
    showToast("StorySpark hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "spark-form";
  form.innerHTML = `
    <label>
      <span>Idea or draft</span>
      <textarea name="idea" rows="4" placeholder="e.g., How I automate my freelance intake" ></textarea>
    </label>
    <label>
      <span>Platform</span>
      <select name="platform">
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="twitter">Twitter</option>
      </select>
    </label>
    <div class="tone-field">
      <span>Tone</span>
      <div class="tone-tags">
        ${toneOptions
          .map(
            (tone, index) =>
              `<button type="button" class="tone-tag ${index === 0 ? "is-selected" : ""}" data-tone="${tone.key}">${tone.label}</button>`
          )
          .join("")}
      </div>
    </div>
    <label>
      <span>Call-to-action (optional)</span>
      <input type="text" name="cta" placeholder="e.g., DM me 'audit' for the template" />
    </label>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";
  const submit = createButton({ label: "Spark My Hooks", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");
  form.append(helper, submit);

  form.querySelectorAll(".tone-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".tone-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const idea = (formData.get("idea") || "").toString().trim();
    if (!idea) {
      showHelper("Drop an idea or headline to get sparks.");
      return;
    }
    showHelper("");
    const tone = form.querySelector(".tone-tag.is-selected")?.dataset.tone || "playful";
    const values = {
      idea,
      platform: formData.get("platform"),
      tone,
      cta: formData.get("cta")
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
    submit.textContent = isLoading ? "Sparking..." : "Spark My Hooks";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Polishing your perfect hook...</p>
    <div class="spark-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPlan(container, plan, upsell) {
  container.innerHTML = "";
  container.append(buildHighlightCard(plan.highlightHook, plan.platform));
  container.append(buildHookList(plan.alternateHooks));
  container.append(buildCaptionCard(plan.caption));
  container.append(buildHashtags(plan.hashtags));
  container.append(
    buildShareRow(plan.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Add an idea first.");
        return;
      }
      startGenerating(state.lastFormValues, container, upsell);
    })
  );
  if (state.planCount > 0) upsell.classList.remove("is-hidden");
}

function buildHighlightCard(hook, platform) {
  const card = createCard("highlight-card");
  card.innerHTML = `
    <div class="highlight-eyebrow">Top hook — ${platform}</div>
    <p class="highlight-copy">${hook}</p>
  `;
  return card;
}

function buildHookList(hooks) {
  const card = createCard("hook-card");
  card.innerHTML = `<h3>Hook alternates</h3>`;
  const list = document.createElement("div");
  list.className = "hook-list";
  hooks.forEach((hook) => {
    const row = document.createElement("div");
    row.className = "hook-row";
    row.innerHTML = `<p>${hook}</p>`;
    const copyBtn = createButton({ label: "Copy", variant: "outline", type: "button" });
    copyBtn.addEventListener("click", () => copyText(hook));
    row.append(copyBtn);
    list.append(row);
  });
  card.append(list);
  return card;
}

function buildCaptionCard(caption) {
  const card = createCard("caption-card");
  const copyBtn = createButton({ label: "Copy caption", variant: "secondary", type: "button" });
  copyBtn.addEventListener("click", () => copyText(caption));
  card.innerHTML = `<h3>Caption</h3><p>${caption}</p>`;
  card.append(copyBtn);
  return card;
}

function buildHashtags(tags) {
  const card = createCard("hashtag-card");
  card.innerHTML = `<h3>Hashtag picks</h3>`;
  const chips = document.createElement("div");
  chips.className = "hashtag-chips";
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    chips.append(span);
  });
  card.append(chips);
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
  copyButton.addEventListener("click", () => copyText(link));

  const regenerate = createButton({ label: "Tweak & regenerate", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  card.append(label, linkInput, copyButton, regenerate);
  return card;
}

function buildUpsellBanner() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Upgrade to StorySpark Pro to unlock unlimited sparks, saved presets, and team sharing.";
  const button = createButton({ label: "Upgrade for unlimited sparks", variant: "primary", type: "button" });
  button.addEventListener("click", () => showToast("Billing flow coming soon."));
  card.append(copy, button);
  return card;
}

function copyText(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text).then(
    () => showToast("Hook copied!"),
    () => {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast("Hook copied!");
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
  button.classList.add("storyspark-button", `variant-${variant}`);
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
  toast.className = "storyspark-toast";
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
