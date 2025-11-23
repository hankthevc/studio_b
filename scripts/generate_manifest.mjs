#!/usr/bin/env node

import { readFile, writeFile, rm, mkdir, cp, readdir, stat } from "node:fs/promises";
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
const MINIAPP_BUNDLE_ROOT = path.join(
  ROOT,
  "ios",
  "StudioBHost",
  "Resources",
  "MiniApps"
);
const CATEGORY_MANIFEST_DIR = path.join(ROOT, "partner-kit", "manifests");

const CHECK_MODE = process.argv.includes("--check");
const checkFailures = [];

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
let generatedAt = new Date().toISOString();
if (CHECK_MODE) {
  const existingTimestamp = await readExistingManifestTimestamp();
  if (existingTimestamp) {
    generatedAt = existingTimestamp;
  }
}

const manifest = {
  version: manifestVersion,
  generatedAt,
  apps: sortedApps
};

await ensureMiniAppBundles(sortedApps);
await emitCategorySlices(manifest);
await writeJSONArtifact(MANIFEST_PATH, manifest);
await writeJSONArtifact(IOS_MANIFEST_PATH, manifest);
await writeArtifact(INDEX_PATH, buildIndexHTML(manifest));

if (CHECK_MODE) {
  if (checkFailures.length) {
    console.error("❌ Manifest artifacts are stale:");
    for (const failure of checkFailures) {
      console.error(`   - ${failure}`);
    }
    process.exit(1);
  } else {
    console.log("✓ Manifest artifacts are current.");
  }
} else {
  console.log(
    `✓ Generated ${sortedApps.length} entries → miniapps-manifest.json (v${manifestVersion})`
  );
  console.log(`✓ Synced iOS bundle manifest`);
  console.log(`✓ Wrote HTML index with universal links`);
  console.log(`✓ Bundled ${sortedApps.length} mini-app payloads into Resources/MiniApps`);
  console.log(`✓ Emitted per-category manifests to partner-kit/manifests/`);
}

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

async function ensureMiniAppBundles(apps) {
  if (CHECK_MODE) {
    await verifyMiniAppBundles(apps);
    return;
  }
  await rm(MINIAPP_BUNDLE_ROOT, { recursive: true, force: true });
  await mkdir(MINIAPP_BUNDLE_ROOT, { recursive: true });
  for (const app of apps) {
    const sourceDir = path.join(ROOT, app.asset.bundleSubdirectory);
    const destDir = path.join(MINIAPP_BUNDLE_ROOT, app.slug);
    await cp(sourceDir, destDir, { recursive: true });
  }
}

async function verifyMiniAppBundles(apps) {
  if (!(await pathExists(MINIAPP_BUNDLE_ROOT))) {
    checkFailures.push(`Bundle directory missing: ${MINIAPP_BUNDLE_ROOT}`);
    return;
  }
  const expectedSlugs = new Set(apps.map((app) => app.slug));
  const existingEntries = await safeReadDir(MINIAPP_BUNDLE_ROOT);
  for (const entry of existingEntries) {
    if (entry.isDirectory() && !expectedSlugs.has(entry.name)) {
      checkFailures.push(`Unexpected bundle directory: ${path.join(MINIAPP_BUNDLE_ROOT, entry.name)}`);
    }
  }
  for (const app of apps) {
    const sourceDir = path.join(ROOT, app.asset.bundleSubdirectory);
    const destDir = path.join(MINIAPP_BUNDLE_ROOT, app.slug);
    const sourceFiles = await glob("**/*", {
      cwd: sourceDir,
      nodir: true
    });
    if (!sourceFiles.length) {
      checkFailures.push(`No files found for ${app.slug} at ${sourceDir}`);
      continue;
    }
    const destFiles = await glob("**/*", {
      cwd: destDir,
      nodir: true
    }).catch(() => []);
    const destSet = new Set(destFiles);
    for (const relativeFile of sourceFiles) {
      if (!destSet.has(relativeFile)) {
        checkFailures.push(`Missing bundle file for ${app.slug}: ${path.join(destDir, relativeFile)}`);
        continue;
      }
      const [sourceContent, destContent] = await Promise.all([
        readFile(path.join(sourceDir, relativeFile)),
        readFile(path.join(destDir, relativeFile))
      ]);
      if (!sourceContent.equals(destContent)) {
        checkFailures.push(`Outdated bundle file for ${app.slug}: ${path.join(destDir, relativeFile)}`);
      }
      destSet.delete(relativeFile);
    }
    for (const extraFile of destSet) {
      checkFailures.push(`Unexpected file in bundle for ${app.slug}: ${path.join(destDir, extraFile)}`);
    }
  }
}

async function emitCategorySlices(manifest) {
  if (CHECK_MODE) {
    await verifyCategorySlices(manifest);
    return;
  }
  await rm(CATEGORY_MANIFEST_DIR, { recursive: true, force: true });
  await mkdir(CATEGORY_MANIFEST_DIR, { recursive: true });
  const grouped = groupByCategory(manifest.apps);
  for (const [category, apps] of grouped) {
    const payload = {
      version: manifest.version,
      generatedAt: manifest.generatedAt,
      category,
      apps
    };
    const filename = `${slugify(category)}.json`;
    await writeJSONArtifact(path.join(CATEGORY_MANIFEST_DIR, filename), payload);
  }
}

async function verifyCategorySlices(manifest) {
  const grouped = groupByCategory(manifest.apps);
  const expectedFilenames = [];
  for (const [category, apps] of grouped) {
    const payload = {
      version: manifest.version,
      generatedAt: manifest.generatedAt,
      category,
      apps
    };
    const filename = `${slugify(category)}.json`;
    expectedFilenames.push(filename);
    await writeJSONArtifact(path.join(CATEGORY_MANIFEST_DIR, filename), payload);
  }
  const existingFiles = await glob("*.json", {
    cwd: CATEGORY_MANIFEST_DIR,
    nodir: true
  }).catch(() => []);
  for (const file of existingFiles) {
    if (!expectedFilenames.includes(file)) {
      checkFailures.push(`Unexpected category manifest: ${path.join(CATEGORY_MANIFEST_DIR, file)}`);
    }
  }
}

function groupByCategory(apps) {
  const map = new Map();
  for (const app of apps) {
    if (!map.has(app.category)) {
      map.set(app.category, []);
    }
    map.get(app.category).push(app);
  }
  return map;
}

async function writeJSONArtifact(destination, data) {
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await writeArtifact(destination, payload);
}

async function writeArtifact(destination, contents) {
  if (CHECK_MODE) {
    let existing = null;
    try {
      existing = await readFile(destination, "utf-8");
    } catch {
      // File missing
    }
    if (existing !== contents) {
      checkFailures.push(destination);
    }
    return;
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf-8");
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

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function safeReadDir(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readExistingManifestTimestamp() {
  try {
    const existing = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
    return existing.generatedAt;
  } catch {
    return null;
  }
}

