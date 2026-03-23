import { rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".next", ".turbo"];
let failed = false;

for (const target of targets) {
  const fullPath = resolve(process.cwd(), target);
  try {
    rmSync(fullPath, { recursive: true, force: true });
  } catch (error) {
    failed = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[clean:next] Failed to remove ${target}: ${message}`);
  }
}

if (failed) {
  console.error("[clean:next] Close running Next.js dev servers and retry.");
  process.exit(1);
}

console.log("[clean:next] Cleared .next/.turbo");
