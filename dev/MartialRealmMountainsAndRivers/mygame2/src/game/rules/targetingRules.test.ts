import { describe, expect, it } from 'vitest'
import {
  resolveTargetShapeCells,
  resolveTargetableCellIds,
  resolveTargetingSpec,
} from './targetingRules'
import type { TargetingSpec } from '../types'

const map = { rows: 10, columns: 10, cells: [] }

describe('resolveTargetShapeCells', () => {
  it('radius(1) 涵蓋周遭 4 格，不含中心', () => {
    const ids = resolveTargetShapeCells({ kind: 'radius', range: 1 }, { row: 5, column: 5 }, map as never)
    expect(ids.has('4-5')).toBe(true)   // 上
    expect(ids.has('6-5')).toBe(true)   // 下
    expect(ids.has('5-4')).toBe(true)   // 左
    expect(ids.has('5-6')).toBe(true)   // 右
    expect(ids.has('5-5')).toBe(false)  // 中心排除
    expect(ids.has('4-4')).toBe(false)  // 對角線排除
    expect(ids.size).toBe(4)
  })

  it('radius(3) 涵蓋曼哈頓距離 3 內的所有格', () => {
    const ids = resolveTargetShapeCells({ kind: 'radius', range: 3 }, { row: 5, column: 5 }, map as never)
    expect(ids.has('5-8')).toBe(true)   // 距離 3
    expect(ids.has('7-6')).toBe(true)   // 距離 3
    expect(ids.has('5-9')).toBe(false)  // 距離 4
    // 曼哈頓菱形：距離 ≤ 3 的格數 = 2*3*(3+1) = 24
    expect(ids.size).toBe(24)
  })

  it('cross(length=2) 只涵蓋十字線', () => {
    const ids = resolveTargetShapeCells({ kind: 'cross', length: 2 }, { row: 5, column: 5 }, map as never)
    expect(ids.has('3-5')).toBe(true)   // 上 2
    expect(ids.has('5-7')).toBe(true)   // 右 2
    expect(ids.has('4-4')).toBe(false)  // 對角線排除
    expect(ids.size).toBe(8)
  })

  it('越界格子被扣除', () => {
    const cornerMap = { rows: 5, columns: 5, cells: [] }
    const ids = resolveTargetShapeCells({ kind: 'radius', range: 3 }, { row: 0, column: 0 }, cornerMap as never)
    // 不會有負座標
    expect(ids.has('-1-0')).toBe(false)
  })
})

describe('resolveTargetableCellIds', () => {
  const creatures = [
    { id: 'c1', name: 'c1', position: { row: 5, column: 6 }, health: 10 },
    { id: 'c2', name: 'c2', position: { row: 8, column: 8 }, health: 10 },
  ]
  const nests = [
    { id: 'n1', name: 'n1', position: { row: 5, column: 4 }, health: 50 },
  ]

  it('只回傳形狀範圍內實際站有目標的格', () => {
    const spec: TargetingSpec = {
      shape: { kind: 'radius', range: 1 },
      mode: { kind: 'single' },
      targetTypes: ['creature', 'nest'],
      hint: '',
      source: 'attack',
    }
    const ids = resolveTargetableCellIds(map as never, creatures as never, nests as never, spec, { row: 5, column: 5 })
    expect(ids.has('5-6')).toBe(true)   // c1 相鄰
    expect(ids.has('5-4')).toBe(true)   // n1 相鄰
    expect(ids.has('8-8')).toBe(false)  // c2 距離外
  })

  it('依 targetTypes 過濾目標', () => {
    const spec: TargetingSpec = {
      shape: { kind: 'radius', range: 10 },
      mode: { kind: 'all' },
      targetTypes: ['creature'],
      hint: '',
      source: 'external-skill',
    }
    const ids = resolveTargetableCellIds(map as never, creatures as never, nests as never, spec, { row: 5, column: 5 })
    expect(ids.has('8-8')).toBe(true)
    expect(ids.has('5-4')).toBe(false)  // nest 被過濾
  })
})

describe('resolveTargetingSpec', () => {
  it('普通攻擊對應相鄰 single', () => {
    const spec = resolveTargetingSpec({ type: 'targeting-attack' })
    expect(spec).toMatchObject({
      shape: { kind: 'radius', range: 1 },
      mode: { kind: 'single' },
      source: 'attack',
    })
  })

  it('元素爆發道具對應相鄰 single', () => {
    const spec = resolveTargetingSpec({ type: 'targeting-item', itemId: 'fire-thunder-talisman' })
    expect(spec).toMatchObject({ source: 'item-burst', mode: { kind: 'single' } })
  })

  it('無 shape/range 的外功推導為 radius(1) + single', () => {
    const spec = resolveTargetingSpec({ type: 'targeting-external-skill', skillId: 'sky-breaking-palm' })
    expect(spec).toMatchObject({
      shape: { kind: 'radius', range: 1 },
      mode: { kind: 'single' },
      source: 'external-skill',
    })
  })

  it('unknown skillId 回退到目錄第一個外功（無範圍，推導 radius(1)）', () => {
    const spec = resolveTargetingSpec({ type: 'targeting-external-skill', skillId: 'does-not-exist' })
    expect(spec?.shape).toEqual({ kind: 'radius', range: 1 })
  })

  it('非選取模式回傳 null', () => {
    expect(resolveTargetingSpec({ type: 'idle' })).toBeNull()
  })
})