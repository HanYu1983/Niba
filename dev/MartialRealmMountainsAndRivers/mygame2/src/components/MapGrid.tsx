import { Card } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getReachableCellIds } from '../game/rules/movementRules'
import Player from './Player'
import { type MapCell, type BaseState, type CreatureNestState, type ResourcePointState, type DefenseStructureState, type ItemPointState, type ExplorationEventState, type PlayerState, type CreatureState, type Position, type GameState, type RuinState, type TrapState, type SectGateState, getAdjacentPositions } from '../game/types'
import { getCellVisibility } from '../game/rules/visibilityRules'
import { getCreatureIcon } from '../game/rules/creatureBehaviorRules'
import { getActiveBuffsForPlayer } from '../game/rules/playerDerivedRules'
import { getMapCellRangeState, resolveMapCellAction } from '../game/rules/mapCellStateRules'
import { executeMapCellAction as executeInteractionAction, type MapInteractionHandlers } from './mapGridInteractionExecutor'

type MapGridProps = {
  map: {
    rows: number
    columns: number
    cells: MapCell[]
  }
  bases?: BaseState[]
  creatureNests?: CreatureNestState[]
  resourcePoints?: ResourcePointState[]
  defenseStructures?: DefenseStructureState[]
  itemPoints?: ItemPointState[]
  explorationEvents?: ExplorationEventState[]
  ruins?: RuinState[]
  traps?: TrapState[]
  sectGates?: SectGateState[]
  selectedBaseId?: string | null
  onClearSelectedBase?: () => void
  onBaseSelect?: (baseId: string) => void
  onBaseDetails?: (baseId: string) => void
  onCreatureNestSelect?: (nestId: string) => void
  onCreatureNestDetails?: (nestId: string) => void
  onResourcePointDetails?: (resourcePointId: string) => void
  onItemPointDetails?: (itemPointId: string) => void
  onDefenseStructureDetails?: (structureId: string) => void
  onRuinDetails?: (ruinId: string) => void
  players?: PlayerState[]
  creatures?: CreatureState[]
  activePlayerId?: string
  movementEnabled?: boolean
  creatureTurnInProgress?: boolean
  gameOver?: boolean
  blockingModal?: boolean
  activeCreatureId?: string | null
  onPlayerMoved?: () => void
  onMovePlayerTo?: (playerId: string, row: number, column: number) => void
  onCreatureSelect?: (creatureId: string, markerRect: DOMRect) => void
  onExplorationEventDetails?: (eventId: string) => void
  onSectGateDetails?: (sectGateId: string) => void
  defenseBuildMode?: { basePosition: Position; structureType: string; selectedPosition: Position | null }
  onDefensePositionSelect?: (position: Position) => void
  externalSkillTargeting?: boolean
  attackTargeting?: boolean
  itemTargeting?: boolean
  visibility?: GameState['visibility']
  visibilityPlayerId?: string
  revealedCreatureCellIds?: string[]
  revealedCreatureUntilRound?: number
}

import { TERRAIN_STYLES } from '../editor/terrainStyles'

function hasValidPosition(value: { position?: Position } | null | undefined): value is { position: Position } {
  const position = value?.position
  return Boolean(position && Number.isFinite(position.row) && Number.isFinite(position.column))
}

function MapGrid({ map, bases = [], creatureNests = [], resourcePoints = [], defenseStructures = [], itemPoints = [], explorationEvents = [], ruins = [], traps = [], sectGates = [], selectedBaseId = null, onClearSelectedBase, players = [], creatures = [], activePlayerId, movementEnabled = false, creatureTurnInProgress = false, gameOver = false, blockingModal = false, activeCreatureId = null, onPlayerMoved, onMovePlayerTo, onBaseSelect, onBaseDetails, onCreatureNestSelect, onCreatureNestDetails, onResourcePointDetails, onItemPointDetails, onDefenseStructureDetails, onRuinDetails, onCreatureSelect, externalSkillTargeting = false, attackTargeting = false, itemTargeting = false, defenseBuildMode, onDefensePositionSelect, onExplorationEventDetails, onSectGateDetails, visibility, visibilityPlayerId, revealedCreatureCellIds, revealedCreatureUntilRound }: MapGridProps) {
  const [isDraggingMap, setIsDraggingMap] = useState(false)
  const mapScrollRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({ active: false, dragged: false, pointerId: -1, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 })
  const suppressClickRef = useRef(false)
  const { rows, columns, cells } = map
  const activePlayer = players.find((player) => player.id === activePlayerId)
  const selectedBase = bases.find((base) => base.id === selectedBaseId)
  const blockedPositions = useMemo(() => activePlayer
    ? [
      ...players
        .filter((player) => player.id !== activePlayer.id)
        .map((player) => player.position),
      ...creatures.map((creature) => creature.position),
      ...bases.map((base) => base.position),
      ...creatureNests.map((nest) => nest.position),
      ...defenseStructures.map((structure) => structure.position),
      ...ruins.filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position),
      ...sectGates.map((gate) => gate.position),
    ].filter((position): position is Position => Boolean(
      position && Number.isFinite(position.row) && Number.isFinite(position.column),
    ))
    : [], [activePlayer, players, creatures, bases, creatureNests, defenseStructures, ruins, sectGates])
  const reachableCellIds = useMemo(() =>
    activePlayer && movementEnabled && activePlayer.stamina > 0 && !activePlayer.turnEnded
      ? getReachableCellIds(map, activePlayer, blockedPositions)
      : new Set<string>(), [activePlayer, movementEnabled, map, blockedPositions])
  const attackableTargetCellIds = useMemo(() => activePlayer
    ? new Set(
      [
        ...creatures
          .filter((creature) => creature.health > 0)
          .map((creature) => creature.position),
        ...creatureNests
          .filter((nest) => nest.health > 0)
          .map((nest) => nest.position),
      ]
        .filter((position): position is Position => Boolean(
          position && Number.isFinite(position.row) && Number.isFinite(position.column),
        ))
        .filter((position) => getAdjacentPositions(activePlayer.position).some(
          (adjacentPosition) => adjacentPosition.row === position.row && adjacentPosition.column === position.column,
        ))
        .map((position) => `${position.row}-${position.column}`),
    )
    : new Set<string>(), [activePlayer, creatures, creatureNests])
  const skillTargetCellIds = externalSkillTargeting ? attackableTargetCellIds : new Set<string>()
  const attackTargetCellIds = attackTargeting ? attackableTargetCellIds : new Set<string>()
  const itemTargetCellIds = itemTargeting ? attackableTargetCellIds : new Set<string>()
  const interactionHandlers: MapInteractionHandlers = {
    move: (playerId, position) => onMovePlayerTo?.(playerId, position.row, position.column),
    playerMoved: () => onPlayerMoved?.(),
    targetCreature: (creatureId, markerRect) => onCreatureSelect?.(creatureId, markerRect),
    inspectCreature: (creatureId, markerRect) => onCreatureSelect?.(creatureId, markerRect),
    targetNest: (nestId) => onCreatureNestSelect?.(nestId),
    inspectNest: (nestId) => onCreatureNestDetails?.(nestId),
    buildDefense: (position) => onDefensePositionSelect?.(position),
    inspectBase: (baseId) => { onBaseSelect?.(baseId); onBaseDetails?.(baseId) },
    inspectDefense: (structureId) => onDefenseStructureDetails?.(structureId),
    inspectEvent: (eventId) => onExplorationEventDetails?.(eventId),
    inspectRuin: (ruinId) => onRuinDetails?.(ruinId),
    inspectResource: (resourcePointId) => onResourcePointDetails?.(resourcePointId),
    inspectItem: (itemPointId) => onItemPointDetails?.(itemPointId),
    inspectSectGate: (sectGateId) => onSectGateDetails?.(sectGateId),
  }
  const executeMapCellAction = (action: Parameters<typeof executeInteractionAction>[0], markerRect: DOMRect) => {
    executeInteractionAction(action, interactionHandlers, markerRect)
  }

  useEffect(() => {
    if (!activePlayer || !mapScrollRef.current) {
      return
    }
    const playerCell = mapScrollRef.current.querySelector<HTMLElement>(
      `[data-cell-id="${activePlayer.position.row}-${activePlayer.position.column}"]`,
    )
    if (!playerCell) {
      return
    }
    const container = mapScrollRef.current
    const containerRect = container.getBoundingClientRect()
    const playerCellRect = playerCell.getBoundingClientRect()
    const targetLeft = container.scrollLeft + playerCellRect.left - containerRect.left + playerCellRect.width / 2 - container.clientWidth / 2
    const targetTop = container.scrollTop + playerCellRect.top - containerRect.top + playerCellRect.height / 2 - container.clientHeight / 2
    container.scrollTo({
      left: Math.max(0, targetLeft),
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 刻意只依賴 id 與座標，而非整個 activePlayer 物件，避免屬性無關變動觸發重滾。
  }, [activePlayer?.id, activePlayer?.position.row, activePlayer?.position.column])

  const handleMapPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    const container = event.currentTarget
    dragStateRef.current = {
      active: true,
      dragged: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    }
  }

  const handleMapPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState.active) {
      return
    }
    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    if (!dragState.dragged && Math.hypot(deltaX, deltaY) < 4) {
      return
    }
    dragState.dragged = true
    suppressClickRef.current = true
    setIsDraggingMap(true)
    if (!event.currentTarget.hasPointerCapture(dragState.pointerId)) {
      event.currentTarget.setPointerCapture(dragState.pointerId)
    }
    event.currentTarget.scrollLeft = dragState.scrollLeft - deltaX
    event.currentTarget.scrollTop = dragState.scrollTop - deltaY
    event.preventDefault()
  }

  const handleMapPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.active = false
    setIsDraggingMap(false)
    if (event.currentTarget.hasPointerCapture(dragStateRef.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragStateRef.current.pointerId)
    }
  }

  const handleMapClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressClickRef.current = false
    }
  }

  return (
    <Card className="map-card" variant="borderless">
      {(externalSkillTargeting || attackTargeting || itemTargeting || defenseBuildMode) && (
        <div className="map-card__target-hint" role="status" aria-live="polite">
          {defenseBuildMode
            ? '🛡️ 請點選黃色高亮的空格建造防禦設施'
            : itemTargeting
              ? '💥 請點選相鄰的生物或巢穴作為道具目標'
              : externalSkillTargeting
                ? '⚡ 請點選相鄰的生物或巢穴作為外功目標'
                : '⚔️ 請點選相鄰的生物或巢穴作為攻擊目標'}
        </div>
      )}

      <div
        ref={mapScrollRef}
        className={`map-scroll${isDraggingMap ? ' map-scroll--dragging' : ''}`}
        onPointerDown={handleMapPointerDown}
        onPointerMove={handleMapPointerMove}
        onPointerUp={handleMapPointerUp}
        onPointerCancel={handleMapPointerUp}
        onClickCapture={handleMapClickCapture}
      >
        <div className="map-frame">
          <div
            className="map-grid"
            style={{ gridTemplateColumns: `repeat(${columns}, 32px)` }}
            role="grid"
            aria-label={`${rows} x ${columns} map grid`}
          >
            {cells.map((cell) => {
              const terrain = TERRAIN_STYLES[cell.terrain]
              const cellVisibility = visibility && visibilityPlayerId
                ? getCellVisibility({ map, visibility, bases, defenseStructures, players, creatures, creatureNests, resourcePoints, itemPoints, explorationEvents, revealedCreatureCellIds, revealedCreatureUntilRound, activePlayerId: activePlayerId ?? '', round: 0, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null }, visibilityPlayerId, cell)
                : 'visible'
              const isUnexplored = cellVisibility === 'unexplored'
              const isVisible = cellVisibility === 'visible'
              const isExplored = cellVisibility === 'explored'
              const isKnownLocation = isVisible || isExplored
              const isReachable = reachableCellIds.has(cell.id)
              const isSkillTarget = skillTargetCellIds.has(cell.id)
              const isAttackTarget = attackTargetCellIds.has(cell.id)
              const isItemTarget = itemTargetCellIds.has(cell.id)
              const playersHere = isVisible ? players.filter(
                (player) => hasValidPosition(player) && player.position.row === cell.row && player.position.column === cell.column,
              ) : []
              const creaturesHere = isVisible ? creatures.filter(
                (creature) => hasValidPosition(creature) && creature.position.row === cell.row && creature.position.column === cell.column,
              ) : []
              const basesHere = isVisible ? bases.filter(
                (base) => hasValidPosition(base) && base.position.row === cell.row && base.position.column === cell.column,
              ) : []
              const nestsHere = isKnownLocation ? creatureNests.filter(
                (nest) => hasValidPosition(nest) && nest.position.row === cell.row && nest.position.column === cell.column,
              ) : []
              const resourcePointsHere = isKnownLocation ? resourcePoints.filter(
                (resourcePoint) =>
                  hasValidPosition(resourcePoint) && resourcePoint.position.row === cell.row &&
                  resourcePoint.position.column === cell.column,
              ) : []
              const itemPointsHere = isVisible ? itemPoints.filter(
                (itemPoint) =>
                  hasValidPosition(itemPoint) && itemPoint.position.row === cell.row &&
                  itemPoint.position.column === cell.column,
              ) : []
              const defenseStructuresHere = isKnownLocation ? defenseStructures.filter((structure) =>
                hasValidPosition(structure) && structure.position.row === cell.row && structure.position.column === cell.column,
              ) : []
              const explorationEventsHere = isVisible ? explorationEvents.filter((event) =>
                event.status === 'available' && hasValidPosition(event) && event.position.row === cell.row && event.position.column === cell.column,
              ) : []
              const sectGatesHere = isKnownLocation ? sectGates.filter((gate) =>
                hasValidPosition(gate) && gate.position.row === cell.row && gate.position.column === cell.column,
              ) : []
              const ruinsHere = isVisible ? ruins.filter((ruin) =>
                ruin.status === 'intact' && hasValidPosition(ruin) && ruin.position.row === cell.row && ruin.position.column === cell.column,
              ) : []
              const trapsHere = isVisible ? traps.filter((trap) =>
                hasValidPosition(trap) && trap.position.row === cell.row && trap.position.column === cell.column,
              ) : []
              const defenseDistance = defenseBuildMode
                ? Math.abs(defenseBuildMode.basePosition.row - cell.row) + Math.abs(defenseBuildMode.basePosition.column - cell.column)
                : Infinity
              const canSelectDefensePosition = Boolean(
                defenseBuildMode && defenseDistance <= 5 && cell.terrain !== 'wall' &&
                !blockedPositions.some((position) => position.row === cell.row && position.column === cell.column),
              )
              const isDefenseBuildRange = Boolean(
                defenseBuildMode && defenseDistance <= 5 && cell.terrain !== 'wall',
              )
              const { isBaseInfluence: isSelectedBaseRange } = getMapCellRangeState(
                cell,
                selectedBase?.position ?? null,
                selectedBase?.active !== false,
                isKnownLocation,
              )
              const creatureTarget = creaturesHere.find((creature) => creature.health > 0)
              const nestTarget = nestsHere.find((nest) => nest.health > 0)
              const cellAction = resolveMapCellAction({
                position: { row: cell.row, column: cell.column },
                visibility: cellVisibility,
                movementEnabled,
                attackTargeting,
                externalSkillTargeting,
                itemTargeting,
                defenseBuildMode: Boolean(defenseBuildMode),
                activePlayerId: activePlayer?.id ?? null,
                isReachable,
                canSelectDefensePosition,
                creatureTargetId: creatureTarget?.id,
                nestTargetId: nestTarget?.id,
                gameOver,
                blockingModal,
                creatureTurnInProgress,
              })
              const resolveMarkerAction = (type: 'creature' | 'nest' | 'base' | 'defense' | 'event' | 'ruin' | 'resource' | 'item' | 'sect-gate', id: string) => resolveMapCellAction({
                position: { row: cell.row, column: cell.column },
                visibility: cellVisibility,
                movementEnabled,
                attackTargeting,
                externalSkillTargeting,
                itemTargeting,
                defenseBuildMode: Boolean(defenseBuildMode),
                activePlayerId: activePlayer?.id ?? null,
                isReachable,
                canSelectDefensePosition,
                creatureTargetId: creatureTarget?.id,
                nestTargetId: nestTarget?.id,
                marker: { type, id },
                gameOver,
                blockingModal,
                creatureTurnInProgress,
              })

              return (
                <div
                  key={cell.id}
                  data-cell-id={cell.id}
                  className={`map-grid__cell map-grid__cell--${cell.terrain}${isUnexplored ? ' map-grid__cell--unexplored' : cellVisibility === 'explored' ? ' map-grid__cell--explored' : ''}${cellAction.type === 'move' ? ' map-grid__cell--move-interactive' : ''}${cellAction.type === 'target-creature' || cellAction.type === 'target-nest' ? ' map-grid__cell--target-interactive' : ''}${cellAction.type === 'build-defense' ? ' map-grid__cell--defense-interactive' : ''}`}
                  role="gridcell"
                  title={`${terrain.label} (${cell.row + 1}, ${cell.column + 1})`}
                  style={{ backgroundColor: terrain.color }}
                  onClick={(event) => {
                    onClearSelectedBase?.()
                    executeMapCellAction(cellAction, event.currentTarget.getBoundingClientRect())
                  }}
                >
                  <span className="map-grid__overlay-layer" aria-hidden="true">
                    {isSelectedBaseRange && <span className="map-grid__overlay map-grid__overlay--base-influence" />}
                    {isReachable && <span className="map-grid__overlay map-grid__overlay--movement" />}
                    {isSkillTarget && <span className="map-grid__overlay map-grid__overlay--skill-target" />}
                    {isAttackTarget && <span className="map-grid__overlay map-grid__overlay--attack-target" />}
                    {isItemTarget && <span className="map-grid__overlay map-grid__overlay--item-target" />}
                    {isDefenseBuildRange && <span className="map-grid__overlay map-grid__overlay--defense-range" />}
                    {canSelectDefensePosition && <span className="map-grid__overlay map-grid__overlay--defense-buildable" />}
                  </span>
                  {defenseStructuresHere.map((structure) => (
                    <div
                      key={structure.id}
                      className="defense-structure-marker"
                      title={`${structure.name}${structure.originName ? `（源自 ${structure.originName}）` : ''} · ${structure.health}/${structure.maxHealth}`}
                      aria-label={structure.name}
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('defense', structure.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          event.stopPropagation()
                          executeMapCellAction(resolveMarkerAction('defense', structure.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      {structure.icon}
                    </div>
                  ))}
                  {explorationEventsHere.map((event) => (
                    <div
                      key={event.id}
                      className={`event-point-marker${event.status === 'resolved' ? ' event-point-marker--resolved' : ''}`}
                      title={`${event.name} · ${event.status === 'resolved' ? '已完成' : '可互動'}`}
                      aria-label={event.name}
                      role="button"
                      tabIndex={0}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('event', event.id), clickEvent.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                          keyEvent.preventDefault()
                          keyEvent.stopPropagation()
                          executeMapCellAction(resolveMarkerAction('event', event.id), keyEvent.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🧭
                    </div>
                  ))}
                  {ruinsHere.map((ruin) => (
                    <div
                      key={ruin.id}
                      className="ruin-marker"
                      title={`${ruin.name ?? '廢墟'} · 可修復`}
                      aria-label={ruin.name ?? '廢墟'}
                      role="button"
                      tabIndex={0}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('ruin', ruin.id), clickEvent.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                          keyEvent.preventDefault()
                          keyEvent.stopPropagation()
                          executeMapCellAction(resolveMarkerAction('ruin', ruin.id), keyEvent.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🏚️
                    </div>
                  ))}
                  {playersHere.map((player) => (
                    <Player
                      key={player.id}
                      id={player.id}
                      name={player.name}
                      stamina={player.stamina}
                      maxStamina={player.maxStamina}
                      className={player.id === activePlayerId && !creatureTurnInProgress ? 'player--current' : undefined}
                    />
                  ))}
                  {creaturesHere.map((creature) => (
                    (() => {
                      const buffClassNames = getActiveBuffsForPlayer(creature)
                        .map((buff) => buff.definitionId)
                        .filter((definitionId) => definitionId === 'scarlet-flame-burning' || definitionId === 'frost-water-cold-poison' || definitionId === 'earth-mountain-reflection' || definitionId === 'golden-body-critical-boost' || definitionId === 'swift-wind-movement' || definitionId === 'hundred-poison-rot')
                        .map((definitionId) => `creature--buff-${definitionId.replace(/-movement|-burning|-poison|-reflection|-boost/g, '')}`)
                        .join(' ')
                      return (
                        <Player
                          key={creature.id}
                          id={creature.id}
                          name={creature.name}
                          controllable={false}
                          appearance="creature"
                          icon={getCreatureIcon(creature)}
                          health={creature.health}
                          maxHealth={creature.maxHealth}
                          className={[creature.id === activeCreatureId ? 'player--current-creature' : '', buffClassNames].filter(Boolean).join(' ') || undefined}
                          onClick={(event) => {
                            event.stopPropagation()
                            executeMapCellAction(resolveMarkerAction('creature', creature.id), event.currentTarget.getBoundingClientRect())
                          }}
                        />
                      )
                    })()
                  ))}
                  {basesHere.map((base) => (
                    <div
                      key={base.id}
                      className={`base-marker${base.active === false ? ' base-marker--inactive' : ''}`}
                      title={`${base.name} · ${base.active === false ? '未啟用' : '運作中'} (${cell.row + 1}, ${cell.column + 1})`}
                      aria-label={`${base.name}${base.active === false ? '（未啟用）' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('base', base.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          executeMapCellAction(resolveMarkerAction('base', base.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🏯
                      {base.active === false && <span className="base-marker__warning" aria-hidden="true">!</span>}
                    </div>
                  ))}
                  {nestsHere.map((nest) => (
                    <div
                      key={nest.id}
                      className={`creature-nest-marker${isExplored ? ' creature-nest-marker--explored' : ''}`}
                      title={`${nest.name} · Lv.${nest.spawnLevel}${isExplored ? ' · 已探索位置' : ''}`}
                      aria-label={nest.name}
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('nest', nest.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          executeMapCellAction(resolveMarkerAction('nest', nest.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🕳️
                    </div>
                  ))}
                  {resourcePointsHere.map((resourcePoint) => (
                    <div
                      key={resourcePoint.id}
                      className={`resource-point-marker${isExplored ? ' resource-point-marker--explored' : ''}`}
                      title={`${resourcePoint.name} · ${resourcePoint.active === false ? '已失活，請修復' : '可採集'} · 所屬：${bases.find((base) => base.id === resourcePoint.ownerBaseId)?.name ?? '未分配'}${isExplored ? ' · 已探索位置' : ''}`}
                      aria-label={`${resourcePoint.name}${resourcePoint.active === false ? '（已失活）' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('resource', resourcePoint.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          executeMapCellAction(resolveMarkerAction('resource', resourcePoint.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      {resourcePoint.active === false ? '❗' : '💎'}
                    </div>
                  ))}
                  {itemPointsHere.map((itemPoint) => (
                    <div
                      key={itemPoint.id}
                      className="item-point-marker"
                      title="道具點"
                      aria-label="道具點"
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('item', itemPoint.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          executeMapCellAction(resolveMarkerAction('item', itemPoint.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🎁
                    </div>
                  ))}
                  {sectGatesHere.map((gate) => (
                    <div
                      key={gate.id}
                      className="sect-gate-marker"
                      title="門派據點"
                      aria-label="門派據點"
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        executeMapCellAction(resolveMarkerAction('sect-gate', gate.id), event.currentTarget.getBoundingClientRect())
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          executeMapCellAction(resolveMarkerAction('sect-gate', gate.id), event.currentTarget.getBoundingClientRect())
                        }
                      }}
                    >
                      🏯
                    </div>
                  ))}
                  {trapsHere.map((trap) => (
                    <div
                      key={trap.id}
                      className={`trap-marker trap-marker--${trap.type}`}
                      title={trap.type === 'snare' ? '絆馬索' : '定身索'}
                      aria-label={trap.type === 'snare' ? '絆馬索' : '定身索'}
                    >
                      {trap.type === 'snare' ? '🪢' : '⛓️'}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MapGrid