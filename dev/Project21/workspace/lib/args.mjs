/**
 * Tiny argv parser shared by every workspace tool.
 *
 *   --plan test_story3/plan.ch0.json     -> { plan: "test_story3/plan.ch0.json" }
 *   --async                              -> { async: true }
 *   --wait false                         -> { wait: "false" }
 *   --no-turbo                           -> { "no-turbo": true }
 *   seg_002                              -> { _: ["seg_002"] }
 */

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    if (eq !== -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
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

/** `--flag false` / `--no-flag` both work; anything else is a string. */
export function boolArg(args, name, fallback) {
  if (args[`no-${name}`] === true) return false;
  const v = args[name];
  if (v === undefined) return fallback;
  if (v === true) return true;
  return !["false", "0", "no", "off"].includes(String(v).toLowerCase());
}

export function numArg(args, name, fallback) {
  const v = args[name];
  if (v === undefined || v === true) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`--${name} must be a number, got ${JSON.stringify(v)}`);
  return n;
}

/** `--only a,b --only c` -> ["a","b","c"]; missing -> []. */
export function listArg(args, name) {
  const v = args[name];
  if (v === undefined) return [];
  const raw = Array.isArray(v) ? v : [v];
  return raw.flatMap((x) => String(x).split(",")).map((x) => x.trim()).filter(Boolean);
}

/** Fail with a usage block instead of a stack trace. */
export function usage(message, lines) {
  console.error([message, "", ...lines].join("\n"));
  process.exit(2);
}
