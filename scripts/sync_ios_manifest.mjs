#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "miniapps-manifest.json");
const DESTINATION = path.join(
  ROOT,
  "ios",
  "StudioBHost",
  "Resources",
  "miniapps-manifest.json"
);

const contents = await readFile(SOURCE, "utf-8");
await writeFile(DESTINATION, contents, "utf-8");
console.log("✓ Synced miniapps-manifest.json into ios/StudioBHost/Resources");

