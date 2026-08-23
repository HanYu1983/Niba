import { useState } from 'react'
import BaseDetailsModal from '../BaseDetailsModal'
import ResourcePointDetailsModal from '../ResourcePointDetailsModal'
import CreatureNestDetailsModal from '../CreatureNestDetailsModal'
import ItemPointDetailsModal from '../ItemPointDetailsModal'
import ExplorationEventDetailsModal from '../ExplorationEventDetailsModal'
import RuinDetailsModal from '../RuinDetailsModal'
import DefenseStructureDetailsModal from '../DefenseStructureDetailsModal'
import SectGateDetailsModal from '../SectGateDetailsModal'
import TransportModal from '../TransportModal'
import { gameStore } from '../../game/gameStore'
import { findRuinBonusBase, RUIN_CLEAR_MATERIAL_BONUS } from '../../game/actions/ruinActions'
import { BASE_INFLUENCE_RANGE } from '../../game/rules/baseRules'
import { getEventChoices } from '../../game/events/eventResolver'
import {
  formatExplorationEventResult,
  formatItemPointPickupResult,
} from '../../game/actionResultFormatters'
import { allExternalSkillCatalog } from '../../game/catalogs/martialHallSkillCatalog'
import { itemCatalog } from '../../game/catalogs/itemCatalog'
import { getTransportTargets } from '../../game/rules/transportRules'
import type { GameState, PlayerState, ExplorationEventState, DefenseStructureState, RuinState, SectGateState } from '../../game/types'

type WorldObjectOverlaysProps = {
  gameState: GameState
  activePlayer: PlayerState | null
  detailsBase: GameState['bases'][number] | null
  detailsCreatureNest: GameState['creatureNests'][number] | null
  detailsResourcePoint: GameState['resourcePoints'][number] | null
  detailsResourcePointBase: GameState['bases'][number] | null
  detailsItemPoint: GameState['itemPoints'][number] | null
  detailsExplorationEvent: ExplorationEventState | null
  detailsRuin: RuinState | null
  detailsDefenseStructure: DefenseStructureState | null
  detailsDefenseStructureBase: GameState['bases'][number] | null
  detailsSectGate: SectGateState | null
  onCloseDetails: () => void
  onCloseCreatureNestDetails: () => void
  onAttackNest: (nestId: string) => void
  onCloseResourcePointDetails: () => void
  onCloseItemPointDetails: () => void
  onCloseExplorationEvent: () => void
  onCloseRuin: () => void
  onCloseDefenseStructureDetails: () => void
  onCloseSectGate: () => void
  onOpenBuildings: (baseId: string) => void
  onOpenDefense: (baseId: string) => void
  onOpenPolicySwitch: (baseId: string) => void
  onOpenWarehouse: (baseId: string) => void
  onOpenTransport: (baseId: string) => void
  onOpenRegionalManagement: (baseId: string) => void
  onOpenCollection: (resourcePointId: string) => void
  onRepairResourcePoint: (resourcePointId: string) => void
}

/**
 * 世界物件詳情 overlay 群組：
 * - 據點、資源點、巢穴、道具點、探索事件、防禦設施詳情
 */
function WorldObjectOverlays({
  gameState,
  activePlayer,
  detailsBase,
  detailsCreatureNest,
  detailsResourcePoint,
  detailsResourcePointBase,
  detailsItemPoint,
  detailsExplorationEvent,
  detailsRuin,
  detailsDefenseStructure,
  detailsDefenseStructureBase,
  detailsSectGate,
  onCloseDetails,
  onCloseCreatureNestDetails,
  onAttackNest,
  onCloseResourcePointDetails,
  onCloseItemPointDetails,
  onCloseExplorationEvent,
  onCloseRuin,
  onCloseDefenseStructureDetails,
  onCloseSectGate,
  onOpenBuildings,
  onOpenDefense,
  onOpenPolicySwitch,
  onOpenWarehouse,
  onOpenTransport,
  onOpenRegionalManagement,
  onOpenCollection,
  onRepairResourcePoint,
}: WorldObjectOverlaysProps) {
  const [smallWaystationTransportId, setSmallWaystationTransportId] = useState<string | null>(null)
  const smallWaystationTransport = gameState.defenseStructures?.find(
    (structure) => structure.id === smallWaystationTransportId,
  ) ?? null
  return (
    <>
      <BaseDetailsModal
        base={detailsBase}
        currentPlayer={activePlayer}
        gameState={gameState}
        onOpenBuildings={onOpenBuildings}
        onOpenDefense={onOpenDefense}
        onOpenPolicySwitch={onOpenPolicySwitch}
        onOpenWarehouse={onOpenWarehouse}
        onOpenTransport={onOpenTransport}
        onOpenRegionalManagement={onOpenRegionalManagement}
        onClose={onCloseDetails}
      />
      <ResourcePointDetailsModal
        resourcePoint={detailsResourcePoint}
        ownerBase={detailsResourcePointBase}
        currentPlayer={activePlayer}
        gameState={gameState}
        round={gameState.round}
        onOpenCollection={onOpenCollection}
        onRepair={onRepairResourcePoint}
        onClose={onCloseResourcePointDetails}
      />
      <CreatureNestDetailsModal
        nest={detailsCreatureNest}
        currentPlayer={activePlayer}
        onAttack={onAttackNest}
        onClose={onCloseCreatureNestDetails}
      />
      <ItemPointDetailsModal
        itemPoint={detailsItemPoint}
        itemCatalog={itemCatalog}
        currentPlayer={activePlayer}
        terrain={detailsItemPoint
          ? gameState.map.cells.find((cell) => cell.row === detailsItemPoint.position.row && cell.column === detailsItemPoint.position.column)?.terrain
          : undefined}
        onCollect={(itemPointId) => {
          const result = gameStore.collectItemPoint(gameState.activePlayerId, itemPointId)
          onCloseItemPointDetails()

          if (result.ok) {
            gameStore.showActionResult(
              formatItemPointPickupResult(
                result.data,
                gameState.map.cells.find((cell) => cell.row === detailsItemPoint?.position.row && cell.column === detailsItemPoint?.position.column)?.terrain,
              ),
            )
          }
        }}
        onClose={onCloseItemPointDetails}
      />
      <ExplorationEventDetailsModal
        event={detailsExplorationEvent}
        player={activePlayer}
        gameState={gameState}
        choices={detailsExplorationEvent ? getEventChoices(detailsExplorationEvent) : []}
        onChoose={(choiceId) => {
          if (!detailsExplorationEvent) return
          const result = gameStore.resolveExplorationEvent(gameState.activePlayerId, detailsExplorationEvent.id, choiceId)
          if (!result.ok) {
            onCloseExplorationEvent()
            gameStore.showActionResult({ title: '事件處理失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          onCloseExplorationEvent()
          const playerBefore = gameState.players.find((player) => player.id === gameState.activePlayerId)
          const playerAfter = gameStore.getState().players.find((player) => player.id === gameState.activePlayerId)
          const learnedExternalSkillId = playerBefore && playerAfter
            ? playerAfter.externalSkillIds.find((skillId) => !playerBefore.externalSkillIds.includes(skillId))
            : undefined
          const learnedExternalSkillName = learnedExternalSkillId
            ? allExternalSkillCatalog.find((skill) => skill.id === learnedExternalSkillId)?.name
            : undefined
          // 自定義事件：讀取該選項的自訂結果訊息（若無則自動生成）。
          const customResultMessage = detailsExplorationEvent.type === 'custom'
            ? detailsExplorationEvent.customEvent?.choices.find((c) => c.id === choiceId)?.resultMessage
            : undefined
          gameStore.showActionResult(
            formatExplorationEventResult(detailsExplorationEvent.name, choiceId, learnedExternalSkillName, customResultMessage),
            { type: 'none' },
          )
        }}
        onClose={onCloseExplorationEvent}
      />
      <RuinDetailsModal
        ruin={detailsRuin}
        player={activePlayer}
        onClear={() => {
          if (!detailsRuin) return
          // 清除前先判斷該廢墟是否落在某活躍據點的影響範圍內，決定是否獲得建料獎勵。
          const bonusBase = findRuinBonusBase(gameState, detailsRuin.position, BASE_INFLUENCE_RANGE)
          const result = gameStore.clearRuin(gameState.activePlayerId, detailsRuin.id)
          if (!result.ok) {
            onCloseRuin()
            gameStore.showActionResult({ title: '清除失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          onCloseRuin()
          gameStore.showActionResult({
            title: '廢墟已清除',
            message: '廢墟點已移除，該格現在可以通行。',
            rewards: [
              '獲得 20 經驗值',
              ...(bonusBase ? [`${bonusBase.name} 獲得 ${RUIN_CLEAR_MATERIAL_BONUS} 建料`] : []),
            ],
          })
        }}
        onReconstruct={(structureType) => {
          if (!detailsRuin) return
          const result = gameStore.reconstructRuin(gameState.activePlayerId, detailsRuin.id, structureType)
          if (!result.ok) {
            onCloseRuin()
            gameStore.showActionResult({ title: '修復失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          onCloseRuin()
          gameStore.showActionResult({
            title: '修復完成',
            message: `已將廢墟修復為${structureType === 'small-watchtower' ? '小型瞭望臺' : structureType === 'small-arrow-tower' ? '小型箭塔' : '小型驛站'}。`,
            rewards: ['獲得 10 經驗值'],
          })
        }}
        onClose={onCloseRuin}
      />
      <DefenseStructureDetailsModal
        structure={detailsDefenseStructure}
        ownerBase={detailsDefenseStructureBase}
        onOpenTransport={(structureId) => {
          onCloseDefenseStructureDetails()
          setSmallWaystationTransportId(structureId)
        }}
        onClose={onCloseDefenseStructureDetails}
      />
      <SectGateDetailsModal
        gate={detailsSectGate}
        player={activePlayer}
        onLearn={(skillId) => {
          if (!detailsSectGate) return
          const result = gameStore.learnSectGateSkill(gameState.activePlayerId, detailsSectGate.id, skillId)
          if (!result.ok) {
            gameStore.showActionResult({ title: '學習功法失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          onCloseSectGate()
          gameStore.showActionResult({ title: '學習成功', message: '已學會此門派功法。', rewards: [] })
        }}
        onPractice={(skillId) => {
          if (!detailsSectGate) return
          const result = gameStore.practiceSectGateSkill(gameState.activePlayerId, detailsSectGate.id, skillId)
          if (!result.ok) {
            gameStore.showActionResult({ title: '練習功法失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          gameStore.showActionResult({ title: '練習功法', message: '個人功法經驗與門派據點經驗各提升 30。', rewards: [] })
        }}
        onBuyEquipment={(equipmentId) => {
          if (!detailsSectGate) return
          const result = gameStore.buySectEquipment(gameState.activePlayerId, detailsSectGate.id, equipmentId)
          if (!result.ok) {
            gameStore.showActionResult({ title: '購買門派裝備失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          gameStore.showActionResult({ title: '購買成功', message: '門派裝備已加入裝備背包，門派據點經驗提升。', rewards: [] })
        }}
        onClose={onCloseSectGate}
      />
      <TransportModal
        player={activePlayer}
        open={smallWaystationTransport !== null}
        title={smallWaystationTransport ? `${smallWaystationTransport.name} · 小型驛站傳送` : '小型驛站傳送'}
        isSmallWaystation
        targets={getTransportTargets(gameState, smallWaystationTransport ? { kind: 'small-waystation', structure: smallWaystationTransport } : null)}
        onTransport={(targetId) => {
          const result = gameStore.transportPlayer(gameState.activePlayerId, targetId)
          if (result.ok) setSmallWaystationTransportId(null)
          else gameStore.showActionResult({ title: '傳送失敗', message: result.reason, rewards: [] })
        }}
        onClose={() => setSmallWaystationTransportId(null)}
      />
    </>
  )
}

export default WorldObjectOverlays
