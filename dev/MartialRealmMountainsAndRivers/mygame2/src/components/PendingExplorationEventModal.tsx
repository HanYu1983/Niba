import { Flex, Modal, Typography } from 'antd'
import { type ExplorationEventState, type ExplorationEventChoice, type ExplorationEventType, type PlayerState, type GameState } from '../game/types'
import { getExplorationEventDefinition } from '../game/events/eventCatalog'
import { type EventRequirement } from '../game/events/eventCatalog'
import OptionCard from './OptionCard'
import HighlightText from './HighlightText'

type PendingExplorationEventModalProps = {
  event: ExplorationEventState | null
  /** 觸發此事件的目標玩家（用於檢查選項條件，例如金錢是否足夠）。 */
  player: PlayerState | null
  gameState: GameState
  onChoose: (choiceId: ExplorationEventChoice['id']) => void
  onClose: () => void
}

/**
 * 檢查玩家是否滿足選項條件（僅檢查與金錢、物品等相關的需求，不含位置條件）。
 * 回合結束觸發的事件不佔地圖格，故跳過 `adjacent-to-event`。
 */
function checkChoiceAffordability(player: PlayerState, gameState: GameState, requirements: EventRequirement[]): { allowed: boolean; reason?: string } {
  for (const requirement of requirements) {
    if (requirement.type === 'money-at-least' && player.money < requirement.amount) {
      return { allowed: false, reason: `需要 ${requirement.amount} 金錢` }
    }
    if (requirement.type === 'item-owned') {
      const quantity = player.inventory.find((entry) => entry.itemId === requirement.itemId)?.quantity ?? 0
      if (quantity < requirement.quantity) {
        return { allowed: false, reason: '缺少所需物品' }
      }
    }
    if (requirement.type === 'building-exists') {
      const hasBuilding = gameState.bases.some((base) => base.buildings.some((building) => building.type === requirement.buildingType))
      if (!hasBuilding) return { allowed: false, reason: '缺少所需建築' }
    }
  }
  return { allowed: true }
}

/**
 * 「輪到該玩家」的回合開始隨機觸發的探索事件 Modal。
 * 事件不佔用地圖格子，因此不顯示位置、不需移動到特定格。
 * 選擇後直接套用事件效果，不結束玩家回合（事件在回合開始出現，玩家之後仍可行動）。
 */
function PendingExplorationEventModal({ event, player, gameState, onChoose, onClose }: PendingExplorationEventModalProps) {
  const definition = event ? getExplorationEventDefinition(event.type as ExplorationEventType) : undefined

  return (
    <Modal
      title="偶遇事件"
      open={event !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {event && (
        <Flex vertical gap={12}>
          <Flex align="center" gap={8}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {definition?.icon ?? '🧭'} {event.name}
            </Typography.Title>
          </Flex>
          <Typography.Paragraph style={{ margin: 0 }}>
            <HighlightText>{event.description}</HighlightText>
          </Typography.Paragraph>
          {player && (
            <Typography.Text type="secondary">目前金錢：<strong>{player.money}</strong></Typography.Text>
          )}
          <Flex vertical gap={8}>
            {(definition?.choices ?? [])
              // 條件未達成的選項直接隱藏，不顯示。
              .filter((choice) => {
                if (!player) return true
                const requirements = choice.requirements.filter((requirement) => requirement.type !== 'adjacent-to-event')
                return checkChoiceAffordability(player, gameState, requirements).allowed
              })
              .map((choice) => (
                <OptionCard
                  key={choice.id}
                  title={choice.label}
                  description={choice.description}
                  actionLabel="選擇"
                  onAction={() => onChoose(choice.id)}
                />
              ))}
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default PendingExplorationEventModal
