// @ts-expect-error Test runtime provides Node's file system module; app tsconfig omits Node typings.
import { mkdirSync, writeFileSync } from 'node:fs'
// @ts-expect-error Test runtime provides Node's path module; app tsconfig omits Node typings.
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { BUILTIN_TEMPLATES } from './mapTemplates'
import { gameStore } from './gameStore'
import type { BaseState, GameState } from './types'
import { getInnerSkill, getSkillDamage, getSkillProgression } from './rules/skillRules'
import { getEffectiveAttributesForPlayer } from './rules/playerDerivedRules'
import { itemCatalog } from './catalogs/itemCatalog'
import { clearMidTermGoals } from './ai/fuzzy/midTermGoal'

declare const process: { cwd(): string }

type AiTurnTrace = {
  turn: number
  round: number
  player: {
    id: string
    name: string
    level: number
    experience: number
    attributes: { armStrength: number; constitution: number; agility: number; innerEnergy: number; insight: number }
    innerSkill: { id: string; name: string; level: number; damage: number }
    health: number
    stamina: number
    position: { row: number; column: number }
  }
  actions: unknown[]
  storedExperienceDelta: number
  leveledUp: boolean
  creatureLogs: unknown[]
  spawnedCreatures: unknown[]
  defeatedCreatures: string[]
  nests: Array<{ id: string; health: number; maxHealth: number }>
}

function recordAiTurn(before: GameState, after: GameState, turn: number): AiTurnTrace {
  const player = after.players.find((candidate) => candidate.isAI) ?? after.players[0]
  const beforeCreatureIds = new Set(before.creatures.map((creature) => creature.id))
  const afterCreatureIds = new Set(after.creatures.map((creature) => creature.id))
  const innerSkill = player ? getInnerSkill(player.innerSkillId) : undefined
  const innerSkillLevel = player ? getSkillProgression(player, player.innerSkillId).level : 1
  const effectiveAttributes = player ? getEffectiveAttributesForPlayer(player) : undefined
  return {
    turn,
    round: after.round,
    player: {
      id: player?.id ?? '',
      name: player?.name ?? '',
      level: player?.level ?? 0,
      experience: player?.experience ?? 0,
      attributes: player?.attributes ?? { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
      innerSkill: {
        id: player?.innerSkillId ?? '',
        name: innerSkill?.name ?? '',
        level: innerSkillLevel,
        damage: innerSkill && effectiveAttributes ? getSkillDamage(effectiveAttributes, innerSkill, innerSkillLevel) : 0,
      },
      health: player?.health ?? 0,
      stamina: player?.stamina ?? 0,
      position: player?.position ?? { row: -1, column: -1 },
    },
    actions: (after.actionEvents ?? []).filter((event) => !(before.actionEvents ?? []).some((previous) => previous.id === event.id)),
    storedExperienceDelta: (player?.experience ?? 0) - (before.players.find((candidate) => candidate.id === player?.id)?.experience ?? 0),
    leveledUp: (player?.level ?? 0) > (before.players.find((candidate) => candidate.id === player?.id)?.level ?? 0),
    creatureLogs: after.creatureActionLogs.slice(before.creatureActionLogs.length),
    spawnedCreatures: after.creatures.filter((creature) => !beforeCreatureIds.has(creature.id)),
    defeatedCreatures: [...beforeCreatureIds].filter((id) => !afterCreatureIds.has(id)),
    nests: after.creatureNests.map((nest) => ({ id: nest.id, health: nest.health, maxHealth: nest.maxHealth })),
  }
}

function countActionTypes(traces: AiTurnTrace[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const trace of traces) {
    for (const event of trace.actions) {
      const type = (event as { action?: { type?: string } }).action?.type
      if (!type) continue
      counts[type] = (counts[type] ?? 0) + 1
    }
  }
  return counts
}

function progressBar(ratio: number, width: number = 12): string {
  const clamped = Math.max(0, Math.min(1, ratio))
  const filled = Math.round(clamped * width)
  return `${'█'.repeat(filled)}${'·'.repeat(width - filled)}`
}

function traceNestHealth(traces: AiTurnTrace[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const trace of traces) {
    for (const nest of trace.nests) map[nest.id] = nest.health
  }
  return map
}

function writeAiTraceReport(fileName: string, title: string, traces: AiTurnTrace[], finalState: GameState): void {
  const reportPath = resolve(process.cwd(), 'reports', 'analysis', fileName)
  mkdirSync(resolve(process.cwd(), 'reports', 'analysis'), { recursive: true })

  const actionTypeCounts = countActionTypes(traces)
  const actionSummary = Object.entries(actionTypeCounts)
    .sort((first, second) => second[1] - first[1])
    .map(([type, count]) => `${type}=${count}`)
    .join(', ')

  const totalSpawned = traces.reduce((sum, trace) => sum + trace.spawnedCreatures.length, 0)
  const totalDefeated = traces.reduce((sum, trace) => sum + trace.defeatedCreatures.length, 0)
  const leveledUp = traces.filter((trace) => trace.leveledUp).length
  const lastTurn = traces[traces.length - 1]
  const player = lastTurn?.player
  // KPI：基於每個 turn 的 action 與玩家快照估算效率指標。
  const productiveActionTypes = new Set([
    'attack', 'use-facility', 'buy-item', 'sell-item', 'learn-skill', 'practice-skill',
    'collect', 'use-item', 'use-element-burst', 'equip', 'equip-inner-skill',
  ])
  let totalActions = 0
  let productiveActions = 0
  let totalAttackActions = 0
  for (const trace of traces) {
    for (const event of trace.actions) {
      const type = (event as { action?: { type?: string } }).action?.type
      if (!type) continue
      totalActions += 1
      if (productiveActionTypes.has(type)) productiveActions += 1
      if (type === 'attack') totalAttackActions += 1
    }
  }
  const productiveRatio = totalActions > 0 ? productiveActions / totalActions : 0
  const killEfficiency = totalSpawned > 0 ? totalDefeated / totalSpawned : 0
  const killCost = totalDefeated > 0 ? totalAttackActions / totalDefeated : 0
  const totalExperience = Math.max(0, player?.experience ?? 0)
  const xpPerTurn = traces.length > 0 ? totalExperience / traces.length : 0
  const startNestHealth = traces
    .reduce<Record<string, number>>((map, trace) => {
      for (const nest of trace.nests) if (!(nest.id in map)) map[nest.id] = nest.health
      return map
    }, {})
  const endNestHealth = traceNestHealth(traces)
  const lines: string[] = [
    `# ${title}`,
    '',
    `- AI turns: ${traces.length}`,
    `- Final round: ${lastTurn?.round ?? '?'}`,
    `- Game won: ${finalState.gameWon === true ? 'true' : 'false'}`,
    `- Game over: ${finalState.gameOver === true ? 'true' : 'false'}`,
    `- Remaining nests: ${finalState.creatureNests.length}`,
    '',
    '## Aggregate',
    '',
    `- Action counts: ${actionSummary || 'none'}`,
    `- Creatures spawned (total): ${totalSpawned}`,
    `- Creatures defeated (total): ${totalDefeated}`,
    `- Level-ups observed: ${leveledUp}`,
    `- Final player: level ${player?.level ?? '?'}, experience ${player?.experience ?? '?'}, inner skill ${player?.innerSkill.name} (${player?.innerSkill.id}) lv.${player?.innerSkill.level} damage ${player?.innerSkill.damage}`,
    `- Final attributes: armStrength=${player?.attributes.armStrength ?? '?'}, constitution=${player?.attributes.constitution ?? '?'}, agility=${player?.attributes.agility ?? '?'}, innerEnergy=${player?.attributes.innerEnergy ?? '?'}, insight=${player?.attributes.insight ?? '?'}`,
    '',
    '## Efficiency (KPI)',
    '',
    `- 行動產出率 (productive): ${progressBar(productiveRatio)} ${(productiveRatio * 100).toFixed(1)}% (${productiveActions}/${totalActions})`,
    `- 擊殺效率 (kill/generate): ${progressBar(killEfficiency)} ${killEfficiency.toFixed(2)} (${totalDefeated}/${totalSpawned || 0})`,
    `- 擊殺成本 (attack/kill): ${totalDefeated > 0 ? killCost.toFixed(2) : 'n/a'} (${totalAttackActions} 次攻擊 / ${totalDefeated} 擊殺)`,
    `- 經驗效率 (XP/turn): ${xpPerTurn.toFixed(2)} (${totalExperience} XP / ${traces.length} turns)`,
    '',
    `- Nest health (start → end): ${Object.entries(endNestHealth).map(([id, health]) => `${id}=${startNestHealth[id] ?? '?'}→${health}`).join(', ') || 'none'}`,
    '',
    '## Turn Trace',
    '',
  ]
  for (const trace of traces) {
    lines.push(`### Turn ${trace.turn} (round ${trace.round})`)
    lines.push(`- Player: ${trace.player.name} (${trace.player.id}), level ${trace.player.level}, experience ${trace.player.experience}, at (${trace.player.position.row}, ${trace.player.position.column}), health ${trace.player.health}, stamina ${trace.player.stamina}`)
    lines.push(`- Attributes: armStrength=${trace.player.attributes.armStrength}, constitution=${trace.player.attributes.constitution}, agility=${trace.player.attributes.agility}, innerEnergy=${trace.player.attributes.innerEnergy}, insight=${trace.player.attributes.insight}`)
    lines.push(`- Inner skill: ${trace.player.innerSkill.name} (${trace.player.innerSkill.id}), level ${trace.player.innerSkill.level}, damage ${trace.player.innerSkill.damage}`)
    lines.push(`- Stored experience change: ${trace.storedExperienceDelta >= 0 ? '+' : ''}${trace.storedExperienceDelta}${trace.leveledUp ? ' (level up; stored experience reset by game rules)' : ''}`)
    lines.push(`- Spawned creatures: ${trace.spawnedCreatures.length}`)
    lines.push(`- Defeated creatures: ${trace.defeatedCreatures.length > 0 ? trace.defeatedCreatures.join(', ') : 'none'}`)
    lines.push(`- Nests: ${trace.nests.map((nest) => `${nest.id}=${nest.health}/${nest.maxHealth}`).join(', ') || 'none'}`)
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify({ actions: trace.actions, creatureLogs: trace.creatureLogs, spawnedCreatures: trace.spawnedCreatures }, null, 2))
    lines.push('```', '')
  }
  writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8')
}

describe('AI 玩家：入門沙盒地圖通關能力', () => {
  beforeEach(() => {
    gameStore.resetForTest()
    clearMidTermGoals()
  })

  it('應能在有限回合內摧毀所有妖物巢穴並取得勝利', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      seed: 20260902,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('入門地圖沒有建立 AI 玩家。')
    gameStore.setStateForTest({
      ...startedState,
      players: [aiPlayer],
      activePlayerId: aiPlayer.id,
    })

    const maxRounds = 200
    let aiTurns = 0
    const traces: AiTurnTrace[] = []
    let turnsWithRealAction = 0

    while (!gameStore.getState().gameWon && !gameStore.getState().gameOver && aiTurns < maxRounds) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      expect(activePlayer.isAI).toBe(true)
      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
      const after = gameStore.getState()
      const trace = recordAiTurn(state, after, aiTurns)
      if (trace.actions.some((event) => (event as { action?: { type?: string } }).action?.type !== 'end-turn')) {
        turnsWithRealAction++
      }
      traces.push(trace)
    }

    const finalState = gameStore.getState()
    writeAiTraceReport('ai-beginner-sandbox-standard-trace-2026-09-02.md', 'AI Beginner Sandbox Standard Trace', traces, finalState)
    expect(turnsWithRealAction).toBeGreaterThan(aiTurns * 0.5)
    expect({
      gameWon: finalState.gameWon,
      gameOver: finalState.gameOver,
      remainingNests: finalState.creatureNests.length,
      aiTurns,
    }).toEqual({
      gameWon: true,
      gameOver: false,
      remainingNests: 0,
      aiTurns: expect.any(Number),
    })
  })

  it.each([20260903, 20260904])('簡單難度（seed %s）：沒有初始生物時應能摧毀唯一妖物巢穴', (seed) => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed,
      nestCount: 1,
      creatureCount: 0,
      resourcePointCount: 0,
      itemPointCount: 0,
      ruinCount: 0,
      sectGateCount: 1,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('簡單難度沒有建立 AI 玩家。')
    expect(startedState.sectGates ?? []).toHaveLength(1)
    const supportBase: BaseState = {
      id: 'ai-support-base',
      name: 'AI 補給據點',
      position: { row: aiPlayer.position.row, column: aiPlayer.position.column + 1 },
      buildings: [
        { id: 'ai-support-infirmary', type: 'infirmary', name: '醫療室', description: '', constructionCost: 50, level: 1 },
        { id: 'ai-support-item-shop', type: 'item-shop', name: '道具商店', description: '', constructionCost: 30, level: 1 },
      ],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
    }
    gameStore.setStateForTest({
      ...startedState,
      players: [{
        ...aiPlayer,
        money: 200,
      }],
      bases: [...startedState.bases, supportBase],
      activePlayerId: aiPlayer.id,
      sectGates: startedState.sectGates?.map((gate) => ({
        ...gate,
        position: { row: aiPlayer.position.row, column: Math.max(1, aiPlayer.position.column - 4) },
      })),
      creatureNests: startedState.creatureNests.map((nest) => ({ ...nest, spawnChance: 0 })),
      nestHealthRegenPercent: 0,
    })

    const maxTurns = 200
    let aiTurns = 0
    const traces: AiTurnTrace[] = []
    let turnsWithRealAction = 0
    while (!gameStore.getState().gameWon && !gameStore.getState().gameOver && aiTurns < maxTurns) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      expect(activePlayer.isAI).toBe(true)
      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
      const after = gameStore.getState()
      const trace = recordAiTurn(state, after, aiTurns)
      if (trace.actions.some((event) => (event as { action?: { type?: string } }).action?.type !== 'end-turn')) {
        turnsWithRealAction++
      }
      traces.push(trace)
    }

    const finalState = gameStore.getState()
    writeAiTraceReport('ai-beginner-sandbox-simple-trace-2026-09-02.md', 'AI Beginner Sandbox Simple Trace', traces, finalState)
    expect(turnsWithRealAction).toBeGreaterThan(aiTurns * 0.5)
    expect({
      gameWon: finalState.gameWon,
      gameOver: finalState.gameOver,
      remainingNests: finalState.creatureNests.length,
      aiTurns,
    }).toEqual({
      gameWon: true,
      gameOver: false,
      remainingNests: 0,
      aiTurns: expect.any(Number),
    })
  })

  it('1 級 AI 應能找到並擊敗唯一的 1 級敵人生物', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260906,
      nestCount: 0,
      creatureCount: 1,
      resourcePointCount: 0,
      itemPointCount: 0,
      ruinCount: 0,
      sectGateCount: 0,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    const creature = startedState.creatures[0]
    if (!aiPlayer || !creature) throw new Error('生物測試沒有建立 AI 玩家或敵人生物。')

    gameStore.setStateForTest({
      ...startedState,
      players: [{ ...aiPlayer, level: 1, experience: 0 }],
      creatures: [{
        ...creature,
        name: '1 級測試生物',
        isAI: false,
        level: 1,
        experience: 0,
        health: 1,
        maxHealth: 1,
        position: { row: aiPlayer.position.row, column: aiPlayer.position.column + 1 },
        behaviorType: 'hunter',
        aggroRange: 0,
      }],
      creatureNests: [],
      activePlayerId: aiPlayer.id,
    })

    const maxTurns = 20
    let aiTurns = 0
    const traces: AiTurnTrace[] = []
    while (!gameStore.getState().gameOver && aiTurns < maxTurns && gameStore.getState().creatures.length > 0) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
      traces.push(recordAiTurn(state, gameStore.getState(), aiTurns))
    }

    const finalState = gameStore.getState()
    const actionTypes = countActionTypes(traces)
    expect(finalState.creatures).toHaveLength(0)
    expect(finalState.players[0].health).toBeGreaterThan(0)
    expect(actionTypes.attack ?? 0).toBeGreaterThan(0)
    expect(finalState.players[0].experience).toBeGreaterThan(0)
  })

  it('入門地圖（1 巢穴、0 初始生物、巢穴不回血、上限 80 round）：單局觀察 AI 成長與 Lv.5 卡點', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260910,
      nestCount: 1,
      creatureCount: 0,
      nestHealthRegenPercent: 0,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('升級測試沒有建立 AI 玩家。')

    gameStore.setStateForTest({
      ...startedState,
      players: [{ ...aiPlayer, level: 1, experience: 0 }],
      activePlayerId: aiPlayer.id,
    })

    const maxRounds = 80
    let aiTurns = 0
    let maxLevel = 1
    const traces: AiTurnTrace[] = []
    while (!gameStore.getState().gameOver && gameStore.getState().round < maxRounds) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
      maxLevel = Math.max(maxLevel, gameStore.getState().players[0].level ?? 1)
      traces.push(recordAiTurn(state, gameStore.getState(), aiTurns))
      if (maxLevel >= 5) break
    }

    const finalState = gameStore.getState()
    writeAiTraceReport('ai-beginner-sandbox-level5-trace-2026-09-02.md', 'AI Beginner Sandbox Level5 Trace', traces, finalState)
    expect(maxLevel).toBeGreaterThanOrEqual(5)
  })

  it('1 級 AI 在相鄰支援據點可使用醫療室並購買回血道具', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260905,
      nestCount: 0,
      creatureCount: 0,
      resourcePointCount: 0,
      itemPointCount: 0,
      ruinCount: 0,
      sectGateCount: 0,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('支援據點測試沒有建立 AI 玩家。')
    const supportBase: BaseState = {
      id: 'ai-support-base',
      name: 'AI 補給據點',
      position: { row: aiPlayer.position.row, column: aiPlayer.position.column + 1 },
      buildings: [
        { id: 'ai-support-infirmary', type: 'infirmary', name: '醫療室', description: '', constructionCost: 50, level: 1 },
        { id: 'ai-support-item-shop', type: 'item-shop', name: '道具商店', description: '', constructionCost: 30, level: 1 },
      ],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
    }
    gameStore.setStateForTest({
      ...startedState,
      players: [{
        ...aiPlayer,
        health: 1,
        inventory: aiPlayer.inventory.filter((entry) => entry.itemId !== 'heal-wound-medicine'),
        money: 200,
      }],
      bases: [supportBase],
      activePlayerId: aiPlayer.id,
    })

    const traces: AiTurnTrace[] = []
    for (let step = 0; step < 8; step++) {
      const before = gameStore.getState()
      const result = gameStore.runFuzzyStep(aiPlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      const after = gameStore.getState()
      const trace = recordAiTurn(before, after, step + 1)
      traces.push(trace)
    }
    const afterHeal = gameStore.getState()
    expect(afterHeal.players[0].health).toBeGreaterThan(1)
    expect(countActionTypes(traces)['use-facility'] ?? 0).toBeGreaterThan(0)

    const playerReadyToShop = afterHeal.players.find((player) => player.id === aiPlayer.id)
    if (!playerReadyToShop) throw new Error('支援據點測試找不到 AI 玩家。')
    gameStore.setStateForTest({
      ...afterHeal,
      players: [{ ...playerReadyToShop, position: aiPlayer.position, turnEnded: false }],
      activePlayerId: aiPlayer.id,
    })
    expect(gameStore.buyItem(aiPlayer.id, 'heal-wound-medicine', 1).ok).toBe(true)
    expect(gameStore.getState().players[0].inventory).toContainEqual({ itemId: 'heal-wound-medicine', quantity: 1 })
  })

  it('AI 缺錢且在相鄰據點有告示牌時：會主動打工存錢，金錢明顯上升', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260911,
      nestCount: 0,
      creatureCount: 0,
      resourcePointCount: 0,
      itemPointCount: 0,
      ruinCount: 0,
      sectGateCount: 0,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('打工測試沒有建立 AI 玩家。')
    // 受控基地：緊鄰玩家，含告示牌(board)可打工；item-shop 供後續買道具。
    const economyBase: BaseState = {
      id: 'ai-economy-base',
      name: 'AI 經濟據點',
      position: { row: aiPlayer.position.row, column: aiPlayer.position.column + 1 },
      buildings: [
        { id: 'ai-economy-board', type: 'board', name: '告示牌', description: '', constructionCost: 30, level: 1 },
        { id: 'ai-economy-item-shop', type: 'item-shop', name: '道具商店', description: '', constructionCost: 30, level: 1 },
      ],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
    }
    gameStore.setStateForTest({
      ...startedState,
      players: [{ ...aiPlayer, money: 0 }],
      bases: [economyBase],
      activePlayerId: aiPlayer.id,
    })

    const traces: AiTurnTrace[] = []
    const maxSteps = 60
    for (let step = 0; step < maxSteps; step++) {
      const before = gameStore.getState()
      const result = gameStore.runFuzzyStep(aiPlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      const after = gameStore.getState()
      traces.push(recordAiTurn(before, after, step + 1))
    }

    const finalState = gameStore.getState()
    const finalPlayer = finalState.players.find((player) => player.id === aiPlayer.id)
    if (!finalPlayer) throw new Error('打工測試找不到玩家。')
    const actionTypes = countActionTypes(traces)
    // 玩家起始 money 0 → 應透過打工賺到錢
    expect(finalPlayer.money).toBeGreaterThan(0)
    // 應至少發生過一次打工（use-facility facilityType=mission）
    expect(actionTypes['use-facility'] ?? 0).toBeGreaterThan(0)
    const missionEvents = traces
      .flatMap((trace) => trace.actions)
      .filter((event) => (event as { action?: { type?: string; facilityType?: string } }).action?.type === 'use-facility')
    expect(missionEvents.some((event) => (event as { action?: { facilityType?: string } }).action?.facilityType === 'mission')).toBe(true)

    //「生存優先」：存到錢後應先去道具商店補齊「回血/回內力/回體力」生存道具，
    // 確保身上三類各至少 1 個（續航力是生存率的根本）。
    const boughtItem = traces
      .flatMap((trace) => trace.actions)
      .some((event) => (event as { action?: { type?: string } }).action?.type === 'buy-item')
    expect(boughtItem).toBe(true)
    const inventoryByEffect = new Map<string, number>()
    for (const entry of finalPlayer.inventory ?? []) {
      const def = itemCatalog.find((i) => i.id === entry.itemId)
      if (def?.effect && entry.quantity > 0) {
        inventoryByEffect.set(def.effect, (inventoryByEffect.get(def.effect) ?? 0) + entry.quantity)
      }
    }
    // 至少補齊回血道具（生存最關鍵）
    expect((inventoryByEffect.get('health') ?? 0)).toBeGreaterThan(0)

    writeAiTraceReport('ai-economy-mission-trace-2026-09-02.md', 'AI Economy Mission Trace', traces, finalState)
  })
})