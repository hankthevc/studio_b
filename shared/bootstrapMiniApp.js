import { initAppShell } from "./appShell.js";

export function mountMiniApp({ config, generatePlan, target = "app" }) {
  if (!config) {
    throw new Error("mountMiniApp requires a config object");
  }
  if (typeof generatePlan !== "function") {
    throw new Error("mountMiniApp requires a generatePlan function");
  }

  const mount = () => {
    const container = typeof target === "string" ? document.getElementById(target) : target;
    if (!container) {
      console.warn("mountMiniApp: target not found", target);
      return;
    }
    initAppShell(container, config, generatePlan);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
}
