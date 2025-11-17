#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fetch from "node-fetch";
import pa11y from "pa11y";
import fsExtra from "fs-extra";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const QA_ROOT = path.join(ROOT, "docs", "qa");
const PROOF_A11Y = path.join(ROOT, "proof", "reports", "a11y");
const BASE_URL = "http://127.0.0.1:8789";

const spinner = ora("Running accessibility checks").start();
let serverProcess = null;

try {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const apps = manifest.apps || [];
  if (!apps.length) {
    throw new Error("No apps found in miniapps-manifest.json");
  }

  serverProcess = await ensureServer();

  const failures = [];
  await fsExtra.ensureDir(PROOF_A11Y);

  for (const app of apps) {
    const slug = app.slug;
    const category = app.category?.toLowerCase() || "unknown";
    const targetUrl = `${BASE_URL}/${category}/${slug}/index.html`;
    const runs = [];

    for (const viewport of getViewports()) {
      const runUrl = `${targetUrl}?viewport=${viewport.name}`;
      let issues = [];
      try {
        const result = await pa11y(runUrl, {
          runners: ["axe"],
          includeNotices: false,
          includeWarnings: false,
          wait: 500,
          timeout: 60000,
          viewport: {
            width: viewport.width,
            height: viewport.height
          },
          chromeLaunchConfig: {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          },
          log: {
            debug: () => {},
            info: () => {},
            error: () => {}
          }
        });
        issues = result.issues.filter((issue) => issue.type === "error");
      } catch (error) {
        issues = [{ code: "runtime.error", message: error.message, type: "error", selector: "html" }];
      }
      runs.push({
        viewport: viewport.name,
        issues,
        url: runUrl
      });
      if (issues.length) {
        failures.push({ slug, viewport: viewport.name, issues: issues.length });
      }
    }

    const payload = {
      slug,
      category,
      url: targetUrl,
      runs,
      generatedAt: new Date().toISOString()
    };
    const qaDir = path.join(QA_ROOT, slug);
    await fsExtra.ensureDir(qaDir);
    await fs.writeFile(path.join(qaDir, "a11y.json"), JSON.stringify(payload, null, 2));
    await fs.writeFile(path.join(PROOF_A11Y, `${slug}.json`), JSON.stringify(payload, null, 2));
  }

  spinner.succeed(`Accessibility sweep complete for ${apps.length} apps.`);

  if (failures.length) {
    console.error("\nAccessibility violations detected:");
    failures.forEach((failure) => {
      console.error(` - ${failure.slug} (${failure.viewport}): ${failure.issues} issue(s)`);
    });
    process.exitCode = 1;
  }
} catch (error) {
  spinner.fail("Accessibility checks failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  if (serverProcess) {
    serverProcess.kill();
  }
}

function getViewports() {
  return [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1280, height: 800 }
  ];
}

async function ensureServer() {
  if (await isServerReady()) {
    return null;
  }
  const child = spawn("node", ["scripts/serve-static.mjs"], {
    cwd: ROOT,
    stdio: "inherit"
  });
  await waitForServer();
  return child;
}

async function waitForServer(retries = 40) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    if (await isServerReady()) return;
    await delay(500);
  }
  throw new Error("Static server did not start on port 8789.");
}

async function isServerReady() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(`${BASE_URL}/healthz`, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
