#!/usr/bin/env node
/* Package proof-of-work + code changes into a single ZIP.
   Cross-platform; no external CLI deps. */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import archiver from "archiver";
import fsExtra from "fs-extra";

const cwd = process.cwd();
const ts = new Date().toISOString().replace(/[:.]/g, "-");
const proofDir = path.join(cwd, "proof");
const bundleDir = path.join(proofDir, "bundle");

const mkdirp = (p) => fsp.mkdir(p, { recursive: true });
const exists = (p) => fsp
  .access(p)
  .then(() => true)
  .catch(() => false);
const cp = (src, dest) => fsExtra
  .copy(src, dest, { overwrite: true, errorOnExist: false })
  .catch(() => {});

await fsp.rm(proofDir, { recursive: true, force: true });
await mkdirp(bundleDir);

const dirs = {
  summary: path.join(bundleDir, "summary"),
  reports: path.join(bundleDir, "reports"),
  qa: path.join(bundleDir, "reports", "qa"),
  playwright: path.join(bundleDir, "reports", "playwright"),
  a11y: path.join(bundleDir, "reports", "a11y"),
  events: path.join(bundleDir, "reports", "events"),
  diffs: path.join(bundleDir, "diffs"),
  changes: path.join(bundleDir, "changes"),
  logs: path.join(bundleDir, "logs"),
  meta: path.join(bundleDir, "meta")
};
for (const d of Object.values(dirs)) await mkdirp(d);

function run(cmd, logName) {
  const res = spawnSync(cmd, { shell: true, encoding: "utf8" });
  const out = `CMD: ${cmd}
EXIT: ${res.status}
---- STDOUT ----
${res.stdout}
---- STDERR ----
${res.stderr}
`;
  if (logName) fs.writeFileSync(path.join(dirs.logs, logName), out);
  return res.status ?? 0;
}

async function sha256(file) {
  const hash = crypto.createHash("sha256");
  hash.update(await fsp.readFile(file));
  return hash.digest("hex");
}

const steps = [
  ["npm run -s progress:generate", "status.log"],
  ["npm run -s manifest:check", "manifest.log"],
  ["npm run -s aasa:diff", "aasa.log"],
  ["npm run -s test:a11y", "a11y.log"],
  ["npm run -s test:visual", "visual.log"],
  ["npm run -s test:events", "events.log"]
];

let failures = 0;
for (const [cmd, log] of steps) {
  const code = run(cmd, log);
  if (code !== 0) failures += 1;
}

if (await exists("STATUS_SUMMARY.md")) await cp("STATUS_SUMMARY.md", path.join(dirs.summary, "STATUS_SUMMARY.md"));
if (await exists("docs/qa")) await cp("docs/qa", dirs.qa);
if (await exists("proof/reports/playwright")) await cp("proof/reports/playwright", dirs.playwright);
if (await exists("proof/reports/a11y")) await cp("proof/reports/a11y", dirs.a11y);
if (await exists("proof/reports/events.json")) await cp("proof/reports/events.json", path.join(dirs.events, "events.json"));

fs.writeFileSync(
  path.join(dirs.meta, "env.txt"),
  `node=${process.version}
os=${os.platform()} ${os.release()}
repo=${path.basename(cwd)}
`
);
run("git rev-parse HEAD", "git_head.log");
run("git status --porcelain=v1 -uall", "git_status.log");
run("git diff --no-color", "git_diff.patch");

const list = spawnSync("git ls-files -m -o --exclude-standard", { shell: true, encoding: "utf8" }).stdout
  .split("\n")
  .filter(Boolean);
for (const rel of list) {
  if (rel.startsWith("node_modules") || rel.startsWith(".git") || rel.startsWith("proof")) continue;
  const dest = path.join(dirs.changes, rel);
  await mkdirp(path.dirname(dest));
  await cp(rel, dest);
}

const checksumLines = [];
async function walk(dir) {
  for (const entry of await fsp.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else {
      checksumLines.push(`${await sha256(full)}  ${path.relative(bundleDir, full)}`);
    }
  }
}
await walk(bundleDir);
await fsp.writeFile(path.join(bundleDir, "checksums.txt"), checksumLines.sort().join("\n") + "\n");

const proofReadme = `# Proof bundle
Created: ${new Date().toISOString()}
Failures (non-zero exits): ${failures}

Contents
- summary/STATUS_SUMMARY.md
- reports/playwright (HTML report)
- reports/a11y (JSON)
- reports/qa (manual QA artifacts, if any)
- reports/events/events.json
- diffs/git_diff.patch + logs/*
- changes/ (snapshot of added/modified files)
- meta/env.txt
- checksums.txt
`;
await fsp.writeFile(path.join(bundleDir, "README.md"), proofReadme);

const zipPath = path.join(proofDir, `studio_b_proof_${ts}.zip`);
await new Promise((resolve, reject) => {
  const out = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  out.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(out);
  archive.directory(bundleDir + "/", false);
  archive.finalize();
});

console.log(`\n➡️  Proof ZIP created at: ${zipPath}\n`);
process.exit(failures ? 1 : 0);
