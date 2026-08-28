import { Flex, Modal, Tag, Typography } from 'antd'
import { type ExplorationEventState, type PlayerState, type ExplorationEventChoice, type GameState } from '../game/types'
import { type EventRequirement } from '../game/events/eventCatalog'
import { getEventChoices } from '../game/events/eventResolver'
import OptionCard from './OptionCard'
import HighlightText from './HighlightText'

type ExplorationEventDetailsModalProps = {
  event: ExplorationEventState | null
  player: PlayerState | null
  gameState: GameState
  choices: ExplorationEventChoice[]
  onChoose: (choiceId: ExplorationEventChoice['id']) => void
  onClose: () => void
}

/**
 * 檢查玩家是否滿足選項條件（金錢、物品、建築等，不含位置條件）。
 * 位置條件由事件所在格互動狀態另外判斷。
 */
function checkChoiceAffordability(player: PlayerState, gameState: GameState, requirements: EventRequirement[]): boolean {
  for (const requirement of requirements) {
    if (requirement.type === 'money-at-least' && player.money < requirement.amount) {
      return false
    }
    if (requirement.type === 'item-owned') {
      const quantity = player.inventory.find((entry) => entry.itemId === requirement.itemId)?.quantity ?? 0
      if (quantity < requirement.quantity) return false
    }
    if (requirement.type === 'building-exists') {
      const hasBuilding = gameState.bases.some((base) => base.buildings.some((building) => building.type === requirement.buildingType))
      if (!hasBuilding) return false
    }
  }
  return true
}

function ExplorationEventDetailsModal({ event, player, gameState, choices, onChoose, onClose }: ExplorationEventDetailsModalProps) {
  const adjacent = Boolean(event && player && player.position.row === event.position.row && player.position.column === event.position.column)
  const actionable = Boolean(player && !player.turnEnded && player.health > 0 && adjacent)

  // 依事件定義過濾條件未達成的選項（該選項直接隱藏）。
  const availableChoices = event && player
    ? choices.filter((choice) => {
      const requirements = getEventChoices(event).find((c) => c.id === choice.id)?.requirements ?? []
      const nonPositionRequirements = requirements.filter((requirement) => requirement.type !== 'adjacent-to-event')
      return checkChoiceAffordability(player, gameState, nonPositionRequirements)
    })
    : choices

  return (
    <Modal
      title={event ? `${event.name} · 探索事件` : '探索事件'}
      open={event !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {event && (
        <Flex vertical gap={12}>
          <Flex align="center" gap={8}>
            <Typography.Title level={4} style={{ margin: 0 }}>🧭 {event.name}</Typography.Title>
            <Tag color={event.status === 'available' ? 'green' : 'default'}>{event.status === 'available' ? '可互動' : '已完成'}</Tag>
          </Flex>
          <Typography.Paragraph style={{ margin: 0 }}><HighlightText>{event.description}</HighlightText></Typography.Paragraph>
          <Typography.Text type="secondary">
            位置：({event.position.row}, {event.position.column})
          </Typography.Text>
          {!adjacent && <Typography.Text type="warning">玩家需移動到事件點所在格才能互動。</Typography.Text>}
          {event.status === 'resolved' && <Typography.Text type="secondary">此事件已完成，不能重複領取。</Typography.Text>}
          <Flex vertical gap={8}>
            {availableChoices.map((choice) => (
              <OptionCard
                key={choice.id}
                title={choice.label}
                description={`${choice.description}${choice.endsPlayerTurn ? '（結束回合）' : '（不結束回合）'}`}
                actionLabel="選擇"
                disabled={!actionable || event.status !== 'available'}
                onAction={() => onChoose(choice.id)}
              />
            ))}
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default ExplorationEventDetailsModal
