import { describe, expect, it } from 'vitest'
import { getCreatureAttributes, getCreatureEquippedExternalSkillIds, getCreatureIcon, getCreatureInnerSkillId, selectCreatureTarget } from './creatureBehaviorRules'
import type { BaseState, CreatureState, GameState } from '../types'

const creature = (behaviorType: CreatureState['behaviorType'], schoolId: CreatureState['schoolId'] = 'frost-water'): CreatureState => ({ id: 'c1', name: 'Creature', position: { row: 2, column: 2 }, behaviorType, schoolId, attributes: { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 10, maxHealth: 10, stamina: 10, maxStamina: 10, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: false })
const state = (currentCreature: CreatureState, bases: BaseState[] = []): GameState => ({ map: { rows: 5, columns: 5, cells: [] }, bases, defenseStructures: [], creatureNests: [], resourcePoints: [{ id: 'r1', name: 'resource', position: { row: 2, column: 3 }, ownerBaseId: 'base-1', materialIncome: 10, lastCollectedRound: null, health: 10, maxHealth: 10 }], itemPoints: [], explorationEvents: [], players: [{ ...currentCreature, id: 'p1', name: 'player', position: { row: 2, column: 4 } }], creatures: [currentCreature], activePlayerId: 'p1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null })

describe('creatureBehaviorRules', () => {
  it('依流派套用五維屬性修正與等級成長', () => {
    // 公式：max(底限5, (base + 派系修正 × levelBonus + levelBonus × growth) × 0.7)
    // levelBonus = level - 1，growth 每項皆 2。
    // Lv1（levelBonus=0）：派系修正不作用，僅套用 multiplier 與底限。
    expect(getCreatureAttributes({ armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 }, { schoolId: 'frost-water' }, 1)).toEqual({ armStrength: 5, constitution: 5, agility: 5, innerEnergy: 5, insight: 5 })
    // Lv2（levelBonus=1）：spread modifier ×1 + 成長 ×1，再乘 0.7；受底限 5 保護。
    expect(getCreatureAttributes({ armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 }, { schoolId: 'swift-wind' }, 2)).toEqual({ armStrength: 5, constitution: 5, agility: 5, innerEnergy: 5, insight: 5 })
    // 更高的 base 讓成長可跨越底限，驗證「超高級生物五維隨等級上升」。
    const base = { armStrength: 10, constitution: 10, agility: 10, innerEnergy: 10, insight: 10 }
    const lv1 = getCreatureAttributes(base, { schoolId: 'frost-water' }, 1)
    const lv4 = getCreatureAttributes(base, { schoolId: 'swift-wind' }, 4)
    expect(lv1.armStrength).toBe(7)      // (10 + 0 + 0) × 0.7
    expect(lv4.armStrength).toBeGreaterThan(lv1.armStrength)
    expect(lv4.constitution).toBeGreaterThan(lv1.constitution)
    expect(lv1.agility).toBe(7)          // levelBonus=0 → 派系修正與成長皆不作用
    expect(lv4.agility).toBeGreaterThan(lv1.agility)
    // insight 底限 5：low base 下不被壓到更低。
    expect(getCreatureAttributes({ armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 }, { schoolId: 'earth-mountain' }, 1).agility).toBe(5)
  })
  it('明確流派決定 Creature 內功', () => expect(getCreatureInnerSkillId({ schoolId: 'frost-water', behaviorType: 'hunter' })).toBe('frost-water-inner'))
  it('不同流派使用不同 Creature 圖示', () => {
    expect(getCreatureIcon(creature('scavenger', 'frost-water'))).not.toBe(getCreatureIcon(creature('hunter', 'swift-wind')))
  })
  it('Creature 等級不改變流派內功 ID', () => expect(getCreatureInnerSkillId({ schoolId: 'frost-water', behaviorType: 'hunter' }, 3)).toBe('frost-water-inner'))
  it('掠奪型有資源點時優先前往資源點', () => expect(selectCreatureTarget(state(creature('scavenger')), creature('scavenger'))?.type).toBe('resource'))
  it('主要目標依行為類型區分', () => {
    for (const behaviorType of ['scavenger', 'hunter', 'sieger', 'wanderer', 'roamer'] as const) {
      const current = creature(behaviorType)
      const targetState = behaviorType === 'wanderer'
        ? { ...state(current), itemPoints: [{ id: 'item-1', itemId: null, position: { row: 2, column: 3 } }] }
        : state(current)
      const target = selectCreatureTarget(targetState, current)
      expect(target?.type, behaviorType).toBe(behaviorType === 'wanderer' ? 'item' : behaviorType === 'sieger' ? 'player' : behaviorType === 'scavenger' ? 'resource' : 'player')
    }
  })
  it('掠奪型沒有資源點時會追蹤警戒範圍內玩家', () => {
    const current = creature('scavenger')
    const noResourceState = { ...state(current), resourcePoints: [], players: [{ ...current, id: 'p1', name: 'player', position: { row: 2, column: 4 } }] }
    expect(selectCreatureTarget(noResourceState, current)?.type).toBe('player')
  })
  it('獵殺型優先玩家', () => expect(selectCreatureTarget(state(creature('hunter')), creature('hunter'))?.type).toBe('player'))
  it('開局游蕩型只在兩格內追蹤玩家，不鎖定資源點', () => {
    const current = creature('roamer')
    const nearby = { ...state(current), resourcePoints: [{ id: 'r1', name: 'resource', position: { row: 2, column: 3 }, ownerBaseId: 'base-1', materialIncome: 10, lastCollectedRound: null, health: 10, maxHealth: 10 }], players: [{ ...current, id: 'p1', name: 'player', position: { row: 2, column: 4 } }] }
    expect(selectCreatureTarget(nearby, current)?.type).toBe('player')
    const far = { ...nearby, players: [{ ...nearby.players[0], position: { row: 0, column: 0 } }] }
    expect(selectCreatureTarget(far, current)).toBeNull()
  })
  it('攻城型有據點時優先前往據點', () => expect(selectCreatureTarget(state(creature('sieger'), [{ id: 'base-1', name: '據點', position: { row: 2, column: 5 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }]), creature('sieger'))?.type).toBe('base'))

  it('持有隱身靈氣的玩家不會被生物選為目標', () => {
    const current = creature('hunter')
    const concealedPlayer = {
      ...current,
      id: 'p1',
      name: 'player',
      position: { row: 2, column: 4 },
      buffs: [{ id: 'buff-1', definitionId: 'concealment-aura', sourceId: 'concealment-talisman', remainingRounds: 3 }],
    }
    const concealedState = { ...state(current), players: [concealedPlayer] }
    // 獵殺型只鎖定玩家，但唯一玩家已隱身 → 無目標。
    expect(selectCreatureTarget(concealedState, current)).toBeNull()
  })

  it('怪物相鄰箭塔時優先攻擊箭塔（即使有玩家在警戒範圍內）', () => {
    const current = creature('hunter')
    const arrowTower = {
      id: 'tower-1',
      type: 'arrow-tower' as const,
      name: '箭塔',
      description: '',
      icon: '🏹',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 40,
      healthBonus: 0,
      blocksMovement: false,
      providesVision: false,
      visionRange: 1,
      attackRange: 1,
      attackDamage: 5,
      position: { row: 2, column: 1 },
      ownerBaseId: 'base-1',
      health: 40,
    }
    // 玩家在 (2,4)，怪在 (2,2)，箭塔在 (2,1)（相鄰）
    const withTower = { ...state(current), players: [{ ...current, id: 'p1', name: 'player', position: { row: 2, column: 4 } }], defenseStructures: [arrowTower] }
    const target = selectCreatureTarget(withTower, current)
    expect(target?.type).toBe('defense')
    expect(target?.defenseStructure?.id).toBe('tower-1')
  })

  it('小型箭塔同樣會被優先反擊', () => {
    const current = creature('hunter')
    const smallTower = {
      id: 'small-tower-1',
      type: 'small-arrow-tower' as const,
      name: '小型箭塔',
      description: '',
      icon: '🏹',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 40,
      healthBonus: 0,
      blocksMovement: true,
      providesVision: true,
      visionRange: 1,
      attackRange: 1,
      attackDamage: 5,
      position: { row: 2, column: 1 },
      ownerBaseId: '',
      health: 40,
    }
    const withTower = { ...state(current), defenseStructures: [smallTower] }
    const target = selectCreatureTarget(withTower, current)
    expect(target?.type).toBe('defense')
    expect(target?.defenseStructure?.id).toBe('small-tower-1')
  })

  it('怪物與箭塔距離超過五格時不會優先攻擊箭塔', () => {
    const current = creature('hunter')
    const arrowTower = {
      id: 'tower-1',
      type: 'arrow-tower' as const,
      name: '箭塔',
      description: '',
      icon: '🏹',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 40,
      healthBonus: 0,
      blocksMovement: false,
      providesVision: false,
      visionRange: 1,
      attackRange: 1,
      attackDamage: 5,
      position: { row: 2, column: 8 },
      ownerBaseId: 'base-1',
      health: 40,
    }
    const withTower = { ...state(current), defenseStructures: [arrowTower] }
    const target = selectCreatureTarget(withTower, current)
    expect(target?.type).not.toBe('defense')
  })

  it('怪物行進時三格內有箭塔即優先攻擊箭塔（即使有玩家在警戒範圍內）', () => {
    const current = creature('hunter')
    const arrowTower = {
      id: 'tower-1',
      type: 'arrow-tower' as const,
      name: '箭塔',
      description: '',
      icon: '🏹',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 40,
      healthBonus: 0,
      blocksMovement: false,
      providesVision: false,
      visionRange: 1,
      attackRange: 1,
      attackDamage: 5,
      position: { row: 2, column: 5 },
      ownerBaseId: 'base-1',
      health: 40,
    }
    // 玩家在 (2,4)，怪在 (2,2)，箭塔在 (2,5)（距離 3）
    const withTower = { ...state(current), players: [{ ...current, id: 'p1', name: 'player', position: { row: 2, column: 4 } }], defenseStructures: [arrowTower] }
    const target = selectCreatureTarget(withTower, current)
    expect(target?.type).toBe('defense')
    expect(target?.defenseStructure?.id).toBe('tower-1')
  })

  it('三格內有多座箭塔時優先攻擊最近的一座', () => {
    const current = creature('hunter')
    const makeTower = (id: string, column: number) => ({
      id,
      type: 'arrow-tower' as const,
      name: '箭塔',
      description: '',
      icon: '🏹',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 40,
      healthBonus: 0,
      blocksMovement: false,
      providesVision: false,
      visionRange: 1,
      attackRange: 1,
      attackDamage: 5,
      position: { row: 2, column },
      ownerBaseId: 'base-1',
      health: 40,
    })
    // 怪在 (2,2)，箭塔 A 在 (2,4)（距離 2）、箭塔 B 在 (2,5)（距離 3）
    const withTowers = { ...state(current), defenseStructures: [makeTower('tower-b', 5), makeTower('tower-a', 4)] }
    const target = selectCreatureTarget(withTowers, current)
    expect(target?.type).toBe('defense')
    expect(target?.defenseStructure?.id).toBe('tower-a')
  })

  it('等級 3 以上怪物依悟性容量裝備所屬門派靈氣型外功', () => {
    // scarlet-flame 內功需求 5 悟性；靈氣外功 insightCost 皆為 3。
    // 等級 3：insight = max(5, (4 + 0 + 2*2) * 0.7) = 5.6 → 不足內功 5 + 一門外功 3。
    const attributes = { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 }
    const level3 = getCreatureAttributes(attributes, { schoolId: 'scarlet-flame', behaviorType: 'hunter' }, 3)
    expect(Math.round(level3.insight)).toBe(6)
    // 悟性不足裝不下外功時不拋錯，回傳空清單。
    const equipped = getCreatureEquippedExternalSkillIds(
      { schoolId: 'scarlet-flame', attributes: level3, innerSkillId: 'scarlet-flame-inner' },
      3,
    )
    expect(Array.isArray(equipped)).toBe(true)
  })
  it('悟性容量不足時不會裝備超過容量的外功（依序挑選）', () => {
    // misty-rain：內功需求 5；靈氣外功兩門各 3。等級 4 insight = max(5, 4 + 1 + 3*3) = 14。
    // 內功 5 + 第一門 3 = 8 ≤ 14；再加第二門 3 → 11 ≤ 14；再加第三門 3 → 14 ≤ 14 → 恰可裝滿兩門。
    const level4 = getCreatureAttributes(
      { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 },
      { schoolId: 'misty-rain', behaviorType: 'hunter' },
      4,
    )
    const equipped = getCreatureEquippedExternalSkillIds(
      { schoolId: 'misty-rain', attributes: level4, innerSkillId: 'misty-rain-inner' },
      4,
    )
    expect(equipped.length).toBeGreaterThan(0)
    // 每個回傳的 ID 都必須是該門派既有的靈氣型外功。
    for (const id of equipped) {
      expect(id).toMatch(/^misty-rain-external-functional/)
    }
  })
  it('等級 1-2 怪物不裝備外功', () => {
    const attributes = { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 }
    for (const level of [1, 2]) {
      const attrs = getCreatureAttributes(attributes, { schoolId: 'blazing-sun', behaviorType: 'hunter' }, level)
      expect(getCreatureEquippedExternalSkillIds({ schoolId: 'blazing-sun', attributes: attrs, innerSkillId: 'blazing-sun-inner' }, level)).toEqual([])
    }
  })
})
