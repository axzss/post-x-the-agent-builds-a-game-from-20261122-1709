// Ghost Dodge — make.fun entry program.
//
// Copies POST.json from the repository root into the grader's output
// directory so the house can read the X post address for this entry.
// Node 22 stdlib only. No network, no wall clock, no files outside the repo.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const botDir: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source: string = join(botDir, "POST.json");
const target: string = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`main.ts: POST.json not found in bot dir: ${source}`);
  process.exit(1);
}

if (!statSync(source).isFile()) {
  console.error(`main.ts: POST.json is not a file: ${source}`);
  process.exit(1);
}

try {
  mkdirSync(outDir, { recursive: true });
  copyFileSync(source, target);
  // Verify the copy is byte-identical: the two grader runs must agree.
  const before: Buffer = readFileSync(source);
  const after: Buffer = readFileSync(target);
  if (!before.equals(after)) {
    console.error(`main.ts: copied POST.json differs from source: ${target}`);
    process.exit(1);
  }
} catch (err) {
  const reason: string = err instanceof Error ? err.message : String(err);
  console.error(`main.ts: failed to copy POST.json to ${target}: ${reason}`);
  process.exit(1);
}
