const SHARE_BASE = "https://miniapps.studio/share";

export function hashString(input = "") {
  const str = input.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function pick(items = [], seed = 0) {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  const index = Math.abs(seed) % items.length;
  return items[index];
}

export function cycle(items = [], count = 1, seed = 0) {
  if (!Array.isArray(items) || items.length === 0 || count <= 0) {
    return [];
  }
  const output = [];
  let cursor = Math.abs(seed) % items.length;
  for (let i = 0; i < count; i += 1) {
    output.push(items[cursor]);
    cursor = (cursor + 1) % items.length;
  }
  return output;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatCurrency(value, currency = "USD") {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  } catch (error) {
    console.warn("formatCurrency fallback", error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatMinutes(minutes = 0) {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  if (mins === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }
  return `${hours}h ${mins}m`;
}

export function buildShareLink(slug, params = {}) {
  const safeSlug = (slug || "app").toLowerCase();
  const search = new URLSearchParams({
    via: "miniapps-studio",
    slug: safeSlug,
    ...params
  });
  return `${SHARE_BASE}/${safeSlug}?${search.toString()}`;
}
