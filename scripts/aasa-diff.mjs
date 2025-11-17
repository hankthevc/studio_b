#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const AASA_PATH = path.join(ROOT, "apple-app-site-association");

const spinner = ora("Checking apple-app-site-association drift").start();

try {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const routes = (manifest.apps || []).map((app) => `/${app.slug}`).filter((value, index, arr) => arr.indexOf(value) === index);
  const expected = {
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

  const expectedJson = JSON.stringify(expected, null, 2) + "\n";
  const actualJson = await fs.readFile(AASA_PATH, "utf8");

  if (actualJson.trim() === expectedJson.trim()) {
    spinner.succeed("apple-app-site-association matches manifest.");
    process.exit(0);
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "aasa-"));
  const expectedPath = path.join(tmpDir, "expected.json");
  await fs.writeFile(expectedPath, expectedJson, "utf8");

  spinner.fail("apple-app-site-association drift detected:");
  const diff = spawnSync("git", ["--no-pager", "diff", "--no-index", expectedPath, AASA_PATH], {
    cwd: ROOT,
    encoding: "utf8"
  });
  if (diff.stdout) {
    console.error(diff.stdout);
  }
  if (diff.stderr && !diff.stdout) {
    console.error(diff.stderr);
  }
  process.exitCode = 1;
} catch (error) {
  spinner.fail("AASA diff failed.");
  console.error(error);
  process.exitCode = 1;
}
