import { buildShareLink, hashString, pick, cycle, clamp, formatCurrency, formatMinutes } from "./deterministic.js";

const TEMPLATE_PATTERN = /{{\s*([a-zA-Z0-9._-]+)\s*}}/g;

export function buildPlan(planConfig, rawValues = {}) {
  if (!planConfig) {
    throw new Error("planConfig is required");
  }

  const normalized = normalizeValues(planConfig.fields || [], rawValues);
  const context = {
    values: normalized.values,
    labels: normalized.labels,
    seed: normalized.seed,
    utils: { pick, cycle, clamp, formatCurrency, formatMinutes }
  };
  context.derived = typeof planConfig.derive === "function" ? planConfig.derive(context) || {} : {};

  return {
    summary: buildSummary(planConfig.summary, context),
    sections: (planConfig.sections || []).map((section, index) => buildSection(section, index, context)),
    tips: buildTips(planConfig.tips, context),
    highlight: buildHighlight(planConfig.highlight, context),
    share: buildShare(planConfig.share, context)
  };
}

function normalizeValues(fields, rawValues) {
  const values = {};
  const labels = {};
  const seedSource = [];

  fields.forEach((field) => {
    const { name, options = [], default: defaultValue = "" } = field || {};
    if (!name) return;
    const userValue = rawValues[name];
    let value = userValue ?? defaultValue ?? "";
    if (typeof value === "string") {
      value = value.trim();
    }
    values[name] = value;

    let label = value;
    const optionMatch = options.find((opt) => opt.value === value || opt.label === value);
    if (optionMatch) {
      label = optionMatch.label ?? optionMatch.value;
    }
    labels[name] = label;
    seedSource.push(`${name}:${value}`);
  });

  const seed = hashString(seedSource.join("|"));
  return { values, labels, seed };
}

function buildSummary(summaryConfig = {}, context) {
  return {
    title: applyTemplate(summaryConfig.title || "Personalized plan", context),
    subtitle: applyTemplate(summaryConfig.subtitle || "Run through the sections below.", context),
    metrics: (summaryConfig.metrics || []).map((metric) => ({
      label: metric.label,
      value: applyTemplate(metric.value, context),
      helper: metric.helper ? applyTemplate(metric.helper, context) : ""
    }))
  };
}

function buildSection(section = {}, index, context) {
  return {
    title: applyTemplate(section.title || `Section ${index + 1}`, context),
    description: applyTemplate(section.description || "", context),
    items: (section.items || []).map((item) => {
      if (typeof item === "string") {
        return applyTemplate(item, context);
      }
      return applyTemplate(item.text || "", context);
    })
  };
}

function buildTips(tips = [], context) {
  return tips.map((tip) => applyTemplate(tip, context));
}

function buildHighlight(highlight = {}, context) {
  return {
    eyebrow: applyTemplate(highlight.eyebrow || "Quick highlight", context),
    copy: applyTemplate(highlight.copy || "Great job staying consistent.", context)
  };
}

function buildShare(shareConfig = {}, context) {
  const url = shareConfig.url
    ? applyTemplate(shareConfig.url, context)
    : buildShareLink(shareConfig.slug || context.values.slug || "app", { seed: context.seed });
  return {
    label: shareConfig.label || "Shareable link",
    url,
    cta: shareConfig.cta || "Copy link"
  };
}

function applyTemplate(template, context) {
  if (!template) return "";
  return template.replace(TEMPLATE_PATTERN, (_, token) => {
    const [root, child] = token.split(".");
    if (root === "values" && child) {
      return context.values[child] ?? "";
    }
    if (root === "labels" && child) {
      return context.labels[child] ?? context.values[child] ?? "";
    }
    if (root === "derived" && child) {
      return context.derived[child] ?? "";
    }
    if (root === "seed") {
      return String(context.seed);
    }
    return context.values[token] ?? context.labels[token] ?? context.derived[token] ?? "";
  });
}
