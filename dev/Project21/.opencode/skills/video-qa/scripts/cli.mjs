/**
 * Shared argument handling for the QA scripts.
 *
 * `node sheet.mjs render/*.mp4` only works when the *shell* expands the glob. PowerShell does,
 * quoted arguments and cmd/bash do not, so the scripts expand it themselves — a literal
 * `block_00[123]_*.mp4` would otherwise be reported as a missing file.
 */

import { globSync } from "node:fs";

export function parseArgs(argv) {
  const out = { files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out.files.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const GLOB = /[*?[\]]/;

/** Expand wildcards; unmatched patterns are passed through so the caller reports them. */
export function expandFiles(files) {
  const out = [];
  for (const file of files) {
    if (!GLOB.test(file)) {
      out.push(file);
      continue;
    }
    const hits = globSync(file.replaceAll("\\", "/")).sort();
    if (hits.length === 0) out.push(file);
    else out.push(...hits);
  }
  return out;
}
