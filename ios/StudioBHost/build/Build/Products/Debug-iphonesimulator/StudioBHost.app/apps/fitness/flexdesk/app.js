import { mountMiniApp } from "../../../shared/bootstrapMiniApp.js";
import { appConfig } from "./config.js";
import { generatePlan } from "./logic.js";

export function mount(target = "app") {
  mountMiniApp({
    config: appConfig,
    generatePlan,
    target
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => mount());
} else {
  mount();
}
