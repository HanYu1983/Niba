import { beforeEach, describe, expect, it, vi } from 'vitest'
import { gameStore } from './gameStore'
import {
  type BaseState,
  type CreatureState,
  type GameState,
  getExperienceRequired,
} from './types'
import { getMaxHealth, getMaxStamina, getMaxInnerPower } from './rules/playerStatsRules'
import { getBaseMaxHealth, getPlayerMaxHealth, getBaseMaxBuildingMaterials, getResourceCollectionMaterialGain } from './rules/baseRules'
import { getGlobalBuffMagnitudeForLevel } from './rules/globalBuffRules'
import { formatItemBurstResult } from './actionResultFormatters'
import { createEmptyRunStats } from './runStats'
import { createCharacter } from './characterRoster'

function makeTestCreature(overrides: Partial<CreatureState> = {}): CreatureState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: ['sky-breaking-palm'],
    equippedExternalSkillIds: [],
    unlockedEquipmentDropIds: ['iron-sword', 'traveling-robe', 'jade-pendant'],
    equipmentInventory: [
      { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 20, maxDurability: 20 },
      { instanceId: 'robe-1', equipmentId: 'traveling-robe', durability: 20, maxDurability: 20 },
      { instanceId: 'pendant-1', equipmentId: 'jade-pendant', durability: 20, maxDurability: 20 },
    ],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    health: getMaxHealth(attributes),
    maxHealth: getMaxHealth(attributes),
    stamina: getMaxStamina(attributes),
    maxStamina: getMaxStamina(attributes),
    innerPower: getMaxInnerPower(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
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
    buildings: [
      {
        id: 'building-1-board',
        type: 'board',
        name: '告示牌',
        description: '提供據點任務。',
        constructionCost: 0,
      },
    ],
    buildingMaterials: 0,
    maxBuildingMaterials: 100,
    health: 450,
    maxHealth: 450,
  }
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  const player = makeTestCreature()
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
    players: [player],
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

beforeEach(() => {
  gameStore.resetForTest()
})

describe('局末殘卷結算防重（bug.md：讀檔時殘卷被重複計算）', () => {
  function stubLocalStorage() {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
      setItem: (key: string, value: string) => { store.set(key, value) },
      removeItem: (key: string) => { store.delete(key) },
    })
    return store
  }

  it('同一局二次 settle 冪等：第二次回傳 null', () => {
    stubLocalStorage()
  const character = createCharacter({ name: '冪等測試' })!
    gameStore.startGame({ playerCount: 1 } as never, [{ id: character.id, attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 } }])
    const first = gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])
    expect(first).toBeDefined()
    const second = gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])
    expect(second).toBeNull()
  })

  it('restartGame 後可重新結算', () => {
    stubLocalStorage()
    const character = createCharacter({ name: '重開測試' })!
    gameStore.startGame({ playerCount: 1 } as never, [{ id: character.id, attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 } }])
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeDefined()
    gameStore.restartGame()
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeDefined()
  })

  it('載入局末存檔視為已結算：settle 回傳 null', () => {
    const store = stubLocalStorage()
    // 直接把局末狀態寫入主存檔（模擬「先前已結算又讀檔」）。
    store.set('mygame2.game-save', JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      state: makeGameState({ gameWon: true }),
      activeCharacterId: 'char-9',
    }))
    expect(gameStore.loadGame().ok).toBe(true)
    expect(gameStore.getActiveCharacterIds()).toEqual(['char-9'])
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeNull()
  })

  it('載入進行中存檔不鎖結算，且還原 activeCharacterId', () => {
    const store = stubLocalStorage()
    store.set('mygame2.game-save.slot.2', JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      state: makeGameState(),
      activeCharacterId: 'char-5',
    }))
    expect(gameStore.loadGameFromSlot(2).ok).toBe(true)
    expect(gameStore.getActiveCharacterIds()).toEqual(['char-5'])
    const character = createCharacter({ name: '進行中測試' })!
    gameStore.setStateForTest(makeGameState())
    gameStore.startGame({ playerCount: 1 } as never, [{ id: character.id, attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 } }])
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeDefined()
  })

  it('跨欄位去重（runId 登記制）：同 runId 的局只結算一次（V3）', () => {
    const store = stubLocalStorage()
    const character = createCharacter({ name: '跨欄位測試' })!
    gameStore.startGame({ playerCount: 1 } as never, [{ id: character.id, attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 } }])
    const runId = gameStore.getState().runId!
    // 同一局的存檔複製到 slot 1 與 slot 2。
    for (const slot of [1, 2]) {
      store.set(`mygame2.game-save.slot.${slot}`, JSON.stringify({
        version: 1,
        savedAt: new Date().toISOString(),
        state: makeGameState({ runId }),
        activeCharacterId: character.id,
      }))
    }
    // 從 slot 1 讀檔玩到結局 → 結算一次。
    expect(gameStore.loadGameFromSlot(1).ok).toBe(true)
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeDefined()
    // 從 slot 2 讀同一局 → 登記表命中，不再結算。
    expect(gameStore.loadGameFromSlot(2).ok).toBe(true)
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeNull()
  })

  it('局末但 runId 未登記（pending）：讀檔後可補結算（V1 修復語意）', () => {
    const store = stubLocalStorage()
    const character = createCharacter({ name: '補結算測試' })!
    // 模擬「勝利對話期間存檔」：局末狀態但尚未登記。
    store.set('mygame2.game-save.slot.3', JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      state: makeGameState({ runId: 'run-pending', gameWon: true }),
      activeCharacterId: character.id,
    }))
    expect(gameStore.loadGameFromSlot(3).ok).toBe(true)
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeDefined()
    // 再讀一次同檔：已登記，不重算。
    expect(gameStore.loadGameFromSlot(3).ok).toBe(true)
    expect(gameStore.settleActiveCharacterRewards(createEmptyRunStats(), true, [[]])).toBeNull()
  })
})

describe('AI 戰略命令與建設計畫', () => {
  it('非 AI 玩家不能建立 AI 命令', () => {
    const result = gameStore.setAiOrder({
      id: 'order-1',
      type: 'protect-base',
      aiPlayerId: 'player-1',
      baseId: 'base-1',
      radius: 6,
      priority: 80,
      retreatHealthPercent: 30,
      status: 'active',
    })

    expect(result).toEqual({ ok: false, reason: '指定的玩家不是 AI 玩家。' })
  })

  it('同一 AI 只能有一個 active 命令，完全相同命令會被阻擋', () => {
    const human = makeTestCreature()
    const ai = makeTestCreature({ id: 'ai-1', name: 'AI 玩家', isAI: true })
    gameStore.setStateForTest(makeGameState({ players: [human, ai] }))

    const protectOrder = {
      id: 'order-protect',
      type: 'protect-base' as const,
      aiPlayerId: 'ai-1',
      baseId: 'base-1',
      radius: 6,
      priority: 80,
      retreatHealthPercent: 30,
      status: 'active' as const,
    }
    expect(gameStore.setAiOrder(protectOrder).ok).toBe(true)
    expect(gameStore.setAiOrder({ ...protectOrder, id: 'order-duplicate' }).ok).toBe(false)

    const supportOrder = {
      id: 'order-support',
      type: 'support-player' as const,
      aiPlayerId: 'ai-1',
      playerId: 'player-1',
      maxDistance: 8,
      priority: 90,
      retreatHealthPercent: 25,
      status: 'active' as const,
    }
    expect(gameStore.setAiOrder(supportOrder).ok).toBe(true)

    const state = gameStore.getState()
    expect(state.aiOrders?.find((order) => order.id === 'order-protect')?.status).toBe('paused')
    expect(state.aiOrders?.filter((order) => order.aiPlayerId === 'ai-1' && order.status === 'active')).toHaveLength(1)
  })

  it('同一 AI 的建設計畫會被新計畫替換', () => {
    const ai = makeTestCreature({ id: 'ai-1', name: 'AI 玩家', isAI: true })
    gameStore.setStateForTest(makeGameState({ players: [makeTestCreature(), ai] }))

    const plan = {
      aiPlayerId: 'ai-1',
      baseId: 'base-1',
      policy: 'defense' as const,
      allowUpgrade: true,
      queue: [{ buildingType: 'watchtower', priority: 100, status: 'planned' as const }],
    }
    expect(gameStore.setAiConstructionPlan(plan).ok).toBe(true)
    expect(gameStore.setAiConstructionPlan({ ...plan, policy: 'economy' }).ok).toBe(true)
    expect(gameStore.getState().aiConstructionPlans).toEqual([{ ...plan, policy: 'economy' }])
  })

  it('編輯支援命令時可以切換目標玩家', () => {
    const human = makeTestCreature()
    const secondHuman = makeTestCreature({ id: 'player-2', name: '玩家 2' })
    const ai = makeTestCreature({ id: 'ai-1', name: 'AI 玩家', isAI: true })
    gameStore.setStateForTest(makeGameState({ players: [human, secondHuman, ai] }))

    const order = {
      id: 'order-support',
      type: 'support-player' as const,
      aiPlayerId: 'ai-1',
      playerId: 'player-1',
      maxDistance: 8,
      priority: 70,
      retreatHealthPercent: 30,
      status: 'active' as const,
    }
    expect(gameStore.setAiOrder(order).ok).toBe(true)
    expect(gameStore.setAiOrder({ ...order, playerId: 'player-2' }).ok).toBe(true)
    expect(gameStore.getState().aiOrders).toEqual([{ ...order, playerId: 'player-2' }])
  })

  it('建設計畫可以保存建設佇列與優先級', () => {
    const ai = makeTestCreature({ id: 'ai-1', name: 'AI 玩家', isAI: true })
    gameStore.setStateForTest(makeGameState({ players: [makeTestCreature(), ai] }))

    const plan = {
      aiPlayerId: 'ai-1',
      baseId: 'base-1',
      policy: 'defense' as const,
      allowUpgrade: true,
      queue: [
        { buildingType: 'wall', priority: 100, status: 'planned' as const },
        { buildingType: 'barracks', priority: 60, status: 'blocked' as const, blockedReason: '官階不足。' },
      ],
    }
    expect(gameStore.setAiConstructionPlan(plan).ok).toBe(true)
    expect(gameStore.getState().aiConstructionPlans).toEqual([plan])
  })
})

describe('useItem', () => {
  it('使用療傷藥會恢復生命並消耗道具', () => {
    const player = makeTestCreature({
      health: 10,
      inventory: [{ itemId: 'heal-wound-medicine', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'heal-wound-medicine')

    expect(used.ok).toBe(true)
    const state = gameStore.getState()
    // 生命恢復會被 maxHealth（24）上限限制
    expect(state.players[0].health).toBe(24)
    expect(state.players[0].turnEnded).toBe(false)
    // 數量歸零的 entry 會被移除
    expect(state.players[0].inventory.find((entry) => entry.itemId === 'heal-wound-medicine')).toBeUndefined()
  })

  it('沒有道具時使用失敗', () => {
    const player = makeTestCreature({ inventory: [] })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'heal-wound-medicine')

    expect(used.ok).toBe(false)
  })

  it('非目前玩家無法使用道具', () => {
    const player = makeTestCreature()
    gameStore.setStateForTest(makeGameState({ players: [player], activePlayerId: 'other' }))

    const used = gameStore.useItem('player-1', 'heal-wound-medicine')

    expect(used.ok).toBe(false)
  })

  it('滿血時使用療傷藥失敗且不消耗道具', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'heal-wound-medicine', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'heal-wound-medicine')

    expect(used.ok).toBe(false)
    expect(gameStore.getState().players[0].inventory).toEqual([
      { itemId: 'heal-wound-medicine', quantity: 1 },
    ])
  })

  it('使用聚氣丹恢復內力', () => {
    const player = makeTestCreature({
      innerPower: 3,
      inventory: [{ itemId: 'gather-qi-pill', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'gather-qi-pill')

    expect(used.ok).toBe(true)
    const state = gameStore.getState()
    // 內力恢復會被 maxInnerPower（15）上限限制
    expect(state.players[0].innerPower).toBe(15)
  })

  it('使用回光玉掛載回光 Buff 並消耗道具', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'return-light-jade', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'return-light-jade')

    expect(used.ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].buffs?.some((buff) => buff.definitionId === 'return-light')).toBe(true)
    expect(state.players[0].inventory).toHaveLength(0)
    expect(state.players[0].turnEnded).toBe(false)
    expect(state.players[0].itemEffectsUsedThisTurn).toEqual(['buff'])
  })

  it('同一回合不能再次使用其他增益類道具', () => {
    const player = makeTestCreature({
      inventory: [
        { itemId: 'return-light-jade', quantity: 2 },
      ],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'return-light-jade').ok).toBe(true)
    expect(gameStore.useItem('player-1', 'return-light-jade')).toEqual({
      ok: false,
      reason: '本回合已使用過此類道具。',
    })
    expect(gameStore.getState().players[0].inventory).toEqual([
      { itemId: 'return-light-jade', quantity: 1 },
    ])
  })

  it('隱身符：使用後獲得 3 回合隱身靈氣 Buff', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'concealment-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const used = gameStore.useItem('player-1', 'concealment-talisman')

    expect(used.ok).toBe(true)
    const state = gameStore.getState()
    const buff = state.players[0].buffs?.find((candidate) => candidate.definitionId === 'concealment-aura')
    expect(buff).toBeDefined()
    expect(buff?.remainingRounds).toBe(3)
    expect(state.players[0].inventory).toHaveLength(0)
    expect(state.players[0].itemEffectsUsedThisTurn).toEqual(['buff'])
  })

  it('每種道具類型一回合一次：探地符再次使用被拒絕', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'scout-talisman', quantity: 2 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'scout-talisman').ok).toBe(true)
    expect(gameStore.useItem('player-1', 'scout-talisman')).toEqual({
      ok: false,
      reason: '本回合已使用過此類道具。',
    })
    expect(gameStore.getState().players[0].itemEffectsUsedThisTurn).toContain('scout')
    expect(gameStore.getState().players[0].inventory).toEqual([
      { itemId: 'scout-talisman', quantity: 1 },
    ])
  })

  it('回營符一回合一次', () => {
    const base = makeBaseState()
    const player = makeTestCreature({
      inventory: [{ itemId: 'recall-base-talisman', quantity: 2 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.useItem('player-1', 'recall-base-talisman').ok).toBe(true)
    expect(gameStore.useItem('player-1', 'recall-base-talisman')).toEqual({
      ok: false,
      reason: '本回合已使用過此類道具。',
    })
    expect(gameStore.getState().players[0].itemEffectsUsedThisTurn).toContain('recall-base')
  })
})

describe('新道具系統', () => {
  it('屬性提升道具永久 +1 屬性並消耗道具', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'great-strength-pill', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'great-strength-pill').ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.attributes.armStrength).toBe(9)
    expect(nextPlayer.inventory).toHaveLength(0)
    expect(nextPlayer.buffs ?? []).toHaveLength(0)
  })

  it('續命丹提升根骨並反映到 maxHealth（衍生數值同步）', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'extend-life-pill', quantity: 1 }],
    })
    const maxHealthBefore = player.maxHealth
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'extend-life-pill').ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.attributes.constitution).toBe(9)
    expect(nextPlayer.maxHealth).toBe(maxHealthBefore + 3)
    expect(nextPlayer.maxStamina).toBe(player.maxStamina)
    expect(nextPlayer.inventory).toHaveLength(0)
  })

  it('絆馬索在當前格放置 snare 陷阱並消耗道具', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'hobble-rope', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'hobble-rope').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.traps).toEqual([
      expect.objectContaining({ type: 'snare', ownerPlayerId: 'player-1', position: { row: 5, column: 5 } }),
    ])
    expect(state.players[0].inventory).toHaveLength(0)
  })

  it('定身索放置 immobilize 陷阱', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'immobilize-rope', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'immobilize-rope').ok).toBe(true)
    expect(gameStore.getState().traps?.[0].type).toBe('immobilize')
  })

  it('同一格不能重複放置陷阱', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'hobble-rope', quantity: 2 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'hobble-rope').ok).toBe(true)
    expect(gameStore.useItem('player-1', 'hobble-rope').ok).toBe(false)
  })

  it('探地符揭示半徑 6 格並寫入 exploredCellIds', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'scout-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'scout-talisman').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.visibility?.exploredCellIds).toContain('5-5')
    expect(state.visibility?.exploredCellIds).toContain('5-8')
    expect(state.visibility?.exploredCellIds).toContain('5-11')
    expect(state.visibility?.exploredCellIds).not.toContain('5-12')
    expect(state.players[0].inventory).toHaveLength(0)
  })

  it('探地符暫時揭示範圍內怪物位置', () => {
    const inRangeCreature = makeTestCreature({
      id: 'creature-in',
      position: { row: 8, column: 5 },
      health: 50,
    })
    const outOfRangeCreature = makeTestCreature({
      id: 'creature-out',
      position: { row: 20, column: 20 },
      health: 50,
    })
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'scout-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatures: [inRangeCreature, outOfRangeCreature],
    }))

    expect(gameStore.useItem('player-1', 'scout-talisman').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.revealedCreatureCellIds).toContain('8-5')
    expect(state.revealedCreatureCellIds).not.toContain('20-20')
    expect(state.revealedCreatureUntilRound).toBe(2)
  })

  it('鳴鑼符暫時揭示全圖怪物位置', () => {
    const creature = makeTestCreature({
      id: 'creature-1',
      position: { row: 10, column: 10 },
      health: 50,
    })
    const player = makeTestCreature({
      inventory: [{ itemId: 'warn-gong-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))

    expect(gameStore.useItem('player-1', 'warn-gong-talisman').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.revealedCreatureCellIds).toContain('10-10')
    expect(state.revealedCreatureUntilRound).toBe(2)
  })

  it('回營符撤退到最近據點周遭一格（不站上據點格）', () => {
    const player = makeTestCreature({
      position: { row: 20, column: 20 },
      inventory: [{ itemId: 'recall-base-talisman', quantity: 1 }],
    })
    const base = makeBaseState()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.useItem('player-1', 'recall-base-talisman').ok).toBe(true)
    const state = gameStore.getState()
    // 據點 (5,6) 周遭一格（上 (4,6)）為可通行空格，不應直接站上據點格。
    expect(state.players[0].position).toEqual({ row: 4, column: 6 })
    expect(state.players[0].inventory).toHaveLength(0)
  })

  it('無據點時回營符使用失敗', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'recall-base-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [] }))

    expect(gameStore.useItem('player-1', 'recall-base-talisman').ok).toBe(false)
  })

  it('元素爆發道具進入選格模式', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'fire-thunder-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.useItem('player-1', 'fire-thunder-talisman').ok).toBe(true)
    expect(gameStore.getState().operation).toEqual({ type: 'targeting-item', itemId: 'fire-thunder-talisman' })
  })

  it('元素爆發對目標造成傷害並消耗道具', () => {
    const creature = makeTestCreature({
      id: 'creature-1',
      position: { row: 5, column: 6 },
      health: 50,
      maxHealth: 50,
      schoolId: 'swift-wind',
    })
    const player = makeTestCreature({
      inventory: [{ itemId: 'gold-glint-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatures: [creature],
      operation: { type: 'targeting-item', itemId: 'gold-glint-talisman' },
    }))

    // 先建立預覽
    const previewResult = gameStore.previewItemBurst('creature', 'creature-1')
    expect(previewResult.ok).toBe(true)
    expect(gameStore.getState().operation).toEqual({ type: 'previewing-item-burst' })
    expect(gameStore.getState().itemBurstPreview?.expectedDamage).toBe(18)

    const result = gameStore.executeItemBurst()
    expect(result.ok).toBe(true)
    const state = gameStore.getState()
    // 金克木（swift-wind 為木），傷害 ×1.25 = floor(15 × 1.25) = 18
    expect(state.creatures[0].health).toBe(32)
    expect(state.players[0].inventory).toHaveLength(0)
    expect(state.operation).toEqual({ type: 'idle' })
    expect(state.itemBurstPreview).toBeNull()
  })

  it('元素爆發對巢穴造成傷害', () => {
    const nest = {
      id: 'nest-1',
      name: '巢穴',
      position: { row: 5, column: 6 },
      health: 40,
      maxHealth: 40,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    const player = makeTestCreature({
      inventory: [{ itemId: 'fire-thunder-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatureNests: [nest],
      operation: { type: 'targeting-item', itemId: 'fire-thunder-talisman' },
    }))

    const previewResult = gameStore.previewItemBurst('nest', 'nest-1')
    expect(previewResult.ok).toBe(true)
    const result = gameStore.executeItemBurst()
    expect(result.ok).toBe(true)
    expect(gameStore.getState().creatureNests[0].health).toBe(25)
  })

  it('元素爆發使怪物血量歸零時移除怪物（統一死亡流程）', () => {
    const creature = makeTestCreature({
      id: 'creature-1',
      position: { row: 5, column: 6 },
      health: 18,
      maxHealth: 18,
      schoolId: 'swift-wind',
    })
    const player = makeTestCreature({
      inventory: [{ itemId: 'gold-glint-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatures: [creature],
      operation: { type: 'targeting-item', itemId: 'gold-glint-talisman' },
    }))

    const previewResult = gameStore.previewItemBurst('creature', 'creature-1')
    expect(previewResult.ok).toBe(true)
    const result = gameStore.executeItemBurst()
    expect(result.ok).toBe(true)
    // 金克木（swift-wind 為木），傷害 ×1.25 = 18，剛好擊殺怪物
    expect(gameStore.getState().creatures).toHaveLength(0)
  })

  it('元素爆發擊殺怪物時獲得經驗值（與一般攻擊一致）', () => {
    const creature = makeTestCreature({
      id: 'creature-1',
      position: { row: 5, column: 6 },
      health: 18,
      maxHealth: 18,
      level: 2,
      schoolId: 'swift-wind',
    })
    const player = makeTestCreature({
      inventory: [{ itemId: 'gold-glint-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatures: [creature],
      operation: { type: 'targeting-item', itemId: 'gold-glint-talisman' },
    }))

    const previewResult = gameStore.previewItemBurst('creature', 'creature-1')
    expect(previewResult.ok).toBe(true)
    const result = gameStore.executeItemBurst()
    expect(result.ok).toBe(true)
    const state = gameStore.getState()
    // 擊殺 Lv.2 生物：經驗 = CREATURE_DEFEAT_EXPERIENCE_REWARD(20) × 2 = 40
    // 玩家 Lv.1 升級所需 50 經驗 → 未升級，剩餘經驗 40
    expect(state.players[0].level).toBe(1)
    expect(state.players[0].experience).toBe(40)
    // 金錢 = CREATURE_DEFEAT_MONEY_REWARD(6) × 2 = 12
    expect(state.players[0].money).toBe(12)
    // 詳情回傳並與彈窗格式掛鉤
    if (result.ok) {
      expect(result.data.defeated).toBe(true)
      expect(result.data.experienceReward).toBe(40)
      expect(result.data.moneyReward).toBe(12)
      expect(result.data.damage).toBe(18)
      // 格式化後應包含獎勵訊息
      const formatted = formatItemBurstResult(result.data)
      expect(formatted.title).toBe('道具攻擊結果')
      expect(formatted.rewards.join(' ')).toContain('目標已被擊敗')
      expect(formatted.rewards.join(' ')).toContain('玩家經驗 +40')
      expect(formatted.rewards.join(' ')).toContain('獲得金錢 +12')
    } else {
      throw new Error('元素爆發擊殺應成功')
    }
  })

  it('元素爆發摧毀最後一座巢穴時觸發勝利', () => {
    const nest = {
      id: 'nest-1',
      name: '巢穴',
      position: { row: 5, column: 6 },
      health: 10,
      maxHealth: 10,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    const player = makeTestCreature({
      inventory: [{ itemId: 'fire-thunder-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatureNests: [nest],
      operation: { type: 'targeting-item', itemId: 'fire-thunder-talisman' },
    }))

    const previewResult = gameStore.previewItemBurst('nest', 'nest-1')
    expect(previewResult.ok).toBe(true)
    const result = gameStore.executeItemBurst()
    expect(result.ok).toBe(true)
    expect(gameStore.getState().creatureNests).toHaveLength(0)
    expect(gameStore.getState().gameWon).toBe(true)
  })

  it('元素爆發不能攻擊玩家周遭一格以外的目標', () => {
    const creature = makeTestCreature({
      id: 'creature-1',
      position: { row: 8, column: 8 },
      health: 50,
      maxHealth: 50,
      schoolId: 'swift-wind',
    })
    const player = makeTestCreature({
      inventory: [{ itemId: 'gold-glint-talisman', quantity: 1 }],
    })
    gameStore.setStateForTest(makeGameState({
      players: [player],
      creatures: [creature],
      operation: { type: 'targeting-item', itemId: 'gold-glint-talisman' },
    }))

    const previewResult = gameStore.previewItemBurst('creature', 'creature-1')
    expect(previewResult.ok).toBe(false)
    expect(gameStore.getState().operation).toEqual({ type: 'targeting-item', itemId: 'gold-glint-talisman' })
    expect(gameStore.getState().itemBurstPreview).toBeUndefined()
  })
})

describe('商店買賣', () => {
  function makeShopBase(): BaseState {
    return {
      ...makeBaseState(),
      buildings: [
        { id: 'base-1-item-shop', type: 'item-shop', name: '道具商店', description: '', constructionCost: 30, level: 1 },
        { id: 'base-1-equip-shop', type: 'equipment-shop', name: '裝備商店', description: '', constructionCost: 40, level: 1 },
      ],
    }
  }

  it('購買道具扣除金錢並加入背包', () => {
    const player = makeTestCreature({ money: 100 })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.buyItem('player-1', 'heal-wound-medicine', 1).ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(80)
    expect(state.players[0].inventory).toEqual([{ itemId: 'heal-wound-medicine', quantity: 1 }])
  })

  it('金錢不足時無法購買', () => {
    const player = makeTestCreature({ money: 5 })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.buyItem('player-1', 'heal-wound-medicine', 1).ok).toBe(false)
  })

  it('賣出道具獲得金錢並移除道具', () => {
    const player = makeTestCreature({ money: 0, inventory: [{ itemId: 'heal-wound-medicine', quantity: 2 }] })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.sellItem('player-1', 'heal-wound-medicine', 1).ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(10)
    expect(state.players[0].inventory).toEqual([{ itemId: 'heal-wound-medicine', quantity: 1 }])
  })

  it('賣出裝備獲得金錢並移除裝備', () => {
    const player = makeTestCreature({
      money: 0,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 20, maxDurability: 20 },
      ],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.sellEquipment('player-1', 'sword-1').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBeGreaterThan(0)
    expect(state.players[0].equipmentInventory).toHaveLength(0)
  })

  it('已裝備的裝備不可賣出', () => {
    const player = makeTestCreature({
      money: 0,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 20, maxDurability: 20 },
      ],
      equipmentLoadout: { weaponInstanceId: 'sword-1', armorInstanceId: null, accessoryInstanceId: null },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.sellEquipment('player-1', 'sword-1').ok).toBe(false)
  })

  it('購買裝備扣除金錢並加入裝備清單', () => {
    const player = makeTestCreature({ money: 200 })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.buyEquipment('player-1', 'iron-sword').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(200 - 30)
    expect(state.players[0].equipmentInventory?.some((instance) => instance.equipmentId === 'iron-sword')).toBe(true)
  })

  it('金錢不足時無法購買裝備', () => {
    const player = makeTestCreature({ money: 10 })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.buyEquipment('player-1', 'iron-sword').ok).toBe(false)
  })

  it('商店等級不足時無法購買高階商品', () => {
    const player = makeTestCreature({ money: 500 })
    // 商店等級 1，聚靈杖需要 Lv.2
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeShopBase()] }))

    expect(gameStore.buyEquipment('player-1', 'spirit-wand').ok).toBe(false)
    expect(gameStore.buyItem('player-1', 'return-light-jade', 1).ok).toBe(false)
  })

  it('商店升級後可購買高階商品', () => {
    const player = makeTestCreature({ money: 500 })
    const base = makeShopBase()
    base.buildings = base.buildings.map((building) =>
      building.type === 'equipment-shop' ? { ...building, level: 2 } : building,
    )
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.buyEquipment('player-1', 'spirit-wand').ok).toBe(true)
  })
})

describe('useInfirmary', () => {
  it('相鄰且擁有醫館時恢復少量氣血與內力', () => {
    const player = makeTestCreature({ health: 10, innerPower: 3 })
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-infirmary',
      type: 'infirmary',
      name: '醫療室',
      description: '提高休整或治療效率。',
      constructionCost: 50,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.useInfirmary('player-1', 'base-1').ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.health).toBeGreaterThanOrEqual(22)
    expect(nextPlayer.health).toBeLessThanOrEqual(24)
    expect(nextPlayer.innerPower).toBeGreaterThanOrEqual(9)
    expect(nextPlayer.innerPower).toBeLessThanOrEqual(13)
    expect(nextPlayer.turnEnded).toBe(false)
  })

  it('醫療室等級越高，回復量的隨機範圍越高', () => {
    const player = makeTestCreature({ health: 1, innerPower: 1 })
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-infirmary',
      type: 'infirmary',
      name: '醫療室',
      description: '提高休整或治療效率。',
      constructionCost: 50,
      level: 3,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.useInfirmary('player-1', 'base-1').ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.health).toBeGreaterThanOrEqual(19)
    expect(nextPlayer.health).toBeLessThanOrEqual(24)
    expect(nextPlayer.innerPower).toBeGreaterThanOrEqual(10)
    expect(nextPlayer.innerPower).toBeLessThanOrEqual(15)
  })

  it('沒有醫館、距離不足或已滿時不能就醫', () => {
    const player = makeTestCreature({ health: 10, innerPower: 3 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))
    expect(gameStore.useInfirmary('player-1', 'base-1').ok).toBe(false)

    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-infirmary',
      type: 'infirmary',
      name: '醫療室',
      description: '提高休整或治療效率。',
      constructionCost: 50,
    })
    gameStore.setStateForTest(makeGameState({
      players: [makeTestCreature({ position: { row: 1, column: 1 }, health: 10, innerPower: 3 })],
      bases: [base],
    }))
    expect(gameStore.useInfirmary('player-1', 'base-1').ok).toBe(false)

    gameStore.setStateForTest(makeGameState({ bases: [base] }))
    expect(gameStore.useInfirmary('player-1', 'base-1').ok).toBe(false)
  })

  it('體力不足時不能就醫', () => {
    const player = makeTestCreature({ health: 10, innerPower: 3, stamina: 1 })
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-infirmary',
      type: 'infirmary',
      name: '醫療室',
      description: '提高休整或治療效率。',
      constructionCost: 50,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const result = gameStore.useInfirmary('player-1', 'base-1')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('體力不足。')
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.health).toBe(10)
    expect(nextPlayer.innerPower).toBe(3)
    expect(nextPlayer.stamina).toBe(1)
  })
})

describe('repair preview', () => {
  function makeWorkshopBase(): BaseState {
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-workshop',
      type: 'workshop',
      name: '修理工坊',
      description: '提供裝備修理功能。',
      constructionCost: 60,
    })
    return base
  }

  it('預覽修理會計算損耗耐久與成本', () => {
    const player = makeTestCreature({
      money: 10,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 18, maxDurability: 20 },
      ],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeWorkshopBase()] }))

    const preview = gameStore.previewRepair('player-1', 'base-1')

    expect(preview).toEqual({
      playerId: 'player-1',
      baseId: 'base-1',
      equipmentCount: 1,
      durabilityRestored: 2,
      moneyCost: 0,
      lockedEquipmentCount: 0,
      repairedEquipment: [{
        instanceId: 'sword-1',
        equipmentId: 'iron-sword',
        name: '精鐵劍',
        icon: '🗡️',
        slot: 'weapon',
        beforeDurability: 18,
        maxDurability: 20,
        durabilityRestored: 2,
      }],
    })
    expect(gameStore.getState().players[0].turnEnded).toBe(false)
  })

  it('工坊等級不足時無法修理高級裝備', () => {
    const player = makeTestCreature({
      money: 100,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 18, maxDurability: 20 },
        { instanceId: 'robe-1', equipmentId: 'cloth-robe', durability: 10, maxDurability: 16 },
      ],
    })
    const base = makeWorkshopBase() // 工坊等級 1
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const preview = gameStore.previewRepair('player-1', 'base-1')

    // 只有 Lv.1 的精鐵劍可修，Lv.2 的布衣被鎖定
    expect(preview?.equipmentCount).toBe(1)
    expect(preview?.durabilityRestored).toBe(2)
    expect(preview?.moneyCost).toBe(0)
    expect(preview?.lockedEquipmentCount).toBe(1)

    gameStore.setStateForTest({ ...gameStore.getState(), repairPreview: preview })
    const result = gameStore.executeRepair()
    expect(result.ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'sword-1')?.durability).toBe(20)
    // 布衣因工坊等級不足保持原耐久
    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'robe-1')?.durability).toBe(10)
  })

  it('工坊升級後可修理高級裝備', () => {
    const player = makeTestCreature({
      money: 100,
      equipmentInventory: [
        { instanceId: 'robe-1', equipmentId: 'cloth-robe', durability: 10, maxDurability: 16 },
      ],
    })
    const base = makeWorkshopBase()
    base.buildings = base.buildings.map((building) =>
      building.type === 'workshop' ? { ...building, level: 2 } : building,
    )
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const preview = gameStore.previewRepair('player-1', 'base-1')

    expect(preview?.equipmentCount).toBe(1)
    expect(preview?.lockedEquipmentCount).toBe(0)
  })

  it('修理確認時消耗體力且不收取金錢', () => {
    const player = makeTestCreature({
      stamina: 7,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 18, maxDurability: 20 },
      ],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [makeWorkshopBase()] }))
    const preview = gameStore.previewRepair('player-1', 'base-1')
    expect(preview?.moneyCost).toBe(0)

    gameStore.setStateForTest({
      ...gameStore.getState(),
      players: [{ ...player, stamina: 7 }],
      repairPreview: preview,
    })

    const result = gameStore.executeRepair()
    expect(result.ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.stamina).toBe(5)
    expect(nextPlayer.equipmentInventory?.[0].durability).toBe(20)
    expect(nextPlayer.turnEnded).toBe(false)
  })

  it('修理確認時玩家離開據點會失敗且清除預覽', () => {
    const player = makeTestCreature({
      money: 10,
      equipmentInventory: [
        { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 18, maxDurability: 20 },
      ],
    })
    const base = makeWorkshopBase()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))
    const preview = gameStore.previewRepair('player-1', 'base-1')

    gameStore.setStateForTest({
      ...gameStore.getState(),
      players: [{ ...player, position: { row: 20, column: 20 } }],
      repairPreview: preview,
    })

    const result = gameStore.executeRepair()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('位置')
    expect(gameStore.getState().repairPreview).toBeNull()
    expect(gameStore.getState().players[0].equipmentInventory?.[0].durability).toBe(18)
  })
})

describe('combat preview boundaries', () => {
  it('攻擊預覽建立後目標消失時，執行會失敗並清除預覽', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 20,
      maxHealth: 20,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))

    gameStore.previewAttack('player-1', 'creature-1')
    expect(gameStore.getState().attackPreview).not.toBeNull()

    gameStore.setStateForTest({
      ...gameStore.getState(),
      creatures: [],
    })
    const result = gameStore.executeAttack()

    expect(result.ok).toBe(false)
    expect(gameStore.getState().attackPreview).toBeNull()
  })

  it('外功預覽建立後內力不足時，執行會失敗並清除預覽', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      equippedExternalSkillIds: ['sky-breaking-palm'],
      innerPower: 10,
    })
    const nest = {
      id: 'nest-1',
      name: '測試巢穴',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    gameStore.setStateForTest(makeGameState({ players: [player], creatureNests: [nest] }))

    gameStore.previewExternalDamageTarget('player-1', 'nest', 'nest-1', 'sky-breaking-palm')
    expect(gameStore.getState().externalSkillPreview).not.toBeNull()

    gameStore.setStateForTest({
      ...gameStore.getState(),
      players: [{ ...player, innerPower: 0 }],
    })
    const result = gameStore.executeExternalDamagePreview()

    expect(result.ok).toBe(false)
    expect(gameStore.getState().externalSkillPreview).toBeNull()
  })
})

describe('equipment', () => {
  it('裝備武器會增加臂力並替換相關衍生上限', () => {
    const player = makeTestCreature({ health: 20, stamina: 6, innerPower: 10 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    const equipped = gameStore.equipEquipment('player-1', 'sword-1')

    expect(equipped.ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.attributes.armStrength).toBe(player.attributes.armStrength + 2)
    expect(nextPlayer.maxHealth).toBe(player.maxHealth)
    expect(nextPlayer.equipmentLoadout?.weaponInstanceId).toBeTruthy()
  })

  it('裝備防具會提高根骨與身法上限', () => {
    const player = makeTestCreature({ health: 24, stamina: 7 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    gameStore.equipEquipment('player-1', 'robe-1')

    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.attributes.constitution).toBe(player.attributes.constitution + 1)
    expect(nextPlayer.attributes.agility).toBe(player.attributes.agility + 1)
    expect(nextPlayer.maxHealth).toBe(player.maxHealth + 3)
    // 身法 +1 → 最大體力 +0.5
    expect(nextPlayer.maxStamina).toBe(player.maxStamina + 0.5)
  })

  it('卸下裝備會還原有效屬性', () => {
    const player = makeTestCreature()
    gameStore.setStateForTest(makeGameState({ players: [player] }))
    gameStore.equipEquipment('player-1', 'sword-1')

    const unequipped = gameStore.unequipEquipment('player-1', 'weapon')

    expect(unequipped.ok).toBe(true)
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.attributes).toEqual({ ...player.attributes, insight: player.attributes.insight + 5 })
    expect(nextPlayer.equipmentLoadout?.weaponInstanceId).toBeNull()
  })

  it('死亡玩家不能變更裝備', () => {
    const player = makeTestCreature({ health: 0 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.equipEquipment('player-1', 'sword-1').ok).toBe(false)
    expect(gameStore.getState().players[0].equipmentLoadout?.weaponInstanceId).toBeNull()
  })
})

describe('executeAttack', () => {
  it('攻擊必定命中並扣除預期傷害', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 低身法與根骨，避免回避／根骨減傷干擾「必定命中」與傷害結算。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.damage).toBeGreaterThan(0)
      expect(gameStore.getState().creatures[0].health).toBe(100 - result.data.damage)
      expect(gameStore.getState().creatures[0].position).toEqual({ row: 5, column: 6 })
      expect(gameStore.getState().creatures[0].name).toBe('測試生物')
    }
  })

  it('普通攻擊也會觸發嗜血回血', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      health: 30,
      maxHealth: 40,
      buffs: [{ id: 'b1', definitionId: 'bloodthirst', sourceId: 'test', remainingRounds: null }],
    })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 低身法與根骨，避免回避／根骨減傷干擾嗜血計算。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()

    expect(result.ok).toBe(true)
    if (result.ok) {
      // 嗜血：回復 30% 傷害值的血量（上限為 maxHealth 24）
      expect(gameStore.getState().players[0].health).toBe(Math.min(24, 30 + Math.floor(result.data.damage * 0.3)))
    }
  })

  it('普通攻擊可以攻擊相鄰巢穴', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const nest = {
      id: 'nest-1',
      name: '測試巢穴',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    gameStore.setStateForTest(makeGameState({ players: [player], creatureNests: [nest] }))

    gameStore.previewAttackTarget('player-1', 'nest', 'nest-1')
    const result = gameStore.executeAttackTarget()

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.targetType).toBe('nest')
      expect(result.data.targetId).toBe('nest-1')
      expect(gameStore.getState().creatureNests[0].health).toBe(100 - result.data.damage)
    }
  })

  it('巢穴被普通攻擊摧毀時從地圖移除並授予尚未學會的江湖功法', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      innerSkillIds: ['tuna-gong'],
    })
    const nest = {
      id: 'nest-1',
      name: '測試巢穴',
      position: { row: 5, column: 6 },
      health: 1,
      maxHealth: 100,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    gameStore.setStateForTest(makeGameState({ players: [player], creatureNests: [nest] }))

    gameStore.previewAttackTarget('player-1', 'nest', 'nest-1')
    const result = gameStore.executeAttackTarget()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.defeated).toBe(true)
    expect(gameStore.getState().creatureNests).toHaveLength(0)
    expect(result.data.learnedSkill?.type).toBe('external')
  })

  it('外功可以攻擊相鄰巢穴並消耗內力', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      equippedExternalSkillIds: ['sky-breaking-palm'],
    })
    const nest = {
      id: 'nest-1',
      name: '測試巢穴',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      spawnChance: 1,
      cooldownRounds: 0,
      spawnLevel: 1,
    }
    gameStore.setStateForTest(makeGameState({ players: [player], creatureNests: [nest] }))

    gameStore.previewExternalDamageTarget('player-1', 'nest', 'nest-1', 'sky-breaking-palm')
    const result = gameStore.executeExternalDamagePreview()

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.targetType).toBe('nest')
      expect(result.data.targetId).toBe('nest-1')
      expect(gameStore.getState().creatureNests[0].health).toBe(100 - result.data.damage)
    }
    expect(gameStore.getState().players[0].innerPower).toBe(player.innerPower - 3)
  })

  it('殘內力玩家用外功擊殺生物升級後不再回滿內力', () => {
    const base = makeTestCreature()
    const required = getExperienceRequired(1)
    const player = {
      ...base,
      position: { row: 5, column: 5 },
      equippedExternalSkillIds: ['sky-breaking-palm'],
      experience: required - 10, // 擊殺後剛好升級
      innerPower: 3, // 殘內力
    }
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 1,
      maxHealth: 1,
      level: 1,
      // 低身法與根骨，避免回避／根骨減傷影響擊殺判定。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))

    gameStore.previewExternalDamageTarget('player-1', 'creature', 'creature-1', 'sky-breaking-palm')
    const result = gameStore.executeExternalDamagePreview()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.level).toBe(2)
    // 升級不再回滿內力：保留升級前的殘內力（本次外功消耗由原有內力支付）
    expect(nextPlayer.innerPower).toBe(3 - 3)
  })

  it('未升級時外功仍會正常扣除內力消耗', () => {
    const base = makeTestCreature()
    const player = {
      ...base,
      position: { row: 5, column: 5 },
      equippedExternalSkillIds: ['sky-breaking-palm'],
      innerPower: 10,
    }
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100, // 不會被擊殺，不升級
      maxHealth: 100,
      level: 1,
      // 低身法與根骨，避免回避／根骨減傷干擾內力結算。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))

    gameStore.previewExternalDamageTarget('player-1', 'creature', 'creature-1', 'sky-breaking-palm')
    const result = gameStore.executeExternalDamagePreview()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(gameStore.getState().players[0].innerPower).toBe(10 - 3)
    expect(gameStore.getState().players[0].innerPower).toBe(player.innerPower - 3)
  })

  it('普通攻擊會消耗武器 1 點與配件 0.5 點耐久', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 低身法與根骨，避免回避／根骨減傷干擾耐久消耗判定。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.equipEquipment('player-1', 'sword-1')
    gameStore.equipEquipment('player-1', 'pendant-1')
    gameStore.previewAttack('player-1', 'creature-1')

    gameStore.executeAttack()

    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'sword-1')?.durability).toBe(19)
    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'pendant-1')?.durability).toBe(19.5)
  })

  it('未擊殺生物時仍獲得少量經驗值', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 }, experience: 0 })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 低身法與根骨，避免回避／根骨減傷干擾經驗結算。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.defeated).toBe(false)
    expect(result.data.experienceReward).toBe(3)
    expect(gameStore.getState().players[0].experience).toBe(3)
  })

  it('攻擊帶有反震 Buff 的生物時，反彈 15% 傷害至玩家', () => {
    // 依序遮斷：暴擊(0.99→否)、回避(0.99→否)、根骨減傷(0.99→否) → 完整命中。
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.99).mockReturnValueOnce(0.99).mockReturnValueOnce(0.99)
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const playerHealthBefore = player.health
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 低身法與根骨，避免回避／根骨減傷干擾。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
      buffs: [{ id: 'reflect-1', definitionId: 'earth-mountain-reflection', sourceId: 'test', remainingRounds: null }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()
    vi.restoreAllMocks()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const damage = result.data.damage
    const nextPlayer = gameStore.getState().players[0]
    // 玩家受到 15% 反震傷害：health = 起始血 - damage * 0.15（與既有反震一致保留小數）。
    expect(damage).toBeGreaterThan(0)
    expect(nextPlayer.health).toBe(playerHealthBefore - damage * 0.15)
  })

  it('攻擊帶有反震 Buff 的生物被回避時，不反彈傷害', () => {
    // 依序遮斷：暴擊(0.99→否)、回避(0.0→命中) → 傷害 0、不反震。
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.99).mockReturnValueOnce(0)
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const playerHealthBefore = player.health
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 100,
      maxHealth: 100,
      // 高身法使回避率 >= 1%，random 0.0 命中回避。
      attributes: { armStrength: 8, constitution: 1, agility: 60, innerEnergy: 5, insight: 7 },
      buffs: [{ id: 'reflect-1', definitionId: 'earth-mountain-reflection', sourceId: 'test', remainingRounds: null }],
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()
    vi.restoreAllMocks()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.damage).toBe(0)
    expect(gameStore.getState().players[0].health).toBe(playerHealthBefore)
  })

  it('擊殺生物時可掉落裝備並加入裝備背包', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.99)
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 1,
      maxHealth: 1,
      // 低身法與根骨，避免回避／根骨減傷影響擊殺判定。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.loot?.kind).toBe('equipment')
    expect(gameStore.getState().players[0].equipmentInventory).toHaveLength(4)
    vi.restoreAllMocks()
  })

  it('殘血玩家擊殺生物升級後不回復氣血與內力', () => {
    const base = makeTestCreature()
    const required = getExperienceRequired(1)
    const player = {
      ...base,
      experience: required - 10, // 擊殺後剛好升級
      health: 5,
      innerPower: 3,
    }
    const creature = makeTestCreature({
      id: 'creature-1',
      name: '測試生物',
      position: { row: 5, column: 6 },
      health: 1,
      maxHealth: 1,
      level: 1,
      // 低身法與根骨，避免回避／根骨減傷影響擊殺判定。
      attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
    })
    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature] }))
    gameStore.previewAttack('player-1', 'creature-1')

    const result = gameStore.executeAttack()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const nextPlayer = gameStore.getState().players[0]
    expect(nextPlayer.level).toBe(2)
    // 升級不再回復氣血與內力：保留升級前數值。
    expect(nextPlayer.health).toBe(5)
    expect(nextPlayer.innerPower).toBe(3)
  })
})

describe('防衛營', () => {
  describe('強化城牆', () => {
    it('建造後提升據點最大與當前生命值', () => {
      const base = makeBaseState()
      base.buildingMaterials = 50
      base.health = 300
      gameStore.setStateForTest(makeGameState({ bases: [base], players: [makeTestCreature({ prestige: 240, governanceRank: 3, unlockedPolicyIds: ['basic', 'economic', 'military'] })] }))

      expect(getBaseMaxHealth(base)).toBe(450)
      expect(gameStore.constructBuilding('base-1', 'building-type-wall', 'player-1').ok).toBe(true)

      const nextBase = gameStore.getState().bases[0]
      expect(nextBase.maxHealth).toBe(480)
      expect(nextBase.health).toBe(330)
      // 建造聲望 = 使用的建料 / 5（強化城牆建料 30 → 6）。
      expect(gameStore.getState().players[0].prestige).toBe(246)
    })

    it('同一據點不能重複建造強化城牆', () => {
      const base = makeBaseState()
      base.buildingMaterials = 100
      gameStore.setStateForTest(makeGameState({ bases: [base] }))

      expect(gameStore.constructBuilding('base-1', 'building-type-wall').ok).toBe(true)
      expect(gameStore.constructBuilding('base-1', 'building-type-wall').ok).toBe(false)
    })
  })
  it('防衛營不影響玩家最大氣血', () => {
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-barracks',
      type: 'barracks',
      name: '防衛營',
      description: '據點鄰近的友軍每回合恢復氣血。',
      constructionCost: 50,
      level: 5,
      healthBonus: 30,
    })
    const player = makeTestCreature({ health: 10, position: { row: 5, column: 5 } })
    const state = makeGameState({ players: [player], bases: [base] })

    expect(getPlayerMaxHealth(state, player)).toBe(24)
    expect(player.health).toBe(10)
  })

  it('離開據點影響範圍後無加成', () => {
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-barracks',
      type: 'barracks',
      name: '防衛營',
      description: '據點鄰近的友軍每回合恢復氣血。',
      constructionCost: 50,
      level: 5,
      healthBonus: 30,
    })
    const player = makeTestCreature({ position: { row: 20, column: 20 } })
    expect(getPlayerMaxHealth(makeGameState({ players: [player], bases: [base] }), player)).toBe(24)
  })
})

describe('executeMission', () => {
  it('玩家在告示牌旁且未結束回合時可完成任務', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = makeBaseState() // base at (5,6), adjacent to player
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const completed = gameStore.executeMission('player-1', 'base-1')

    expect(completed.ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(10)
    expect(state.players[0].prestige).toBe(5)
    expect(state.players[0].turnEnded).toBe(false)

    gameStore.showActionResult(
      { title: '任務結果', message: '任務完成', rewards: [] },
      { type: 'end-player-turn', playerId: 'player-1' },
    )
    expect(gameStore.getState().blockingModal?.type).toBe('action-result')

    gameStore.confirmBlockingModal()

    expect(gameStore.getState().blockingModal).toBeNull()
    expect(gameStore.getState().players[0].turnEnded).toBe(false)
  })

  it('告示牌等級越高，任務獎勵越多', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = {
      ...makeBaseState(),
      buildings: [{ ...makeBaseState().buildings[0], level: 3 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const completed = gameStore.executeMission('player-1', 'base-1')

    expect(completed.ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(30)
    expect(state.players[0].prestige).toBe(15)
  })

  it('玩家不在告示牌旁時任務失敗', () => {
    const player = makeTestCreature({ position: { row: 10, column: 10 } })
    const base = makeBaseState() // base at (5,6), far from player
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const completed = gameStore.executeMission('player-1', 'base-1')

    expect(completed.ok).toBe(false)
    expect(gameStore.getState().players[0].money).toBe(0)
  })

  it('據點沒有告示牌時任務失敗', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = { ...makeBaseState(), buildings: [] }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const completed = gameStore.executeMission('player-1', 'base-1')

    expect(completed.ok).toBe(false)
  })

  it('體力不足時任務失敗且不扣資源', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 }, stamina: 1 })
    const base = makeBaseState()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    const completed = gameStore.executeMission('player-1', 'base-1')

    expect(completed.ok).toBe(false)
    if (!completed.ok) expect(completed.reason).toBe('體力不足。')
    const state = gameStore.getState()
    expect(state.players[0].money).toBe(0)
    expect(state.players[0].prestige).toBe(0)
    expect(state.players[0].stamina).toBe(1)
  })
})

describe('collectResourcePoint', () => {
  it('玩家在資源點旁且本回合未採集過時可採集', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = makeBaseState()
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    const collected = gameStore.collectResourcePoint('player-1', 'resource-point-1')

    expect(collected.ok).toBe(true)
    const state = gameStore.getState()
    expect(state.players[0].prestige).toBe(5)
    // 結果確認前只套用採集本身的 +10，尚未進入回合結算。
    expect(state.bases[0].buildingMaterials).toBe(10)
    expect(state.resourcePoints[0].lastCollectedRound).toBeNull()

    gameStore.showActionResult(
      { title: '採集結果', message: '採集完成', rewards: [] },
      { type: 'end-player-turn', playerId: 'player-1' },
    )
    expect(gameStore.getState().blockingModal?.type).toBe('action-result')

    gameStore.confirmBlockingModal()

    expect(gameStore.getState().blockingModal).toBeNull()
  })

  it('同一回合可再次採集資源點', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = makeBaseState()
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: 1,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    const collected = gameStore.collectResourcePoint('player-1', 'resource-point-1')

    expect(collected.ok).toBe(true)
  })

  it('建料倉庫提高建料上限與主動採集量', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = makeBaseState()
    base.buildings.push({
      id: 'building-1-warehouse',
      type: 'warehouse',
      name: '建料倉庫',
      description: '提高建料上限。',
      constructionCost: 40,
      materialCapacityBonus: 50,
      collectionBonus: 5,
    })
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    expect(getBaseMaxBuildingMaterials(base)).toBe(150)
    expect(getResourceCollectionMaterialGain(base, 10)).toBe(15)
    expect(gameStore.collectResourcePoint('player-1', 'resource-point-1').ok).toBe(true)
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(15)
  })

  it('民生政策提高主動採集量', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base: BaseState = { ...makeBaseState(), activePolicyId: 'civilian' }
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    expect(gameStore.collectResourcePoint('player-1', 'resource-point-1').ok).toBe(true)
    // 10 × (1 + 0.1) = 11
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(11)
  })

  it('建料倉庫上限允許主動採集超過基礎上限', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = makeBaseState()
    base.buildingMaterials = 98
    base.buildings.push({
      id: 'building-1-warehouse',
      type: 'warehouse',
      name: '建料倉庫',
      description: '提高建料上限。',
      constructionCost: 40,
      materialCapacityBonus: 50,
      collectionBonus: 0,
    })
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    expect(getBaseMaxBuildingMaterials(base)).toBe(150)
    expect(gameStore.collectResourcePoint('player-1', 'resource-point-1').ok).toBe(true)
    // 98 + 10 = 108，應受倉庫上限 150 而非基礎上限 100 截斷。
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(108)
  })

  it('據點建料已滿時採集失敗且不消耗玩家資源', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 }, stamina: 7, prestige: 12 })
    const base = makeBaseState()
    base.buildingMaterials = base.maxBuildingMaterials
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 5, column: 6 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({ players: [player], bases: [base], resourcePoints: [resourcePoint] }),
    )

    const result = gameStore.collectResourcePoint('player-1', 'resource-point-1')

    expect(result.ok).toBe(false)
    expect(gameStore.getState().players[0].stamina).toBe(7)
    expect(gameStore.getState().players[0].prestige).toBe(12)
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(100)
  })
})

describe('回合切換', () => {
  it('回合完成時據點獲得所屬資源點收入總和的 25%', () => {
    const player = makeTestCreature({ stamina: 0, health: 10 })
    const base = makeBaseState()
    const resourcePoints = [
      {
        id: 'resource-point-1', name: '資源點 1', position: { row: 2, column: 2 }, ownerBaseId: base.id,
        materialIncome: 10, lastCollectedRound: null, health: 30, maxHealth: 30,
      },
      {
        id: 'resource-point-2', name: '資源點 2', position: { row: 2, column: 3 }, ownerBaseId: base.id,
        materialIncome: 6, lastCollectedRound: null, health: 30, maxHealth: 30,
      },
    ]
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base], resourcePoints }))

    gameStore.endPlayerTurn('player-1')

    expect(gameStore.getState().bases[0].buildingMaterials).toBe(4)
  })

  it('民生政策提高回合被動建料收入', () => {
    const player = makeTestCreature({ stamina: 0, health: 10 })
    const base: BaseState = { ...makeBaseState(), activePolicyId: 'civilian' }
    const resourcePoints = [
      {
        id: 'resource-point-1', name: '資源點 1', position: { row: 2, column: 2 }, ownerBaseId: base.id,
        materialIncome: 10, lastCollectedRound: null, health: 30, maxHealth: 30,
      },
    ]
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base], resourcePoints }))

    gameStore.endPlayerTurn('player-1')

    // (10 * 0.25) = 2.5 → round 後套用民生 +10% = 3
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(3)
  })

  it('建料倉庫上限允許被動收入超過基礎上限', () => {
    const player = makeTestCreature({ stamina: 0, health: 10 })
    const base = makeBaseState()
    base.buildingMaterials = 99
    base.buildings.push({
      id: 'building-1-warehouse',
      type: 'warehouse',
      name: '建料倉庫',
      description: '提高建料上限。',
      constructionCost: 40,
      materialCapacityBonus: 50,
    })
    const resourcePoints = [
      {
        id: 'resource-point-1', name: '資源點 1', position: { row: 2, column: 2 }, ownerBaseId: base.id,
        materialIncome: 10, lastCollectedRound: null, health: 30, maxHealth: 30,
      },
    ]
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base], resourcePoints }))

    gameStore.endPlayerTurn('player-1')

    // 99 + (10 * 0.25 = 2.5) = 101.5，應受倉庫上限 150 而非基礎上限 100 截斷。
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(101.5)
  })

  it('單一玩家結束回合後，回合數增加', () => {
    const player = makeTestCreature({ stamina: 0, health: 10 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    gameStore.endPlayerTurn('player-1')

    const state = gameStore.getState()
    expect(state.round).toBe(2)
    expect(state.players[0].turnEnded).toBe(false)
  })

  it('某玩家死亡時，回合切換跳過死亡玩家，避免 activePlayerId 指向死亡玩家', () => {
    // 玩家 2 開場（activePlayerId = player-2），玩家 1 存活。
    const firstPlayer = makeTestCreature({ id: 'player-1', stamina: 0, health: 10 })
    const deadSecondPlayer = makeTestCreature({ id: 'player-2', name: '玩家 2', stamina: 0, health: 0 })
    gameStore.setStateForTest(
      makeGameState({ players: [firstPlayer, deadSecondPlayer], activePlayerId: 'player-1' }),
    )

    // 玩家 1 結束回合：下一位應跳過已死亡的 player-2，回到自己，而不是指到死亡玩家。
    gameStore.endPlayerTurn('player-1')

    const state = gameStore.getState()
    expect(state.activePlayerId).toBe('player-1')
    // 死亡玩家仍在陣列中（保留顯示），但不會成為 activePlayerId。
    expect(state.players.find((player) => player.id === 'player-2')?.health).toBe(0)
  })

  it('中間玩家死亡時，回合切換跳到下一位存活玩家', () => {
    const firstPlayer = makeTestCreature({ id: 'player-1', stamina: 0, health: 10 })
    const deadSecondPlayer = makeTestCreature({ id: 'player-2', name: '玩家 2', stamina: 0, health: 0 })
    const thirdPlayer = makeTestCreature({ id: 'player-3', name: '玩家 3', stamina: 0, health: 10 })
    gameStore.setStateForTest(
      makeGameState({ players: [firstPlayer, deadSecondPlayer, thirdPlayer], activePlayerId: 'player-3' }),
    )

    // 玩家 3 結束回合：下一位是 player-1（跳過中間死亡的 player-2）。
    gameStore.endPlayerTurn('player-3')

    expect(gameStore.getState().activePlayerId).toBe('player-1')
  })

  it('回合完成後清空已使用的道具類型列表', () => {
    const player = makeTestCreature({
      inventory: [{ itemId: 'scout-talisman', quantity: 2 }],
      itemEffectsUsedThisTurn: ['scout'],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    gameStore.endPlayerTurn('player-1')

    // 完整回合（單人）結束後，itemEffectsUsedThisTurn 應被清空，
    // 否則跨回合仍會被鎖（如裂地符等 element-burst 道具）。
    expect(gameStore.getState().players[0].itemEffectsUsedThisTurn ?? []).toEqual([])
  })

  it('非目前玩家無法結束回合', () => {
    const player = makeTestCreature()
    gameStore.setStateForTest(makeGameState({ players: [player], activePlayerId: 'other' }))

    gameStore.endPlayerTurn('player-1')

    expect(gameStore.getState().round).toBe(1)
  })
})

describe('upgradeBuilding', () => {
  it('官階不足時無法升級建築', () => {
    const player = makeTestCreature({ prestige: 0 })
    const base = makeBaseState()
    base.buildingMaterials = 100
    base.buildings.push({
      id: 'building-1-wall',
      type: 'wall',
      name: '強化城牆',
      description: '提升據點最大生命。',
      constructionCost: 30,
      level: 1,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.upgradeBuilding('player-1', 'base-1', 'building-1-wall').ok).toBe(false)
    expect(gameStore.getState().bases[0].buildings[1].level).toBe(1)
  })

  it('村寨掌事可升級建築並獲得聲望', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'economic'] })
    const base = makeBaseState()
    base.buildingMaterials = 100
    base.buildings.push({
      id: 'building-1-wall',
      type: 'wall',
      name: '強化城牆',
      description: '提升據點最大生命。',
      constructionCost: 30,
      level: 1,
    })
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.upgradeBuilding('player-1', 'base-1', 'building-1-wall').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.bases[0].buildings[1].level).toBe(2)
    expect(state.bases[0].buildingMaterials).toBe(100 - 40)
    expect(state.players[0].prestige).toBe(80 + 8)
  })
})

describe('貿易市場全局靈氣', () => {
  it('建成貿易市場賦予一項全局靈氣 buff', () => {
    const player = makeTestCreature()
    const base = makeBaseState()
    base.buildingMaterials = 100
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.constructBuilding('base-1', 'building-type-trade-market', 'player-1').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.globalBuffs).toHaveLength(1)
    expect(state.globalBuffs?.[0].sourceBaseId).toBe('base-1')
    expect(state.globalBuffs?.[0].sourceBuildingId).toBe('base-1-trade-market-2')
    expect(state.globalBuffs?.[0].magnitude).toBe(
      getGlobalBuffMagnitudeForLevel(state.globalBuffs![0].kind, 1),
    )
  })

  it('升級貿易市場會增強已有靈氣的 magnitude', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'economic'] })
    const base = makeBaseState()
    base.buildingMaterials = 200
    base.buildings.push({
      id: 'building-1-trade-market',
      type: 'trade-market',
      name: '貿易市場',
      description: '建成時賦予一項全局靈氣。',
      constructionCost: 30,
      level: 1,
    })
    // 模擬該貿易市場建成時已賦予的一項靈氣。
    const buffKind = 'base-defense-reduction'
    gameStore.setStateForTest({
      ...makeGameState({ players: [player], bases: [base] }),
      globalBuffs: [{ id: 'g1', kind: buffKind, magnitude: 2, sourceBaseId: 'base-1', sourceBuildingId: 'building-1-trade-market' }],
    } as GameState)

    expect(gameStore.upgradeBuilding('player-1', 'base-1', 'building-1-trade-market').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.bases[0].buildings[1].level).toBe(2)
    expect(state.globalBuffs).toHaveLength(1)
    expect(state.globalBuffs?.[0].magnitude).toBe(getGlobalBuffMagnitudeForLevel(buffKind, 2))
  })
})

describe('建設聲望', () => {
  it('成功建造防禦設施時獲得聲望', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 }, stamina: 10, maxStamina: 10 })
    const base = makeBaseState()
    base.buildingMaterials = 100
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.constructDefenseStructure('player-1', 'base-1', 'barricade', { row: 5, column: 4 }).ok).toBe(true)
    // 建造聲望 = 使用的建料 / 5（木柵建料 20 → 4）。
    expect(gameStore.getState().players[0].prestige).toBe(4)
  })
})

describe('switchBasePolicy', () => {
  it('未解鎖政策時無法切換', () => {
    const player = makeTestCreature({ prestige: 0, unlockedPolicyIds: ['basic'] })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'economic').ok).toBe(false)
    expect(gameStore.getState().bases[0].activePolicyId).toBeUndefined()
  })

  it('已解鎖政策時可切換（不增加聲望）', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'civilian'] })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'civilian').ok).toBe(true)
    const state = gameStore.getState()
    expect(state.bases[0].activePolicyId).toBe('civilian')
    expect(state.players[0].prestige).toBe(80)
  })

  it('切換政策後進入冷卻，需等待 3 回合才能再次切換', () => {
    const player = makeTestCreature({ prestige: 240, governanceRank: 3, unlockedPolicyIds: ['basic', 'civilian', 'military'] })
    gameStore.setStateForTest(makeGameState({ players: [player], round: 5 }))

    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'civilian').ok).toBe(true)
    expect(gameStore.getState().bases[0].lastPolicySwitchRound).toBe(5)

    // 尚未滿 3 回合，無法切換。
    gameStore.setStateForTest({ ...gameStore.getState(), round: 6 })
    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'military').ok).toBe(false)

    gameStore.setStateForTest({ ...gameStore.getState(), round: 7 })
    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'military').ok).toBe(false)

    // 第 8 回合（round 5 + 3）可再次切換。
    gameStore.setStateForTest({ ...gameStore.getState(), round: 8 })
    expect(gameStore.switchBasePolicy('player-1', 'base-1', 'military').ok).toBe(true)
  })

  it('遠端切換政策同樣受到冷卻限制', () => {
    const player = makeTestCreature({ prestige: 240, governanceRank: 3, unlockedPolicyIds: ['basic', 'civilian', 'military'] })
    const base1 = makeBaseState()
    const base2: BaseState = {
      ...makeBaseState(),
      id: 'base-2',
      name: '據點 2',
    }
    gameStore.setStateForTest({ ...makeGameState({ players: [player], round: 4 }), bases: [base1, base2] })

    expect(gameStore.switchBasePolicy('player-1', 'base-2', 'civilian').ok).toBe(true)
    expect(gameStore.getState().bases[1].lastPolicySwitchRound).toBe(4)

    // 距離上次切換 2 回合，仍無法切換。
    gameStore.setStateForTest({ ...gameStore.getState(), round: 6 })
    expect(gameStore.switchBasePolicy('player-1', 'base-2', 'military').ok).toBe(false)
  })
})

describe('transportPlayer', () => {
  it('從有驛站的據點傳送到其他據點', () => {
    const player = makeTestCreature({ money: 100, position: { row: 5, column: 5 } })
    const base1 = {
      ...makeBaseState(),
      id: 'base-1',
      position: { row: 5, column: 6 },
      buildings: [
        {
          id: 'base-1-ws',
          type: 'waystation',
          name: '驛站',
          description: '據點間傳送',
          constructionCost: 20,
        },
      ],
    }
    const base2 = {
      ...makeBaseState(),
      id: 'base-2',
      name: '據點 2',
      position: { row: 10, column: 10 },
      buildings: [],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))

    expect(gameStore.transportPlayer('player-1', 'base-2').ok).toBe(true)
    const state = gameStore.getState()
    expect(Math.abs(state.players[0].position.row - base2.position.row) + Math.abs(state.players[0].position.column - base2.position.column)).toBe(1)
    expect(state.players[0].money).toBe(100 - 10)
  })

  it('金錢不足時無法傳送', () => {
    const player = makeTestCreature({ money: 3, position: { row: 5, column: 5 } })
    const base1 = {
      ...makeBaseState(),
      id: 'base-1',
      position: { row: 5, column: 6 },
      buildings: [
        {
          id: 'base-1-ws',
          type: 'waystation',
          name: '驛站',
          description: '據點間傳送',
          constructionCost: 20,
        },
      ],
    }
    const base2 = { ...makeBaseState(), id: 'base-2', position: { row: 10, column: 10 }, buildings: [] }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))

    expect(gameStore.transportPlayer('player-1', 'base-2').ok).toBe(false)
  })
})

describe('公共倉庫', () => {
  it('從有交易所的據點存入與取出物品', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'heal-wound-medicine', quantity: 3 }],
    })
    const base = {
      ...makeBaseState(),
      buildings: [
        {
          id: 'base-1-ex',
          type: 'exchange',
          name: '交易所',
          description: '公共倉庫',
          constructionCost: 30,
        },
      ],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositToSharedWarehouse('player-1', 'heal-wound-medicine', 2).ok).toBe(true)
    let state = gameStore.getState()
    expect(state.players[0].inventory).toEqual([{ itemId: 'heal-wound-medicine', quantity: 1 }])
    expect(state.sharedWarehouse).toEqual([{ itemId: 'heal-wound-medicine', quantity: 2 }])

    expect(gameStore.withdrawFromSharedWarehouse('player-1', 'heal-wound-medicine', 1).ok).toBe(true)
    state = gameStore.getState()
    expect(state.players[0].inventory).toEqual([{ itemId: 'heal-wound-medicine', quantity: 2 }])
    expect(state.sharedWarehouse).toEqual([{ itemId: 'heal-wound-medicine', quantity: 1 }])
  })

  it('持有數量不足時無法存入', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      inventory: [{ itemId: 'heal-wound-medicine', quantity: 1 }],
    })
    const base = {
      ...makeBaseState(),
      buildings: [{ id: 'base-1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositToSharedWarehouse('player-1', 'heal-wound-medicine', 5).ok).toBe(false)
  })

  it('從有交易所的據點存入與取出裝備', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      equipmentInventory: [{
        instanceId: 'eq-1',
        equipmentId: 'iron-sword',
        durability: 20,
        maxDurability: 20,
      }],
    })
    const base = {
      ...makeBaseState(),
      buildings: [{ id: 'base-1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositEquipmentToSharedWarehouse('player-1', 'eq-1').ok).toBe(true)
    let state = gameStore.getState()
    expect(state.players[0].equipmentInventory).toHaveLength(0)
    expect(state.sharedEquipmentWarehouse).toHaveLength(1)
    expect(state.sharedEquipmentWarehouse?.[0].instanceId).toBe('eq-1')

    expect(gameStore.withdrawEquipmentFromSharedWarehouse('player-1', 'eq-1').ok).toBe(true)
    state = gameStore.getState()
    expect(state.players[0].equipmentInventory).toHaveLength(1)
    expect(state.sharedEquipmentWarehouse).toHaveLength(0)
  })

  it('未持有裝備時無法存入裝備', () => {
    const player = makeTestCreature({ position: { row: 5, column: 5 } })
    const base = {
      ...makeBaseState(),
      buildings: [{ id: 'base-1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositEquipmentToSharedWarehouse('player-1', 'eq-1').ok).toBe(false)
  })

  it('從有交易所的據點存入與取出功法（經驗值繼承）', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      innerSkillIds: ['tuna-gong', 'golden-body-inner'],
      innerSkillId: 'tuna-gong',
      skillProgression: { 'golden-body-inner': { experience: 30, level: 2 } },
    })
    const base = {
      ...makeBaseState(),
      buildings: [{ id: 'base-1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositSkillToSharedWarehouse('player-1', 'golden-body-inner').ok).toBe(true)
    let state = gameStore.getState()
    expect(state.players[0].innerSkillIds).not.toContain('golden-body-inner')
    expect(state.sharedSkillWarehouse).toHaveLength(1)
    expect(state.sharedSkillWarehouse?.[0]).toMatchObject({ skillId: 'golden-body-inner', experience: 30, level: 2 })

    expect(gameStore.withdrawSkillFromSharedWarehouse('player-1', 'golden-body-inner').ok).toBe(true)
    state = gameStore.getState()
    expect(state.players[0].innerSkillIds).toContain('golden-body-inner')
    expect(state.players[0].skillProgression?.['golden-body-inner']).toEqual({ experience: 30, level: 2 })
    expect(state.sharedSkillWarehouse).toHaveLength(0)
  })

  it('目前裝備的內功無法存入功法', () => {
    const player = makeTestCreature({
      position: { row: 5, column: 5 },
      innerSkillIds: ['tuna-gong'],
      innerSkillId: 'tuna-gong',
    })
    const base = {
      ...makeBaseState(),
      buildings: [{ id: 'base-1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
    }
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base] }))

    expect(gameStore.depositSkillToSharedWarehouse('player-1', 'tuna-gong').ok).toBe(false)
  })
})

describe('總管府治理', () => {
  function makeBase2(): BaseState {
    return {
      id: 'base-2',
      name: '據點 2',
      position: { row: 10, column: 10 },
      buildings: [],
      buildingMaterials: 50,
      maxBuildingMaterials: 100,
      health: 450,
      maxHealth: 450,
    }
  }

  it('可遠端切換其他據點政策', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'civilian'] })
    const base1 = {
      ...makeBaseState(),
      buildings: [
        { id: 'base-1-rm', type: 'regional-management', name: '總管府', description: '', constructionCost: 80 },
      ],
    }
    const base2 = makeBase2()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))

    expect(gameStore.switchRemoteBasePolicy('player-1', 'base-2', 'civilian').ok).toBe(true)
    expect(gameStore.getState().bases[1].activePolicyId).toBe('civilian')
  })

  it('未解鎖政策時無法遠端切換', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'civilian'] })
    const base1 = {
      ...makeBaseState(),
      buildings: [
        { id: 'base-1-rm', type: 'regional-management', name: '總管府', description: '', constructionCost: 80 },
      ],
    }
    const base2 = makeBase2()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))

    expect(gameStore.switchRemoteBasePolicy('player-1', 'base-2', 'military').ok).toBe(false)
  })

  it('可調度建料並套用損耗', () => {
    const player = makeTestCreature({ prestige: 80, governanceRank: 2 })
    const base1 = {
      ...makeBaseState(),
      buildingMaterials: 100,
      buildings: [
        { id: 'base-1-rm', type: 'regional-management', name: '總管府', description: '', constructionCost: 80 },
      ],
    }
    const base2 = makeBase2()
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))

    const result = gameStore.transferBaseMaterials('player-1', 'base-1', 'base-2', 20)
    expect(result.ok).toBe(true)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.deliveredAmount).toBe(18)
      expect(result.data.loss).toBe(2)
    }
    const state = gameStore.getState()
    expect(state.bases[0].buildingMaterials).toBe(80)
    expect(state.bases[1].buildingMaterials).toBe(50 + 18)
  })
})
