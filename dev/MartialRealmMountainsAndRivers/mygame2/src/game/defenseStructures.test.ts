import { beforeEach, describe, expect, it } from 'vitest'
import { gameStore } from './gameStore'
import { moveCreatures } from './actions/creatureActions'
import type { BaseState, CreatureState, DefenseStructureState, GameState, PlayerState, MapState } from './types'
import { getBastionMultipliers, getEffectiveAttackDamage, isWithinAnyWarcampBastion, restoreTowerHealthForBastion } from './rules/defenseBastionRules'
import { defenseStructureCatalog, type DefenseStructureType } from './catalogs/defenseStructureCatalog'
import { evaluateWarningBeaconReveal } from './rules/warningBeaconRules'
import { countdownBombardCooldowns, fireBombardCannons } from './rules/bombardCannonRules'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 20,
    maxHealth: 20,
    stamina: 10,
    maxStamina: 10,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeBaseState(): BaseState {
  return {
    id: 'base-1',
    name: '守護據點 1',
    position: { row: 5, column: 6 },
    buildings: [],
    buildingMaterials: 0,
    maxBuildingMaterials: 100,
    health: 450,
    maxHealth: 450,
  }
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
      }),
    },
    bases: [makeBaseState()],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [makePlayer()],
    creatures: [],
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

function makeDefense(type: DefenseStructureType, position: { row: number; column: number }, overrides: Partial<DefenseStructureState> = {}): DefenseStructureState {
  const definition = defenseStructureCatalog.find((candidate) => candidate.type === type)!
  return {
    ...definition,
    id: `${type}-1`,
    position,
    ownerBaseId: 'base-1',
    health: definition.maxHealth,
    ...overrides,
  }
}

function makeCreature(id: string, name: string, position: { row: number; column: number }, health = 100): CreatureState {
  return makePlayer({
    id,
    name,
    position,
    health,
    maxHealth: health,
    attributes: { armStrength: 3, constitution: 3, agility: 5, innerEnergy: 0, insight: 2 },
  }) as unknown as CreatureState
}

function makeSmallMap(): MapState {
  return {
    rows: 10,
    columns: 10,
    cells: Array.from({ length: 10 * 10 }, (_, index) => {
      const row = Math.floor(index / 10)
      const column = index % 10
      const isBorder = row === 0 || column === 0 || row === 9 || column === 9
      return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
    }),
  }
}

beforeEach(() => {
  gameStore.resetForTest()
})

describe('輜重庫 supply-depot', () => {
  it('建造輜重庫時生成採集量 ×3 的大型資源點', () => {
    const player = makePlayer({ position: { row: 5, column: 5 }, prestige: 240, governanceRank: 3 })
    const base = makeBaseState()
    base.buildingMaterials = 1000
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const result = gameStore.constructDefenseStructure('player-1', 'base-1', 'supply-depot', { row: 4, column: 5 })
    expect(result.ok).toBe(true)
    const state = gameStore.getState()
    expect(state.resourcePoints).toHaveLength(1)
    // 一般資源點 base 採集量 15，輜重庫 ×3 = 45。
    expect(state.resourcePoints[0].materialIncome).toBe(45)
    expect(state.resourcePoints[0].ownerBaseId).toBe('base-1')
    expect(state.resourcePoints[0].position).toEqual({ row: 4, column: 5 })
    // 輜重庫不新增實體防禦設施，避免與大型資源點形成雙 icon 疊加。
    expect(state.defenseStructures ?? []).toHaveLength(0)
  })

  it('官階不足 3 無法建造輜重庫', () => {
    const player = makePlayer({ position: { row: 5, column: 5 }, prestige: 80, governanceRank: 2 })
    const base = makeBaseState()
    base.buildingMaterials = 1000
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const result = gameStore.constructDefenseStructure('player-1', 'base-1', 'supply-depot', { row: 4, column: 5 })
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toContain('官階不足')
  })
})

describe('軍壘 warcamp-bastion', () => {
  it('軍壘 3 格內箭塔攻擊 ×2、HP ×2', () => {
    const bastion = makeDefense('warcamp-bastion', { row: 5, column: 5 })
    const tower = makeDefense('arrow-tower', { row: 4, column: 5 })
    expect(getBastionMultipliers([bastion, tower], tower)).toEqual({ hpMultiplier: 2, attackMultiplier: 2 })
    expect(getEffectiveAttackDamage([bastion, tower], tower)).toBe(20)
  })

  it('軍壘 3 格外箭塔不受強化', () => {
    const bastion = makeDefense('warcamp-bastion', { row: 5, column: 5 })
    const tower = makeDefense('arrow-tower', { row: 9, column: 5 })
    expect(getBastionMultipliers([bastion, tower], tower)).toEqual({ hpMultiplier: 1, attackMultiplier: 1 })
  })

  it('軍壘被摧毀後強化失效', () => {
    const deadBastion = makeDefense('warcamp-bastion', { row: 5, column: 5 }, { health: 0 })
    const tower = makeDefense('arrow-tower', { row: 4, column: 5 })
    expect(isWithinAnyWarcampBastion([deadBastion, tower], tower.position)).toBe(false)
    expect(getBastionMultipliers([deadBastion, tower], tower)).toEqual({ hpMultiplier: 1, attackMultiplier: 1 })
  })

  it('軍壘建造瞬間回復範圍內塔類 HP', () => {
    const tower = makeDefense('arrow-tower', { row: 4, column: 5 }, { health: 10, maxHealth: 50 })
    const restored = restoreTowerHealthForBastion([tower], { row: 5, column: 5 })
    expect(restored[0].health).toBe(restored[0].maxHealth)
  })
})

describe('烽燧臺 warning-beacon', () => {
  it('存在烽燧臺時，隨機值低於閾值觸發揭示全圖敵軍', () => {
    const state: GameState = makeGameState({
      creatures: [makeCreature('c1', '狼', { row: 3, column: 3 }, 10)],
      defenseStructures: [makeDefense('warning-beacon', { row: 5, column: 5 })],
    })
    const reveal = evaluateWarningBeaconReveal(state, 0.1)
    expect(reveal).not.toBeNull()
    expect(reveal!.revealedCreatureCellIds).toContain('3-3')
  })

  it('隨機值高於閾值時不觸發揭示', () => {
    const state: GameState = makeGameState({
      creatures: [makeCreature('c1', '狼', { row: 3, column: 3 }, 10)],
      defenseStructures: [makeDefense('warning-beacon', { row: 5, column: 5 })],
    })
    expect(evaluateWarningBeaconReveal(state, 0.9)).toBeNull()
  })

  it('無烽燧臺時永不揭示', () => {
    const state: GameState = makeGameState({})
    expect(evaluateWarningBeaconReveal(state, 0.01)).toBeNull()
  })
})

describe('轟城砲 bombard-cannon', () => {
  it('範圍砲擊所有射程內敵軍，並進入冷卻', () => {
    const cannon = makeDefense('bombard-cannon', { row: 5, column: 5 })
    const inRange = makeCreature('c1', '狼', { row: 6, column: 6 }, 100)
    const outRange = makeCreature('c2', '虎', { row: 0, column: 0 }, 100)
    const result = fireBombardCannons([cannon], [inRange, outRange], 1)
    // 射程 4，據點在 (5,5)，(6,6) 曼哈頓距離 2 在範圍內。
    expect(result.creatures.find((c) => c.id === 'c1')!.health).toBe(65)
    expect(result.creatures.find((c) => c.id === 'c2')!.health).toBe(100)
    expect(result.defenseStructures[0].cooldownRemaining).toBe(cannon.cooldownRounds)
  })

  it('冷卻未歸零時不發射', () => {
    const cannon = makeDefense('bombard-cannon', { row: 5, column: 5 }, { cooldownRemaining: 1 })
    const target = makeCreature('c1', '狼', { row: 6, column: 6 }, 100)
    const result = fireBombardCannons([cannon], [target], 1)
    expect(result.creatures[0].health).toBe(100)
  })

  it('冷卻遞減每回合減少 1', () => {
    const cannon = makeDefense('bombard-cannon', { row: 5, column: 5 }, { cooldownRemaining: 2 })
    const result = countdownBombardCooldowns([cannon])
    expect(result[0].cooldownRemaining).toBe(1)
  })
})

describe('軍壘整合（真實 Creature 回合）', () => {
  it('軍壘 3 格內箭塔在 Creature 回合造成 ×2 傷害', () => {
    const bastion = makeDefense('warcamp-bastion', { row: 4, column: 4 })
    // 箭塔位於軍壘 3 格內，對 (5,5) 的敵軍（距離 1）射擊。
    const tower = makeDefense('arrow-tower', { row: 4, column: 5 })
    const creature = makeCreature('c1', '狼', { row: 5, column: 5 }, 100)

    // 無軍壘：箭塔造成 10 傷。
    const without = moveCreatures(
      [creature], makeSmallMap(), [], [], [], [tower], [], [],
    )
    // 軍壘強化：箭塔造成 20 傷。
    const withBastion = moveCreatures(
      [creature], makeSmallMap(), [], [], [], [bastion, tower], [], [],
    )

    // 箭塔在 Creature 行動前先造成傷害，因此最終剩餘 HP 不同。
    expect(without.creatures[0].health).toBe(90)
    expect(withBastion.creatures[0].health).toBe(80)
  })

  it('軍壘 3 格內箭塔承受 Creature 傷害減半（HP×2 等效）', () => {
    // 敵軍位於箭塔旁，會攻擊箭塔。
    const tower = makeDefense('arrow-tower', { row: 4, column: 5 })
    const creature = makeCreature('c1', '狼', { row: 4, column: 4 }, 100)
    creature.attributes = { armStrength: 12, constitution: 3, agility: 5, innerEnergy: 0, insight: 2 }

    // 無軍壘：箭塔受 (12-2)=10 傷。
    const without = moveCreatures(
      [creature], makeSmallMap(), [], [], [], [tower], [], [],
    )
    // 軍壘：箭塔受 floor(10/2)=5 傷。
    const bastion = makeDefense('warcamp-bastion', { row: 3, column: 5 })
    const withBastion = moveCreatures(
      [creature], makeSmallMap(), [], [], [], [bastion, tower], [], [],
    )

    expect(without.defenseStructures![0].health).toBe(40) // 50 - 10
    expect(withBastion.defenseStructures?.find((s) => s.id === tower.id)?.health).toBe(45) // 50 - 5
  })
})