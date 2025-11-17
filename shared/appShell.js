import { renderToast } from "./ui.js";

const MIN_PLAN_DELAY = 420;
const HOST_SUBSCRIPTION_EVENT = "MiniHostBridge:subscriptionUpdate";

export function initAppShell(root, config, generatePlan) {
  if (!root) return;
  const mergedConfig = {
    slug: "miniapp",
    hero: {},
    form: { fields: [] },
    placeholder: "Fill out the form to get started.",
    freePlanLimit: 1,
    analytics: {},
    share: { label: "Shareable link", cta: "Copy" },
    ...config
  };

  const state = {
    planCount: 0,
    lastValues: null,
    lastPlan: null,
    isSubscribed: false
  };
  const hostAdapter = createMiniHostAdapter(mergedConfig.slug);
  let awaitingHostConfirmation = false;

  const shell = document.createElement("div");
  shell.className = "app-shell";

  const inner = document.createElement("div");
  inner.className = "app-shell-inner";

  const hero = buildHero(mergedConfig.hero);
  const form = buildForm(mergedConfig.form, async (values) => {
    await handleSubmit(values);
  });
  const results = document.createElement("section");
  results.className = "results card";
  results.append(buildPlaceholder(mergedConfig.placeholder));

  const upsell = buildUpsell(mergedConfig.slug, mergedConfig.upsell, () => handleUpgradeClick("upsell"));
  if (upsell) {
    upsell.classList.add("is-hidden");
  }
  bootstrapHostSubscriptionState();

  inner.append(hero, form.element, results);
  if (upsell) {
    inner.append(upsell);
  }
  shell.append(inner);
  root.innerHTML = "";
  root.append(shell);

  async function handleSubmit(values) {
    state.lastValues = values;
    showLoading(results);
    const pending = delay(MIN_PLAN_DELAY);
    try {
      const plan = await generatePlan(values);
      await pending;
      state.planCount += 1;
      state.lastPlan = plan;
      renderPlan(results, plan, mergedConfig.share, {
        onCopy: () => dispatchAnalytics(`${mergedConfig.slug}:shareCopied`),
        onRegenerate: () => {
          if (state.lastValues) {
            handleSubmit(state.lastValues);
            dispatchAnalytics(`${mergedConfig.slug}:regenerate`);
          }
        }
      });
      if (upsell && state.planCount >= mergedConfig.freePlanLimit) {
        upsell.classList.remove("is-hidden");
        dispatchAnalytics(`${mergedConfig.slug}:upsellViewed`, { surface: "results" });
      }
      if (state.planCount > mergedConfig.freePlanLimit && !state.isSubscribed) {
        dispatchAnalytics(`${mergedConfig.slug}:freeLimitHit`, { count: state.planCount });
        renderToast("Upgrade to unlock unlimited plans.");
      }
    } catch (error) {
      console.error("Plan generation failed", error);
      await pending;
      showError(results, mergedConfig.errors?.generate || "We hit a snag. Try again.");
      renderToast("Plan failed. Try again.");
    }
  }

  async function handleUpgradeClick(surface = "upsell") {
    dispatchAnalytics(`${mergedConfig.slug}:upsellClicked`, { surface });
    if (!hostAdapter) {
      renderToast("Connect to a MiniHost-enabled container to upgrade.");
      return;
    }
    awaitingHostConfirmation = true;
    renderToast("Connecting to host checkout…");
    try {
      const active = await hostAdapter.requestSubscription({
        planCount: state.planCount,
        freePlanLimit: mergedConfig.freePlanLimit
      });
      if (active) {
        markSubscribed();
        renderToast("Subscription active. Enjoy unlimited plans.");
      } else {
        renderToast("Subscription pending confirmation.");
      }
    } catch (error) {
      console.error("MiniHost subscription failed", error);
      renderToast("Upgrade failed. Try again.");
    } finally {
      awaitingHostConfirmation = false;
    }
  }

  function markSubscribed() {
    state.isSubscribed = true;
    if (upsell) {
      upsell.classList.add("is-hidden");
    }
  }

  function bootstrapHostSubscriptionState() {
    if (!hostAdapter || typeof window === "undefined") {
      return;
    }
    hostAdapter.isSubscribed().then((active) => {
      if (active) {
        markSubscribed();
      }
    });
    window.addEventListener(HOST_SUBSCRIPTION_EVENT, handleHostSubscriptionEvent);
  }

  function handleHostSubscriptionEvent(event) {
    const detail = event?.detail || {};
    if (detail.slug && detail.slug !== mergedConfig.slug) {
      return;
    }
    if (typeof detail.isSubscribed === "boolean") {
      const wasSubscribed = state.isSubscribed;
      state.isSubscribed = detail.isSubscribed;
      if (state.isSubscribed) {
        if (upsell) {
          upsell.classList.add("is-hidden");
        }
        if (!wasSubscribed && !awaitingHostConfirmation) {
          renderToast("Subscription active. Enjoy unlimited plans.");
        }
      }
    }
  }
}

function buildHero(hero = {}) {
  const card = document.createElement("section");
  card.className = "hero card";

  if (hero.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = hero.eyebrow;
    card.append(eyebrow);
  }

  const title = document.createElement("h1");
  title.textContent = hero.title || "AI mini-app";
  card.append(title);

  if (hero.tagline) {
    const copy = document.createElement("p");
    copy.textContent = hero.tagline;
    card.append(copy);
  }

  return card;
}

function buildForm(form = {}, onSubmit) {
  const wrapper = document.createElement("section");
  wrapper.className = "card";
  const formEl = document.createElement("form");
  formEl.className = "app-form";

  const helper = document.createElement("p");
  helper.className = "form-helper";
  helper.textContent = form.helper || "";

  (form.fields || []).forEach((field) => {
    const fieldElement = createField(field);
    if (fieldElement) {
      formEl.append(fieldElement);
    }
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "btn-primary";
  submit.textContent = form.ctaLabel || "Generate plan";

  formEl.append(helper, submit);

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = collectFormValues(formEl, form.fields || []);
    if (!values.ok) {
      helper.textContent = values.message;
      helper.classList.add("is-visible");
      focusField(formEl, values.invalidField);
      return;
    }
    helper.textContent = "";
    submit.disabled = true;
    submit.textContent = form.loadingLabel || "Generating…";
    try {
      await onSubmit(values.data);
    } finally {
      submit.disabled = false;
      submit.textContent = form.ctaLabel || "Generate plan";
    }
  });

  wrapper.append(formEl);
  return { element: wrapper };
}

function createField(field) {
  const { type = "text", label, name, options = [], placeholder = "", helperText = "", required } = field;
  const wrapper = document.createElement("label");
  wrapper.dataset.field = name;

  if (label) {
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    wrapper.append(labelEl);
  }

  let input;
  if (type === "textarea") {
    input = document.createElement("textarea");
  } else if (type === "select") {
    input = document.createElement("select");
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.default) {
        option.selected = true;
      }
      input.append(option);
    });
  } else if (type === "chips") {
    const chipset = document.createElement("div");
    chipset.className = "chipset";
    options.forEach((opt, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = opt.label;
      if (opt.default || index === 0) {
        chip.classList.add("is-selected");
      }
      chip.dataset.value = opt.value;
      chip.addEventListener("click", () => {
        chipset.querySelectorAll(".chip").forEach((node) => node.classList.remove("is-selected"));
        chip.classList.add("is-selected");
      });
      chipset.append(chip);
    });
    chipset.dataset.field = name;
    wrapper.append(chipset);
  } else if (type === "range") {
    input = document.createElement("input");
    input.type = "range";
    if (field.min) input.min = field.min;
    if (field.max) input.max = field.max;
    if (field.step) input.step = field.step;
    input.value = field.default || field.min || 0;
  } else {
    input = document.createElement("input");
    input.type = field.inputType || type;
  }

  if (input) {
    input.name = name;
    input.placeholder = placeholder;
    if (required) {
      input.required = true;
    }
    wrapper.append(input);
  }

  if (helperText) {
    const helper = document.createElement("small");
    helper.textContent = helperText;
    wrapper.append(helper);
  }

  return wrapper;
}

function collectFormValues(formEl, fields) {
  const data = {};
  for (const field of fields) {
    const { name, required, type } = field;
    if (!name) continue;
    if (type === "chips") {
      const chipset = formEl.querySelector(`[data-field="${name}"] .chip.is-selected`);
      const value = chipset?.dataset.value;
      if (required && !value) {
        return { ok: false, invalidField: name, message: `Select ${field.label || "an option"}.` };
      }
      data[name] = value || "";
    } else {
      const input = formEl.querySelector(`[name="${name}"]`);
      const value = input?.value?.trim();
      if (required && !value) {
        return { ok: false, invalidField: name, message: `${field.label || "Field"} is required.` };
      }
      data[name] = value;
    }
  }
  return { ok: true, data };
}

function focusField(formEl, fieldName) {
  if (!fieldName) return;
  const target = formEl.querySelector(`[name="${fieldName}"]`) || formEl.querySelector(`[data-field="${fieldName}"] button`);
  if (target && typeof target.focus === "function") {
    target.focus();
  }
}

function buildPlaceholder(message) {
  const card = document.createElement("div");
  card.className = "placeholder";
  card.textContent = message || "Your plan will appear here.";
  return card;
}

function showLoading(results) {
  results.innerHTML = "";
  const card = document.createElement("article");
  card.className = "card";
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "<span></span><span></span><span></span>";
  const copy = document.createElement("p");
  copy.textContent = "Sketching your plan...";
  card.append(copy, loader);
  results.append(card);
}

function showError(results, message) {
  results.innerHTML = "";
  const card = document.createElement("article");
  card.className = "card";
  const text = document.createElement("p");
  text.textContent = message;
  card.append(text);
  results.append(card);
}

function renderPlan(container, plan, shareConfig, callbacks = {}) {
  container.innerHTML = "";
  const summaryCard = document.createElement("article");
  summaryCard.className = "card summary-card";
  const summaryTitle = document.createElement("h3");
  summaryTitle.textContent = plan.summary?.title || "Your plan";
  const summarySubtitle = document.createElement("p");
  summarySubtitle.textContent = plan.summary?.subtitle || "";
  summaryCard.append(summaryTitle, summarySubtitle);

  if (plan.summary?.metrics?.length) {
    const metrics = document.createElement("div");
    metrics.className = "metrics";
    plan.summary.metrics.forEach((metric) => {
      const metricCard = document.createElement("div");
      metricCard.className = "metric";
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = metric.label;
      const value = document.createElement("span");
      value.className = "value";
      value.textContent = metric.value;
      metricCard.append(label, value);
      if (metric.helper) {
        const helper = document.createElement("small");
      helper.textContent = metric.helper;
        metricCard.append(helper);
      }
      metrics.append(metricCard);
    });
    summaryCard.append(metrics);
  }

  container.append(summaryCard);

  (plan.sections || []).forEach((section) => {
    const sectionCard = document.createElement("article");
    sectionCard.className = "card section-card";
    const title = document.createElement("h3");
    title.textContent = section.title;
    const description = document.createElement("p");
    description.textContent = section.description;
    sectionCard.append(title, description);
    const list = document.createElement("ul");
    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    sectionCard.append(list);
    container.append(sectionCard);
  });

  if (plan.highlight) {
    const highlightCard = document.createElement("article");
    highlightCard.className = "card";
    if (plan.highlight.eyebrow) {
      const eyebrow = document.createElement("p");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = plan.highlight.eyebrow;
      highlightCard.append(eyebrow);
    }
    const copy = document.createElement("p");
    copy.textContent = plan.highlight.copy;
    highlightCard.append(copy);
    container.append(highlightCard);
  }

  if (plan.tips?.length) {
    const tipCard = document.createElement("article");
    tipCard.className = "card";
    const heading = document.createElement("h3");
    heading.textContent = "Tips";
    const list = document.createElement("ul");
    list.className = "tips-list";
    plan.tips.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      list.append(li);
    });
    tipCard.append(heading, list);
    container.append(tipCard);
  }

  container.append(buildShareRow(plan.share || shareConfig, callbacks));
}

function buildShareRow(share = {}, callbacks = {}) {
  const card = document.createElement("article");
  card.className = "card share-row";
  const label = document.createElement("p");
  label.className = "share-label";
  label.textContent = share.label || "Shareable link";

  const input = document.createElement("input");
  input.value = share.url || "https://miniapps.studio";
  input.readOnly = true;

  const actions = document.createElement("div");
  actions.className = "actions";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "btn-outline";
  copy.textContent = share.cta || "Copy link";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      renderToast("Link copied");
    } catch (error) {
      console.error("Copy failed", error);
      renderToast("Copy not supported");
    }
    if (typeof callbacks.onCopy === "function") {
      callbacks.onCopy();
    }
  });

  const regen = document.createElement("button");
  regen.type = "button";
  regen.className = "btn-outline";
  regen.textContent = "Regenerate";
  regen.addEventListener("click", () => {
    if (typeof callbacks.onRegenerate === "function") {
      callbacks.onRegenerate();
    }
  });

  actions.append(copy, regen);
  card.append(label, input, actions);
  return card;
}

function buildUpsell(slug, upsell = {}, onUpgrade) {
  if (!upsell || (!upsell.title && !upsell.copy)) {
    return null;
  }
  const card = document.createElement("article");
  card.className = "upsell";
  const title = document.createElement("h3");
  title.textContent = upsell.title || "Upgrade to Pro";
  card.append(title);
  if (upsell.copy) {
    const body = document.createElement("p");
    body.textContent = upsell.copy;
    card.append(body);
  }
  if (Array.isArray(upsell.bullets) && upsell.bullets.length > 0) {
    const list = document.createElement("ul");
    upsell.bullets.forEach((bullet) => {
      const li = document.createElement("li");
      li.textContent = bullet;
      list.append(li);
    });
    card.append(list);
  }
  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "btn-primary";
  cta.textContent = upsell.ctaLabel || "Upgrade";
  cta.addEventListener("click", () => {
    if (typeof onUpgrade === "function") {
      onUpgrade();
      return;
    }
    renderToast("Billing flow coming soon.");
    if (slug) {
      dispatchAnalytics(`${slug}:upsellClicked`);
    }
  });
  card.append(cta);
  return card;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dispatchAnalytics(eventName, detail = {}) {
  if (!eventName) return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
  if (window.MiniHost && typeof window.MiniHost.track === "function") {
    try {
      window.MiniHost.track(eventName, detail);
    } catch (error) {
      console.warn("MiniHost track failed", error);
    }
  }
}

function createMiniHostAdapter(slug) {
  if (typeof window === "undefined" || !window.MiniHost) {
    return null;
  }
  return {
    async requestSubscription(metadata = {}) {
      if (typeof window.MiniHost.requestSubscription !== "function") {
        return false;
      }
      const result = await window.MiniHost.requestSubscription(slug, metadata);
      return interpretSubscriptionResult(result);
    },
    async isSubscribed() {
      if (typeof window.MiniHost.isSubscribed !== "function") {
        return false;
      }
      try {
        const response = await window.MiniHost.isSubscribed(slug);
        return interpretSubscriptionResult(response);
      } catch (error) {
        console.warn("MiniHost isSubscribed failed", error);
        return false;
      }
    },
    async getAgeRange() {
      if (typeof window.MiniHost.getAgeRange === "function") {
        try {
          const response = await window.MiniHost.getAgeRange(slug);
          return normalizeAgeRange(response);
        } catch (error) {
          console.warn("MiniHost getAgeRange failed", error);
          return null;
        }
      }
      if (typeof window.MiniHost.getAgeCategory === "function") {
        try {
          const response = await window.MiniHost.getAgeCategory(slug);
          return legacyCategoryToRange(response?.category);
        } catch (error) {
          console.warn("MiniHost getAgeCategory failed", error);
          return null;
        }
      }
      return null;
    }
  };
}

function interpretSubscriptionResult(result) {
  if (typeof result === "boolean") {
    return result;
  }
  if (result && typeof result === "object") {
    if (typeof result.isSubscribed === "boolean") {
      return result.isSubscribed;
    }
    if (typeof result.status === "string") {
      return ["active", "subscribed", "purchased"].includes(result.status);
    }
  }
  return false;
}

function normalizeAgeRange(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const min = typeof value.min === "number" ? value.min : null;
  const max = typeof value.max === "number" ? value.max : null;
  if (min === null) {
    return null;
  }
  return { min, max };
}

function legacyCategoryToRange(category) {
  switch (category) {
    case "kids":
      return { min: 4, max: 12 };
    case "teen":
      return { min: 13, max: 17 };
    case "general":
      return { min: 18, max: 20 };
    case "mature":
      return { min: 21, max: null };
    default:
      return null;
  }
}
