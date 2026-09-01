// @ts-expect-error Test runtime provides Node's file system module; app tsconfig omits Node typings.
import { mkdirSync, writeFileSync } from 'node:fs'
// @ts-expect-error Test runtime provides Node's path module; app tsconfig omits Node typings.
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { BUILTIN_TEMPLATES } from './mapTemplates'
import { gameStore } from './gameStore'
import type { GameState } from './types'
import { getInnerSkill, getSkillDamage, getSkillProgression } from './rules/skillRules'
import { getEffectiveAttributesForPlayer } from './rules/playerDerivedRules'

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
  const startNestHealth = traces
    .reduce<Record<string, number>>((map, trace) => {
      for (const nest of trace.nests) if (!(nest.id in map)) map[nest.id] = nest.health
      return map
    }, {})
  const endNestHealth = traceNestHealth(traces)

  const lines = [
    `# ${title}`,
    '',
    `- AI turns: ${traces.length}`,
    `- Final round: ${finalState.round}`,
    `- Game won: ${finalState.gameWon === true}`,
    `- Game over: ${finalState.gameOver === true}`,
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

  it('簡單難度：沒有初始生物時應能摧毀唯一妖物巢穴', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260903,
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
    gameStore.setStateForTest({
      ...startedState,
      players: [{ ...aiPlayer, money: 200 }],
      activePlayerId: aiPlayer.id,
      sectGates: startedState.sectGates?.map((gate) => ({
        ...gate,
        position: { row: aiPlayer.position.row, column: aiPlayer.position.column - 1 },
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
})