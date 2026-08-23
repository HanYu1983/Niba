import BuildingListModal from '../BuildingListModal'
import ShopModal from '../ShopModal'
import MartialHallModal from '../MartialHallModal'
import PolicySwitchModal from '../PolicySwitchModal'
import SharedWarehouseModal from '../SharedWarehouseModal'
import TransportModal from '../TransportModal'
import RegionalManagementModal from '../RegionalManagementModal'
import DefenseStructureBuildModal from '../DefenseStructureBuildModal'
import ResourceCollectionModal from '../ResourceCollectionModal'
import MissionRewardModal from '../MissionRewardModal'
import RepairPreviewModal from '../RepairPreviewModal'
import { gameStore } from '../../game/gameStore'
import { BUILDING_TYPES } from '../../game/catalogs/buildingCatalog'
import {
  formatDefenseStructureBuildResult,
  formatMissionResult,
  formatRepairResult,
  formatResourceCollectionResult,
} from '../../game/actionResultFormatters'
import { equipmentCatalog } from '../../game/catalogs/equipmentCatalog'
import { itemCatalog } from '../../game/catalogs/itemCatalog'
import { defenseStructureCatalog } from '../../game/catalogs/defenseStructureCatalog'
import { getResourceCollectionMaterialGain } from '../../game/rules/baseRules'
import { getEffectiveMaterialGain } from '../../game/rules/policyRules'
import { getAvailablePolicyIds } from '../../game/rules/governanceRules'
import { getGovernanceRankUpMessage } from '../../game/rules/governanceRules'
import { getTransportTargets } from '../../game/rules/transportRules'
import type { GameState, PlayerState } from '../../game/types'

type BaseOverlaysProps = {
  gameState: GameState
  activePlayer: PlayerState | null
  buildingBase: GameState['bases'][number] | null
  defenseBase: GameState['bases'][number] | null
  collectionResourcePoint: GameState['resourcePoints'][number] | null
  collectionBase: GameState['bases'][number] | null
  missionBase: GameState['bases'][number] | null
  policySwitchBase: GameState['bases'][number] | null
  warehouseBase: GameState['bases'][number] | null
  transportBase: GameState['bases'][number] | null
  regionalManagementBase: GameState['bases'][number] | null
  shopBase: GameState['bases'][number] | null
  martialHallBase: GameState['bases'][number] | null
  onCloseBuilding: () => void
  onCloseCollection: () => void
  onCloseMission: () => void
  onCloseDefense: () => void
  onBeginDefensePositionSelection: () => void
  onOpenShop: (baseId: string) => void
  onOpenTransport: (baseId: string) => void
  onOpenWarehouse: (baseId: string) => void
  onOpenRegionalManagement: (baseId: string) => void
  onOpenMartialHall: (baseId: string) => void
  onOpenMission: (baseId: string) => void
  onHeal: (baseId: string) => void
  onRepair: (baseId: string) => void
  onCloseShop: () => void
  onCloseMartialHall: () => void
  onClosePolicySwitch: () => void
  onCloseWarehouse: () => void
  onCloseTransport: () => void
  onCloseRegionalManagement: () => void
}

/**
 * 據點建設與治理相關 overlay 群組：
 * - 建築列表、升級、商店、武館、政策、倉庫、傳送、區域管理
 * - 防禦建築建造
 * - 資源採集、任務獎勵、修理預覽
 */

/** 若執行後官階升級，將升級訊息附加到獎勵清單。 */
function withRankUpReward(beforePrestige: number, rewards: string[]): string[] {
  const playerId = gameStore.getState().activePlayerId
  const afterPrestige = gameStore.getState().players.find((player) => player.id === playerId)?.prestige ?? beforePrestige
  const rankUp = getGovernanceRankUpMessage(beforePrestige, afterPrestige)
  return rankUp ? [...rewards, rankUp] : rewards
}

function BaseOverlays({
  gameState,
  activePlayer,
  buildingBase,
  defenseBase,
  collectionResourcePoint,
  collectionBase,
  missionBase,
  policySwitchBase,
  warehouseBase,
  transportBase,
  regionalManagementBase,
  shopBase,
  martialHallBase,
  onCloseBuilding,
  onCloseCollection,
  onCloseMission,
  onCloseDefense,
  onBeginDefensePositionSelection,
  onOpenShop,
  onOpenTransport,
  onOpenWarehouse,
  onOpenRegionalManagement,
  onOpenMartialHall,
  onOpenMission,
  onHeal,
  onRepair,
  onCloseShop,
  onCloseMartialHall,
  onClosePolicySwitch,
  onCloseWarehouse,
  onCloseTransport,
  onCloseRegionalManagement,
}: BaseOverlaysProps) {
  return (
    <>
      <RepairPreviewModal
        preview={gameState.repairPreview ?? null}
        onCancel={() => gameStore.clearRepairPreview()}
        onConfirm={() => {
          const result = gameStore.executeRepair()
          if (result.ok) {
            gameStore.showActionResult(formatRepairResult(result.data))
          } else {
            gameStore.showActionResult({ title: '修理失敗', message: result.reason, rewards: [] })
          }
        }}
      />
      <BuildingListModal
        base={buildingBase}
        onClose={onCloseBuilding}
        currentPlayer={activePlayer}
        onBuild={(buildingId) => {
          const result = gameStore.constructBuilding(buildingBase?.id ?? '', buildingId, gameState.activePlayerId)
          if (!result.ok) gameStore.showActionResult({ title: '建造失敗', message: result.reason, rewards: [] })
        }}
        onUpgrade={(buildingId) => {
          if (buildingBase) {
            const result = gameStore.upgradeBuilding(gameState.activePlayerId, buildingBase.id, buildingId)
            if (!result.ok) gameStore.showActionResult({ title: '升級失敗', message: result.reason, rewards: [] })
          }
        }}
        onVisitShop={(baseId) => {
          onCloseBuilding()
          onOpenShop(baseId)
        }}
        onOpenTransport={(baseId) => {
          onCloseBuilding()
          onOpenTransport(baseId)
        }}
        onOpenWarehouse={(baseId) => {
          onCloseBuilding()
          onOpenWarehouse(baseId)
        }}
        onOpenRegionalManagement={(baseId) => {
          onCloseBuilding()
          onOpenRegionalManagement(baseId)
        }}
        onOpenMartialHall={(baseId) => {
          onCloseBuilding()
          onOpenMartialHall(baseId)
        }}
        onHeal={onHeal}
        onRepair={onRepair}
        onMission={(baseId) => {
          onCloseBuilding()
          onOpenMission(baseId)
        }}
      />
      <ShopModal
        base={shopBase}
        player={activePlayer}
        gameState={gameState}
        onBuyItem={(itemId, quantity) => {
          const item = itemCatalog.find((candidate) => candidate.id === itemId)
          const result = gameStore.buyItem(gameState.activePlayerId, itemId, quantity)
          if (result.ok && item) {
            gameStore.showActionResult({
              title: '購買成功',
              message: `已購買 ${item.icon} ${item.name} × ${quantity}。`,
              rewards: [`金錢 -${item.buyPrice * quantity}`],
            })
          } else if (!result.ok) {
            gameStore.showActionResult({ title: '購買失敗', message: result.reason, rewards: [] })
          }
        }}
        onSellItem={(itemId, quantity) => gameStore.sellItem(gameState.activePlayerId, itemId, quantity)}
        onBuyEquipment={(equipmentId) => {
          const equipment = equipmentCatalog.find((candidate) => candidate.id === equipmentId)
          const result = gameStore.buyEquipment(gameState.activePlayerId, equipmentId)
          if (result.ok && equipment) {
            gameStore.showActionResult({
              title: '購買成功',
              message: `已購買 ${equipment.icon} ${equipment.name}。`,
              rewards: [`金錢 -${equipment.buyPrice}`],
            })
          } else if (!result.ok) {
            gameStore.showActionResult({ title: '購買失敗', message: result.reason, rewards: [] })
          }
        }}
        onSellEquipment={(instanceId) => gameStore.sellEquipment(gameState.activePlayerId, instanceId)}
        onClose={onCloseShop}
      />
      <MartialHallModal
        base={martialHallBase}
        player={activePlayer}
        onLearn={(skillType, skillId) => {
          const result = gameStore.learnSkillAtMartialHall(gameState.activePlayerId, martialHallBase?.id ?? '', skillType, skillId)
          if (!result.ok) gameStore.showActionResult({ title: '學習失敗', message: result.reason, rewards: [] })
        }}
        onClose={onCloseMartialHall}
      />
      <PolicySwitchModal
        base={policySwitchBase}
        availablePolicies={activePlayer ? getAvailablePolicyIds(activePlayer) : ['basic']}
        currentRound={gameState.round}
        onSwitch={(policyId) => {
          if (policySwitchBase) {
            const result = gameStore.switchBasePolicy(gameState.activePlayerId, policySwitchBase.id, policyId)
            if (!result.ok) gameStore.showActionResult({ title: '政策切換失敗', message: result.reason, rewards: [] })
          }
        }}
        onClose={onClosePolicySwitch}
      />
      <SharedWarehouseModal
        gameState={gameState}
        player={activePlayer}
        open={warehouseBase !== null}
        onDeposit={(itemId, quantity) => {
          const result = gameStore.depositToSharedWarehouse(gameState.activePlayerId, itemId, quantity)
          if (!result.ok) gameStore.showActionResult({ title: '存入失敗', message: result.reason, rewards: [] })
        }}
        onWithdraw={(itemId, quantity) => {
          const result = gameStore.withdrawFromSharedWarehouse(gameState.activePlayerId, itemId, quantity)
          if (!result.ok) gameStore.showActionResult({ title: '取出失敗', message: result.reason, rewards: [] })
        }}
        onDepositEquipment={(instanceId) => {
          const result = gameStore.depositEquipmentToSharedWarehouse(gameState.activePlayerId, instanceId)
          if (!result.ok) gameStore.showActionResult({ title: '存入失敗', message: result.reason, rewards: [] })
        }}
        onWithdrawEquipment={(instanceId) => {
          const result = gameStore.withdrawEquipmentFromSharedWarehouse(gameState.activePlayerId, instanceId)
          if (!result.ok) gameStore.showActionResult({ title: '取出失敗', message: result.reason, rewards: [] })
        }}
        onClose={onCloseWarehouse}
      />
      <TransportModal
        player={activePlayer}
        open={transportBase !== null}
        title={transportBase ? `${transportBase.name} · 驛站傳送` : '驛站傳送'}
        isSmallWaystation={false}
        targets={getTransportTargets(gameState, transportBase ? { kind: 'base', baseId: transportBase.id } : null)}
        onTransport={(targetId) => {
          const result = gameStore.transportPlayer(gameState.activePlayerId, targetId)
          if (result.ok) onCloseTransport()
          else gameStore.showActionResult({ title: '傳送失敗', message: result.reason, rewards: [] })
        }}
        onClose={onCloseTransport}
      />
      <RegionalManagementModal
        player={activePlayer}
        bases={gameState.bases}
        open={regionalManagementBase !== null}
        currentRound={gameState.round}
        onSwitchPolicy={(targetBaseId, policyId) => {
          const result = gameStore.switchRemoteBasePolicy(gameState.activePlayerId, targetBaseId, policyId)
          if (!result.ok) gameStore.showActionResult({ title: '政策切換失敗', message: result.reason, rewards: [] })
        }}
        onTransferMaterials={(sourceBaseId, targetBaseId, amount) => {
          const sourceName = gameState.bases.find((b) => b.id === sourceBaseId)?.name ?? '來源據點'
          const targetName = gameState.bases.find((b) => b.id === targetBaseId)?.name ?? '目標據點'
          const result = gameStore.transferBaseMaterials(gameState.activePlayerId, sourceBaseId, targetBaseId, amount)
          if (result.ok) {
            gameStore.showActionResult({
              title: '建料調度完成',
              message: `已從「${sourceName}」調度 ${amount} 建料到「${targetName}」。`,
              rewards: [
                `實際送達 ${result.data.deliveredAmount} 建料`,
                `調度損耗 ${result.data.loss} 建料`,
              ],
            })
          } else {
            gameStore.showActionResult({
              title: '調度失敗',
              message: result.reason ?? '無法調度建料。',
              rewards: [],
            })
          }
        }}
        onClose={onCloseRegionalManagement}
      />
      <DefenseStructureBuildModal
        base={defenseBase}
        player={activePlayer}
        open={defenseBase !== null}
        structureType={gameState.operation.type === 'building-defense' ? gameState.operation.structureType : 'barricade'}
        position={gameState.operation.type === 'building-defense' ? gameState.operation.position : null}
        onSelectStructure={(structureType) => {
          if (gameState.operation.type === 'building-defense') {
            gameStore.setOperation({ ...gameState.operation, structureType, position: null })
          }
        }}
        onBeginPositionSelection={onBeginDefensePositionSelection}
        onConfirm={() => {
          const operation = gameState.operation
          if (operation.type !== 'building-defense' || !operation.position || !defenseBase) {
            return false
          }
          const result = gameStore.constructDefenseStructure(
            gameState.activePlayerId,
            defenseBase.id,
            operation.structureType,
            operation.position,
          )
          if (result.ok) {
            onCloseDefense()
            const definition = defenseStructureCatalog.find(
              (candidate) => candidate.type === operation.structureType,
            )
            if (definition) {
              const beforePrestige = gameState.players.find((player) => player.id === gameState.activePlayerId)?.prestige ?? 0
              const actionResult = formatDefenseStructureBuildResult(definition, operation.position)
              gameStore.showActionResult({
                ...actionResult,
                rewards: withRankUpReward(beforePrestige, actionResult.rewards),
              })
            }
          } else {
            gameStore.showActionResult({ title: '建造失敗', message: result.reason, rewards: [] })
          }
          return result.ok
        }}
        onCancel={onCloseDefense}
      />
      <ResourceCollectionModal
        player={activePlayer}
        resourcePoint={collectionResourcePoint}
        base={collectionBase}
        gameState={gameState}
        onCancel={onCloseCollection}
        onConfirmBatch={() => {
          const resourcePointName = collectionResourcePoint?.name ?? '資源點'
          const result = gameStore.collectResourcePointBatch(gameState.activePlayerId, collectionResourcePoint?.id ?? '')
          onCloseCollection()
          if (result.ok) {
            const beforePrestige = gameState.players.find((player) => player.id === gameState.activePlayerId)?.prestige ?? 0
            const data = result.data
            gameStore.showActionResult({
              title: '批次採集完成',
              message: `已將可用體力投入「${resourcePointName}」，共採集 ${data.count} 次。`,
              rewards: withRankUpReward(beforePrestige, [
                `建料 +${data.materialGain}`,
                `聲望 +${data.prestige}`,
              ]),
            })
          }
          else gameStore.showActionResult({ title: '批次採集失敗', message: result.reason, rewards: [] })
        }}
        onConfirm={() => {
          const resourcePointName = collectionResourcePoint?.name ?? '資源點'
          const materialIncome = collectionResourcePoint && collectionBase
            ? getEffectiveMaterialGain(collectionBase, getResourceCollectionMaterialGain(collectionBase, collectionResourcePoint.materialIncome), gameState)
            : 0
          const baseName = collectionBase?.name ?? '所屬據點'
          const result = gameStore.collectResourcePoint(gameState.activePlayerId, collectionResourcePoint?.id ?? '')
          onCloseCollection()
          if (result.ok) {
            const beforePrestige = gameState.players.find((player) => player.id === gameState.activePlayerId)?.prestige ?? 0
            const actionResult = formatResourceCollectionResult(resourcePointName, baseName, materialIncome)
            gameStore.showActionResult({
              ...actionResult,
              rewards: withRankUpReward(beforePrestige, actionResult.rewards),
            })
          } else {
            gameStore.showActionResult({ title: '採集失敗', message: result.reason, rewards: [] })
          }
        }}
      />
      <MissionRewardModal
        player={activePlayer}
        base={missionBase}
        onCancel={onCloseMission}
        onConfirmBatch={() => {
          const baseName = missionBase?.name ?? '據點'
          const result = gameStore.executeMissionBatch(gameState.activePlayerId, missionBase?.id ?? '')
          onCloseMission()
          if (result.ok) {
            const beforePrestige = gameState.players.find((player) => player.id === gameState.activePlayerId)?.prestige ?? 0
            const data = result.data
            gameStore.showActionResult({
              title: '批次任務完成',
              message: `已將可用體力投入「${baseName}」的告示牌任務，共完成 ${data.count} 次。`,
              rewards: withRankUpReward(beforePrestige, [
                `金錢 +${data.money}`,
                `聲望 +${data.prestige}`,
              ]),
            })
          }
          else gameStore.showActionResult({ title: '批次任務失敗', message: result.reason, rewards: [] })
        }}
        onConfirm={() => {
          const baseName = missionBase?.name ?? '據點'
          const boardLevel = missionBase?.buildings.find((building) => building.type === BUILDING_TYPES.BOARD)?.level ?? 1
          const result = gameStore.executeMission(gameState.activePlayerId, missionBase?.id ?? '')
          onCloseMission()
          if (result.ok) {
            const beforePrestige = gameState.players.find((player) => player.id === gameState.activePlayerId)?.prestige ?? 0
            const actionResult = formatMissionResult(baseName, boardLevel)
            gameStore.showActionResult({
              ...actionResult,
              rewards: withRankUpReward(beforePrestige, actionResult.rewards),
            })
          } else {
            gameStore.showActionResult({ title: '任務失敗', message: result.reason, rewards: [] })
          }
        }}
      />
    </>
  )
}

export default BaseOverlays
