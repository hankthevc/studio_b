const financingOptions = {
  cash: { label: "Pay in full", months: 1, apr: 0 },
  six: { label: "6-month plan", months: 6, apr: 0.06 },
  twelve: { label: "12-month plan", months: 12, apr: 0.09 }
};

const timelineOptions = {
  three: { label: "3 months", months: 3 },
  six: { label: "6 months", months: 6 },
  twelve: { label: "12 months", months: 12 }
};

const statusConfig = [
  { key: "onTrack", label: "On track", threshold: 120 },
  { key: "tight", label: "Tight fit", threshold: 40 },
  { key: "hold", label: "Hold off", threshold: -Infinity }
];

export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function planScenario(formValues = {}) {
  const normalized = normalizeForm(formValues);
  const financing = financingOptions[normalized.financing];
  const timeline = timelineOptions[normalized.timeline];

  const amountFinanced = Math.max(normalized.price - normalized.downPayment, 0);
  const monthlyPayment = calculateMonthlyPayment(amountFinanced, financing);
  const goalContribution = normalized.goal / timeline.months || 0;
  const remaining = goalContribution - monthlyPayment;
  const status = determineStatus(remaining);

  return {
    summary: buildSummary(status, normalized.price, normalized.goal, financing.label),
    status,
    timelineRows: buildTimelineRows(goalContribution, monthlyPayment, timeline),
    tip: buildTip(status.key),
    shareLink: buildShareLink(status.key)
  };
}

function calculateMonthlyPayment(amountFinanced, financing) {
  if (financing.apr === 0) {
    return Math.round(amountFinanced / financing.months);
  }
  const monthlyRate = financing.apr / 12;
  const numerator = amountFinanced * monthlyRate * Math.pow(1 + monthlyRate, financing.months);
  const denominator = Math.pow(1 + monthlyRate, financing.months) - 1;
  return Math.round(numerator / denominator);
}

function determineStatus(remaining) {
  for (const config of statusConfig) {
    if (remaining >= config.threshold) {
      return { key: config.key, label: config.label, delta: remaining };
    }
  }
  return statusConfig[statusConfig.length - 1];
}

function buildSummary(status, price, goal, financingLabel) {
  if (status.key === "onTrack") {
    return `Still on pace for your ${formatCurrency(goal)} goal while covering ${formatCurrency(price)} (${financingLabel}).`;
  }
  if (status.key === "tight") {
    return `Doable, but trims ${formatCurrency(Math.abs(status.delta))} from your monthly goal.`;
  }
  return `Purchase cuts too deep—short ${formatCurrency(Math.abs(status.delta))} per month toward your goal.`;
}

function buildTimelineRows(goalContribution, monthlyPayment, timeline) {
  return [
    {
      label: "This month",
      goal: formatCurrency(goalContribution),
      impact: formatCurrency(goalContribution - monthlyPayment)
    },
    {
      label: timeline.label,
      goal: formatCurrency(goalContribution * timeline.months),
      impact: formatCurrency(goalContribution * timeline.months - monthlyPayment * timeline.months)
    },
    {
      label: "After payoff",
      goal: formatCurrency(goalContribution * timeline.months),
      impact: formatCurrency(goalContribution * timeline.months)
    }
  ];
}

function buildTip(statusKey) {
  if (statusKey === "onTrack") {
    return "Keep an auto-transfer in place so the goal stays funded.";
  }
  if (statusKey === "tight") {
    return "Trim $15/week from dining or pause one subscription to stay on pace.";
  }
  return "Delay 1–2 months or boost down payment by 15% to protect your goal.";
}

function buildShareLink(statusKey) {
  const id = Math.random().toString(36).slice(2, 5);
  return `https://moneymicro.app/s/${statusKey}-${id}`;
}

function normalizeForm(form = {}) {
  return {
    price: clampCurrency(Number(form.price)),
    downPayment: clampCurrency(Number(form.downPayment) || 0),
    financing: financingOptions[form.financing] ? form.financing : "cash",
    goal: clampCurrency(Number(form.goal) || 1000),
    timeline: timelineOptions[form.timeline] ? form.timeline : "six"
  };
}

function clampCurrency(value) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 10000);
}
