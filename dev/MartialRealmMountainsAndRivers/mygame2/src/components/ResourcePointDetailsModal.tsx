import { Button, Modal, Typography } from 'antd'
import { type ResourcePointState, type BaseState, type PlayerState, type GameState, isSameOrAdjacent } from '../game/types'
import LocationDetailsCard from './LocationDetailsCard'
import StatValue from './StatValue'
import { getResourceCollectionMaterialGain } from '../game/rules/baseRules'
import { getEffectiveMaterialGain } from '../game/rules/policyRules'

type ResourcePointDetailsModalProps = {
  resourcePoint: ResourcePointState | null
  ownerBase: BaseState | null
  currentPlayer: PlayerState | null
  gameState: GameState
  round: number
  onOpenCollection: (resourcePointId: string) => void
  onRepair: (resourcePointId: string) => void
  onClose: () => void
}

function ResourcePointDetailsModal({
  resourcePoint,
  ownerBase,
  currentPlayer,
  gameState,
  onOpenCollection,
  onRepair,
  onClose,
}: ResourcePointDetailsModalProps) {
  const isInCollectionRange = Boolean(
    resourcePoint && currentPlayer && isSameOrAdjacent(currentPlayer.position, resourcePoint.position),
  )
  const alreadyCollected = false
  const effectiveGain = resourcePoint && ownerBase
    ? getEffectiveMaterialGain(ownerBase, getResourceCollectionMaterialGain(ownerBase, resourcePoint.materialIncome), gameState)
    : null
  const canCollect = Boolean(
    resourcePoint?.active !== false &&
    isInCollectionRange &&
    currentPlayer &&
    !currentPlayer.turnEnded &&
    !alreadyCollected,
  )

  return (
    <Modal
      title={resourcePoint ? `${resourcePoint.name} · 詳細資料` : '資源點詳細資料'}
      open={resourcePoint !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {resourcePoint && (
        <LocationDetailsCard
          icon="💎"
          name={resourcePoint.name}
          position={`位置 (${resourcePoint.position.row + 1}, ${resourcePoint.position.column + 1})`}
          statusLabel={resourcePoint.active === false ? '已失活' : alreadyCollected ? '本回合已採集' : '可採集'}
          statusColor={resourcePoint.active === false ? 'red' : alreadyCollected ? 'default' : 'cyan'}
          health={resourcePoint.health}
          maxHealth={resourcePoint.maxHealth}
        >
          <StatValue label="每次產出建料">
            {effectiveGain !== null ? `${effectiveGain}（基礎 ${resourcePoint.materialIncome}）` : resourcePoint.materialIncome}
          </StatValue>
          <StatValue label="所屬據點">{ownerBase?.name ?? '未分配'}</StatValue>

          {resourcePoint.active === false ? (
            <>
              <Typography.Text type="warning">資源點已被破壞，修復需要體力 10 點。</Typography.Text>
              <Button
                block
                type="primary"
                disabled={!isInCollectionRange || !currentPlayer || currentPlayer.stamina < 10 || currentPlayer.turnEnded}
                onClick={() => onRepair(resourcePoint.id)}
              >
                🔧 修復資源點（體力 -10）
              </Button>
            </>
          ) : null}

          {resourcePoint.active !== false && isInCollectionRange ? (
            <Button
              block
              type="primary"
              disabled={!canCollect}
              onClick={() => onOpenCollection(resourcePoint.id)}
            >
              ⛏️ 採集
            </Button>
          ) : (
            <Typography.Text type="secondary">
              玩家位於資源點自身格或周圍一格時，才能採集。
            </Typography.Text>
          )}

          {currentPlayer?.turnEnded && isInCollectionRange && !alreadyCollected && (
            <Typography.Text type="warning">本回合已結束，無法採集。</Typography.Text>
          )}
        </LocationDetailsCard>
      )}
    </Modal>
  )
}

export default ResourcePointDetailsModal
