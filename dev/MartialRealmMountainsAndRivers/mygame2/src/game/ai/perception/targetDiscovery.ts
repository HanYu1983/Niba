import type { CreatureNestState, CreatureState, GameState, Position } from '../../types'

/** 威脅來源快照：存活中的生物或巢穴（玩家陣營視角的敵對目標）。 */
export type HostileActor =
  | { sourceType: 'creature'; creature: CreatureState }
  | { sourceType: 'nest'; nest: CreatureNestState }

/** 列出所有存活的生物與巢穴；AI 威脅評估的共同枚舉來源。 */
export function listHostileActors(state: GameState): HostileActor[] {
  return [
    ...state.creatures
      .filter((creature) => creature.health > 0)
      .map((creature) => ({ sourceType: 'creature' as const, creature })),
    ...state.creatureNests
      .filter((nest) => nest.health > 0)
      .map((nest) => ({ sourceType: 'nest' as const, nest })),
  ]
}

export function getHostileActorId(actor: HostileActor): string {
  return actor.sourceType === 'creature' ? actor.creature.id : actor.nest.id
}

export function getHostileActorPosition(actor: HostileActor): Position {
  return actor.sourceType === 'creature' ? actor.creature.position : actor.nest.position
}

/** 目標是否仍然有效（存在且存活）；執行前 stale check 的最小共用版本。 */
export function isHostileActorStillValid(state: GameState, targetType: 'creature' | 'nest', targetId: string): boolean {
  if (targetType === 'creature') {
    const creature = state.creatures.find((candidate) => candidate.id === targetId)
    return Boolean(creature && creature.health > 0)
  }
  const nest = state.creatureNests.find((candidate) => candidate.id === targetId)
  return Boolean(nest && nest.health > 0)
}
