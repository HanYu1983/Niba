import InventoryModal from '../InventoryModal'
import EquipmentModal from '../EquipmentModal'
import UnifiedSkillModal from '../UnifiedSkillModal'
import { gameStore } from '../../game/gameStore'
import {
  formatItemUseResult,
} from '../../game/actionResultFormatters'
import { itemCatalog } from '../../game/catalogs/itemCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../../game/catalogs/martialHallSkillCatalog'
import type { GameState, PlayerState } from '../../game/types'

type PlayerOverlaysProps = {
  gameState: GameState
  inventoryPlayer: PlayerState | null
  equipmentPlayer: PlayerState | null
  skillPlayerId: string | null
  onCloseInventory: () => void
  onCloseEquipment: () => void
  onCloseSkill: () => void
}

/**
 * 玩家自身 overlay 群組：
 * - 背包
 * - 裝備
 * - 技能
 */
function PlayerOverlays({
  gameState,
  inventoryPlayer,
  equipmentPlayer,
  skillPlayerId,
  onCloseInventory,
  onCloseEquipment,
  onCloseSkill,
}: PlayerOverlaysProps) {
  return (
    <>
      <InventoryModal
        player={inventoryPlayer}
        isActive={inventoryPlayer?.id === gameState.activePlayerId && !inventoryPlayer.turnEnded}
        items={itemCatalog}
        onUseItem={(itemId) => {
          if (!inventoryPlayer) {
            return
          }

          const item = itemCatalog.find((currentItem) => currentItem.id === itemId)
          const result = gameStore.useItem(inventoryPlayer.id, itemId)
          // 元素爆發道具需選格；關閉背包讓地圖可點擊，但保留 targeting operation。
          if (item?.effect === 'element-burst' && result.ok) {
            onCloseInventory()
            return
          }
          onCloseInventory()
          if (item && result.ok) {
            gameStore.showActionResult(formatItemUseResult(item))
          } else if (!result.ok) {
            gameStore.showActionResult({ title: '使用失敗', message: result.reason, rewards: [] })
          }
        }}
        onClose={onCloseInventory}
      />
      <EquipmentModal
        player={equipmentPlayer}
        isActive={equipmentPlayer?.id === gameState.activePlayerId && Boolean(equipmentPlayer && !equipmentPlayer.turnEnded)}
        onEquip={(equipmentId) => gameStore.equipEquipment(gameState.activePlayerId, equipmentId)}
        onUnequip={(slot) => gameStore.unequipEquipment(gameState.activePlayerId, slot)}
        onClose={onCloseEquipment}
      />
      <UnifiedSkillModal
        player={gameState.players.find((player) => player.id === skillPlayerId) ?? null}
        innerSkills={allInnerSkillCatalog}
        externalSkills={allExternalSkillCatalog}
        mapCells={gameState.map.cells}
        creatures={gameState.creatures}
        onEquipInnerSkill={(skillId) => gameStore.equipInnerSkill(gameState.activePlayerId, skillId)}
        onToggleExternalSkill={(skillId) => gameStore.toggleExternalSkill(gameState.activePlayerId, skillId)}
        onClose={onCloseSkill}
      />
    </>
  )
}

export default PlayerOverlays
