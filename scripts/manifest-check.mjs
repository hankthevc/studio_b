#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const INDEX_PATH = path.join(ROOT, "miniapps-index.html");

const spinner = ora("Validating mini-app manifest").start();

try {
  const [manifestRaw, indexRaw] = await Promise.all([fs.readFile(MANIFEST_PATH, "utf8"), fs.readFile(INDEX_PATH, "utf8")]);
  const manifest = JSON.parse(manifestRaw);
  const indexHtml = indexRaw.toString();
  const errors = [];

  for (const app of manifest.apps || []) {
    const slug = app.slug;
    if (!slug) {
      errors.push("Manifest entry missing slug.");
      continue;
    }
    const category = app.category?.toLowerCase() || guessCategoryFromAsset(app.asset);
    const assetPath = normalizeAssetPath(app.asset, category, slug);
    const indexPath = path.join(ROOT, assetPath, "index.html");
    if (!(await exists(indexPath))) {
      errors.push(`Missing index.html for ${slug} at ${assetPath}`);
    }
    if (!indexHtml.includes(`/${slug}`)) {
      errors.push(`miniapps-index.html missing link for ${slug}`);
    }
  }

  if (errors.length) {
    spinner.fail("Manifest drift detected.");
    errors.forEach((err) => console.error(` - ${err}`));
    process.exitCode = 1;
  } else {
    spinner.succeed("Manifest and surfaces are aligned.");
  }
} catch (error) {
  spinner.fail("Manifest check failed.");
  console.error(error);
  process.exitCode = 1;
}

function guessCategoryFromAsset(asset = {}) {
  const bundle = asset.bundleSubdirectory;
  if (typeof bundle === "string" && bundle.includes("/")) {
    return bundle.split("/")[1] || "unknown";
  }
  return "unknown";
}

function normalizeAssetPath(asset = {}, category, slug) {
  if (asset.bundleSubdirectory) {
    return asset.bundleSubdirectory;
  }
  return path.join("apps", category || "unknown", slug);
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
