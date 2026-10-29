/**
 * File IO for the json-editor MCP server.
 *
 * Design goals (these are what make this safer than editing text by hand):
 *   - atomic write   : write tmp then rename, never leave a half-written JSON
 *   - format keep    : detect indent / EOL / BOM / trailing newline and preserve them
 *   - optimistic lock: return sha256 so callers can pass expect_sha256 on the next write
 *   - jsonc tolerant : optionally strip comments / trailing commas (writes become lossy -> flagged)
 */

import { readFileSync, writeFileSync, renameSync, existsSync, statSync, mkdirSync, copyFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";

export const sha256 = (s) => createHash("sha256").update(s).digest("hex");

// ---------- JSONC stripping ----------

/** Remove // and block comments plus trailing commas, without touching string contents. */
export function stripJsonc(text) {
  const n = text.length;
  let i = 0;
  let out = "";

  const skipTrivia = (j) => {
    for (;;) {
      while (j < n && /\s/.test(text[j])) j++;
      if (text[j] === "/" && text[j + 1] === "/") {
        while (j < n && text[j] !== "\n") j++;
        continue;
      }
      if (text[j] === "/" && text[j + 1] === "*") {
        j += 2;
        while (j < n && !(text[j] === "*" && text[j + 1] === "/")) j++;
        j += 2;
        continue;
      }
      return j;
    }
  };

  while (i < n) {
    const c = text[i];

    if (c === '"') {
      out += c;
      i++;
      while (i < n) {
        const d = text[i];
        out += d;
        i++;
        if (d === "\\") {
          if (i < n) {
            out += text[i];
            i++;
          }
          continue;
        }
        if (d === '"') break;
      }
      continue;
    }

    if (c === "/" && text[i + 1] === "/") {
      while (i < n && text[i] !== "\n") i++;
      continue;
    }

    if (c === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < n && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    if (c === ",") {
      const j = skipTrivia(i + 1);
      if (j < n && (text[j] === "}" || text[j] === "]")) {
        i++;
        continue;
      }
    }

    out += c;
    i++;
  }

  return out;
}

// ---------- format detection ----------

function detectIndent(text) {
  const m = /\n([ \t]+)\S/.exec(text);
  if (!m) return 2;
  const ws = m[1];
  if (ws.includes("\t")) return "\t";
  return ws.length >= 1 && ws.length <= 10 ? ws.length : 2;
}

function invalidJsonError(file, text, err) {
  const msg = String(err.message ?? err);
  const pos = /position (\d+)/.exec(msg);
  let where = "";
  if (pos) {
    const p = Number(pos[1]);
    const before = text.slice(0, p);
    const line = before.split("\n").length;
    const col = p - before.lastIndexOf("\n");
    const from = Math.max(0, p - 60);
    const to = Math.min(text.length, p + 60);
    const snippet = text.slice(from, to).replace(/\n/g, "\\n");
    where = `\n  at line ${line}, column ${col}\n  ...${snippet}...\n  ${" ".repeat(Math.min(p - from, 60))}^`;
  }
  return new Error(`invalid JSON in ${file}: ${msg}${where}`);
}

// ---------- read / write ----------

/**
 * @param {string} file
 * @param {{lenient?: boolean}} opts
 */
export function readJson(file, { lenient = false } = {}) {
  const abs = resolve(file);
  if (!existsSync(abs)) throw new Error(`file not found: ${abs}`);

  const stat = statSync(abs);
  if (stat.isDirectory()) throw new Error(`path is a directory: ${abs}`);

  const raw = readFileSync(abs, "utf-8");
  const bom = raw.charCodeAt(0) === 0xfeff;
  const text = bom ? raw.slice(1) : raw;

  let data;
  let lossy = false;
  try {
    data = JSON.parse(text);
  } catch (err) {
    if (!lenient) throw invalidJsonError(abs, text, err);
    try {
      data = JSON.parse(stripJsonc(text));
    } catch (err2) {
      throw invalidJsonError(abs, text, err);
    }
    lossy = true;
  }

  return {
    abs,
    data,
    raw,
    text,
    bom,
    indent: detectIndent(text),
    eol: text.includes("\r\n") ? "\r\n" : "\n",
    trailingNewline: /\r?\n$/.test(text),
    sha256: sha256(raw),
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    lossy
  };
}

export function formatJson(data, fmt, overrides = {}) {
  const indent = overrides.indent ?? fmt.indent;
  const eol = overrides.eol ?? fmt.eol;
  let text = JSON.stringify(data, null, indent);
  if (text === undefined) throw new Error("value cannot be serialized to JSON (undefined)");
  if (eol === "\r\n") text = text.replace(/\n/g, "\r\n");
  if (fmt.trailingNewline) text += eol;
  return (fmt.bom ? "\uFEFF" : "") + text;
}

/** Write JSON atomically. Returns { sha256, bytes }. */
export function writeJsonAtomic(abs, data, fmt, overrides = {}) {
  const text = formatJson(data, fmt, overrides);
  mkdirSync(dirname(abs), { recursive: true });
  const tmp = `${abs}.tmp_${Date.now()}_${process.pid}_${Math.floor(Math.random() * 1e9)}`;
  writeFileSync(tmp, text, "utf-8");
  renameSync(tmp, abs);
  return { sha256: sha256(text), bytes: Buffer.byteLength(text) };
}

export function backupFile(abs) {
  const dst = `${abs}.bak`;
  copyFileSync(abs, dst);
  return dst;
}
