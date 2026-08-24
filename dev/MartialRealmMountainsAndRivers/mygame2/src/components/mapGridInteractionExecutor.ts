import type { Position } from '../game/types'
import type { MapCellInteractionAction } from '../game/rules/mapCellStateRules'

export type MapInteractionHandlers = {
  move: (playerId: string, position: Position) => void
  playerMoved: () => void
  targetCreature: (creatureId: string, markerRect: DOMRect) => void
  inspectCreature: (creatureId: string, markerRect: DOMRect) => void
  targetNest: (nestId: string) => void
  inspectNest: (nestId: string) => void
  buildDefense: (position: Position) => void
  inspectBase: (baseId: string) => void
  inspectDefense: (structureId: string) => void
  inspectEvent: (eventId: string) => void
  inspectRuin: (ruinId: string) => void
  inspectResource: (resourcePointId: string) => void
  inspectItem: (itemPointId: string) => void
  inspectSectGate: (sectGateId: string) => void
}

export function executeMapCellAction(
  action: MapCellInteractionAction,
  handlers: MapInteractionHandlers,
  markerRect = new DOMRect(),
): void {
  switch (action.type) {
    case 'move':
      handlers.move(action.playerId, action.position)
      handlers.playerMoved()
      break
    case 'target-creature':
      handlers.targetCreature(action.creatureId, markerRect)
      break
    case 'inspect-creature':
      handlers.inspectCreature(action.creatureId, markerRect)
      break
    case 'target-nest':
      handlers.targetNest(action.nestId)
      break
    case 'inspect-nest':
      handlers.inspectNest(action.nestId)
      break
    case 'build-defense':
      handlers.buildDefense(action.position)
      break
    case 'inspect-base':
      handlers.inspectBase(action.baseId)
      break
    case 'inspect-defense':
      handlers.inspectDefense(action.structureId)
      break
    case 'inspect-event':
      handlers.inspectEvent(action.eventId)
      break
    case 'inspect-ruin':
      handlers.inspectRuin(action.ruinId)
      break
    case 'inspect-resource':
      handlers.inspectResource(action.resourcePointId)
      break
    case 'inspect-item':
      handlers.inspectItem(action.itemPointId)
      break
    case 'inspect-sect-gate':
      handlers.inspectSectGate(action.sectGateId)
      break
    case 'none':
      break
  }
}
