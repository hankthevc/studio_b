import { buildPlan } from "../../../shared/planBuilder.js";
import { appConfig } from "./config.js";

export function generatePlan(values) {
  return buildPlan(appConfig.plan, values);
}
