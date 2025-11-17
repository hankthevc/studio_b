#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const OUTPUT_PATH = path.join(ROOT, "apple-app-site-association");

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
const routes = manifest.apps
  .map((app) => `/` + app.slug)
  .filter((value, index, arr) => arr.indexOf(value) === index);

const aasa = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "ABCDE12345.com.studiob.host",
        paths: routes
      }
    ]
  }
};

await writeFile(OUTPUT_PATH, JSON.stringify(aasa, null, 2));
console.log(`✓ Wrote apple-app-site-association with ${routes.length} paths.`);

