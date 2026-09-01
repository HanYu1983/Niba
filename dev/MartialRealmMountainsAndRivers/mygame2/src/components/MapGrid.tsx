import { Card } from 'antd'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { getReachableCellIds } from '../game/rules/movementRules'
import Player from './Player'
import { type MapCell, type BaseState, type CreatureNestState, type ResourcePointState, type DefenseStructureState, type ItemPointState, type ExplorationEventState, type PlayerState, type CreatureState, type Position, type GameState, type RuinState, type TrapState, type SectGateState, getAdjacentPositions } from '../game/types'
import { getPlayerVisibleCellIds } from '../game/rules/visibilityRules'
import { getOccupiedPositions, MOVEMENT_LAYERS } from '../game/rules/occupancyRules'
import { getCreatureIcon } from '../game/rules/creatureBehaviorRules'
import { getActiveBuffsForPlayer, getBuff } from '../game/rules/playerDerivedRules'
import { getBastionMultipliers } from '../game/rules/defenseBastionRules'
import { getDefenseBuildRange } from '../game/rules/defenseRules'
import { getGovernanceRank } from '../game/rules/governanceRules'
import { getMapCellRangeState, resolveMapCellAction } from '../game/rules/mapCellStateRules'
import { resolveTargetShapeCells } from '../game/rules/targetingRules'
import { executeMapCellAction as executeInteractionAction, type MapInteractionHandlers } from './mapGridInteractionExecutor'
import type { TargetingSpec } from '../game/types'

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
  onPlayerTarget?: (playerId: string) => void
  onExplorationEventDetails?: (eventId: string) => void
  onSectGateDetails?: (sectGateId: string) => void
  defenseBuildMode?: { basePosition: Position; structureType: string; selectedPosition: Position | null }
  onDefensePositionSelect?: (position: Position) => void
  externalSkillTargeting?: boolean
  attackTargeting?: boolean
  firstAidTargeting?: boolean
  itemTargeting?: boolean
  /** 目標選取規格（新框架）；提供時由 spec 決定高亮範圍，取代外部透傳的 targeting 旗標。 */
  targetingSpec?: TargetingSpec | null
  visibility?: GameState['visibility']
  visibilityPlayerId?: string
  revealedCreatureCellIds?: string[]
  revealedCreatureUntilRound?: number
  /** 三重共振：被命中的生物位置與 icon（即使生物已從 state 移除仍顯示 shake 動畫）。 */
  creatureShake?: { signal: number; targetId: string; position: Position; icon: string } | null
}

import { TERRAIN_STYLES } from '../editor/terrainStyles'
import { getResourcePointIcon } from '../game/catalogs/placeNameCatalog'

function MapGrid({ map, bases = [], creatureNests = [], resourcePoints = [], defenseStructures = [], itemPoints = [], explorationEvents = [], ruins = [], traps = [], sectGates = [], selectedBaseId = null, onClearSelectedBase, players = [], creatures = [], activePlayerId, movementEnabled = false, creatureTurnInProgress = false, gameOver = false, blockingModal = false, activeCreatureId = null, onPlayerMoved, onMovePlayerTo, onBaseSelect, onBaseDetails, onCreatureNestSelect, onCreatureNestDetails, onResourcePointDetails, onItemPointDetails, onDefenseStructureDetails, onRuinDetails, onCreatureSelect, onPlayerTarget, externalSkillTargeting = false, attackTargeting = false, firstAidTargeting = false, itemTargeting = false, targetingSpec = null, defenseBuildMode, onDefensePositionSelect, onExplorationEventDetails, onSectGateDetails, visibility, visibilityPlayerId, revealedCreatureCellIds, revealedCreatureUntilRound, creatureShake }: MapGridProps) {
  const [isDraggingMap, setIsDraggingMap] = useState(false)
  const mapScrollRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({ active: false, dragged: false, pointerId: -1, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 })
  const suppressClickRef = useRef(false)
  const { rows, columns, cells } = map
  const activePlayer = players.find((player) => player.id === activePlayerId)
  const selectedBase = bases.find((base) => base.id === selectedBaseId)
  // 建造範圍隨官階增長：基礎 5 +（官階 - 1），官階 6 達最大 10 格。
  const defenseBuildRange = activePlayer
    ? getDefenseBuildRange(getGovernanceRank(activePlayer.prestige).rank)
    : 0
  const blockedPositions = useMemo(() => activePlayer
    ? getOccupiedPositions({
      players,
      creatures,
      bases,
      creatureNests,
      defenseStructures,
      ruins,
      sectGates,
    }, { excludePlayerId: activePlayer.id, layers: MOVEMENT_LAYERS })
    : [], [activePlayer, players, creatures, bases, creatureNests, defenseStructures, ruins, sectGates])
  const reachableCellIds = useMemo(() =>
    activePlayer && (movementEnabled || (activePlayer.id === activePlayerId && !activePlayer.turnEnded)) && activePlayer.stamina > 0 && !activePlayer.turnEnded
      ? getReachableCellIds(map, activePlayer, blockedPositions)
      : new Set<string>(), [activePlayer, activePlayerId, movementEnabled, map, blockedPositions])
  // 視野計算：一次算出所有存活玩家共享的可見格 Set，per-cell 只做 Set.has，
  // 取代原先每格呼叫 getCellVisibility（內部會重跑全圖視野計算，O(cells²)）。
  const visibilityState = useMemo(() => {
    if (!visibility || !visibilityPlayerId) return null
    const visibleCellIds = getPlayerVisibleCellIds({
      map, visibility, bases, defenseStructures, players, creatures, creatureNests,
      resourcePoints, itemPoints, explorationEvents, revealedCreatureCellIds,
      revealedCreatureUntilRound, activePlayerId: activePlayerId ?? '', round: 0,
      creatureActionLogs: [], attackPreview: null, externalSkillPreview: null,
      creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null,
    }, visibilityPlayerId)
    return {
      visibleCellIds,
      exploredSet: new Set(visibility.exploredCellIds),
      revealedSet: new Set(revealedCreatureCellIds ?? []),
      revealed: visibility.mode === 'revealed',
    }
  }, [visibility, visibilityPlayerId, map, bases, defenseStructures, players, creatures, creatureNests, resourcePoints, itemPoints, explorationEvents, revealedCreatureCellIds, revealedCreatureUntilRound, activePlayerId])
  // 物件索引：一次把各類實體依所在格分組，取代 per-cell 對全陣列的 11 次 filter。
  // 以不可變方式建構（spread 建立新陣列，不 push 變異）——讓 React Compiler 能證明
  // props 元素不會被變異，恢復整個元件的自動 memoization（否則整個元件 Compilation Skipped）。
  const cellObjects = useMemo(() => {
    type Entry = {
      players: PlayerState[]; creatures: CreatureState[]; bases: BaseState[]; nests: CreatureNestState[];
      resourcePoints: ResourcePointState[]; itemPoints: ItemPointState[]; defenseStructures: DefenseStructureState[];
      explorationEvents: ExplorationEventState[]; sectGates: SectGateState[]; ruins: RuinState[]; traps: TrapState[];
    }
    const emptyEntry: Entry = { players: [], creatures: [], bases: [], nests: [], resourcePoints: [], itemPoints: [], defenseStructures: [], explorationEvents: [], sectGates: [], ruins: [], traps: [] }
    const index = new Map<string, Entry>()
    const add = <K extends keyof Entry>(position: Position | undefined, key: K, item: Entry[K][number]) => {
      if (!position || !Number.isFinite(position.row) || !Number.isFinite(position.column)) return
      const cellKey = `${position.row}-${position.column}`
      const entry = index.get(cellKey) ?? emptyEntry
      index.set(cellKey, { ...entry, [key]: [...entry[key], item] })
    }
    for (const player of players) add(player.position, 'players', player)
    for (const creature of creatures) add(creature.position, 'creatures', creature)
    for (const base of bases) add(base.position, 'bases', base)
    for (const nest of creatureNests) add(nest.position, 'nests', nest)
    for (const point of resourcePoints) add(point.position, 'resourcePoints', point)
    for (const point of itemPoints) add(point.position, 'itemPoints', point)
    for (const structure of defenseStructures) add(structure.position, 'defenseStructures', structure)
    for (const event of explorationEvents) add(event.position, 'explorationEvents', event)
    for (const gate of sectGates) add(gate.position, 'sectGates', gate)
    for (const ruin of ruins) add(ruin.position, 'ruins', ruin)
    for (const trap of traps) add(trap.position, 'traps', trap)
    return index
  }, [players, creatures, bases, creatureNests, resourcePoints, itemPoints, defenseStructures, explorationEvents, sectGates, ruins, traps])
  // 新框架：提供 targetingSpec 時，高亮整個形狀範圍的格（純視覺提示可選範圍）。
  // 實際「可點擊目標」由 resolveMapCellAction 依 targeting flag 與格子上是否有目標判定。
  const specRangeCellIds = useMemo(() => {
    if (activePlayer && targetingSpec) {
      return resolveTargetShapeCells(targetingSpec.shape, activePlayer.position, map)
    }
    return new Set<string>()
  }, [activePlayer, targetingSpec, map])
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
  // 統一目標格（高亮）：有 spec 用「整個範圍」（視覺提示可選範圍），否則沿用既有相鄰邏輯。
  const targetCellIds = targetingSpec
    ? specRangeCellIds
    : externalSkillTargeting ? attackableTargetCellIds
      : attackTargeting ? attackableTargetCellIds
        : itemTargeting ? attackableTargetCellIds
          : new Set<string>()
  const skillTargetCellIds = targetingSpec && targetingSpec.source === 'external-skill' ? targetCellIds : new Set<string>()
  const attackTargetCellIds = targetingSpec && targetingSpec.source === 'attack' ? targetCellIds : new Set<string>()
  const itemTargetCellIds = targetingSpec && targetingSpec.source === 'item-burst' ? targetCellIds : new Set<string>()
  // 急救：高亮整個選取範圍（周圍一格），實際可點擊目標由 cellAction 判定。
  const firstAidRangeCellIds = targetingSpec && targetingSpec.source === 'first-aid' ? targetCellIds : new Set<string>()
  const interactionHandlers: MapInteractionHandlers = {
    move: (playerId, position) => onMovePlayerTo?.(playerId, position.row, position.column),
    playerMoved: () => onPlayerMoved?.(),
    targetCreature: (creatureId, markerRect) => onCreatureSelect?.(creatureId, markerRect),
    inspectCreature: (creatureId, markerRect) => onCreatureSelect?.(creatureId, markerRect),
    targetNest: (nestId) => onCreatureNestSelect?.(nestId),
    inspectNest: (nestId) => onCreatureNestDetails?.(nestId),
    targetPlayer: (playerId) => onPlayerTarget?.(playerId),
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
            : targetingSpec
              ? targetingSpec.hint
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
              const cellVisibility = visibilityState
                ? visibilityState.revealed
                  ? 'visible'
                  : visibilityState.visibleCellIds.has(cell.id)
                    ? 'visible'
                    : visibilityState.revealedSet.has(cell.id)
                      ? 'visible'
                      : visibilityState.exploredSet.has(cell.id)
                        ? 'explored'
                        : 'unexplored'
                : 'visible'
              const isUnexplored = cellVisibility === 'unexplored'
              const isVisible = cellVisibility === 'visible'
              const isExplored = cellVisibility === 'explored'
              const isKnownLocation = isVisible || isExplored
              const isReachable = reachableCellIds.has(cell.id)
              const isSkillTarget = skillTargetCellIds.has(cell.id)
              const isAttackTarget = attackTargetCellIds.has(cell.id)
              const isItemTarget = itemTargetCellIds.has(cell.id)
              const isFirstAidRange = firstAidRangeCellIds.has(cell.id)
              const cellEntry = cellObjects.get(cell.id)
              const playersHere = isVisible ? (cellEntry?.players ?? []) : []
              const isFirstAidTarget = firstAidTargeting && playersHere.some(
                (player) => player.health <= 0 && player.id !== activePlayer?.id,
              )
              const creaturesHere = isVisible ? (cellEntry?.creatures ?? []) : []
              const basesHere = isVisible ? (cellEntry?.bases ?? []) : []
              const nestsHere = isKnownLocation ? (cellEntry?.nests ?? []) : []
              const resourcePointsHere = isKnownLocation ? (cellEntry?.resourcePoints ?? []) : []
              const itemPointsHere = isVisible ? (cellEntry?.itemPoints ?? []) : []
              const defenseStructuresHere = isKnownLocation ? (cellEntry?.defenseStructures ?? []) : []
              const explorationEventsHere = isVisible
                ? (cellEntry?.explorationEvents ?? []).filter((event) => event.status === 'available')
                : []
              const sectGatesHere = isKnownLocation ? (cellEntry?.sectGates ?? []) : []
              const ruinsHere = isVisible
                ? (cellEntry?.ruins ?? []).filter((ruin) => ruin.status === 'intact')
                : []
              const trapsHere = isVisible ? (cellEntry?.traps ?? []) : []
              const defenseDistance = defenseBuildMode
                ? Math.abs(defenseBuildMode.basePosition.row - cell.row) + Math.abs(defenseBuildMode.basePosition.column - cell.column)
                : Infinity
              const canSelectDefensePosition = Boolean(
                defenseBuildMode && defenseDistance <= defenseBuildRange && cell.terrain !== 'wall' &&
                !blockedPositions.some((position) => position.row === cell.row && position.column === cell.column),
              )
              const isDefenseBuildRange = Boolean(
                defenseBuildMode && defenseDistance <= defenseBuildRange && cell.terrain !== 'wall',
              )
              const { isBaseInfluence: isSelectedBaseRange } = getMapCellRangeState(
                cell,
                selectedBase?.position ?? null,
                selectedBase?.active !== false,
                isKnownLocation,
              )
              const creatureTarget = creaturesHere.find((creature) => creature.health > 0)
              const nestTarget = nestsHere.find((nest) => nest.health > 0)
              const playerTarget = playersHere.find((player) => player.health <= 0 && player.id !== activePlayer?.id)
              const cellAction = resolveMapCellAction({
                position: { row: cell.row, column: cell.column },
                visibility: cellVisibility,
                movementEnabled,
                attackTargeting,
                firstAidTargeting,
                externalSkillTargeting,
                itemTargeting,
                defenseBuildMode: Boolean(defenseBuildMode),
                activePlayerId: activePlayer?.id ?? null,
                isReachable,
                canSelectDefensePosition,
                creatureTargetId: creatureTarget?.id,
                nestTargetId: nestTarget?.id,
                playerTargetId: playerTarget?.id,
                gameOver,
                blockingModal,
                creatureTurnInProgress,
              })
              const resolveMarkerAction = (type: 'creature' | 'nest' | 'player' | 'base' | 'defense' | 'event' | 'ruin' | 'resource' | 'item' | 'sect-gate', id: string) => resolveMapCellAction({
                position: { row: cell.row, column: cell.column },
                visibility: cellVisibility,
                movementEnabled,
                attackTargeting,
                firstAidTargeting,
                externalSkillTargeting,
                itemTargeting,
                defenseBuildMode: Boolean(defenseBuildMode),
                activePlayerId: activePlayer?.id ?? null,
                isReachable,
                canSelectDefensePosition,
                creatureTargetId: creatureTarget?.id,
                nestTargetId: nestTarget?.id,
                playerTargetId: playerTarget?.id,
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
                  title={`${terrain.label} (${cell.row}, ${cell.column})`}
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
                    {isFirstAidRange && <span className="map-grid__overlay map-grid__overlay--first-aid-range" />}
                    {isFirstAidTarget && <span className="map-grid__overlay map-grid__overlay--attack-target" />}
                    {isDefenseBuildRange && <span className="map-grid__overlay map-grid__overlay--defense-range" />}
                    {canSelectDefensePosition && <span className="map-grid__overlay map-grid__overlay--defense-buildable" />}
                  </span>
                  {defenseStructuresHere.map((structure) => {
                    const bastionBoosted = getBastionMultipliers(defenseStructures, structure)
                    const boosted = bastionBoosted.hpMultiplier > 1
                    return (
                    <div
                      key={structure.id}
                      className={`defense-structure-marker${boosted ? ' defense-structure-marker--bastion-boosted' : ''}`}
                      title={`${structure.name}${structure.originName ? `（源自 ${structure.originName}）` : ''} · ${structure.health}/${structure.maxHealth}${boosted ? ` · 受軍壘強化：HP×${bastionBoosted.hpMultiplier}${bastionBoosted.attackMultiplier > 1 ? `、攻擊×${bastionBoosted.attackMultiplier}` : ''}` : ''}`}
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
                      {boosted ? <span className="defense-structure-marker__boost">✦</span> : null}
                      {structure.icon}
                    </div>
                    )
                  })}
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
                  {playersHere.map((player) => {
                    const playerBuffClassNames = getActiveBuffsForPlayer(player)
                      .map((buff) => getBuff(buff.definitionId))
                      .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition?.mapMarker))
                      .map((definition) => `creature--buff-${definition.mapMarkerClass ?? definition.id.replace(/-movement|-burning|-poison|-reflection|-boost/g, '')}`)
                      .join(' ')
                    return (
                      <Player
                        key={player.id}
                        id={player.id}
                        name={player.name}
                        stamina={player.stamina}
                        maxStamina={player.maxStamina}
                        className={[
                          player.id === activePlayerId && !creatureTurnInProgress ? 'player--current' : '',
                          firstAidTargeting && player.health <= 0 && player.id !== activePlayer?.id ? 'player--first-aid-target' : '',
                          playerBuffClassNames,
                        ].filter(Boolean).join(' ') || undefined}
                        onClick={firstAidTargeting && player.health <= 0 && player.id !== activePlayer?.id
                          ? (event) => {
                            event.stopPropagation()
                            executeMapCellAction(resolveMarkerAction('player', player.id), event.currentTarget.getBoundingClientRect())
                          }
                          : undefined}
                      />
                    )
                  })}
                  {creaturesHere.map((creature) => (
                    (() => {
                      const buffClassNames = getActiveBuffsForPlayer(creature)
                        .map((buff) => getBuff(buff.definitionId))
                        .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition?.mapMarker))
                        .map((definition) => `creature--buff-${definition.mapMarkerClass ?? definition.id.replace(/-movement|-burning|-poison|-reflection|-boost/g, '')}`)
                        .join(' ')
                      // 三重共振且生物存活：直接對生物 icon 播放 shake 動畫。
                      const isShaking = creatureShake?.targetId === creature.id && creatureShake.position.row === cell.row && creatureShake.position.column === cell.column
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
                          className={[creature.id === activeCreatureId ? 'player--current-creature' : '', buffClassNames, isShaking ? 'creature--triple-resonance-shake' : ''].filter(Boolean).join(' ') || undefined}
                          onClick={(event) => {
                            event.stopPropagation()
                            executeMapCellAction(resolveMarkerAction('creature', creature.id), event.currentTarget.getBoundingClientRect())
                          }}
                        />
                      )
                    })()
                  ))}
                  {/* 三重共振：若被命中的生物已被移除（擊殺），在此格顯示 ghost icon 並播放 shake 動畫。 */}
                  {creatureShake && isVisible && creatureShake.position.row === cell.row && creatureShake.position.column === cell.column
                    && !creaturesHere.some((creature) => creature.id === creatureShake.targetId) ? (
                    <Player
                      key={`shake-${creatureShake.signal}-${creatureShake.targetId}`}
                      id={creatureShake.targetId}
                      name="震懾"
                      controllable={false}
                      appearance="creature"
                      icon={creatureShake.icon}
                      className="creature--triple-resonance-shake"
                    />
                  ) : null}
                  {basesHere.map((base) => (
                    <div
                      key={base.id}
                      className={`base-marker${base.active === false ? ' base-marker--inactive' : ''}`}
                      title={`${base.name} · ${base.active === false ? '未啟用' : '運作中'} (${cell.row}, ${cell.column})`}
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
                      className={`resource-point-marker${isExplored ? ' resource-point-marker--explored' : ''}${playersHere.length > 0 ? ' resource-point-marker--overlapping' : ''}`}
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
                      {getResourcePointIcon(resourcePoint.name, cell.terrain)}
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

export default memo(MapGrid)