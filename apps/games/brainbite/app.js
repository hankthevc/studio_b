import * as sharedUI from "../../../shared/ui.js";
import { planPuzzle } from "./logic.js";

const MIN_PLAN_DELAY = 320;
const difficultyOptions = [
  { key: "chill", label: "Chill" },
  { key: "tricky", label: "Tricky" },
  { key: "spicy", label: "Spicy" }
];

const state = {
  puzzleCount: 0,
  lastFormValues: null,
  lastPuzzle: null
};

export function initMiniApp(container) {
  container.innerHTML = "";
  container.classList.add("brainbite-app");

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <p class="eyebrow">Daily brain snack</p>
    <h1>BrainBite</h1>
    <p class="tagline">One 60-second puzzle tailored to your vibe.</p>
  `;

  const resultsSection = document.createElement("section");
  resultsSection.className = "results";
  resultsSection.innerHTML = `<p class="placeholder">Pick a category to serve your bite.</p>`;

  const upsell = buildUpsell();

  const form = buildForm(async (formValues) => {
    state.lastFormValues = formValues;
    await startPuzzle(formValues, resultsSection, upsell);
  });

  container.append(hero, form, resultsSection, upsell);
}

async function startPuzzle(formValues, resultsSection, upsell) {
  showLoading(resultsSection);
  const loadDelay = delay(MIN_PLAN_DELAY);

  try {
    const puzzle = planPuzzle(formValues);
    await loadDelay;
    state.puzzleCount += 1;
    state.lastPuzzle = puzzle;
    renderPuzzle(resultsSection, puzzle, upsell);
  } catch (error) {
    console.error("BrainBite failed to load puzzle:", error);
    await loadDelay;
    showErrorState(resultsSection, "Could not mix your bite. Try again.");
    showToast("BrainBite hit a snag. Try again.");
  }
}

function buildForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "puzzle-form";
  form.innerHTML = `
    <label>
      <span>Category</span>
      <select name="category">
        <option value="logic" selected>Logic</option>
        <option value="trivia">Trivia</option>
        <option value="pattern">Pattern</option>
        <option value="wordplay">Wordplay</option>
      </select>
    </label>
    <div class="difficulty-field">
      <span>Difficulty</span>
      <div class="difficulty-tags">
        ${difficultyOptions
          .map(
            ({ key, label }, index) =>
              `<button type="button" class="difficulty-tag ${index === 0 ? "is-selected" : ""}" data-difficulty="${key}">${label}</button>`
          )
          .join("")}
      </div>
    </div>
    <div class="type-field">
      <span>Puzzle type</span>
      <div class="type-toggle">
        <button type="button" class="type-btn is-selected" data-type="choice">Multiple choice</button>
        <button type="button" class="type-btn" data-type="free">Free answer</button>
      </div>
    </div>
  `;

  const helper = document.createElement("p");
  helper.className = "form-helper";

  const submit = createButton({ label: "Serve My Bite", variant: "primary", type: "submit" });
  submit.classList.add("primary-action");

  form.append(helper, submit);

  form.querySelectorAll(".difficulty-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      form.querySelectorAll(".difficulty-tag").forEach((btn) => btn.classList.remove("is-selected"));
      tag.classList.add("is-selected");
    });
  });

  form.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      form.querySelectorAll(".type-btn").forEach((node) => node.classList.remove("is-selected"));
      btn.classList.add("is-selected");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const difficulty = form.querySelector(".difficulty-tag.is-selected")?.dataset.difficulty || "chill";
    const puzzleType = form.querySelector(".type-btn.is-selected")?.dataset.type || "choice";
    const values = {
      category: formData.get("category"),
      difficulty,
      puzzleType
    };

    if (!values.category) {
      setHelper("Pick a category for your bite.");
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
    submit.textContent = isLoading ? "Mixing..." : "Serve My Bite";
  }

  return form;
}

function showLoading(container) {
  container.innerHTML = "";
  const card = createCard("loading-card");
  card.innerHTML = `
    <p class="loading-text">Mixing your next brain bite...</p>
    <div class="bite-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  `;
  container.append(card);
}

function renderPuzzle(container, puzzle, upsell) {
  container.innerHTML = "";

  container.append(buildPuzzleCard(puzzle));
  container.append(buildStreakCard(puzzle.streak));
  container.append(
    buildShareRow(puzzle.shareLink, () => {
      if (!state.lastFormValues) {
        showToast("Pick a category first.");
        return;
      }
      startPuzzle(state.lastFormValues, container, upsell);
    })
  );

  if (state.puzzleCount >= 1) {
    upsell.classList.remove("is-hidden");
  }
}

function buildPuzzleCard(puzzle) {
  const card = createCard("puzzle-card");
  const status = document.createElement("p");
  status.className = "puzzle-status";
  const hint = document.createElement("p");
  hint.className = "puzzle-hint";

  let answered = false;
  let selectedChoice = "";

  const prompt = document.createElement("p");
  prompt.className = "puzzle-prompt";
  prompt.textContent = puzzle.prompt;

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "puzzle-input";

  let answerInput = null;
  if (puzzle.type === "choice" && Array.isArray(puzzle.choices)) {
    const list = document.createElement("div");
    list.className = "choice-list";
    puzzle.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (answered) return;
        list.querySelectorAll("button").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedChoice = choice;
      });
      list.append(btn);
    });
    inputWrapper.append(list);
  } else {
    answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.placeholder = "Type your answer";
    answerInput.autocomplete = "off";
    inputWrapper.append(answerInput);
  }

  const actions = document.createElement("div");
  actions.className = "puzzle-actions";

  const hintButton = createButton({ label: "Hint", variant: "outline", type: "button" });
  hintButton.addEventListener("click", () => {
    hint.textContent = puzzle.hint;
    hint.classList.add("is-visible");
  });

  const revealButton = createButton({ label: "Reveal answer", variant: "outline", type: "button" });
  revealButton.addEventListener("click", () => {
    answered = true;
    status.textContent = `Answer: ${puzzle.answer}`;
    status.className = "puzzle-status is-revealed";
    disableInputs();
  });

  const submitButton = createButton({ label: "Check answer", variant: "primary", type: "button" });
  submitButton.addEventListener("click", () => {
    if (answered) return;
    const guess = puzzle.type === "choice" ? selectedChoice : (answerInput?.value || "").trim();
    if (!guess) {
      showToast("Add an answer first.");
      return;
    }
    if (sanitize(guess) === sanitize(puzzle.answer)) {
      status.textContent = "Correct! Streak protected.";
      status.className = "puzzle-status is-correct";
      answered = true;
      disableInputs();
      showToast("Nice! +1 streak.");
    } else {
      status.textContent = "Try again or tap Hint.";
      status.className = "puzzle-status is-incorrect";
    }
  });

  actions.append(hintButton, revealButton, submitButton);

  card.append(prompt, inputWrapper, hint, status, actions);
  return card;

  function disableInputs() {
    submitButton.disabled = true;
    hintButton.disabled = true;
    revealButton.disabled = true;
    if (answerInput) {
      answerInput.disabled = true;
    }
    inputWrapper.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  }
}

function buildStreakCard(streak) {
  const card = createCard("streak-card");
  card.innerHTML = `
    <div class="streak-header">
      <h3>Streak status</h3>
      <span>${streak.status}</span>
    </div>
    <p class="streak-count">${streak.count} days in a row</p>
  `;
  return card;
}

function buildShareRow(link, onRegenerate) {
  const card = createCard("share-card");
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = "Share your brag";

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

  const exportButton = createButton({ label: "Unlock archives (Pro)", variant: "secondary", type: "button" });
  exportButton.addEventListener("click", () => showToast("Upgrade for archives + shields."));

  const shareActions = document.createElement("div");
  shareActions.className = "share-actions";
  shareActions.append(copyButton, exportButton);

  const regenerate = createButton({ label: "New bite", variant: "outline", type: "button" });
  regenerate.addEventListener("click", () => onRegenerate?.());

  card.append(label, linkInput, shareActions, regenerate);
  return card;
}

function buildUpsell() {
  const card = createCard("upsell-card is-hidden");
  const copy = document.createElement("p");
  copy.textContent = "Unlock archives, streak shields, and custom categories with BrainBite Pro.";

  const button = createButton({ label: "Upgrade to Pro", variant: "primary", type: "button" });
  button.addEventListener("click", () => showToast("Billing flow coming soon."));

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
  button.classList.add("brainbite-button", `variant-${variant}`);
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
  toast.className = "brainbite-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => toast.remove(), 2600);
}

function sanitize(text = "") {
  return text.toString().trim().toLowerCase();
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
