export type RandomSource = () => number

/** 全域隨機來源：預設為 Math.random()，測試可透過 setGlobalRandomSource 覆寫以取得決定性。 */
let globalRandomSource: RandomSource = () => Math.random()

export const defaultRandomSource: RandomSource = () => globalRandomSource()

/** 覆寫全域隨機來源（測試用）。傳入 null 恢復為 Math.random()。 */
export function setGlobalRandomSource(source: RandomSource | null): void {
  globalRandomSource = source ?? (() => Math.random())
}

/** 以固定 seed 覆寫全域隨機來源，回傳可還原的還原函式。 */
export function seedGlobalRandom(seed: number): () => void {
  const previous = globalRandomSource
  globalRandomSource = createSeededRandom(seed)
  return () => { globalRandomSource = previous }
}

/**
 * MurmurHash3 的 finalizer（fmix32）：對輸入做雪崩攪拌，
 * 讓相鄰 seed（例如 6666666 與 6666667）產生差異極大的隨機序列，
 * 避免線性同餘生成器（LCG）「相近 seed 輸出相近」的缺陷。
 */
export function mixSeed(seed: number): number {
  let hash = seed >>> 0
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85ebca6b)
  hash ^= hash >>> 13
  hash = Math.imul(hash, 0xc2b2ae35)
  hash ^= hash >>> 16
  return hash >>> 0
}

export function createSeededRandom(seed: number): RandomSource {
  let state = mixSeed(seed)
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function rollChance(chance: number, random: RandomSource = defaultRandomSource): boolean {
  return random() < chance
}

export function pickRandom<T>(items: T[], random: RandomSource = defaultRandomSource): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(random() * items.length)]
}

export function rollWeighted<T>(items: Array<{ value: T; weight: number }>, random: RandomSource = defaultRandomSource): T | undefined {
  const totalWeight = items.reduce((total, item) => total + Math.max(0, item.weight), 0)
  if (totalWeight <= 0) return undefined
  let roll = random() * totalWeight
  for (const item of items) {
    roll -= Math.max(0, item.weight)
    if (roll < 0) return item.value
  }
  return items[items.length - 1]?.value
}