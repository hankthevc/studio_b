#!/usr/bin/env node

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = 8789;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname === "/healthz") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("ok");
      return;
    }
    const filePath = resolvePath(url.pathname);
    const stats = await stat(filePath);
    const finalPath = stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const stream = fs.createReadStream(finalPath);
    stream.on("error", () => sendNotFound(res));
    res.writeHead(200, { "content-type": mimeType(finalPath) });
    stream.pipe(res);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendNotFound(res);
    } else {
      console.error("Static server error:", error);
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Server error");
    }
  }
});

server.listen(PORT, () => {
  console.log(`[static] Serving ${ROOT} on http://127.0.0.1:${PORT}`);
});

function resolvePath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0] || "/");
  if (decoded === "/" || decoded === "") {
    return ROOT;
  }
  const sanitized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const relativePath = sanitized.replace(/^\/+/, "");
  const segments = relativePath.split("/");

  if (segments.length >= 2) {
    const [category, slug, ...rest] = segments;
    const appDir = path.join(ROOT, "apps", category, slug, ...rest);
    if (appDir.startsWith(ROOT) && fs.existsSync(appDir)) {
      return appDir;
    }
    const withIndex = path.join(ROOT, "apps", category, slug);
    if (withIndex.startsWith(ROOT) && fs.existsSync(withIndex)) {
      return path.join(withIndex, ...rest);
    }
  }

  const fallback = path.join(ROOT, relativePath);
  if (!fallback.startsWith(ROOT)) {
    return ROOT;
  }
  return fallback;
}

function sendNotFound(res) {
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function stat(target) {
  return new Promise((resolve, reject) => {
    fs.stat(target, (error, metadata) => {
      if (error) {
        reject(error);
      } else {
        resolve(metadata);
      }
    });
  });
}
