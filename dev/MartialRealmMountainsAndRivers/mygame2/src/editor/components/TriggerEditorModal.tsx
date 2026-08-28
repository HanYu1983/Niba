import { Button, Divider, Flex, Input, Modal, Select, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ScenarioDefinition, ScenarioTrigger } from '../editorTypes'

type TriggerEditorModalProps = {
  open: boolean
  scenario: ScenarioDefinition
  onClose: () => void
  onUpdateTriggers: (triggers: ScenarioTrigger[]) => void
}

/** 觸發時機選項。 */
const CONDITION_OPTIONS = [
  { value: 'on-start', label: '開局觸發' },
  { value: 'on-objective-complete', label: '目標達成時' },
  { value: 'on-enter-region', label: '進入座標時' },
  { value: 'on-enter-area', label: '進入區域時' },
  { value: 'on-exit-area', label: '離開區域時' },
  { value: 'on-defeat-boss', label: '擊敗首領時' },
  { value: 'on-round-reached', label: '到達指定回合' },
  { value: 'on-object-destroyed', label: '物件銷毀時' },
  { value: 'on-events-resolved', label: '探索點事件解決時' },
  { value: 'on-failure', label: '失敗結算前' },
  { value: 'on-victory', label: '勝利結算前' },
]

/** 行為選項。 */
const ACTION_OPTIONS = [
  { value: 'start-dialogue', label: '啟動對話' },
  { value: 'spawn-creature', label: '生成怪物' },
]

/** 需要時機參數的條件。 */
const CONDITIONS_WITH_PARAM = new Set(['on-objective-complete', 'on-enter-region', 'on-enter-area', 'on-exit-area', 'on-defeat-boss', 'on-round-reached', 'on-object-destroyed', 'on-events-resolved'])

/** 時機參數的 placeholder 提示。 */
const CONDITION_PARAM_PLACEHOLDER: Record<string, string> = {
  'on-objective-complete': '目標 ID',
  'on-enter-region': '座標（row,column）',
  'on-enter-area': '區域 ID',
  'on-exit-area': '區域 ID',
  'on-defeat-boss': '首領 ID',
  'on-round-reached': '回合數',
  'on-object-destroyed': '物件 ID',
  'on-events-resolved': '事件 ID（逗號分隔，全部解決才觸發）',
}

/**
 * 事件觸發器編輯器。
 *
 * 以「時機（condition）→ 行為（action）→ 參數（actionParam）」統一管理觸發。
 * - 時機：開局 / 勝利 / 擊敗首領 / 進入區域 / 到達回合 / 目標達成 / 失敗
 * - 行為：啟動對話（選對話組）/ 生成怪物（選怪物）
 */
function TriggerEditorModal({ open, scenario, onClose, onUpdateTriggers }: TriggerEditorModalProps) {
  const triggers = scenario.triggers ?? []

  const dialogueGroupOptions = Object.entries(scenario.dialogues).map(([id, group]) => ({
    value: id,
    label: group.name || id,
  }))

  const creatureOptions = scenario.entities
    .filter((entity) => entity.kind === 'creature')
    .map((entity) => ({
      value: entity.id,
      label: (entity.data.name as string) || entity.id,
    }))

  /** 區域選項：讓 on-enter-area / on-exit-area 的參數改為選單。 */
  const areaOptions = (scenario.areas ?? []).map((area) => ({
    value: area.id,
    label: area.name || area.id,
  }))

  /** 探索事件選項：供 on-events-resolved 多選（conditionParam 為逗號分隔 id 清單）。 */
  const eventOptions = scenario.entities
    .filter((entity) => entity.kind === 'event')
    .map((entity) => ({
      value: entity.id,
      label: (entity.data.name as string) || entity.id,
    }))

  /** 將 conditionParam（逗號分隔）解析為多選值陣列。 */
  const parseEventIds = (param?: string): string[] =>
    (param ?? '').split(',').map((id) => id.trim()).filter(Boolean)

  const updateTrigger = (index: number, patch: Partial<ScenarioTrigger>) => {
    onUpdateTriggers(triggers.map((trigger, i) => (i === index ? { ...trigger, ...patch } : trigger)))
  }

  const addTrigger = () => {
    onUpdateTriggers([
      ...triggers,
      {
        id: `trigger-${Date.now().toString(36)}`,
        condition: 'on-start',
        action: 'start-dialogue',
        actionParam: Object.keys(scenario.dialogues)[0] ?? '',
      },
    ])
  }

  const removeTrigger = (index: number) => {
    onUpdateTriggers(triggers.filter((_, i) => i !== index))
  }

  return (
    <Modal
      title="事件觸發器"
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnHidden
    >
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        以「時機 → 行為 → id」統一管理觸發。對話組與怪物的觸發時機在此設定。
      </Typography.Text>

      <Divider style={{ margin: '0 0 12px' }}>觸發器</Divider>

      <Button type="primary" icon={<PlusOutlined />} onClick={addTrigger} block style={{ marginBottom: 12 }}>
        新增觸發
      </Button>

      {triggers.map((trigger, index) => (
        <Flex key={trigger.id} vertical gap={8} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <Flex gap={8} align="center">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>時機</Typography.Text>
            <Select
              size="small"
              value={trigger.condition}
              options={CONDITION_OPTIONS}
              style={{ width: 160 }}
              onChange={(value) => updateTrigger(index, { condition: value })}
            />
            {CONDITIONS_WITH_PARAM.has(trigger.condition) && (
              trigger.condition === 'on-enter-area' || trigger.condition === 'on-exit-area' ? (
                <Select
                  size="small"
                  value={trigger.conditionParam}
                  options={areaOptions}
                  placeholder="選擇區域"
                  style={{ flex: 1 }}
                  onChange={(value) => updateTrigger(index, { conditionParam: value })}
                />
              ) : trigger.condition === 'on-events-resolved' ? (
                <Select
                  size="small"
                  mode="multiple"
                  value={parseEventIds(trigger.conditionParam)}
                  options={eventOptions}
                  placeholder="選擇需全部解決的事件（可多選）"
                  style={{ flex: 1, minWidth: 0 }}
                  onChange={(values) => updateTrigger(index, { conditionParam: values.length > 0 ? values.join(',') : undefined })}
                />
              ) : (
                <Input
                  size="small"
                  value={trigger.conditionParam ?? ''}
                  placeholder={CONDITION_PARAM_PLACEHOLDER[trigger.condition] ?? '時機參數'}
                  onChange={(e) => updateTrigger(index, { conditionParam: e.target.value || undefined })}
                  style={{ flex: 1 }}
                />
              )
            )}
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeTrigger(index)} />
          </Flex>

          <Flex gap={8} align="center">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>行為</Typography.Text>
            <Select
              size="small"
              value={trigger.action}
              options={ACTION_OPTIONS}
              style={{ width: 140 }}
              onChange={(value) => updateTrigger(index, { action: value as ScenarioTrigger['action'] })}
            />
            {trigger.action === 'start-dialogue' ? (
              <Select
                size="small"
                value={trigger.actionParam}
                options={dialogueGroupOptions}
                placeholder="選擇對話組"
                style={{ flex: 1 }}
                onChange={(value) => updateTrigger(index, { actionParam: value })}
              />
            ) : (
              <Select
                size="small"
                value={trigger.actionParam}
                options={creatureOptions}
                placeholder="選擇怪物"
                style={{ flex: 1 }}
                onChange={(value) => updateTrigger(index, { actionParam: value })}
              />
            )}
          </Flex>
        </Flex>
      ))}
    </Modal>
  )
}

export default TriggerEditorModal