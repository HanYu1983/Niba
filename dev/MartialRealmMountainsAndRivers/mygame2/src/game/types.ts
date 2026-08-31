/**
 * 型別總出口（backward-compatible barrel）。
 *
 * 型別已拆分至 `game/types/*` 各模組，此檔保留所有既有 export 以維持向後相容，
 * 讓既有 `import ... from './types'` 不需改動。新程式碼建議直接從各子模組 import。
 */
export * from './types/geometry'
export * from './types/entities'
export * from './types/map'
export * from './types/combat'
export * from './types/campaign'
export * from './types/ai'
export * from './types/runStats'
export * from './types/gameState'