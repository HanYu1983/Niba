import { describe, expect, it } from 'vitest'
import { getCreatureAttributes, getCreatureIcon, getCreatureInnerSkillId, selectCreatureTarget } from './creatureBehaviorRules'
import type { BaseState, CreatureState, GameState } from '../types'

const creature = (behaviorType: CreatureState['behaviorType'], schoolId: CreatureState['schoolId'] = 'frost-water'): CreatureState => ({ id: 'c1', name: 'Creature', position: { row: 2, column: 2 }, behaviorType, schoolId, attributes: { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 10, maxHealth: 10, stamina: 10, maxStamina: 10, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: false })
const state = (currentCreature: CreatureState, bases: BaseState[] = []): GameState => ({ map: { rows: 5, columns: 5, cells: [] }, bases, defenseStructures: [], creatureNests: [], resourcePoints: [{ id: 'r1', name: 'resource', position: { row: 2, column: 3 }, ownerBaseId: 'base-1', materialIncome: 10, lastCollectedRound: null, health: 10, maxHealth: 10 }], itemPoints: [], explorationEvents: [], players: [{ ...currentCreature, id: 'p1', name: 'player', position: { row: 2, column: 4 } }], creatures: [currentCreature], activePlayerId: 'p1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null })

describe('creatureBehaviorRules', () => {
  it('依流派套用五維屬性修正與等級成長', () => {
    expect(getCreatureAttributes({ armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 }, { schoolId: 'frost-water' }, 1)).toEqual({ armStrength: 4, constitution: 8, agility: 2, innerEnergy: 4, insight: 5 })
    expect(getCreatureAttributes({ armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 }, { schoolId: 'swift-wind' }, 2)).toEqual({ armStrength: 7, constitution: 8, agility: 8, innerEnergy: 5, insight: 6 })
    expect(getCreatureAttributes({ armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 }, { schoolId: 'earth-mountain' }, 1).agility).toBe(2)
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
})
