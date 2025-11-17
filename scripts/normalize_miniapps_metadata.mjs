#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_PATH = path.join(ROOT, "schema", "miniapp.schema.json");
const PRODUCT_CATALOG_PATH = path.join(
  ROOT,
  "ios",
  "StudioBHost",
  "Resources",
  "commerce",
  "miniapp-products.json"
);

const featuredSlugs = new Set([
  "tripspark",
  "pocketporter",
  "layoverloop",
  "mealmind",
  "liftshift",
  "flexdesk",
  "flowstreak",
  "inboxzen",
  "billbreeze",
  "beatboard"
]);

const productCatalog = JSON.parse(
  await readFile(PRODUCT_CATALOG_PATH, "utf-8")
);
const skuLookup = Object.fromEntries(
  (productCatalog.items || []).map((entry) => [entry.slug, entry.productId])
);

const files = await glob("apps/*/*/apple.json", { cwd: ROOT });

for (const relativePath of files) {
  const absolutePath = path.join(ROOT, relativePath);
  const dir = path.dirname(absolutePath);
  const slug = path.basename(dir);
  const categoryDir = path.basename(path.dirname(dir));
  const existing = JSON.parse(await readFile(absolutePath, "utf-8"));

  const displayName = existing.title || existing.displayName || toTitle(slug);
  const subtitle = existing.subtitle || existing.tagline || "";
  const category =
    existing.category && existing.category.length
      ? toTitle(existing.category)
      : toTitle(categoryDir);
  const keywords = Array.isArray(existing.keywords)
    ? existing.keywords
    : [];

  const ageBand = normalizeAgeBand(existing.ageRating);
  const skuIds = skuLookup[slug] ? [skuLookup[slug]] : [];

  const transformed = {
    $schema: path.relative(dir, SCHEMA_PATH),
    slug,
    title: displayName,
    subtitle,
    category,
    keywords,
    isFeatured: featuredSlugs.has(slug),
    ageBand,
    universalLink: `https://miniapps.studio/${slug}`,
    asset: {
      bundleSubdirectory: `apps/${categoryDir}/${slug}`,
      entrypoint: "index"
    },
    skuIds,
    previewImageName: null
  };

  await writeFile(
    absolutePath,
    `${JSON.stringify(transformed, null, 2)}\n`,
    "utf-8"
  );
  console.log(`Normalized ${relativePath}`);
}

function normalizeAgeBand(ageRating) {
  if (typeof ageRating === "string") {
    const match = ageRating.match(/(\d+)/);
    if (match) {
      const min = parseInt(match[1], 10);
      return { min, max: null };
    }
  }
  return { min: 13, max: null };
}

function toTitle(value) {
  return value
    .split(/[\s_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

