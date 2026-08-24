/**
 * 地圖網格渲染效能基準腳本
 *
 * 目的：量測 `MapGrid` 每格渲染的「純 JS 計算成本」——即每格對 11 類實體
 * 的 filter 過濾、以及 `getCellVisibility` 的呼叫成本。這是優化 B（實體索引）
 * 與優化 C（參數快取）能改善的部分。
 *
 * 注意：本腳本量測的是 JS 計算層，不包含 DOM layout/paint（那需要瀏覽器）。
 * 若此處耗時低但遊戲仍卡，代表主因是 DOM 渲染，需走優化 A（視窗化/Canvas）。
 *
 * 用法：node scripts/benchmarkMapGrid.mjs
 */
import { performance } from 'node:perf_hooks'

const CONFIG = {
  sizes: [
    { rows: 40, columns: 40 },
    { rows: 50, columns: 50 },
    { rows: 80, columns: 80 },
  ],
  // 每類實體數量（模擬中後期地圖）
  entities: {
    players: 4,
    creatures: 40,
    bases: 8,
    creatureNests: 12,
    resourcePoints: 20,
    defenseStructures: 15,
    itemPoints: 15,
    explorationEvents: 20,
    ruins: 15,
    traps: 10,
    sectGates: 6,
  },
  iterations: 20, // 每個尺寸重複量測次數，取中位數
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

/** 建立地圖與實體資料（模擬 MapGrid 收到的 props）。 */
function buildWorld(rows, columns) {
  const cells = Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
    return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
  })

  const map = { rows, columns, cells }

  // 隨機散布實體到非邊界格
  const interior = cells.filter((cell) => cell.terrain !== 'wall')
  const pick = () => interior[Math.floor(Math.random() * interior.length)]

  const makeEntities = (count, factory) =>
    Array.from({ length: count }, (_, index) => factory(pick(), index))

  const entities = {
    players: makeEntities(CONFIG.entities.players, (pos, i) => ({ id: `p${i}`, position: pos, health: 100 })),
    creatures: makeEntities(CONFIG.entities.creatures, (pos, i) => ({ id: `c${i}`, position: pos, health: 50 })),
    bases: makeEntities(CONFIG.entities.bases, (pos, i) => ({ id: `b${i}`, position: pos })),
    creatureNests: makeEntities(CONFIG.entities.creatureNests, (pos, i) => ({ id: `n${i}`, position: pos, health: 80 })),
    resourcePoints: makeEntities(CONFIG.entities.resourcePoints, (pos, i) => ({ id: `r${i}`, position: pos })),
    defenseStructures: makeEntities(CONFIG.entities.defenseStructures, (pos, i) => ({ id: `d${i}`, position: pos })),
    itemPoints: makeEntities(CONFIG.entities.itemPoints, (pos, i) => ({ id: `i${pos.row}-${pos.column}-${i}`, position: pos })),
    explorationEvents: makeEntities(CONFIG.entities.explorationEvents, (pos, i) => ({ id: `e${i}`, position: pos, status: 'available' })),
    ruins: makeEntities(CONFIG.entities.ruins, (pos, i) => ({ id: `ru${i}`, position: pos, status: 'intact' })),
    traps: makeEntities(CONFIG.entities.traps, (pos, i) => ({ id: `t${i}`, position: pos })),
    sectGates: makeEntities(CONFIG.entities.sectGates, (pos, i) => ({ id: `s${i}`, position: pos })),
  }

  return { map, ...entities }
}

/**
 * 模擬 MapGrid 目前的每格渲染計算（優化前）。
 * 對每格做 11 次 filter + 一次 visibility 計算。
 */
function renderCellsNaive(world) {
  const { map, ...entities } = world
  const { rows, columns, cells } = map
  const visibleIds = new Set(cells.map((cell) => cell.id)) // 簡化：全可見

  let checks = 0
  for (const cell of cells) {
    // 模擬 11 類實體的 filter（與 MapGrid 相同模式）
    const playersHere = entities.players.filter((p) => p.position.row === cell.row && p.position.column === cell.column)
    const creaturesHere = entities.creatures.filter((c) => c.position.row === cell.row && c.position.column === cell.column)
    const basesHere = entities.bases.filter((b) => b.position.row === cell.row && b.position.column === cell.column)
    const nestsHere = entities.creatureNests.filter((n) => n.position.row === cell.row && n.position.column === cell.column)
    const resourcesHere = entities.resourcePoints.filter((r) => r.position.row === cell.row && r.position.column === cell.column)
    const structuresHere = entities.defenseStructures.filter((d) => d.position.row === cell.row && d.position.column === cell.column)
    const itemsHere = entities.itemPoints.filter((i) => i.position.row === cell.row && i.position.column === cell.column)
    const eventsHere = entities.explorationEvents.filter((e) => e.status === 'available' && e.position.row === cell.row && e.position.column === cell.column)
    const ruinsHere = entities.ruins.filter((r) => r.status === 'intact' && r.position.row === cell.row && r.position.column === cell.column)
    const trapsHere = entities.traps.filter((t) => t.position.row === cell.row && t.position.column === cell.column)
    const gatesHere = entities.sectGates.filter((s) => s.position.row === cell.row && s.position.column === cell.column)

    // 模擬 visibility 計算（簡化：查 Set）
    const isVisible = visibleIds.has(cell.id)

    checks += playersHere.length + creaturesHere.length + basesHere.length + nestsHere.length
      + resourcesHere.length + structuresHere.length + itemsHere.length + eventsHere.length
      + ruinsHere.length + trapsHere.length + gatesHere.length + (isVisible ? 1 : 0)
  }
  return checks
}

/**
 * 模擬優化 B（實體索引）後的每格渲染計算。
 * 先建一次索引，每格 O(1) 查詢。
 */
function renderCellsIndexed(world) {
  const { map, ...entities } = world
  const { cells } = map
  const visibleIds = new Set(cells.map((cell) => cell.id))

  // 優化 B：建立實體位置索引（O(實體數) 一次）
  const index = new Map()
  for (const [key, list] of Object.entries(entities)) {
    for (const entity of list) {
      const id = `${entity.position.row}-${entity.position.column}`
      if (!index.has(id)) index.set(id, {})
      index.get(id)[key] = (index.get(id)[key] ?? []).concat(entity)
    }
  }

  let checks = 0
  for (const cell of cells) {
    const here = index.get(cell.id) ?? {}
    const isVisible = visibleIds.has(cell.id)
    checks += Object.values(here).reduce((sum, list) => sum + list.length, 0) + (isVisible ? 1 : 0)
  }
  return checks
}

function benchmark() {
  console.log('=== 地圖網格渲染效能基準（JS 計算層） ===\n')
  console.log(`實體數量：${JSON.stringify(CONFIG.entities)}\n`)
  console.log('尺寸\t\t優化前(ms)\t優化B後(ms)\t加速比\t\t每格檢查數')

  for (const { rows, columns } of CONFIG.sizes) {
    const world = buildWorld(rows, columns)
    const cellCount = rows * columns

    const naiveTimes = []
    const indexedTimes = []
    for (let i = 0; i < CONFIG.iterations; i++) {
      const t0 = performance.now()
      renderCellsNaive(world)
      naiveTimes.push(performance.now() - t0)

      const t1 = performance.now()
      renderCellsIndexed(world)
      indexedTimes.push(performance.now() - t1)
    }

    const naive = median(naiveTimes)
    const indexed = median(indexedTimes)
    const speedup = naive / indexed
    const checksPerCell = Math.round(renderCellsNaive(world) / cellCount)

    console.log(
      `${rows}×${columns}\t\t${naive.toFixed(2)}\t\t${indexed.toFixed(2)}\t\t` +
      `${speedup.toFixed(2)}×\t\t${checksPerCell}`,
    )
  }

  console.log('\n說明：')
  console.log('- 此基準僅量測 JS 計算層（filter + visibility），不含 DOM layout/paint。')
  console.log('- 若優化 B 後耗時已極低但遊戲仍卡，代表主因是 DOM 渲染，需走優化 A。')
}

benchmark()
