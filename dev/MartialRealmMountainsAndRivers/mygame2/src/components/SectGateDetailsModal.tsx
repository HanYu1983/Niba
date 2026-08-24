import { Button, Flex, Modal, Tag, Typography } from 'antd'
import type { PlayerState, SectGateState } from '../game/types'
import { martialSchoolCatalog } from '../game/catalogs/martialSchoolCatalog'
import { equipmentCatalog } from '../game/catalogs/equipmentCatalog'
import { getSectGateSkills, getSectGateLearnCost, SECT_GATE_PRACTICE_STAMINA_COST } from '../game/rules/sectGateRules'
import SkillCard from './SkillCard'
import StatValue from './StatValue'
import { EQUIPMENT_SLOT_LABELS, formatEquipmentModifiers } from '../game/equipmentViewData'

type SectGateDetailsModalProps = {
  gate: SectGateState | null
  player: PlayerState | null
  onLearn: (skillId: string) => void
  onPractice: (skillId: string) => void
  onBuyEquipment: (equipmentId: string) => void
  onClose: () => void
}

const schoolIcon = (schoolId: string) =>
  schoolId === 'golden-body' ? '🥋' : schoolId === 'swift-wind' ? '💨' : schoolId === 'scarlet-flame' ? '🔥' : schoolId === 'frost-water' ? '❄️' : schoolId === 'earth-mountain' ? '⛰️' : schoolId === 'hundred-poison' ? '🐍' : '☯'

function SectGateDetailsModal({ gate, player, onLearn, onPractice, onBuyEquipment, onClose }: SectGateDetailsModalProps) {
  const schoolName = gate ? martialSchoolCatalog.find((school) => school.id === gate.schoolId)?.name ?? '未知流派' : ''
  const { inner, damage, aura } = gate
    ? getSectGateSkills(gate.schoolId)
    : { inner: null, damage: null, aura: null }
  const skills = [inner, damage, aura].filter((skill) => skill !== null)
  const sectEquipment = gate
    ? equipmentCatalog.filter((equipment) => equipment.schoolId === gate.schoolId && equipment.sectGateLevel !== undefined)
    : []

  return (
    <Modal title={gate ? `${schoolIcon(gate.schoolId)} ${schoolName} · 門派據點` : '門派據點'} open={gate !== null} onCancel={onClose} footer={<Button onClick={onClose}>關閉</Button>} destroyOnHidden>
      {gate && player && (
        <Flex vertical gap={12}>
          <Typography.Text type="secondary">
            門派據點是中立設施，可在此學習或練習該門派功法。
          </Typography.Text>
          <Flex wrap gap={8} align="center">
            <Tag color="gold">金錢 {player.money}</Tag>
            <Tag color="blue">體力 {Math.floor(player.stamina)}</Tag>
            <Tag color="purple">門派 Lv.{gate.level}</Tag>
            <Tag color="cyan">門派經驗 {gate.experience} / {gate.level >= 3 ? '已滿' : gate.level === 2 ? '250' : '100'}</Tag>
          </Flex>
          <Flex vertical gap={8}>
            {skills.map((skill) => {
              if (!skill) return null
              const isInner = !!inner && skill.id === inner.id
              const learned = isInner
                ? player.innerSkillIds.includes(skill.id)
                : player.externalSkillIds.includes(skill.id)
              const cost = getSectGateLearnCost(gate.schoolId, skill.id)
              const disabled = false
              return (
                <SkillCard
                  key={skill.id}
                  icon={isInner ? '☯' : (skill as { category?: string }).category === 'aura' ? '✦' : '⚡'}
                  label={isInner ? '內功' : (skill as { category?: string }).category === 'aura' ? '靈氣外功' : '外功'}
                  name={skill.name}
                  description={skill.description}
                   element={skill.element}
                  status={learned ? '已學會' : undefined}
                  meta={
                    <>
                      <StatValue label={isInner ? '悟性需求' : '容量'}>
                        {(() => {
                          const s = skill as { insightRequirement?: number; insightCost?: number }
                          return isInner ? s.insightRequirement ?? 0 : s.insightCost ?? 0
                        })()}
                      </StatValue>
                      <StatValue label="學習費用">{cost} 金錢</StatValue>
                    </>
                  }
                >
                  {learned ? (
                    <Button
                      type="default"
                      disabled={disabled || player.stamina < SECT_GATE_PRACTICE_STAMINA_COST}
                      onClick={() => onPractice(skill.id)}
                    >
                      練習（{SECT_GATE_PRACTICE_STAMINA_COST} 體力）
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      disabled={disabled || player.money < cost}
                      onClick={() => onLearn(skill.id)}
                    >
                      學習（{cost} 金錢）
                    </Button>
                  )}
                </SkillCard>
              )
            })}
          </Flex>
          <Typography.Title level={5} style={{ margin: '8px 0 0' }}>門派專屬裝備</Typography.Title>
          <Flex vertical gap={8}>
            {sectEquipment.map((equipment) => {
              const unlocked = gate.level >= (equipment.sectGateLevel ?? 1)
              return (
                <Flex key={equipment.id} justify="space-between" align="center" gap={8} wrap>
                  <Flex vertical gap={2} style={{ flex: 1, minWidth: 220 }}>
                    <Typography.Text strong>
                      {equipment.icon} {equipment.name}（{EQUIPMENT_SLOT_LABELS[equipment.slot]}）
                    </Typography.Text>
                    <Typography.Text type="secondary">{equipment.description}</Typography.Text>
                    <Typography.Text type="success">屬性：{formatEquipmentModifiers(equipment.modifiers)}</Typography.Text>
                    <Typography.Text type="secondary">耐久：{equipment.maxDurability}</Typography.Text>
                  </Flex>
                  <Button
                    type={unlocked ? 'primary' : 'default'}
                    disabled={!unlocked || player.money < equipment.buyPrice}
                    onClick={() => onBuyEquipment(equipment.id)}
                  >
                    {unlocked ? `購買（${equipment.buyPrice} 金）` : `需門派 Lv.${equipment.sectGateLevel}`}
                  </Button>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default SectGateDetailsModal