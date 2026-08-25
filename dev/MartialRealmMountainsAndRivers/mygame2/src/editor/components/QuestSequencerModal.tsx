import { useState } from 'react'
import { Button, Divider, Flex, Input, InputNumber, Modal, Select, Space, Switch, Tag, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ScenarioDefinition } from '../editorTypes'
import { BUILDING_OPTIONS } from '../editorOptions'
import { defenseStructureCatalog } from '../../game/catalogs/defenseStructureCatalog'

/** 防禦設施類型選項。 */
const DEFENSE_STRUCTURE_OPTIONS = defenseStructureCatalog.map((structure) => ({
    value: structure.type,
    label: structure.name,
}))

type QuestSequencerModalProps = {
    open: boolean
    scenario: ScenarioDefinition
    onClose: () => void
    onUpdateQuests: (quests: ScenarioDefinition['quests']) => void
    /** 更新關卡頂層設定（如 enableRandomEvents）。 */
    onUpdateScenario: (patch: Partial<ScenarioDefinition>) => void
}

/** 勝利目標類型選項。 */
const OBJECTIVE_TYPE_OPTIONS = [
    { value: 'defeat-creature', label: '擊敗指定怪物/首領' },
    { value: 'destroy-nest', label: '摧毀巢穴' },
    { value: 'build-building', label: '建造建築' },
    { value: 'reconstruct-ruin', label: '修復廢墟' },
    { value: 'learn-skill', label: '習得功法' },
    { value: 'reach-prestige', label: '累積聲望/官階' },
    { value: 'survive-rounds', label: '存活回合數' },
    { value: 'build-defense-structure', label: '建造防禦設施' },
    { value: 'reach-position', label: '到達指定位置' },
    { value: 'interact-object', label: '與物件互動' },
]

/**
 * 任務目標與勝敗條件編輯器（M3-1 + M3-2）。
 *
 * 支援：
 * - 新增/編輯/刪除勝利目標
 * - 目標類型下拉、目標數值、關聯物件 id、支線標記
 * - 失敗條件編輯（最大回合、據點/玩家存活、關鍵據點、允許損失據點數）
 */
function QuestSequencerModal({ open, scenario, onClose, onUpdateQuests, onUpdateScenario }: QuestSequencerModalProps) {
    const quests = scenario.quests
    const [objectiveType, setObjectiveType] = useState('defeat-creature')
    // 每個 interact-object 目標的暫存輸入文字（避免受控元件 value 固定為空導致無法輸入）。
    const [interactInputs, setInteractInputs] = useState<Record<string, string>>({})

    const updateObjective = (index: number, patch: Record<string, unknown>) => {
        onUpdateQuests({
            ...quests,
            victoryObjectives: quests.victoryObjectives.map((objective, i) =>
                i === index ? { ...objective, ...patch } : objective,
            ),
        })
    }

    const addObjective = () => {
        onUpdateQuests({
            ...quests,
            victoryObjectives: [
                ...quests.victoryObjectives,
                {
                    id: `objective-${Date.now().toString(36)}`,
                    title: '新目標',
                    type: objectiveType,
                    targetValue: 1,
                },
            ],
        })
    }

    const removeObjective = (index: number) => {
        onUpdateQuests({
            ...quests,
            victoryObjectives: quests.victoryObjectives.filter((_, i) => i !== index),
        })
    }

    const updateFailConditions = (patch: Record<string, unknown>) => {
        onUpdateQuests({
            ...quests,
            failConditions: { ...quests.failConditions, ...patch },
        })
    }

    return (
        <Modal
            title="任務與勝敗條件編排"
            open={open}
            onCancel={onClose}
            footer={null}
            width={640}
            destroyOnHidden
        >
            <Flex vertical gap={16}>
                <Flex vertical gap={16}>
                    <Typography.Text strong>關卡設定</Typography.Text>
                    <Flex justify="space-between" align="center">
                        <Typography.Text>探索點消失後補充新探索點</Typography.Text>
                        <Switch
                            size="small"
                            checked={Boolean(scenario.replenishExplorationEvents)}
                            onChange={(checked) => onUpdateScenario({ replenishExplorationEvents: checked })}
                        />
                        <Typography.Text>啟用回合結束隨機事件</Typography.Text>
                        <Switch
                            size="small"
                            checked={Boolean(scenario.enableRandomEvents)}
                            onChange={(checked) => onUpdateScenario({ enableRandomEvents: checked })}
                        />
                    </Flex>
                </Flex>

                <Divider style={{ margin: 0 }}>勝利目標</Divider>

                {quests.victoryObjectives.map((objective, index) => (
                    <Flex key={objective.id} vertical gap={8} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
                        <Flex gap={8} align="center">
                            <Input
                                size="small"
                                value={objective.title}
                                placeholder="目標名稱"
                                onChange={(e) => updateObjective(index, { title: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeObjective(index)}
                            />
                        </Flex>
                        <Flex gap={8} wrap>
                            <Select
                                size="small"
                                value={objective.type}
                                options={OBJECTIVE_TYPE_OPTIONS}
                                style={{ width: 200 }}
                                onChange={(value) => updateObjective(index, { type: value })}
                            />
                            <InputNumber
                                size="small"
                                min={1}
                                value={objective.targetValue}
                                placeholder="目標數值"
                                onChange={(value) => value && updateObjective(index, { targetValue: value })}
                            />
                            <Input
                                size="small"
                                value={objective.targetId ?? ''}
                                placeholder="關聯物件 ID（可選）"
                                onChange={(e) => updateObjective(index, { targetId: e.target.value || undefined })}
                                style={{ width: 180 }}
                            />
                            {objective.type === 'build-building' && (
                                <>
                                    <Select
                                        size="small"
                                        value={objective.buildingType}
                                        placeholder="選擇建築類型"
                                        options={BUILDING_OPTIONS}
                                        style={{ width: 160 }}
                                        onChange={(value) => updateObjective(index, { buildingType: value })}
                                    />
                                    <InputNumber
                                        size="small"
                                        min={1}
                                        max={6}
                                        value={objective.buildingLevel}
                                        placeholder="等級"
                                        onChange={(value) => updateObjective(index, { buildingLevel: value ?? undefined })}
                                        style={{ width: 80 }}
                                    />
                                </>
                            )}
                            {objective.type === 'build-defense-structure' && (
                                <Select
                                    size="small"
                                    value={objective.structureType}
                                    placeholder="選擇防禦設施"
                                    options={DEFENSE_STRUCTURE_OPTIONS}
                                    style={{ width: 160 }}
                                    onChange={(value) => updateObjective(index, { structureType: value })}
                                />
                            )}
                            {objective.type === 'reach-position' && (
                                <>
                                    <InputNumber
                                        size="small"
                                        min={0}
                                        value={objective.targetRow}
                                        placeholder="目標列"
                                        onChange={(value) => updateObjective(index, { targetRow: value ?? undefined })}
                                        style={{ width: 90 }}
                                    />
                                    <InputNumber
                                        size="small"
                                        min={0}
                                        value={objective.targetColumn}
                                        placeholder="目標欄"
                                        onChange={(value) => updateObjective(index, { targetColumn: value ?? undefined })}
                                        style={{ width: 90 }}
                                    />
                                </>
                            )}
                            {objective.type === 'interact-object' && (
                                <Flex vertical gap={4} style={{ flex: 1, minWidth: 200 }}>
                                    <Space wrap>
                                        {objective.targetIds?.map((id) => (
                                            <Tag
                                                key={id}
                                                closable
                                                onClose={(e) => {
                                                    e.preventDefault()
                                                    updateObjective(index, {
                                                        targetIds: objective.targetIds?.filter((x) => x !== id),
                                                    })
                                                }}
                                            >
                                                {id}
                                            </Tag>
                                        ))}
                                        {!objective.targetIds?.length && (
                                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                請填入需要互動的物件 ID
                                            </Typography.Text>
                                        )}
                                    </Space>
                                    <Flex gap={8}>
                                        <Input
                                            size="small"
                                            value={interactInputs[objective.id] ?? ''}
                                            placeholder="輸入物件 ID，按 Enter 加入清單"
                                            onChange={(e) => setInteractInputs((prev) => ({
                                                ...prev,
                                                [objective.id]: e.target.value,
                                            }))}
                                            onPressEnter={() => {
                                                const value = interactInputs[objective.id]?.trim() ?? ''
                                                if (!value) return
                                                const ids = objective.targetIds ?? []
                                                if (!ids.includes(value)) {
                                                    updateObjective(index, { targetIds: [...ids, value] })
                                                }
                                                setInteractInputs((prev) => ({ ...prev, [objective.id]: '' }))
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                    </Flex>
                                </Flex>
                            )}
                            <Space>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>支線</Typography.Text>
                                <Switch
                                    size="small"
                                    checked={Boolean(objective.isOptional)}
                                    onChange={(checked) => updateObjective(index, { isOptional: checked })}
                                />
                            </Space>
                        </Flex>
                    </Flex>
                ))}

                <Flex gap={8}>
                    <Select
                        size="small"
                        value={objectiveType}
                        options={OBJECTIVE_TYPE_OPTIONS}
                        style={{ width: 200 }}
                        onChange={setObjectiveType}
                    />
                    <Button size="small" type="primary" icon={<PlusOutlined />} onClick={addObjective}>
                        新增目標
                    </Button>
                </Flex>

                <Divider style={{ margin: 0 }}>失敗條件</Divider>

                <Flex gap={16} wrap>
                    <Space>
                        <Typography.Text>最大回合數</Typography.Text>
                        <InputNumber
                            size="small"
                            min={1}
                            value={quests.failConditions.maxRounds}
                            placeholder="不限"
                            onChange={(value) => updateFailConditions({ maxRounds: value ?? undefined })}
                        />
                    </Space>
                    <Space>
                        <Typography.Text>據點必須存活</Typography.Text>
                        <Switch
                            size="small"
                            checked={Boolean(quests.failConditions.baseMustSurvive)}
                            onChange={(checked) => updateFailConditions({ baseMustSurvive: checked })}
                        />
                    </Space>
                    <Space>
                        <Typography.Text>玩家必須存活</Typography.Text>
                        <Switch
                            size="small"
                            checked={Boolean(quests.failConditions.playerMustSurvive)}
                            onChange={(checked) => updateFailConditions({ playerMustSurvive: checked })}
                        />
                    </Space>
                </Flex>

                <Flex gap={16} wrap>
                    <Space>
                        <Typography.Text>關鍵據點（必須存活）</Typography.Text>
                        <Input
                            size="small"
                            value={(quests.failConditions.criticalBases ?? []).join(',')}
                            placeholder="以逗號分隔據點 ID"
                            onChange={(e) => updateFailConditions({
                                criticalBases: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })}
                            style={{ width: 220 }}
                        />
                    </Space>
                    <Space>
                        <Typography.Text>允許損失據點數</Typography.Text>
                        <InputNumber
                            size="small"
                            min={0}
                            value={quests.failConditions.maxLostBasesCount}
                            placeholder="不限"
                            onChange={(value) => updateFailConditions({ maxLostBasesCount: value ?? undefined })}
                        />
                    </Space>
                </Flex>

                <Button type="primary" onClick={onClose}>完成</Button>
            </Flex>
        </Modal>
    )
}

export default QuestSequencerModal