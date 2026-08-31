import CombatOverlays from './overlays/CombatOverlays'
import BaseOverlays from './overlays/BaseOverlays'
import WorldObjectOverlays from './overlays/WorldObjectOverlays'
import PlayerOverlays from './overlays/PlayerOverlays'
import SystemOverlays from './overlays/SystemOverlays'
import PendingExplorationEventModal from './PendingExplorationEventModal'
import { gameStore } from '../game/gameStore'
import { formatExplorationEventResult } from '../game/actionResultFormatters'
import { allExternalSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import type { GameState, PlayerState, CreatureState, ExplorationEventState, DefenseStructureState, RuinState, SectGateState } from '../game/types'

type GameOverlaysProps = {
  gameState: GameState
  /** 「重新開始」時回到地圖設置頁面（可選）。 */
  onRestartToMap?: () => void
  /** 玩家是否已關閉局末結算彈窗（可由指令欄按鈕重新開啟）。 */
  gameOverModalDismissed?: boolean
  /** 關閉局末結算彈窗。 */
  onDismissGameOverModal?: () => void
  activePlayer: PlayerState | null
  selectedCreature: CreatureState | null
  buildingBase: GameState['bases'][number] | null
  defenseBase: GameState['bases'][number] | null
  collectionResourcePoint: GameState['resourcePoints'][number] | null
  collectionBase: GameState['bases'][number] | null
  missionBase: GameState['bases'][number] | null
  detailsBase: GameState['bases'][number] | null
  detailsCreatureNest: GameState['creatureNests'][number] | null
  detailsResourcePoint: GameState['resourcePoints'][number] | null
  detailsResourcePointBase: GameState['bases'][number] | null
  inventoryPlayer: PlayerState | null
  equipmentPlayer: PlayerState | null
  detailsItemPoint: GameState['itemPoints'][number] | null
  detailsExplorationEvent: ExplorationEventState | null
  detailsRuin: RuinState | null
  detailsDefenseStructure: DefenseStructureState | null
  detailsDefenseStructureBase: GameState['bases'][number] | null
  detailsSectGate: SectGateState | null
  skillPlayerId: string | null
  policySwitchBase: GameState['bases'][number] | null
  warehouseBase: GameState['bases'][number] | null
  transportBase: GameState['bases'][number] | null
  regionalManagementBase: GameState['bases'][number] | null
  martialHallBase: GameState['bases'][number] | null
  shopBase: GameState['bases'][number] | null
  onCloseBuilding: () => void
  onCloseCollection: () => void
  onCloseMission: () => void
  onCloseDetails: () => void
  onCloseCreatureNestDetails: () => void
  onAttackNest: (nestId: string) => void
  onCloseResourcePointDetails: () => void
  onCloseInventory: () => void
  onCloseEquipment: () => void
  onCloseItemPointDetails: () => void
  onCloseSkill: () => void
  onCloseCreaturePanel: () => void
  onOpenBuildings: (baseId: string) => void
  onOpenDefense: (baseId: string) => void
  onOpenPolicySwitch: (baseId: string) => void
  onOpenWarehouse: (baseId: string) => void
  onOpenTransport: (baseId: string) => void
  onOpenRegionalManagement: (baseId: string) => void
  onOpenMartialHall: (baseId: string) => void
  onOpenShop: (baseId: string) => void
  onCloseDefense: () => void
  onBeginDefensePositionSelection: () => void
  onOpenMission: (baseId: string) => void
  onHeal: (baseId: string) => void
  onRepair: (baseId: string) => void
  onOpenCollection: (resourcePointId: string) => void
  onRepairResourcePoint: (resourcePointId: string) => void
  onCloseExplorationEvent: () => void
  onCloseRuin: () => void
  onCloseDefenseStructureDetails: () => void
  onCloseSectGate: () => void
  onClosePolicySwitch: () => void
  onCloseWarehouse: () => void
  onCloseTransport: () => void
  onCloseRegionalManagement: () => void
  onCloseShop: () => void
  onCloseMartialHall: () => void
}

/**
 * 遊戲 overlay 總控制器。
 *
 * 本元件只負責組裝各 overlay 群組並轉傳 props，不再直接組合 modal 流程。
 * 各群組的 modal 掛載與 action 編排已移至：
 * - {@link CombatOverlays}
 * - {@link BaseOverlays}
 * - {@link WorldObjectOverlays}
 * - {@link PlayerOverlays}
 * - {@link SystemOverlays}
 */
function GameOverlays({
  gameState,
  onRestartToMap,
  gameOverModalDismissed,
  onDismissGameOverModal,
  activePlayer,
  selectedCreature,
  buildingBase,
  defenseBase,
  collectionResourcePoint,
  collectionBase,
  missionBase,
  detailsBase,
  detailsCreatureNest,
  detailsResourcePoint,
  detailsResourcePointBase,
  inventoryPlayer,
  equipmentPlayer,
  detailsItemPoint,
  detailsExplorationEvent,
  detailsRuin,
  detailsDefenseStructure,
  detailsDefenseStructureBase,
  detailsSectGate,
  skillPlayerId,
  policySwitchBase,
  warehouseBase,
  transportBase,
  regionalManagementBase,
  shopBase,
  martialHallBase,
  onCloseBuilding,
  onCloseCollection,
  onCloseMission,
  onCloseDetails,
  onCloseCreatureNestDetails,
  onAttackNest,
  onCloseResourcePointDetails,
  onCloseInventory,
  onCloseEquipment,
  onCloseItemPointDetails,
  onCloseSkill,
  onCloseCreaturePanel,
  onOpenBuildings,
  onOpenDefense,
  onOpenPolicySwitch,
  onOpenWarehouse,
  onOpenTransport,
  onOpenRegionalManagement,
  onOpenShop,
  onCloseDefense,
  onBeginDefensePositionSelection,
  onOpenMission,
  onHeal,
  onRepair,
  onOpenCollection,
  onRepairResourcePoint,
  onCloseExplorationEvent,
  onCloseRuin,
  onCloseDefenseStructureDetails,
  onCloseSectGate,
  onClosePolicySwitch,
  onCloseWarehouse,
  onCloseTransport,
  onCloseRegionalManagement,
  onOpenMartialHall,
  onCloseShop,
  onCloseMartialHall,
}: GameOverlaysProps) {
  return (
    <>
      <SystemOverlays
        gameState={gameState}
        onRestartToMap={onRestartToMap}
        gameOverModalDismissed={gameOverModalDismissed}
        onDismissGameOverModal={onDismissGameOverModal}
      />
      <CombatOverlays
        gameState={gameState}
        selectedCreature={selectedCreature}
        onCloseCreaturePanel={onCloseCreaturePanel}
      />
      <BaseOverlays
        gameState={gameState}
        activePlayer={activePlayer}
        buildingBase={buildingBase}
        defenseBase={defenseBase}
        collectionResourcePoint={collectionResourcePoint}
        collectionBase={collectionBase}
        missionBase={missionBase}
        policySwitchBase={policySwitchBase}
        warehouseBase={warehouseBase}
        transportBase={transportBase}
        regionalManagementBase={regionalManagementBase}
        shopBase={shopBase}
        martialHallBase={martialHallBase}
        onCloseBuilding={onCloseBuilding}
        onCloseCollection={onCloseCollection}
        onCloseMission={onCloseMission}
        onCloseDefense={onCloseDefense}
        onBeginDefensePositionSelection={onBeginDefensePositionSelection}
        onOpenShop={onOpenShop}
        onOpenTransport={onOpenTransport}
        onOpenWarehouse={onOpenWarehouse}
        onOpenRegionalManagement={onOpenRegionalManagement}
        onOpenMartialHall={onOpenMartialHall}
        onOpenMission={onOpenMission}
        onHeal={onHeal}
        onRepair={onRepair}
        onCloseShop={onCloseShop}
        onCloseMartialHall={onCloseMartialHall}
        onClosePolicySwitch={onClosePolicySwitch}
        onCloseWarehouse={onCloseWarehouse}
        onCloseTransport={onCloseTransport}
        onCloseRegionalManagement={onCloseRegionalManagement}
      />
      <WorldObjectOverlays
        gameState={gameState}
        activePlayer={activePlayer}
        detailsBase={detailsBase}
        detailsCreatureNest={detailsCreatureNest}
        detailsResourcePoint={detailsResourcePoint}
        detailsResourcePointBase={detailsResourcePointBase}
        detailsItemPoint={detailsItemPoint}
        detailsExplorationEvent={detailsExplorationEvent}
        detailsRuin={detailsRuin}
        detailsDefenseStructure={detailsDefenseStructure}
        detailsDefenseStructureBase={detailsDefenseStructureBase}
        detailsSectGate={detailsSectGate}
        onCloseDetails={onCloseDetails}
        onCloseCreatureNestDetails={onCloseCreatureNestDetails}
        onAttackNest={onAttackNest}
        onCloseResourcePointDetails={onCloseResourcePointDetails}
        onCloseItemPointDetails={onCloseItemPointDetails}
        onCloseExplorationEvent={onCloseExplorationEvent}
        onCloseRuin={onCloseRuin}
        onCloseDefenseStructureDetails={onCloseDefenseStructureDetails}
        onCloseSectGate={onCloseSectGate}
        onOpenBuildings={onOpenBuildings}
        onOpenDefense={onOpenDefense}
        onOpenPolicySwitch={onOpenPolicySwitch}
        onOpenWarehouse={onOpenWarehouse}
        onOpenTransport={onOpenTransport}
        onOpenRegionalManagement={onOpenRegionalManagement}
        onOpenCollection={onOpenCollection}
        onRepairResourcePoint={onRepairResourcePoint}
      />
      <PlayerOverlays
        gameState={gameState}
        inventoryPlayer={inventoryPlayer}
        equipmentPlayer={equipmentPlayer}
        skillPlayerId={skillPlayerId}
        onCloseInventory={onCloseInventory}
        onCloseEquipment={onCloseEquipment}
        onCloseSkill={onCloseSkill}
      />
      <PendingExplorationEventModal
        event={gameState.pendingExplorationEvent ?? null}
        player={gameState.players.find((player) => player.id === (gameState.pendingExplorationEventPlayerId ?? gameState.activePlayerId)) ?? null}
        gameState={gameState}
        onChoose={(choiceId) => {
          const pending = gameState.pendingExplorationEvent
          if (!pending) return
          const targetPlayerId = gameState.pendingExplorationEventPlayerId ?? gameState.activePlayerId
          const playerBefore = gameState.players.find((player) => player.id === targetPlayerId)
          const result = gameStore.resolvePendingExplorationEvent(targetPlayerId, pending.id, choiceId)
          if (!result.ok) {
            // 事件處理失敗：僅顯示失敗彈窗。敵人行動已在回合結束時執行完畢，無需延後。
            gameStore.showActionResult({ title: '事件處理失敗', message: `原因：${result.reason}`, rewards: [] })
            return
          }
          const playerAfter = gameStore.getState().players.find((player) => player.id === targetPlayerId)
          const learnedExternalSkillId = playerBefore && playerAfter
            ? playerAfter.externalSkillIds.find((skillId) => !playerBefore.externalSkillIds.includes(skillId))
            : undefined
          const learnedExternalSkillName = learnedExternalSkillId
            ? allExternalSkillCatalog.find((skill) => skill.id === learnedExternalSkillId)?.name
            : undefined
          // 顯示事件結果彈窗。敵人行動已於回合結束執行，此處不需延後。
          gameStore.showActionResult(
            formatExplorationEventResult(pending.name, choiceId, learnedExternalSkillName),
          )
        }}
        onClose={() => gameStore.dismissPendingExplorationEvent()}
      />
    </>
  )
}

export default GameOverlays
