import { rm } from "node:fs/promises";
import manifest from "../src/manifest.json";

const OUT_DIR = "dist";
const USERSCRIPT = "netflix-quality-badges.user.js";

const result = await Bun.build({ entrypoints: ["src/main.ts"], format: "iife", target: "browser" });
const [output] = result.outputs;
if (!result.success || !output) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
const script = await output.text();

await rm(OUT_DIR, { recursive: true, force: true });
await Bun.write(`${OUT_DIR}/extension/manifest.json`, JSON.stringify(manifest, null, 2));
await Bun.write(`${OUT_DIR}/extension/content.js`, script);
await Bun.write(`${OUT_DIR}/${USERSCRIPT}`, userscriptHeader() + script);

function userscriptHeader(): string {
  const [contentScript] = manifest.content_scripts;
  const latest = `${manifest.homepage_url}/releases/latest/download/${USERSCRIPT}`;
  const fields: [string, string][] = [
    ["name", manifest.name],
    ["namespace", manifest.homepage_url],
    ["version", manifest.version],
    ["description", manifest.description],
    ["homepageURL", manifest.homepage_url],
    ...(contentScript?.matches ?? []).map((match): [string, string] => ["match", match]),
    ["run-at", "document-start"],
    ["inject-into", "page"],
    ["grant", "none"],
    ["downloadURL", latest],
    ["updateURL", latest],
  ];
  const width = Math.max(...fields.map(([key]) => key.length));
  const lines = fields.map(([key, value]) => `// @${key.padEnd(width)} ${value}`);
  return ["// ==UserScript==", ...lines, "// ==/UserScript==", "", ""].join("\n");
}
