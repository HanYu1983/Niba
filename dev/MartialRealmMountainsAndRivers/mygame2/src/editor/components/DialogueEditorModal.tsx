import { Button, Collapse, Divider, Flex, Input, Modal, Typography, message } from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, CopyOutlined } from '@ant-design/icons'
import type { ScenarioDefinition } from '../editorTypes'

type DialogueEditorModalProps = {
  open: boolean
  scenario: ScenarioDefinition
  onClose: () => void
  onUpdateDialogues: (dialogues: ScenarioDefinition['dialogues']) => void
}

/**
 * 劇情對話組編輯器。
 *
 * 支援：
 * - 新增/編輯/刪除對話組（id + name）
 * - 每個組內新增/編輯/刪除對話步驟
 * - 說話者名稱、頭像 icon、對話內容（多行）
 * - 步驟排序（上下移動）
 *
 * 觸發時機由觸發器（triggers）統一設定，此處不再編輯觸發條件。
 */
function DialogueEditorModal({ open, scenario, onClose, onUpdateDialogues }: DialogueEditorModalProps) {
  const dialogues = scenario.dialogues

  const updateGroup = (groupId: string, patch: Record<string, unknown>) => {
    onUpdateDialogues({
      ...dialogues,
      [groupId]: { ...dialogues[groupId], ...patch },
    })
  }

  const addGroup = () => {
    const groupId = `dialogue-${Date.now().toString(36)}`
    onUpdateDialogues({
      ...dialogues,
      [groupId]: {
        name: '新對話組',
        steps: [
          {
            id: `step-${Date.now().toString(36)}`,
            speakerName: '說話者',
            speakerIcon: '🗨️',
            content: '',
          },
        ],
      },
    })
  }

  const removeGroup = (groupId: string) => {
    const next = { ...dialogues }
    delete next[groupId]
    onUpdateDialogues(next)
  }

  const updateStep = (groupId: string, stepId: string, patch: Record<string, unknown>) => {
    const group = dialogues[groupId]
    updateGroup(groupId, {
      steps: group.steps.map((step) => step.id === stepId ? { ...step, ...patch } : step),
    })
  }

  const addStep = (groupId: string) => {
    const group = dialogues[groupId]
    updateGroup(groupId, {
      steps: [
        ...group.steps,
        {
          id: `step-${Date.now().toString(36)}`,
          speakerName: '說話者',
          speakerIcon: '🗨️',
          content: '',
        },
      ],
    })
  }

  const removeStep = (groupId: string, stepId: string) => {
    const group = dialogues[groupId]
    updateGroup(groupId, { steps: group.steps.filter((step) => step.id !== stepId) })
  }

  const moveStep = (groupId: string, stepId: string, direction: -1 | 1) => {
    const group = dialogues[groupId]
    const index = group.steps.findIndex((step) => step.id === stepId)
    const target = index + direction
    if (target < 0 || target >= group.steps.length) return
    const next = [...group.steps]
    ;[next[index], next[target]] = [next[target], next[index]]
    updateGroup(groupId, { steps: next })
  }

  return (
    <Modal
      title="劇情對話編排"
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnHidden
    >
      <Divider style={{ margin: '0 0 12px' }}>對話組</Divider>

      <Button type="primary" icon={<PlusOutlined />} onClick={addGroup} block style={{ marginBottom: 12 }}>
        新增對話組
      </Button>

      <Collapse
        accordion
        items={Object.entries(dialogues).map(([groupId, group]) => ({
          key: groupId,
          label: (
            <Flex gap={8} align="center" onClick={(e) => e.stopPropagation()}>
              <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace', width: 120, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {groupId}
              </Typography.Text>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard?.writeText(groupId)
                  message.success(`已複製對話組 ID：${groupId}`)
                }}
              />
              <Input
                size="small"
                value={group.name}
                placeholder="對話組名稱"
                onChange={(e) => updateGroup(groupId, { name: e.target.value })}
                style={{ flex: 1 }}
              />
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  removeGroup(groupId)
                }}
              />
            </Flex>
          ),
          children: (
            <Flex vertical gap={8}>
              {group.steps.map((step) => (
                <Flex key={step.id} vertical gap={8} style={{ border: '1px dashed #f0f0f0', borderRadius: 8, padding: 8 }}>
                  <Flex gap={8} align="center">
                    <Button size="small" icon={<ArrowUpOutlined />} onClick={() => moveStep(groupId, step.id, -1)} />
                    <Button size="small" icon={<ArrowDownOutlined />} onClick={() => moveStep(groupId, step.id, 1)} />
                    <Input
                      size="small"
                      value={step.speakerName}
                      placeholder="說話者名稱"
                      onChange={(e) => updateStep(groupId, step.id, { speakerName: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <Input
                      size="small"
                      value={step.speakerIcon}
                      placeholder="頭像 icon"
                      onChange={(e) => updateStep(groupId, step.id, { speakerIcon: e.target.value })}
                      style={{ width: 80 }}
                    />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeStep(groupId, step.id)} />
                  </Flex>

                  <Input.TextArea
                    size="small"
                    value={step.content}
                    placeholder="對話內容"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    onChange={(e) => updateStep(groupId, step.id, { content: e.target.value })}
                  />
                </Flex>
              ))}

              <Button size="small" icon={<PlusOutlined />} onClick={() => addStep(groupId)}>
                新增步驟
              </Button>
            </Flex>
          ),
        }))}
      />
    </Modal>
  )
}

export default DialogueEditorModal