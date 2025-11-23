import crypto from "node:crypto";
import express from "express";
import morgan from "morgan";
import axios from "axios";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_ENV_PATH = new URL("./env.sample", import.meta.url);
dotenv.config();
dotenv.config({ path: SAMPLE_ENV_PATH, override: false });
warnIfSampleValue("APP_SHARED_SECRET");

const subscriptions = new Map();
const analyticsEvents = [];
const app = createServer();
const PORT = process.env.PORT || 8787;

if (isMainModule(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Advanced Commerce backend running on http://localhost:${PORT}`);
  });
}

export default app;
export async function sendConsumptionInformation(payload = {}) {
  const config = getStoreKitConfig();
  const url = resolveStoreKitURL("inApps/v1/subscriptions/consumption", config.environment);
  const token = generateJWT(config);
  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

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
    const activatedAt = new Date().toISOString();
    const payload = {
      slug,
      status: "active",
      productId,
      transactionId,
      activatedAt
    };
    subscriptions.set(slug, payload);
    res.json(payload);
  });

  app.post("/api/commerce/consumption", async (req, res) => {
    try {
      const data = await sendConsumptionInformation(req.body);
      res.json(data);
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

  app.get("/api/commerce/subscriptions", (_req, res) => {
    res.json({ subscriptions: Array.from(subscriptions.values()) });
  });

  app.post("/api/analytics/track", (req, res) => {
    const { eventName, slug, properties, timestamp } = req.body || {};
    if (!eventName || !slug) {
      return res.status(400).json({ error: "eventName and slug are required" });
    }
    const entry = {
      eventName,
      slug,
      properties: properties || {},
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString()
    };
    analyticsEvents.push(entry);
    if (analyticsEvents.length > 500) {
      analyticsEvents.shift();
    }
    console.log(`[analytics] ${eventName} (${slug})`, entry.properties);
    res.status(202).json({ ok: true });
  });

  app.get("/api/analytics/events", (_req, res) => {
    res.json({ events: analyticsEvents });
  });

  app.post("/api/ai/liftshift", async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("...") || apiKey.toLowerCase().includes("your_")) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server." });
    }

    const { focus = "strength", equipment = [], daysPerWeek = 4, sessionMinutes = 45, note = "" } = req.body || {};
    const prompt = buildLiftShiftPrompt({ focus, equipment, daysPerWeek, sessionMinutes, note });

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are LiftShift, an elite strength coach. Respond ONLY with strict JSON matching the provided schema. Keep movements concise but real; do not invent impossible exercises."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.6,
          max_tokens: 600,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          timeout: 12000
        }
      );

      const parsed = safeParseJSON(response.data?.choices?.[0]?.message?.content);
      if (!parsed) {
        return res.status(502).json({ error: "LLM returned invalid JSON." });
      }
      res.json(parsed);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({
        error: error.message,
        details: error.response?.data
      });
    }
  });

  app.post("/api/ai/tripspark", async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("...") || apiKey.toLowerCase().includes("your_")) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server." });
    }
    const {
      destination = "your city",
      vibe = "culture",
      pace = "balanced",
      budgetLevel = 2,
      stayLength = 3
    } = req.body || {};
    const prompt = buildTripSparkPrompt({ destination, vibe, pace, budgetLevel, stayLength });
    try {
      const data = await callOpenAIJSON({ apiKey, prompt, model: process.env.OPENAI_MODEL });
      const parsed = safeParseJSON(data);
      if (!parsed) {
        return res.status(502).json({ error: "LLM returned invalid JSON." });
      }
      res.json(parsed);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({ error: error.message, details: error.response?.data });
    }
  });

  app.post("/api/ai/mealmind", async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("...") || apiKey.toLowerCase().includes("your_")) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server." });
    }
    const {
      diet = "balanced",
      calories = 1800,
      effort = "balanced",
      householdSize = 1,
      dislikes = ""
    } = req.body || {};
    const prompt = buildMealMindPrompt({ diet, calories, effort, householdSize, dislikes });
    try {
      const data = await callOpenAIJSON({ apiKey, prompt, model: process.env.OPENAI_MODEL });
      const parsed = safeParseJSON(data);
      if (!parsed) {
        return res.status(502).json({ error: "LLM returned invalid JSON." });
      }
      res.json(parsed);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({ error: error.message, details: error.response?.data });
    }
  });

  app.post("/api/ai/pocketporter", async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("...") || apiKey.toLowerCase().includes("your_")) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server." });
    }
    const { destination = "your city", vibe = "leisure", airline = "economy", note = "", climate = "" } = req.body || {};
    const prompt = buildPocketPorterPrompt({ destination, vibe, airline, note, climate });
    try {
      const data = await callOpenAIJSON({ apiKey, prompt, model: process.env.OPENAI_MODEL });
      const parsed = safeParseJSON(data);
      if (!parsed) {
        return res.status(502).json({ error: "LLM returned invalid JSON." });
      }
      res.json(parsed);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({ error: error.message, details: error.response?.data });
    }
  });

  app.post("/api/ai/focustiles", async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("...") || apiKey.toLowerCase().includes("your_")) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server." });
    }
    const { theme = "deepwork", energy = "steady", blockLength = 25, goal = "" } = req.body || {};
    const prompt = buildFocusTilesPrompt({ theme, energy, blockLength, goal });
    try {
      const data = await callOpenAIJSON({ apiKey, prompt, model: process.env.OPENAI_MODEL });
      const parsed = safeParseJSON(data);
      if (!parsed) {
        return res.status(502).json({ error: "LLM returned invalid JSON." });
      }
      res.json(parsed);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({ error: error.message, details: error.response?.data });
    }
  });

  return app;
}

function isMainModule(moduleUrl) {
  const modulePath = fileURLToPath(moduleUrl);
  const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return modulePath === entryPath;
}

function getStoreKitConfig() {
  return {
    keyId: requireEnv("APPLE_AC_KEY_ID"),
    issuerId: requireEnv("APPLE_AC_ISSUER_ID"),
    bundleId: requireEnv("APPLE_AC_BUNDLE_ID"),
    privateKey: formatPrivateKey(requireEnv("APPLE_AC_PRIVATE_KEY")),
    environment:
      (process.env.APPLE_AC_ENV || "sandbox").toLowerCase() === "production"
        ? "production"
        : "sandbox"
  };
}

function requireEnv(key) {
  const value = process.env[key];
  if (!value || value.trim().length === 0 || value.includes("YOUR_") || value.includes("...")) {
    throw new Error(`Environment variable ${key} is not set with a usable value.`);
  }
  return value;
}

function resolveStoreKitURL(pathname, environment) {
  const base =
    environment === "production"
      ? "https://api.storekit.itunes.apple.com"
      : "https://api.storekit-sandbox.itunes.apple.com";
  return `${base}/${pathname}`;
}

function generateJWT(config) {
  const header = base64urlJSON({
    alg: "ES256",
    kid: config.keyId,
    typ: "JWT"
  });
  const now = Math.floor(Date.now() / 1000);
  const claims = base64urlJSON({
    iss: config.issuerId,
    iat: now,
    exp: now + 20 * 60,
    aud: "appstoreconnect-v1",
    bid: config.bundleId
  });
  const signingInput = `${header}.${claims}`;
  const signer = crypto.createSign("sha256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({
    key: config.privateKey,
    dsaEncoding: "ieee-p1363"
  });
  return `${signingInput}.${base64urlBuffer(signature)}`;
}

function base64urlJSON(object) {
  return base64urlBuffer(Buffer.from(JSON.stringify(object)));
}

function base64urlBuffer(buffer) {
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function warnIfSampleValue(key) {
  const value = process.env[key];
  if (!value) {
    return;
  }
  if (value === "change-me" || value.includes("YOUR_") || value.includes("...")) {
    console.warn(`Warning: ${key} is using a sample value. Set a real value in your .env file.`);
  }
}


function formatPrivateKey(key) {
  let formatted = key.replace(/\\n/g, "\n");
  if (!formatted.includes("\n")) {
    formatted = formatted
      .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n")
      .replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
  }
  return formatted;
}

function buildLiftShiftPrompt({ focus, equipment, daysPerWeek, sessionMinutes, note }) {
  const equipmentList = Array.isArray(equipment) ? equipment.join(", ") : String(equipment || "");
  return `
Return JSON for a ${daysPerWeek}-day strength block focused on ${focus}.
Session length target: ${sessionMinutes} minutes.
Equipment available: ${equipmentList || "bodyweight only"}.
Athlete note: ${note || "none"}.

Schema:
{
  "programName": "string",
  "summary": "1–2 sentence summary",
  "days": [
    {
      "day": 1,
      "title": "string",
      "estMinutes": 45,
      "segments": [
        { "label": "Warmup", "movements": ["movement 1", "movement 2"] },
        { "label": "Main set", "movements": ["..."] },
        { "label": "Finisher", "movements": ["..."] }
      ]
    }
  ],
  "recovery": {
    "cues": ["tip 1", "tip 2", "tip 3"],
    "deload": "string (when/how to deload)"
  }
}

Rules:
- Use equipment realistically; if not available, substitute bodyweight.
- Movements must be clear, human-readable, and actionable.
- estMinutes should reflect the target session length ±5 min.
- Do not include any text outside the JSON.
`;
}

function safeParseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

async function callOpenAIJSON({ apiKey, prompt, model }) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a concise planner. Respond ONLY with strict JSON matching the provided schema. Do not add explanations."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 480,
      response_format: { type: "json_object" }
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );
  return response.data?.choices?.[0]?.message?.content;
}

function buildTripSparkPrompt({ destination, vibe, pace, budgetLevel, stayLength }) {
  return `
Return JSON for a ${stayLength}-day itinerary to ${destination}, vibe=${vibe}, pace=${pace}, budgetLevel=${budgetLevel} (1=budget, 3=premium).
Schema:
{
  "sparkHighlight": "1 sentence hero experience",
  "days": [
    {
      "day": 1,
      "theme": "string",
      "highlights": ["Morning activity", "Afternoon activity", "Evening activity"]
    }
  ]
}
Rules: Activities must be plausible for ${destination}. Keep each highlight short.`;
}

function buildMealMindPrompt({ diet, calories, effort, householdSize, dislikes }) {
  return `
Return JSON for a 3-day meal plan.
Diet: ${diet}. Calories target per day: ${calories}. Effort: ${effort}. Household size: ${householdSize}. Dislikes: ${dislikes || "none"}.
Schema:
{
  "meals": [
    { "name": "string", "prep": "string", "tip": "string" }
  ],
  "groceryShortlist": ["item 1", "item 2", "item 3"]
}
Rules: Return exactly 9 meals (3 per day, ordered B/L/D). Keep groceryShortlist concise (≤10 items).`;
}

function buildPocketPorterPrompt({ destination, vibe, airline, note, climate }) {
  return `
Return JSON for a packing list to ${destination}. Vibe=${vibe}. Airline tier=${airline}. Climate=${climate || "detect from destination"}.
Extra note from traveler: ${note || "none"}.
Schema:
{
  "categories": [
    {
      "name": "Essentials",
      "badge": "Required|Optional",
      "items": [
        { "label": "Passport & ID", "required": true }
      ]
    }
  ],
  "compliance": {
    "status": "clear|warning",
    "message": "string",
    "allowanceKg": 10,
    "liquidsMl": 100
  },
  "weatherTip": "string"
}
Rules: 4-5 categories max. Each category 4-7 items. Mark true only for must-pack items.`;
}

function buildFocusTilesPrompt({ theme, energy, blockLength, goal }) {
  return `
Return JSON for a focus block with tiles and breaks.
Theme=${theme}. Energy=${energy}. Block length target=${blockLength} minutes. Goal=${goal || "none"}.
Schema:
{
  "tiles": [
    { "label": "Tile 1", "type": "focus|break", "duration": 25, "suggestion": "string", "soundtrack": "string" }
  ],
  "flowScore": { "score": 80, "description": "string" },
  "resetTip": "string"
}
Rules: Provide 4 focus tiles and 4 short breaks (8 entries total), alternating focus/break. Durations near target with small variation. Keep suggestions actionable.`;
}
