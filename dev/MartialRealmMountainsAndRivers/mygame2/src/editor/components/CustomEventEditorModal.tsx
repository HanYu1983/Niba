import { Button, Divider, Flex, Input, InputNumber, Modal, Select, Space, Switch, Typography, message } from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, CopyOutlined } from '@ant-design/icons'
import type { CustomEventData, CustomEventChoice } from '../editorTypes'
import type { EventEffect, EventRequirement } from '../../game/events/eventCatalog'
import { BUILDING_OPTIONS, LOOT_ITEM_OPTIONS, INNER_SKILL_OPTIONS, EXTERNAL_SKILL_OPTIONS } from '../editorOptions'

type CustomEventEditorModalProps = {
  open: boolean
  /** 目前編輯的自定義事件資料（若無則為空）。 */
  data: CustomEventData | null
  onClose: () => void
  /** 儲存自定義事件資料。 */
  onSave: (data: CustomEventData) => void
}

const REQUIREMENT_TYPE_OPTIONS = [
  { value: 'adjacent-to-event', label: '鄰近事件' },
  { value: 'active-player', label: '行動玩家' },
  { value: 'player-alive', label: '玩家存活' },
  { value: 'money-at-least', label: '金錢至少' },
  { value: 'item-owned', label: '持有道具' },
  { value: 'building-exists', label: '存在建築' },
]

const EFFECT_TYPE_OPTIONS = [
  { value: 'money', label: '金錢' },
  { value: 'prestige', label: '聲望' },
  { value: 'item', label: '道具' },
  { value: 'learn-skill', label: '習得功法' },
  { value: 'spawn-creature', label: '怪物生產' },
  { value: 'spawn-event', label: '事件生成' },
  { value: 'spawn-base', label: '據點生成' },
  { value: 'spawn-nest', label: '巢穴生成' },
  { value: 'start-dialogue', label: '對話生成' },
]

const ITEM_OPTIONS = LOOT_ITEM_OPTIONS.filter((option) => option.kind === 'item').map((option) => ({
  value: option.value,
  label: option.label,
}))

/** 建立一個空的條件。 */
function emptyRequirement(): EventRequirement {
  return { type: 'active-player' }
}

/** 建立一個空的效果。 */
function emptyEffect(): EventEffect {
  return { type: 'money', amount: 0 }
}

function RequirementEditor({
  requirement,
  onChange,
  onRemove,
}: {
  requirement: EventRequirement
  onChange: (next: EventRequirement) => void
  onRemove: () => void
}) {
  return (
    <Flex gap={6} align="center" style={{ marginBottom: 4 }}>
      <Select
        size="small"
        value={requirement.type}
        options={REQUIREMENT_TYPE_OPTIONS}
        style={{ width: 130 }}
        onChange={(value) => onChange({ type: value } as EventRequirement)}
      />
      {requirement.type === 'money-at-least' && (
        <InputNumber
          size="small"
          min={0}
          value={(requirement as { amount?: number }).amount}
          placeholder="金額"
          onChange={(value) => onChange({ ...requirement, amount: value ?? 0 })}
          style={{ width: 90 }}
        />
      )}
      {requirement.type === 'item-owned' && (
        <>
          <Select
            size="small"
            value={(requirement as { itemId?: string }).itemId}
            placeholder="道具"
            options={ITEM_OPTIONS}
            style={{ width: 140 }}
            onChange={(value) => onChange({ ...requirement, itemId: value })}
          />
          <InputNumber
            size="small"
            min={1}
            value={(requirement as { quantity?: number }).quantity}
            placeholder="數量"
            onChange={(value) => onChange({ ...requirement, quantity: value ?? 1 })}
            style={{ width: 70 }}
          />
        </>
      )}
      {requirement.type === 'building-exists' && (
        <Select
          size="small"
          value={(requirement as { buildingType?: string }).buildingType}
          placeholder="建築"
          options={BUILDING_OPTIONS}
          style={{ width: 140 }}
          onChange={(value) => onChange({ ...requirement, buildingType: value })}
        />
      )}
      <Button size="small" danger icon={<DeleteOutlined />} onClick={onRemove} />
    </Flex>
  )
}

function EffectEditor({
  effect,
  onChange,
  onRemove,
}: {
  effect: EventEffect
  onChange: (next: EventEffect) => void
  onRemove: () => void
}) {
  return (
    <Flex gap={6} align="center" style={{ marginBottom: 4 }}>
      <Select
        size="small"
        value={effect.type}
        options={EFFECT_TYPE_OPTIONS}
        style={{ width: 100 }}
        onChange={(value) => onChange({ type: value } as EventEffect)}
      />
      {(effect.type === 'money' || effect.type === 'prestige') && (
        <InputNumber
          size="small"
          value={(effect as { amount?: number }).amount}
          placeholder="數值"
          onChange={(value) => onChange({ ...effect, amount: value ?? 0 })}
          style={{ width: 90 }}
        />
      )}
      {effect.type === 'item' && (
        <>
          <Select
            size="small"
            value={(effect as { itemId?: string }).itemId}
            placeholder="道具"
            options={ITEM_OPTIONS}
            style={{ width: 140 }}
            onChange={(value) => onChange({ ...effect, itemId: value })}
          />
          <InputNumber
            size="small"
            min={1}
            value={(effect as { quantity?: number }).quantity}
            placeholder="數量"
            onChange={(value) => onChange({ ...effect, quantity: value ?? 1 })}
            style={{ width: 70 }}
          />
        </>
      )}
      {effect.type === 'learn-skill' && (
        <>
          <Select
            size="small"
            value={(effect as { skillType?: string }).skillType}
            placeholder="功法類型"
            options={[
              { value: 'inner', label: '內功' },
              { value: 'external', label: '外功' },
            ]}
            style={{ width: 100 }}
            onChange={(value) => onChange({ ...effect, skillType: value as 'inner' | 'external', skillId: undefined })}
          />
          <Select
            size="small"
            value={(effect as { skillId?: string }).skillId}
            placeholder="指定功法（留空＝隨機）"
            allowClear
            showSearch
            optionFilterProp="label"
            options={(effect as { skillType?: string }).skillType === 'inner' ? INNER_SKILL_OPTIONS : EXTERNAL_SKILL_OPTIONS}
            style={{ width: 200 }}
            onChange={(value) => onChange({ ...effect, skillId: value ?? undefined })}
          />
        </>
      )}
      {effect.type === 'spawn-creature' && (
        <>
          <Input
            size="small"
            value={(effect as { creatureId?: string }).creatureId}
            placeholder="怪物 ID"
            style={{ width: 160 }}
            onChange={(e) => onChange({ ...effect, creatureId: e.target.value })}
          />
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              const id = (effect as { creatureId?: string }).creatureId
              if (id) {
                navigator.clipboard?.writeText(id)
                message.success(`已複製怪物 ID：${id}`)
              }
            }}
          />
        </>
      )}
      {effect.type === 'spawn-event' && (
        <>
          <Input
            size="small"
            value={(effect as { eventId?: string }).eventId}
            placeholder="事件點 ID"
            style={{ width: 160 }}
            onChange={(e) => onChange({ ...effect, eventId: e.target.value })}
          />
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              const id = (effect as { eventId?: string }).eventId
              if (id) {
                navigator.clipboard?.writeText(id)
                message.success(`已複製事件點 ID：${id}`)
              }
            }}
          />
        </>
      )}
      {effect.type === 'spawn-base' && (
        <>
          <Input
            size="small"
            value={(effect as { baseId?: string }).baseId}
            placeholder="據點 ID"
            style={{ width: 160 }}
            onChange={(e) => onChange({ ...effect, baseId: e.target.value })}
          />
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              const id = (effect as { baseId?: string }).baseId
              if (id) {
                navigator.clipboard?.writeText(id)
                message.success(`已複製據點 ID：${id}`)
              }
            }}
          />
        </>
      )}
      {effect.type === 'spawn-nest' && (
        <>
          <Input
            size="small"
            value={(effect as { nestId?: string }).nestId}
            placeholder="巢穴 ID"
            style={{ width: 160 }}
            onChange={(e) => onChange({ ...effect, nestId: e.target.value })}
          />
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              const id = (effect as { nestId?: string }).nestId
              if (id) {
                navigator.clipboard?.writeText(id)
                message.success(`已複製巢穴 ID：${id}`)
              }
            }}
          />
        </>
      )}
      {effect.type === 'start-dialogue' && (
        <>
          <Input
            size="small"
            value={(effect as { dialogueId?: string }).dialogueId}
            placeholder="對話組 ID"
            style={{ width: 160 }}
            onChange={(e) => onChange({ ...effect, dialogueId: e.target.value })}
          />
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              const id = (effect as { dialogueId?: string }).dialogueId
              if (id) {
                navigator.clipboard?.writeText(id)
                message.success(`已複製對話組 ID：${id}`)
              }
            }}
          />
        </>
      )}
      <Button size="small" danger icon={<DeleteOutlined />} onClick={onRemove} />
    </Flex>
  )
}

function CustomEventEditorModal({ open, data, onClose, onSave }: CustomEventEditorModalProps) {
  const current: CustomEventData = data ?? {
    type: 'custom',
    name: '',
    description: '',
    icon: '🗨️',
    choices: [],
  }

  const update = (patch: Partial<CustomEventData>) => {
    onSave({ ...current, ...patch })
  }

  const updateChoice = (index: number, patch: Partial<CustomEventChoice>) => {
    update({ choices: current.choices.map((choice, i) => i === index ? { ...choice, ...patch } : choice) })
  }

  const addChoice = () => {
    update({
      choices: [
        ...current.choices,
        {
          id: `choice-${Date.now().toString(36)}`,
          label: '新選項',
          description: '',
          endsPlayerTurn: false,
          requirements: [],
          effects: [],
        },
      ],
    })
  }

  const removeChoice = (index: number) => {
    update({ choices: current.choices.filter((_, i) => i !== index) })
  }

  const moveChoice = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= current.choices.length) return
    const next = [...current.choices]
    ;[next[index], next[target]] = [next[target], next[index]]
    update({ choices: next })
  }

  const updateRequirement = (choiceIndex: number, reqIndex: number, next: EventRequirement) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, {
      requirements: choice.requirements.map((req, i) => i === reqIndex ? next : req),
    })
  }

  const addRequirement = (choiceIndex: number) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, { requirements: [...choice.requirements, emptyRequirement()] })
  }

  const removeRequirement = (choiceIndex: number, reqIndex: number) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, { requirements: choice.requirements.filter((_, i) => i !== reqIndex) })
  }

  const updateEffect = (choiceIndex: number, effectIndex: number, next: EventEffect) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, {
      effects: choice.effects.map((effect, i) => i === effectIndex ? next : effect),
    })
  }

  const addEffect = (choiceIndex: number) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, { effects: [...choice.effects, emptyEffect()] })
  }

  const removeEffect = (choiceIndex: number, effectIndex: number) => {
    const choice = current.choices[choiceIndex]
    updateChoice(choiceIndex, { effects: choice.effects.filter((_, i) => i !== effectIndex) })
  }

  return (
    <Modal
      title="自定義探索事件"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
    >
      <Flex vertical gap={12}>
        <Flex gap={8}>
          <Input
            value={current.icon}
            placeholder="圖示（emoji）"
            style={{ width: 80 }}
            onChange={(e) => update({ icon: e.target.value })}
          />
          <Input
            value={current.name}
            placeholder="事件名稱"
            style={{ flex: 1 }}
            onChange={(e) => update({ name: e.target.value })}
          />
        </Flex>
        <Input.TextArea
          value={current.description}
          placeholder="事件描述"
          rows={2}
          onChange={(e) => update({ description: e.target.value })}
        />

        <Divider style={{ margin: '8px 0' }}>選項</Divider>

        {current.choices.map((choice, choiceIndex) => (
          <Flex key={choice.id} vertical gap={6} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
            <Flex gap={6} align="center">
              <Button size="small" icon={<ArrowUpOutlined />} onClick={() => moveChoice(choiceIndex, -1)} />
              <Button size="small" icon={<ArrowDownOutlined />} onClick={() => moveChoice(choiceIndex, 1)} />
              <Input
                size="small"
                value={choice.label}
                placeholder="選項文字"
                style={{ flex: 1 }}
                onChange={(e) => updateChoice(choiceIndex, { label: e.target.value })}
              />
              <Space>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>結束回合</Typography.Text>
                <Switch
                  size="small"
                  checked={choice.endsPlayerTurn}
                  onChange={(checked) => updateChoice(choiceIndex, { endsPlayerTurn: checked })}
                />
              </Space>
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeChoice(choiceIndex)} />
            </Flex>
            <Input
              size="small"
              value={choice.description}
              placeholder="選項描述"
              onChange={(e) => updateChoice(choiceIndex, { description: e.target.value })}
            />
            <Input.TextArea
              size="small"
              value={choice.resultMessage ?? ''}
              placeholder="結果彈窗訊息（可選；留空則自動由效果生成）"
              autoSize={{ minRows: 1, maxRows: 3 }}
              onChange={(e) => updateChoice(choiceIndex, { resultMessage: e.target.value || undefined })}
            />

            <Typography.Text type="secondary" style={{ fontSize: 12 }}>條件</Typography.Text>
            {choice.requirements.map((req, reqIndex) => (
              <RequirementEditor
                key={reqIndex}
                requirement={req}
                onChange={(next) => updateRequirement(choiceIndex, reqIndex, next)}
                onRemove={() => removeRequirement(choiceIndex, reqIndex)}
              />
            ))}
            <Button size="small" icon={<PlusOutlined />} onClick={() => addRequirement(choiceIndex)}>新增條件</Button>

            <Typography.Text type="secondary" style={{ fontSize: 12 }}>效果</Typography.Text>
            {choice.effects.map((effect, effectIndex) => (
              <EffectEditor
                key={effectIndex}
                effect={effect}
                onChange={(next) => updateEffect(choiceIndex, effectIndex, next)}
                onRemove={() => removeEffect(choiceIndex, effectIndex)}
              />
            ))}
            <Button size="small" icon={<PlusOutlined />} onClick={() => addEffect(choiceIndex)}>新增效果</Button>
          </Flex>
        ))}

        <Button type="dashed" icon={<PlusOutlined />} onClick={addChoice}>新增選項</Button>
      </Flex>
    </Modal>
  )
}

export default CustomEventEditorModal
