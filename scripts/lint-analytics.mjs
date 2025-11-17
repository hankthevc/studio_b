#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import fsExtra from "fs-extra";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTRACT_JSON = path.join(ROOT, "partner-kit", "analytics", "contracts.json");
const CONTRACT_MD = path.join(ROOT, "partner-kit", "analytics", "contracts.md");
const PROOF_PATH = path.join(ROOT, "proof", "reports");
const EVENTS_REPORT = path.join(PROOF_PATH, "events.json");

const spinner = ora("Linting analytics contracts").start();

try {
  const contract = await loadContract();
  const appDirs = await glob("apps/*/*", { cwd: ROOT, onlyDirectories: true });
  const coreEvents = contract.coreEvents || [];
  const extensions = contract.extensions || {};
  const results = [];

  for (const rel of appDirs) {
    const slug = path.basename(rel);
    const absDir = path.join(ROOT, rel);
    const appSource = await safeRead(path.join(absDir, "app.js"));
    const readme = await safeRead(path.join(absDir, "README.md"));
    const expectedEvents = [
      ...coreEvents.map((event) => ({
        name: `${slug}:${event.suffix}`,
        props: event.props || []
      })),
      ...(extensions[slug] || []).map((event) => ({
        name: event.event,
        props: event.props || []
      }))
    ];

    const eventStatuses = expectedEvents.map((event) => {
      const implementedIndex = appSource.indexOf(event.name);
      const implemented = implementedIndex !== -1;
      const documented = readme.includes(event.name);
      const missingProps = [];

      if (implemented) {
        const window = appSource.slice(Math.max(0, implementedIndex - 120), implementedIndex + 400);
        for (const prop of event.props) {
          if (!window.includes(prop)) {
            missingProps.push(prop);
          }
        }
      } else if (event.props?.length) {
        missingProps.push(...event.props);
      }

      return {
        event: event.name,
        implemented,
        documented,
        missingProps
      };
    });

    results.push({
      slug,
      implemented: eventStatuses.filter((status) => status.implemented && status.missingProps.length === 0).length,
      expected: eventStatuses.length,
      events: eventStatuses
    });
  }

  await fsExtra.ensureDir(PROOF_PATH);
  await fs.writeFile(EVENTS_REPORT, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));

  const failures = results
    .map((row) => {
      const broken = row.events.filter((event) => !event.implemented || event.missingProps.length);
      if (!broken.length) return null;
      const issues = broken
        .map((event) => {
          if (!event.implemented) {
            return `${event.event} (missing CustomEvent)`;
          }
          return `${event.event} (missing props: ${event.missingProps.join(", ")})`;
        })
        .join("; ");
      return `${row.slug}: ${issues}`;
    })
    .filter(Boolean);

  if (failures.length) {
    spinner.fail("Analytics contract violations found.");
    failures.forEach((line) => console.error(` - ${line}`));
    process.exitCode = 1;
  } else {
    spinner.succeed("Analytics events verified for all apps.");
  }
} catch (error) {
  spinner.fail("Analytics lint failed.");
  console.error(error);
  process.exitCode = 1;
}

async function loadContract() {
  if (await exists(CONTRACT_JSON)) {
    return JSON.parse(await fs.readFile(CONTRACT_JSON, "utf8"));
  }
  if (await exists(CONTRACT_MD)) {
    const markdown = await fs.readFile(CONTRACT_MD, "utf8");
    const match = markdown.match(/```json\\s*([\\s\\S]*?)```/i);
    if (match) {
      return JSON.parse(match[1]);
    }
  }
  throw new Error("Analytics contract definition not found.");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function safeRead(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}
