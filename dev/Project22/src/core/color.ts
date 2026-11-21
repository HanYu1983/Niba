export type RGBA = [number, number, number, number];

export type PaletteMap = ReadonlyMap<string, RGBA>;

export class ColorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColorError";
  }
}

const NAMED_COLORS: Record<string, RGBA> = {
  black: [0, 0, 0, 255],
  white: [255, 255, 255, 255],
  silver: [192, 192, 192, 255],
  gray: [128, 128, 128, 255],
  grey: [128, 128, 128, 255],
  red: [255, 0, 0, 255],
  maroon: [128, 0, 0, 255],
  orange: [255, 165, 0, 255],
  gold: [255, 215, 0, 255],
  yellow: [255, 255, 0, 255],
  olive: [128, 128, 0, 255],
  lime: [0, 255, 0, 255],
  green: [0, 128, 0, 255],
  teal: [0, 128, 128, 255],
  cyan: [0, 255, 255, 255],
  aqua: [0, 255, 255, 255],
  blue: [0, 0, 255, 255],
  navy: [0, 0, 128, 255],
  purple: [128, 0, 128, 255],
  magenta: [255, 0, 255, 255],
  fuchsia: [255, 0, 255, 255],
  pink: [255, 192, 203, 255],
  brown: [165, 42, 42, 255],
  transparent: [0, 0, 0, 0],
  none: [0, 0, 0, 0],
};

export function clampByte(value: number, context = "color channel"): number {
  if (!Number.isFinite(value)) {
    throw new ColorError(`${context} must be a finite number, got ${String(value)}.`);
  }
  return Math.max(0, Math.min(255, Math.round(value)));
}

function lookupPalette(name: string, palette?: PaletteMap): RGBA | undefined {
  if (!palette || palette.size === 0) return undefined;
  const direct = palette.get(name);
  if (direct) return [...direct] as RGBA;
  const lower = name.toLowerCase();
  for (const [key, value] of palette) {
    if (key.toLowerCase() === lower) return [...value] as RGBA;
  }
  return undefined;
}

/** True when a color input explicitly means "leave the pixel unchanged". */
export function isTransparentInput(input: unknown): boolean {
  if (typeof input !== "string") return false;
  const lower = input.trim().toLowerCase();
  return lower === "transparent" || lower === "none" || lower === "";
}

function parseHex(hex: string): RGBA {
  const expand = (ch: string) => parseInt(ch + ch, 16);
  if (hex.length === 3) {
    return [expand(hex[0]!), expand(hex[1]!), expand(hex[2]!), 255];
  }
  if (hex.length === 4) {
    return [expand(hex[0]!), expand(hex[1]!), expand(hex[2]!), expand(hex[3]!)];
  }
  const byte = (offset: number) => parseInt(hex.slice(offset, offset + 2), 16);
  if (hex.length === 6) {
    return [byte(0), byte(2), byte(4), 255];
  }
  return [byte(0), byte(2), byte(4), byte(6)];
}

function parseFunctional(input: string): RGBA {
  const match = /^rgba?\(\s*([^)]*)\)$/i.exec(input);
  if (!match) throw new ColorError(`Invalid color "${input}".`);
  const parts = (match[1] ?? "").trim().split(/[\s,/]+/).filter(Boolean);
  if (parts.length !== 3 && parts.length !== 4) {
    throw new ColorError(`Invalid color "${input}". Expected rgb(r, g, b) or rgba(r, g, b, a).`);
  }
  const num = (part: string): number => {
    const value = Number.parseFloat(part);
    if (Number.isNaN(value)) throw new ColorError(`Invalid number "${part}" in color "${input}".`);
    return value;
  };
  const channel = (part: string) => clampByte(num(part), `channel in "${input}"`);
  const rgb: RGBA = [channel(parts[0]!), channel(parts[1]!), channel(parts[2]!), 255];
  if (parts.length === 4) {
    const raw = parts[3]!;
    const value = num(raw);
    if (raw.endsWith("%")) {
      rgb[3] = clampByte((value / 100) * 255, `alpha in "${input}"`);
    } else if (value <= 1) {
      rgb[3] = clampByte(value * 255, `alpha in "${input}"`);
    } else {
      rgb[3] = clampByte(value, `alpha in "${input}"`);
    }
  }
  return rgb;
}

/**
 * Parse #RGB / #RGBA / #RRGGBB / #RRGGBBAA, rgb()/rgba(), named CSS-ish colors,
 * palette keys, [r,g,b,(a)] arrays or {r,g,b,a} objects into an RGBA tuple.
 */
export function parseColor(input: unknown, palette?: PaletteMap): RGBA {
  if (Array.isArray(input)) {
    if (input.length !== 3 && input.length !== 4) {
      throw new ColorError(`Color arrays must have 3 or 4 entries, got ${input.length}.`);
    }
    const values = input.map((v) => {
      if (typeof v !== "number") throw new ColorError(`Color array entries must be numbers, got ${typeof v}.`);
      return v;
    });
    return [
      clampByte(values[0]!, "red"),
      clampByte(values[1]!, "green"),
      clampByte(values[2]!, "blue"),
      values.length === 4 ? clampByte(values[3]!, "alpha") : 255,
    ];
  }

  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (typeof obj.r !== "number" || typeof obj.g !== "number" || typeof obj.b !== "number") {
      throw new ColorError(`Color objects must have numeric r, g and b properties.`);
    }
    return [
      clampByte(obj.r, "red"),
      clampByte(obj.g, "green"),
      clampByte(obj.b, "blue"),
      typeof obj.a === "number" ? clampByte(obj.a, "alpha") : 255,
    ];
  }

  if (typeof input !== "string") {
    throw new ColorError(`Color must be a string, array or {r,g,b,a} object, got ${typeof input}.`);
  }

  const raw = input.trim();
  if (!raw) throw new ColorError(`Color must not be empty.`);

  const fromPalette = lookupPalette(raw, palette);
  if (fromPalette) return fromPalette;

  const lower = raw.toLowerCase();

  if (/^rgba?\(/i.test(raw)) return parseFunctional(raw);

  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  if (/^[0-9a-f]{3,8}$/i.test(hex)) {
    if (hex.length !== 3 && hex.length !== 4 && hex.length !== 6 && hex.length !== 8) {
      throw new ColorError(`Invalid hex color "${input}". Use 3, 4, 6 or 8 hex digits.`);
    }
    return parseHex(hex);
  }
  if (raw.startsWith("#")) {
    throw new ColorError(`Invalid hex color "${input}". Use 3, 4, 6 or 8 hex digits.`);
  }

  const named = NAMED_COLORS[lower];
  if (named) return [...named] as RGBA;

  const paletteKeys = palette ? [...palette.keys()].slice(0, 20) : [];
  const hint = paletteKeys.length ? ` Palette keys: ${paletteKeys.join(", ")}.` : "";
  throw new ColorError(
    `Unknown color "${input}". Use #RGB, #RRGGBB, #RRGGBBAA, "rgb(...)", "transparent", an [r,g,b,a] array, or a palette key.${hint}`,
  );
}

export function rgbaToHex(color: RGBA, includeAlpha = false): string {
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const base = `#${hex(color[0])}${hex(color[1])}${hex(color[2])}`;
  const value = includeAlpha || color[3] < 255 ? `${base}${hex(color[3])}` : base;
  return value.toUpperCase();
}

export function colorsEqual(a: RGBA, b: RGBA, tolerance = 0): boolean {
  return (
    Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance &&
    Math.abs(a[3] - b[3]) <= tolerance
  );
}

export function colorDistanceSq(r: number, g: number, b: number, color: RGBA): number {
  const dr = r - color[0];
  const dg = g - color[1];
  const db = b - color[2];
  return dr * dr + dg * dg + db * db;
}
