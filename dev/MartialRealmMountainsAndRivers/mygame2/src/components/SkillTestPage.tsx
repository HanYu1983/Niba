import { Card, Col, Divider, Flex, InputNumber, Row, Select, Space, Statistic, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import type { InnerSkill } from '../game/catalogs/innerSkillCatalog'
import { allExternalSkillCatalog, allInnerSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import type { PlayerAttributes } from '../game/types'

const ATTRIBUTE_LABELS: Record<keyof PlayerAttributes, string> = {
  armStrength: '臂力',
  constitution: '根骨',
  agility: '身法',
  innerEnergy: '內息',
  insight: '悟性',
}

const ATTRIBUTE_KEYS = Object.keys(ATTRIBUTE_LABELS) as Array<keyof PlayerAttributes>
type SkillMode = 'inner' | 'external'
type Skill = InnerSkill | ExternalSkill

function isExternalSkill(skill: Skill): skill is ExternalSkill {
  return 'innerPowerCost' in skill
}

function SkillTestPage({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<SkillMode>('external')
  const [schoolId, setSchoolId] = useState<string>('all')
  const [level, setLevel] = useState<number>(0)
  const [attributes, setAttributes] = useState<PlayerAttributes>({
    armStrength: 7,
    constitution: 7,
    agility: 7,
    innerEnergy: 7,
    insight: 7,
  })

  const skills = mode === 'inner' ? allInnerSkillCatalog : allExternalSkillCatalog
  const schools = useMemo(() => [...new Map(skills.filter((skill) => skill.schoolId).map((skill) => [skill.schoolId, skill.school])).entries()], [skills])
  const filteredSkills = skills.filter((skill) => {
    const matchesSchool = schoolId === 'all' || skill.schoolId === schoolId
    return matchesSchool
  })

  const updateAttribute = (key: keyof PlayerAttributes, value: number | null) => {
    setAttributes((current) => ({ ...current, [key]: Math.max(0, value ?? current[key]) }))
  }

  return (
    <main className="skill-test-page">
      <Card className="skill-test-page__card" bordered={false}>
        <Flex justify="space-between" align="flex-start" gap={16} wrap>
          <div>
            <Typography.Text className="start-screen__eyebrow">COMBAT LAB · SKILL TEST</Typography.Text>
            <Typography.Title level={2}>功法測試頁</Typography.Title>
            <Typography.Paragraph type="secondary">
              調整角色屬性，檢查內功與外功的傷害公式、悟性需求和內力消耗。這裡只讀取目錄資料，不會改變正式遊戲狀態。
            </Typography.Paragraph>
          </div>
          <button className="skill-test-page__back" type="button" onClick={onBack}>返回開始畫面</button>
        </Flex>

        <Divider>測試參數</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Typography.Text strong>功法類型</Typography.Text>
            <Select
              className="skill-test-page__control"
              value={mode}
              options={[{ value: 'external', label: '外功' }, { value: 'inner', label: '內功' }]}
              onChange={(value: SkillMode) => { setMode(value); setSchoolId('all') }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Typography.Text strong>門派</Typography.Text>
            <Select
              className="skill-test-page__control"
              value={schoolId}
              options={[{ value: 'all', label: '全部門派' }, ...schools.map(([value, label]) => ({ value, label }))]}
              onChange={setSchoolId}
            />
          </Col>
          <Col xs={24} md={8}>
            <Typography.Text strong>功法等級</Typography.Text>
            <Select
              className="skill-test-page__control"
              value={level}
              options={[{ value: 0, label: '全部等級' }, ...[1, 2, 3, 4, 5, 6].map((value) => ({ value, label: `第 ${value} 重` }))]}
              onChange={setLevel}
            />
          </Col>
        </Row>

        <Divider>角色屬性</Divider>
        <Row gutter={[16, 16]}>
          {ATTRIBUTE_KEYS.map((key) => (
            <Col xs={12} sm={8} md={4} key={key}>
              <Typography.Text strong>{ATTRIBUTE_LABELS[key]}</Typography.Text>
              <InputNumber min={0} max={999} value={attributes[key]} onChange={(value) => updateAttribute(key, value)} />
            </Col>
          ))}
        </Row>

        <Divider>功法目錄（{filteredSkills.length}）</Divider>
        <Row gutter={[16, 16]}>
          {filteredSkills.map((skill) => {
            const damage = Math.max(1, Math.floor(skill.calculateDamage(attributes) * (level === 0 ? 1 : level)))
            const external = isExternalSkill(skill)
            return (
              <Col xs={24} md={12} xl={8} key={skill.id}>
                <Card className="skill-test-card" size="small" title={<Flex justify="space-between" gap={8}><span>{skill.name}</span><Tag color={external ? 'blue' : 'green'}>{external ? '外功' : '內功'}</Tag></Flex>}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Typography.Text type="secondary">{skill.description}</Typography.Text>
                    <Typography.Text>門派：{skill.school ?? '核心功法'} 等級：{level === 0 ? skill.level ?? 1 : level}</Typography.Text>
                    <Typography.Text>公式：{skill.formulaDescription}</Typography.Text>
                    <Row gutter={8}>
                      <Col span={12}><Statistic title="計算傷害" value={damage} /></Col>
                      <Col span={12}><Statistic title={external ? '內力消耗' : '悟性需求'} value={external ? skill.innerPowerCost : skill.insightRequirement} /></Col>
                    </Row>
                    {external && <Typography.Text type="secondary">學習悟性：{skill.insightCost} 武館等級：{skill.requiredHallLevel}</Typography.Text>}
                    {!external && <Typography.Text type="secondary">武館等級：{skill.requiredHallLevel}</Typography.Text>}
                  </Space>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Card>
    </main>
  )
}

export default SkillTestPage
