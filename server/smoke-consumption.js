#!/usr/bin/env node

import dotenv from "dotenv";
import { sendConsumptionInformation } from "./index.js";

dotenv.config({ path: new URL("./env.sample", import.meta.url) });
dotenv.config();

const [transactionId, slug = "smoke-test", productId = "advanced.smoke.pro"] = process.argv.slice(2);

if (!transactionId) {
  console.error("Usage: npm run smoke:consumption -- <transactionId> [slug] [productId]");
  process.exit(1);
}

const bundleId = process.env.APPLE_AC_BUNDLE_ID;
if (!bundleId) {
  console.error("APPLE_AC_BUNDLE_ID must be set in your environment.");
  process.exit(1);
}

const payload = {
  transactionId: String(transactionId),
  bundleId,
  appAccountToken: slug,
  productId,
  consumptionStatus: 0,
  activeEngagement: true,
  lifetimeDollarsPurchased: 0,
  lifetimeDollarsRefunded: 0,
  userStatus: 0,
  platform: 0,
  sampleContentProvided: false
};

console.log("Dispatching Send Consumption Information payload:", payload);

try {
  const response = await sendConsumptionInformation(payload);
  console.log("✓ StoreKit response:", response);
} catch (error) {
  const message = error.response?.data || error.message;
  console.error("✗ StoreKit request failed:", message);
  process.exit(1);
}

