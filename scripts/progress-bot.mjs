#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { glob } from "glob";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IDEAS_PATH = path.join(ROOT, "ideas.yaml");
const MANIFEST_PATH = path.join(ROOT, "miniapps-manifest.json");
const STATUS_PATH = path.join(ROOT, "STATUS_SUMMARY.md");

const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
const spinner = ora("Scanning mini-app portfolio").start();

try {
  const [ideasRaw, manifestRaw] = await Promise.all([fs.readFile(IDEAS_PATH, "utf8"), fs.readFile(MANIFEST_PATH, "utf8")]);
  const ideaData = YAML.parse(ideasRaw);
  const ideaSlugs = Array.from(new Set(extractSlugs(ideaData).filter(Boolean)));

  const manifest = JSON.parse(manifestRaw);
  const manifestIndex = new Map();
  manifest.apps?.forEach((entry) => {
    if (entry?.slug) {
      manifestIndex.set(entry.slug, entry);
    }
  });

  const appDirs = await indexAppDirectories();
  const podsPhaseDetector = await createPodsPhaseDetector();

  const results = [];
  const errors = [];

  for (const slug of ideaSlugs) {
    const dir = appDirs.get(slug) || null;
    const manifestEntry = manifestIndex.get(slug);
    const category =
      manifestEntry?.category?.toLowerCase() ||
      (dir ? path.basename(path.dirname(dir)) : manifestEntry?.asset?.bundleSubdirectory?.split("/")[1]) ||
      "unknown";

    const presence = await checkRequiredFiles(dir);
    const readmePath = dir ? path.join(dir, "README.md") : null;
    const readmeRaw = readmePath && (await safeReadFile(readmePath));
    const readmeContent = readmeRaw ? matter(readmeRaw).content : "";
    const readmePhase = readmeContent.match(/Phase\s+(\d)/i);
    let phaseNumber = readmePhase ? Number.parseInt(readmePhase[1], 10) : null;
    if (!phaseNumber) {
      phaseNumber = podsPhaseDetector(slug);
    }
    const phaseLabel = phaseNumber ? `P${phaseNumber}` : "Untracked";

    const markdownText = readmeContent ? stripHtml(md.render(readmeContent)) : "";
    const monetizationReady = /freePlanLimit/i.test(markdownText) && /upsell/i.test(markdownText);

    const appPath = dir ? path.join(dir, "app.js") : null;
    const appSource = appPath && (await safeReadFile(appPath));
    const analyticsReady = Boolean(appSource && /CustomEvent\s*\(/.test(appSource));

    const screenshots = await hasScreenshots(slug, dir);
    const a11yReport = await fileExists(path.join(ROOT, "docs", "qa", slug, "report.md"));

    if (!dir) {
      errors.push(`Missing app directory for slug "${slug}".`);
    }
    if (!presence.readme || !presence.indexHtml || !presence.logic) {
      errors.push(`Critical files missing for ${slug} (README/index.html/logic.js required).`);
    }
    if (phaseNumber >= 2 && !screenshots) {
      errors.push(`Screenshots missing for ${slug} (phase ${phaseNumber}).`);
    }

    results.push({
      slug,
      category,
      phaseNumber,
      phaseLabel,
      discovered: Boolean(dir),
      files: presence,
      screenshots,
      a11yReport,
      monetizationReady,
      analyticsReady
    });
  }

  const discoveredCount = results.filter((item) => item.discovered).length;
  if (discoveredCount < ideaSlugs.length) {
    errors.push(`Only ${discoveredCount} apps discovered out of ${ideaSlugs.length} ideas.`);
  }

  const summary = buildSummary(results, ideaSlugs.length);
  await fs.writeFile(STATUS_PATH, summary, "utf8");
  spinner.succeed(`STATUS_SUMMARY.md updated for ${results.length} apps.`);

  if (errors.length) {
    console.error("\nPortfolio gate failures:");
    errors.forEach((msg) => console.error(` - ${msg}`));
    process.exitCode = 1;
  }
} catch (error) {
  spinner.fail("Progress bot failed.");
  console.error(error);
  process.exitCode = 1;
}

function extractSlugs(value, acc = []) {
  if (Array.isArray(value)) {
    value.forEach((entry) => extractSlugs(entry, acc));
  } else if (value && typeof value === "object") {
    if (typeof value.slug === "string") {
      acc.push(value.slug.trim());
    }
    Object.values(value).forEach((child) => extractSlugs(child, acc));
  }
  return acc;
}

async function indexAppDirectories() {
  const entries = await glob("apps/*/*", { cwd: ROOT, onlyDirectories: true });
  const index = new Map();
  for (const rel of entries) {
    const slug = path.basename(rel);
    index.set(slug, path.join(ROOT, rel));
  }
  return index;
}

async function createPodsPhaseDetector() {
  const files = await glob("pods/**/*.md", { cwd: ROOT, absolute: true });
  const cache = new Map();
  const pods = await Promise.all(files.map((file) => fs.readFile(file, "utf8")));

  return (slug) => {
    if (cache.has(slug)) {
      return cache.get(slug);
    }
    let found = null;
    pods.forEach((content) => {
      const regex = new RegExp(`${slug}[^\\n]*?(?:Phase\\s*(\\d))`, "gi");
      let match;
      while ((match = regex.exec(content))) {
        found = Number.parseInt(match[1], 10);
      }
    });
    cache.set(slug, found);
    return found;
  };
}

async function checkRequiredFiles(dir) {
  const defaults = {
    spec: false,
    ux: false,
    readme: false,
    logic: false,
    indexHtml: false,
    styles: false,
    app: false
  };
  if (!dir) return defaults;
  const map = {
    spec: "SPEC.md",
    ux: "UX_NOTES.md",
    readme: "README.md",
    logic: "logic.js",
    indexHtml: "index.html",
    styles: "styles.css",
    app: "app.js"
  };
  const result = { ...defaults };
  await Promise.all(
    Object.entries(map).map(async ([key, rel]) => {
      result[key] = await fileExists(path.join(dir, rel));
    })
  );
  return result;
}

async function hasScreenshots(slug, dir) {
  const slugScreens = dir
    ? await glob("**/screenshots/**/*.{png,jpg,jpeg}", {
        cwd: dir,
        nocase: true
      })
    : [];
  const docsScreens = await glob(`docs/qa/${slug}/**/*.{png,jpg,jpeg}`, {
    cwd: ROOT,
    nocase: true
  });
  return slugScreens.length > 0 || docsScreens.length > 0;
}

async function fileExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function safeReadFile(target) {
  try {
    return await fs.readFile(target, "utf8");
  } catch {
    return "";
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ");
}

function buildSummary(results, ideasTarget) {
    const headers = [
    "App",
    "Category",
    "Phase",
    "SPEC",
    "UX",
    "README",
    "Logic",
    "HTML",
    "Styles",
    "App JS",
    "Screenshots",
      "A11y Report",
    "Monetization",
    "Analytics"
  ];
  const rows = results
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((item) => {
        const cells = [
        item.slug,
        item.category,
        item.phaseLabel,
        mark(item.files.spec),
        mark(item.files.ux),
        mark(item.files.readme),
        mark(item.files.logic),
        mark(item.files.indexHtml),
        mark(item.files.styles),
        mark(item.files.app),
        mark(item.screenshots),
          mark(item.a11yReport),
        mark(item.monetizationReady),
        mark(item.analyticsReady)
      ];
      return `| ${cells.join(" | ")} |`;
    });

  const phaseCounts = results.reduce((acc, item) => {
    const key = item.phaseLabel || "Untracked";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const phaseSummary = Object.entries(phaseCounts)
    .map(([key, count]) => `${key}: ${count}`)
    .join(", ");

    const discovered = results.filter((item) => item.discovered).length;
  const lastUpdated = new Date().toISOString();

  return [
    "# Portfolio Quality Status",
    "",
    `Last updated: ${lastUpdated}`,
    "",
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows,
    "",
    "## Totals",
    `- Ideas target: ${ideasTarget}`,
    `- Apps discovered: ${discovered}`,
    `- Phase counts: ${phaseSummary || "None"}`,
      `- Accessibility reports: ${results.filter((r) => r.a11yReport).length}`,
    ""
  ].join("\n");
}

function mark(value) {
  return value ? "✅" : "⚠️";
}
