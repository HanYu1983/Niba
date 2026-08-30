import { Button, Modal } from 'antd'
import { type CreatureNestState, type PlayerState, isAdjacent } from '../game/types'
import { getCreatureBehaviorName, getCreatureSchoolId } from '../game/rules/creatureBehaviorRules'
import { martialSchoolCatalog } from '../game/catalogs/martialSchoolCatalog'
import { getSchoolElement } from '../game/catalogs/skillProgressionCatalog'
import { getElementName } from '../game/rules/skillRules'
import LocationDetailsCard from './LocationDetailsCard'
import StatValue from './StatValue'

type CreatureNestDetailsModalProps = {
  nest: CreatureNestState | null
  currentPlayer: PlayerState | null
  onAttack: (nestId: string) => void
  onClose: () => void
}

function CreatureNestDetailsModal({ nest, currentPlayer, onAttack, onClose }: CreatureNestDetailsModalProps) {
  const behaviorName = nest ? getCreatureBehaviorName(nest) : null
  const schoolId = nest ? getCreatureSchoolId(nest) : 'frost-water'
  const schoolName = martialSchoolCatalog.find((school) => school.id === schoolId)?.name ?? schoolId
  const elementName = getElementName(getSchoolElement(schoolId))
  const canAttack = Boolean(
    nest &&
    currentPlayer &&
    currentPlayer.health > 0 &&
    !currentPlayer.turnEnded &&
    isAdjacent(currentPlayer.position, nest.position),
  )
  return (
    <Modal
      title={nest ? `${nest.name} · 詳細資料` : '巢穴詳細資料'}
      open={nest !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {nest && (
        <LocationDetailsCard
          icon="🕳️"
          name={nest.name}
          position={`位置 (${nest.position.row}, ${nest.position.column})`}
          statusLabel={nest.health === 0 ? '已摧毀' : '生成中'}
          statusColor={nest.health === 0 ? 'red' : 'purple'}
          health={nest.health}
          maxHealth={nest.maxHealth}
          healthLabel="巢穴生命"
        >
          <StatValue label="生成機率">{(nest.spawnChance * 100).toFixed(1)}%（每回合 +0.5%，上限 30%）</StatValue>
          <StatValue label="冷卻回合">{nest.cooldownRounds > 0 ? `剩餘 ${nest.cooldownRounds} 回合` : '可生成'}</StatValue>
          <StatValue label="目前生成等級">Lv.{nest.spawnLevel}</StatValue>
          <StatValue label="每回合回復">最大生命 2%</StatValue>
          <StatValue label="生成行為">{behaviorName}</StatValue>
          <StatValue label="功法流派">{schoolName}</StatValue>
          <StatValue label="五行屬性">{elementName}</StatValue>
          <Button
            type="primary"
            danger
            block
            disabled={!canAttack}
            onClick={() => {
              onClose()
              onAttack(nest.id)
            }}
          >
            ⚔️ 攻擊巢穴
          </Button>
        </LocationDetailsCard>
      )}
    </Modal>
  )
}

export default CreatureNestDetailsModal