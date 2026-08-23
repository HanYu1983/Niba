import { Button, Flex, Modal, Tabs, Tag, Typography } from 'antd'
import type { BaseState, PlayerState } from '../game/types'
import { getBuildingLevel } from '../game/rules/buildingProgressionRules'
import { getMartialHallSkillCost } from '../game/actions/martialHallActions'
import { martialSchoolCatalog, type MartialSchoolId } from '../game/catalogs/martialSchoolCatalog'
import { getMartialHallSkills } from '../game/catalogs/martialHallSkillCatalog'
import SkillCard from './SkillCard'
import StatValue from './StatValue'

type MartialHallModalProps = {
  base: BaseState | null
  player: PlayerState | null
  onLearn: (skillType: 'inner' | 'external', skillId: string) => void
  onClose: () => void
}

function MartialHallModal({ base, player, onLearn, onClose }: MartialHallModalProps) {
  const halls = (base?.buildings ?? []).filter((building) => building.type === 'martial-hall')
  const schoolName = (schoolId?: string) =>
    schoolId ? martialSchoolCatalog.find((school) => school.id === schoolId)?.name ?? '未知流派' : '所有門派'
  const schoolIcon = (schoolId?: string) =>
    schoolId === 'golden-body' ? '🥋' : schoolId === 'swift-wind' ? '💨' : schoolId === 'scarlet-flame' ? '🔥' : schoolId === 'frost-water' ? '❄️' : schoolId === 'earth-mountain' ? '⛰️' : '☯'

  return (
    <Modal title={base ? `${base.name} · 武館` : '武館'} open={base !== null} onCancel={onClose} footer={<Button onClick={onClose}>關閉</Button>} destroyOnHidden>
      {base && player && (
        <Flex vertical gap={12}>
          <Flex wrap gap={8} align="center">
            <Tag color="gold">金錢 {player.money}</Tag>
          </Flex>
          <Typography.Text type="secondary">學習功法不消耗玩家回合；購買後立即加入功法列表。</Typography.Text>
          <Tabs
            items={halls.map((hall) => {
              const hallLevel = getBuildingLevel(hall)
              const schoolSkills = getMartialHallSkills(hall.schoolId as MartialSchoolId | undefined)
              return {
                key: hall.id,
                label: `${schoolIcon(hall.schoolId)} ${schoolName(hall.schoolId)} Lv.${hallLevel}`,
                children: (
                  <Tabs
                    items={[
                      {
                        key: 'inner',
                        label: '內功',
                        children: <Flex vertical gap={8}>
                          {schoolSkills.inner.map((skill) => {
                            const learned = player.innerSkillIds.includes(skill.id)
                            const unlocked = hallLevel >= skill.requiredHallLevel
                            const cost = getMartialHallSkillCost(skill.insightRequirement)
                            return (
                              <SkillCard
                                key={skill.id}
                                icon="☯"
                                label="內功"
                                element={skill.element}
                                name={skill.name}
                                description={skill.description}
                                status={learned ? '已學會' : undefined}
                                meta={
                                  <>
                                    <StatValue label="悟性需求">{skill.insightRequirement}</StatValue>
                                    <StatValue label="學習費用">{cost} 金錢</StatValue>
                                  </>
                                }
                              >
                                <Button
                                  type="primary"
                                  disabled={learned || !unlocked || player.money < cost}
                                  onClick={() => onLearn('inner', skill.id)}
                                >
                                  {learned ? '已學會' : unlocked ? `學習（${cost} 金錢）` : `需要武館 Lv.${skill.requiredHallLevel}`}
                                </Button>
                              </SkillCard>
                            )
                          })}
                        </Flex>,
                      },
                      {
                        key: 'external',
                        label: '外功',
                        children: <Flex vertical gap={8}>
                          {schoolSkills.external.map((skill) => {
                            const learned = player.externalSkillIds.includes(skill.id)
                            const unlocked = hallLevel >= skill.requiredHallLevel
                            const cost = getMartialHallSkillCost(skill.insightCost)
                            return (
                              <SkillCard
                                key={skill.id}
                                icon="⚡"
                                label="外功"
                                element={skill.element}
                                name={skill.name}
                                description={skill.description}
                                status={learned ? '已學會' : undefined}
                                meta={
                                  <>
                                    <StatValue label="容量">{skill.insightCost}</StatValue>
                                    <StatValue label="學習費用">{cost} 金錢</StatValue>
                                  </>
                                }
                              >
                                <Button
                                  type="primary"
                                  disabled={learned || !unlocked || player.money < cost}
                                  onClick={() => onLearn('external', skill.id)}
                                >
                                  {learned ? '已學會' : unlocked ? `學習（${cost} 金錢）` : `需要武館 Lv.${skill.requiredHallLevel}`}
                                </Button>
                              </SkillCard>
                            )
                          })}
                        </Flex>,
                      },
                    ]}
                  />
                ),
              }
            })}
          />
        </Flex>
      )}
    </Modal>
  )
}

export default MartialHallModal
