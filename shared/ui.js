// Shared UI helpers for mini-apps. Keep DOM interactions lightweight for WebViews.

const TOAST_DURATION_MS = 2800;

/**
 * Creates a card element and optionally appends it to a container.
 * @param {HTMLElement|null} container - Target node to append into.
 * @param {string} title - Heading text for the card.
 * @param {string|HTMLElement|null} body - Main body content.
 * @param {object} options - Optional settings.
 * @returns {HTMLElement} - The card element for further customization.
 */
export function renderCard(container, title, body, options = {}) {
  const { className = "", bodyTag = "p" } = options;
  const card = document.createElement("article");
  card.className = ["shared-card", className].filter(Boolean).join(" ");

  if (title) {
    const heading = document.createElement("h3");
    heading.textContent = title;
    card.append(heading);
  }

  if (body) {
    if (typeof body === "string") {
      const bodyEl = document.createElement(bodyTag);
      bodyEl.textContent = body;
      card.append(bodyEl);
    } else if (body instanceof HTMLElement) {
      card.append(body);
    }
  }

  if (container instanceof HTMLElement) {
    container.append(card);
  }

  return card;
}

/**
 * Builds a styled button element with safe defaults.
 * @param {object} config
 * @param {string} config.label - Visible button text.
 * @param {function} [config.onClick] - Click handler.
 * @param {string} [config.variant="primary"] - Visual variant.
 * @param {string} [config.type="button"] - Button type attribute.
 */
export function renderButton({ label, onClick, variant = "primary", type = "button", disabled = false }) {
  const button = document.createElement("button");
  button.type = type;
  button.className = ["shared-button", `variant-${variant}`].join(" ");
  button.textContent = label;
  button.disabled = Boolean(disabled);

  if (typeof onClick === "function") {
    button.addEventListener("click", onClick);
  }

  return button;
}

/**
 * Displays a temporary toast message near the bottom of the viewport.
 * Safe to call multiple times; toasts auto-dismiss.
 */
export function renderToast(message, { duration = TOAST_DURATION_MS } = {}) {
  if (!message) return;

  const toast = document.createElement("div");
  toast.className = "shared-toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  // Force repaint so animation classes take effect in WebViews.
  requestAnimationFrame(() => toast.classList.add("is-visible"));

  const timeoutId = window.setTimeout(() => dismissToast(toast), duration);
  toast.dataset.toastTimeout = timeoutId.toString();

  toast.addEventListener("click", () => dismissToast(toast));
  return toast;
}

function dismissToast(toast) {
  if (!toast || !toast.classList) return;
  toast.classList.remove("is-visible");
  const timeoutId = Number(toast.dataset.toastTimeout);
  if (!Number.isNaN(timeoutId)) {
    clearTimeout(timeoutId);
  }
  toast.addEventListener(
    "transitionend",
    () => {
      toast.remove();
    },
    { once: true }
  );
}

/**
 * Utility to render labeled input rows consistently across apps.
 * @param {object} config
 * @param {string} config.label - Text shown above the input.
 * @param {HTMLElement} config.input - Input element to mount.
 */
export function renderField({ label, input, helperText = "" }) {
  const wrapper = document.createElement("label");
  wrapper.className = "shared-field";

  if (label) {
    const span = document.createElement("span");
    span.className = "shared-field-label";
    span.textContent = label;
    wrapper.append(span);
  }

  if (input instanceof HTMLElement) {
    input.classList.add("shared-input");
    wrapper.append(input);
  }

  if (helperText) {
    const helper = document.createElement("small");
    helper.className = "shared-field-helper";
    helper.textContent = helperText;
    wrapper.append(helper);
  }

  return wrapper;
}
