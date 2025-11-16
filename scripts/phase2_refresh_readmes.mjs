#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IDEAS_PATH = path.join(ROOT, "ideas.yaml");
const SCREENSHOT_DIR = path.join(ROOT, "docs", "screenshots");

async function loadIdeas() {
  const raw = await fs.readFile(IDEAS_PATH, "utf-8");
  const ideas = YAML.parse(raw) || [];
  const map = new Map();
  ideas.forEach((entry) => map.set(entry.slug, entry));
  return map;
}

function buildPlaceholder(slug, title) {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const h1 = hash % 360;
  const h2 = (h1 + 40) % 360;
  const color1 = `hsl(${h1}, 75%, 80%)`;
  const color2 = `hsl(${h2}, 70%, 70%)`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="720" height="400" viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg">\n  <defs>\n    <linearGradient id="grad-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="${color1}" />\n      <stop offset="100%" stop-color="${color2}" />\n    </linearGradient>\n  </defs>\n  <rect width="720" height="400" rx="28" fill="url(#grad-${slug})" />\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'SF Pro Display', 'Inter', sans-serif" font-size="48" fill="#0f172a" opacity="0.85">${title}</text>\n</svg>\n`;
}

function hasSection(content, heading) {
  return content.includes(heading);
}

function ensureFlow(content, idea) {
  if (hasSection(content, "## Flow")) return { updated: false, content };
  const defaultFlow = [
    "Set context with the mini-app form.",
    "Review the deterministic plan/cards it generates.",
    "Share, embed, or regenerate as needed.",
  ];
  const block = `\n## Flow\n${defaultFlow.map((line) => `- ${line}`).join("\n")}\n`;
  return { updated: true, content: content.trimEnd() + "\n" + block + "\n" };
}

function ensureWhatItDoes(content, idea) {
  if (hasSection(content, "## What it does")) return { updated: false, content };
  const copy = idea?.idea || "AI mini-app built on TripSpark patterns.";
  const block = `\n## What it does\n${copy}\n`;
  return { updated: true, content: content.trimEnd() + "\n" + block + "\n" };
}

function ensureFreeVsPro(content, idea) {
  if (hasSection(content, "## Free vs Pro")) return { updated: false, content };
  const monetization = idea?.monetization || "Free core use; Pro unlocks unlimited runs.";
  const parts = monetization.split(";").map((part) => part.trim());
  const free = parts[0] || "Free tier covers the first plan.";
  const pro = parts[1] || "Pro unlocks unlimited runs + exports.";
  const block = `\n## Free vs Pro\n**Free**\n- ${free.replace(/^Free\s*/i, "")}\n\n**Pro**\n- ${pro.replace(/^Pro\s*/i, "")}\n`;
  return { updated: true, content: content.trimEnd() + "\n" + block + "\n" };
}

function ensureScreenshot(content, slug, name) {
  if (hasSection(content, "## Screenshot or Loom")) return { updated: false, content };
  const block = `\n## Screenshot or Loom\n![${name} screenshot](../../docs/screenshots/${slug}.svg)\n`;
  return { updated: true, content: content.trimEnd() + "\n" + block + "\n" };
}

async function ensurePlaceholder(slug, title) {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  const file = path.join(SCREENSHOT_DIR, `${slug}.svg`);
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, buildPlaceholder(slug, title), "utf-8");
  }
}

async function processReadme(file, idea) {
  let content = await fs.readFile(file, "utf-8");
  let touched = false;
  const flow = ensureFlow(content, idea);
  if (flow.updated) {
    content = flow.content;
    touched = true;
  }
  const what = ensureWhatItDoes(content, idea);
  if (what.updated) {
    content = what.content;
    touched = true;
  }
  const tiers = ensureFreeVsPro(content, idea);
  if (tiers.updated) {
    content = tiers.content;
    touched = true;
  }
  const slug = path.basename(path.dirname(file));
  const name = idea?.name || slug;
  const shot = ensureScreenshot(content, slug, name);
  if (shot.updated) {
    content = shot.content;
    touched = true;
  }
  return { touched, content };
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const ideas = await loadIdeas();
  const readmes = await glob("apps/*/*/README.md", { cwd: ROOT, absolute: true });
  const touchedFiles = [];

  for (const file of readmes) {
    const slug = path.basename(path.dirname(file));
    const idea = ideas.get(slug);
    await ensurePlaceholder(slug, idea?.name || slug);
    const { touched, content } = await processReadme(file, idea);
    if (touched) {
      if (check) {
        touchedFiles.push(path.relative(ROOT, file));
      } else {
        await fs.writeFile(file, content, "utf-8");
        touchedFiles.push(path.relative(ROOT, file));
      }
    }
  }

  if (check && touchedFiles.length > 0) {
    console.error("README refresh required for:\n" + touchedFiles.join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
