import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import type { AiNodeImpl } from './AiNodeImpl'

export interface AiNode {
  state: GameState
  action: AiAction | null
  parent: AiNode | null
  cumulativeCost: number
  depth: number
  remainingStamina: number
}

export interface AiEdge {
  node: AiNodeImpl
  action: AiAction
  score: number
  cost: number
}

export interface SearchStrategy {
  search(root: AiNode, maxDepth: number): AiNode | null
}
