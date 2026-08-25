import type {
  GameOperation,
  MapState,
  Position,
  SelectionMode,
  TargetingShape,
  TargetingSource,
  TargetingSpec,
} from '../types'
import { getExternalSkill } from './skillRules'

/**
 * 攻擊目標選取抽象（Targeting Rules）
 *
 * 將「使用 → 顯示高亮 → 選擇對象」流程抽象為「範圍形狀 (Shape) × 選取模式 (Mode)」。
 * - Shape：決定哪些格子是合法目標（radius / cross / line / custom）。
 * - Mode：決定如何選取、命中多少目標（single / all / multi）。
 *
 * 對齊 `reports/system/targeting-flow-abstraction-design.md`。
 */

/** 依形狀與原點，回傳所有「合法目標格」的 cell id 集合（純函式）。 */
export function resolveTargetShapeCells(shape: TargetingShape, origin: Position, map: MapState): Set<string> {
  const ids = new Set<string>()
  const addCell = (row: number, column: number) => {
    // 僅加入存在於地圖上的格子
    if (row >= 0 && row < map.rows && column >= 0 && column < map.columns) {
      ids.add(`${row}-${column}`)
    }
  }

  switch (shape.kind) {
    case 'radius': {
      for (let dRow = -shape.range; dRow <= shape.range; dRow += 1) {
        for (let dCol = -shape.range; dCol <= shape.range; dCol += 1) {
          const distance = Math.abs(dRow) + Math.abs(dCol)
          // 曼哈頓距離在範圍內、且非中心點自身（距離 0 排除）
          if (distance > 0 && distance <= shape.range) {
            addCell(origin.row + dRow, origin.column + dCol)
          }
        }
      }
      break
    }
    case 'cross': {
      for (let i = 1; i <= shape.length; i += 1) {
        addCell(origin.row - i, origin.column)
        addCell(origin.row + i, origin.column)
        addCell(origin.row, origin.column - i)
        addCell(origin.row, origin.column + i)
      }
      break
    }
    case 'line': {
      // 目前僅支援「向下」方向佔位；完整方向需搭配朝向參數，留待後續。
      for (let i = 1; i <= shape.length; i += 1) {
        addCell(origin.row + i, origin.column)
      }
      break
    }
    case 'custom': {
      for (const cellId of shape.cellIds) ids.add(cellId)
      break
    }
  }
  return ids
}

/** 依規格計算「合法目標格」集合（形狀範圍 ∩ 實際站有目標）。供 MapGrid 高亮使用。 */
export function resolveTargetableCellIds(
  map: MapState,
  creatures: Array<{ position: Position; health: number; id: string }>,
  creatureNests: Array<{ position: Position; health: number; id: string }>,
  spec: TargetingSpec,
  origin: Position,
): Set<string> {
  const shapeCells = resolveTargetShapeCells(spec.shape, origin, map)
  const occupied = [
    ...creatures
      .filter((c) => c.health > 0 && spec.targetTypes.includes('creature'))
      .map((c) => `${c.position.row}-${c.position.column}`),
    ...creatureNests
      .filter((n) => n.health > 0 && spec.targetTypes.includes('nest'))
      .map((n) => `${n.position.row}-${n.position.column}`),
  ]
  const result = new Set<string>()
  for (const cellId of occupied) {
    if (shapeCells.has(cellId)) result.add(cellId)
  }
  return result
}

/** 依 operation 產生目標選取規格；回傳 null 表示目前不處於選取模式。 */
export function resolveTargetingSpec(
  operation: GameOperation,
  skillId?: string,
): TargetingSpec | null {
  switch (operation.type) {
    case 'targeting-attack':
      return {
        shape: { kind: 'radius', range: 1 },
        mode: { kind: 'single' },
        targetTypes: ['creature', 'nest'],
        hint: '請點選相鄰的生物或巢穴作為攻擊目標',
        source: 'attack',
      }
    case 'targeting-item':
      return {
        shape: { kind: 'radius', range: 1 },
        mode: { kind: 'single' },
        targetTypes: ['creature', 'nest'],
        hint: '請點選相鄰的生物或巢穴作為道具目標',
        source: 'item-burst',
      }
    case 'targeting-external-skill': {
      const skill = skillId ? getExternalSkill(skillId) : undefined
      const shape: TargetingShape = skill?.shape ?? { kind: 'radius', range: skill?.range ?? 1 }
      const mode: SelectionMode = skill?.selectionMode ?? { kind: 'single' }
      const source: TargetingSource = 'external-skill'
      const baseTargets: TargetingSpec['targetTypes'] = skill?.target === 'nest'
        ? ['nest']
        : ['creature', 'nest']
      const hint = mode.kind === 'all'
        ? '範圍內的所有目標將同時受到攻擊'
        : shape.kind === 'radius' && shape.range > 1
          ? `請點選 ${shape.range} 格內的可攻擊目標`
          : '請點選相鄰的生物或巢穴作為外功目標'
      return { shape, mode, targetTypes: baseTargets, hint, source }
    }
    default:
      return null
  }
}