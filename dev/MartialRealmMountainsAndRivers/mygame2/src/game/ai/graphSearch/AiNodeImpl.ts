import type { GameState } from '../../types'
import type { AiNode, AiEdge } from './types'
import { getAdjacentNodes } from './actionGenerators'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'
import type { AiAction } from '../aiAction'

export class AiNodeImpl implements AiNode {
  public state: GameState
  public action: AiAction | null
  public parent: AiNode | null
  public cost: number
  public depth: number
  public remainingStamina: number
  public cumulativeCost: number

  constructor(
    state: GameState,
    action: AiAction | null,
    parent: AiNode | null,
    cost: number,
    depth: number,
    remainingStamina: number,
  ) {
    this.state = state
    this.action = action
    this.parent = parent
    this.cost = cost
    this.depth = depth
    this.remainingStamina = remainingStamina
    this.cumulativeCost = parent ? parent.cumulativeCost + cost : 0
  }

  getEdges(dependencies: ExecuteAiActionDependencies): AiEdge[] {
    return getAdjacentNodes({ ...this, state: this.state }, dependencies)
  }
}

export function extractPath(leaf: AiNode): AiAction[] {
  const actions: AiAction[] = []
  let current: AiNode | null = leaf
  while (current !== null) {
    if (current.action !== null) {
      actions.push(current.action)
    }
    current = current.parent
  }
  actions.reverse()
  return actions
}

export function makeRoot(state: GameState, playerId: string): AiNodeImpl {
  const player = state.players.find((p) => p.id === playerId)!
  return new AiNodeImpl(state, null, null, 0, 0, player.stamina)
}
