import crypto from "node:crypto";
import express from "express";
import morgan from "morgan";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: new URL("./env.sample", import.meta.url) });
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 8787;
const APP_SHARED_SECRET = process.env.APP_SHARED_SECRET || "dev-secret";

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post("/api/commerce/purchase", (req, res) => {
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({ error: "slug is required" });
  }
  const productId = `advanced.${slug}.pro`;
  const transactionId = Number(Date.now());
  res.json({
    slug,
    status: "active",
    productId,
    transactionId
  });
});

app.post("/api/commerce/consumption", async (req, res) => {
  try {
    const response = await sendConsumptionInformation(req.body);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

app.post("/api/commerce/notifications", (req, res) => {
  // Placeholder: In production, verify the notification and fan out to analytics/billing.
  console.log("App Store notification:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Advanced Commerce backend running on http://localhost:${PORT}`);
});

async function sendConsumptionInformation(payload = {}) {
  const url = resolveStoreKitURL("inApps/v1/subscriptions/consumption");
  const token = generateJWT();
  return axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

function resolveStoreKitURL(path) {
  const base =
    process.env.APPLE_AC_ENV === "production"
      ? "https://api.storekit.itunes.apple.com"
      : "https://api.storekit-sandbox.itunes.apple.com";
  return `${base}/${path}`;
}

function generateJWT() {
  const header = base64url(
    JSON.stringify({
      alg: "ES256",
      kid: process.env.APPLE_AC_KEY_ID,
      typ: "JWT"
    })
  );
  const now = Math.floor(Date.now() / 1000);
  const claims = base64url(
    JSON.stringify({
      iss: process.env.APPLE_AC_ISSUER_ID,
      iat: now,
      exp: now + 20 * 60,
      aud: "appstoreconnect-v1",
      bid: process.env.APPLE_AC_BUNDLE_ID
    })
  );
  const signingInput = `${header}.${claims}`;
  const key = crypto.createPrivateKey({
    key: process.env.APPLE_AC_PRIVATE_KEY.replace(/\\n/g, "\n"),
    format: "pem"
  });
  const signature = crypto.sign("sha256", Buffer.from(signingInput), key);
  return `${signingInput}.${base64url(signature)}`;
}

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

