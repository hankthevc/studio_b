#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_PATH = path.join(ROOT, "schema", "miniapp.schema.json");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const INDEX_PATH = path.join(ROOT, "miniapps-index.html");
const IOS_MANIFEST_PATH = path.join(
  ROOT,
  "ios",
  "StudioBHost",
  "Resources",
  "miniapps-manifest.json"
);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf-8"));
const validate = ajv.compile(schema);

const manifestVersion = 1;
const files = await glob("apps/*/*/apple.json", { cwd: ROOT });
const apps = [];

for (const relativePath of files) {
  const absolutePath = path.join(ROOT, relativePath);
  const raw = JSON.parse(await readFile(absolutePath, "utf-8"));
  if (!validate(raw)) {
    console.error(
      `❌ ${relativePath} failed validation:\n${ajv.errorsText(validate.errors, {
        separator: "\n"
      })}`
    );
    throw new Error("Invalid mini-app metadata");
  }
  apps.push(normalizeMetadata(raw));
}

const sortedApps = apps.sort((a, b) => a.slug.localeCompare(b.slug));
const manifest = {
  version: manifestVersion,
  generatedAt: new Date().toISOString(),
  apps: sortedApps
};

await writeJSON(MANIFEST_PATH, manifest);
await writeJSON(IOS_MANIFEST_PATH, manifest);
await writeFile(INDEX_PATH, buildIndexHTML(manifest), "utf-8");

console.log(
  `✓ Generated ${sortedApps.length} entries → miniapps-manifest.json (v${manifestVersion})`
);
console.log(`✓ Updated iOS bundle manifest`);
console.log(`✓ Wrote HTML index with universal links`);

function normalizeMetadata(meta) {
  return {
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle,
    category: meta.category,
    keywords: meta.keywords,
    isFeatured: meta.isFeatured,
    ageBand: {
      min: meta.ageBand.min,
      max: meta.ageBand.max ?? null
    },
    universalLink: meta.universalLink,
    asset: meta.asset,
    skuIds: meta.skuIds,
    previewImageName:
      typeof meta.previewImageName === "string" ? meta.previewImageName : null
  };
}

async function writeJSON(destination, data) {
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(destination, payload, "utf-8");
}

function buildIndexHTML(manifest) {
  const rows = manifest.apps
    .map(
      (app) => `
        <tr>
          <td>${escapeHTML(app.category)}</td>
          <td><a href="${app.universalLink}">${escapeHTML(app.title)}</a></td>
          <td>${escapeHTML(app.subtitle)}</td>
          <td>${app.ageBand.min}${app.ageBand.max ? `-${app.ageBand.max}` : "+"}</td>
          <td>${app.skuIds.length ? escapeHTML(app.skuIds.join(", ")) : "Free tier"}</td>
        </tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Studio B Mini-Apps Manifest</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; background: #f8f9fb; color: #111; }
      table { border-collapse: collapse; width: 100%; background: white; box-shadow: 0 10px 40px rgba(15,23,42,0.1); border-radius: 16px; overflow: hidden; }
      th, td { padding: 14px 18px; text-align: left; }
      th { background: #111827; color: white; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.04em; text-transform: uppercase; }
      tr:nth-child(even) { background: #f9fafb; }
      a { color: #2563eb; text-decoration: none; }
      a:hover { text-decoration: underline; }
      caption { text-align: left; padding-bottom: 16px; font-size: 1.25rem; font-weight: 600; }
    </style>
  </head>
  <body>
    <table>
      <caption>Studio B Mini-Apps (v${manifest.version}, generated ${new Date(manifest.generatedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC)</caption>
      <thead>
        <tr>
          <th>Category</th>
          <th>Mini-app</th>
          <th>Subtitle</th>
          <th>Age</th>
          <th>SKU IDs</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>
`;
}

function escapeHTML(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

