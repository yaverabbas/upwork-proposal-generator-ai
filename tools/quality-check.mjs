import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const banned = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /password\s*=/i,
  /secret\s*=/i
];
const ignoredDirs = new Set([".git", "node_modules", "dist", "build"]);

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    if (ignoredDirs.has(entry)) continue;
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const files = await walk(root);
const failures = [];

for (const file of files) {
  const rel = path.relative(root, file);
  if (rel.replaceAll("\\", "/") === "tools/quality-check.mjs") continue;
  if (/\.png|\.jpg|\.jpeg|\.gif|\.webp|\.ico$/i.test(rel)) continue;
  const text = await readFile(file, "utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) {
      failures.push(`${rel}: matched ${pattern}`);
    }
  }
  if (/^\.env($|\.)/.test(path.basename(rel)) && path.basename(rel) !== ".env.example") {
    failures.push(`${rel}: environment file should not be committed`);
  }
}

if (failures.length) {
  console.error("Quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Quality check passed for ${files.length} files.`);
