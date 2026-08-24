import { Button, Checkbox, Divider, Flex, Input, Modal, type ModalProps, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { Position } from '../../game/types'
import type { ScenarioArea, ScenarioDefinition } from '../editorTypes'
import { TERRAIN_OPTIONS } from '../terrainStyles'

type AreaEditorModalProps = ModalProps & {
  open: boolean
  scenario: ScenarioDefinition
  onClose: () => void
  /** 更新 areas 陣列（由上層以 setState 實作）。 */
  onUpdateAreas: (areas: ScenarioArea[]) => void
}

/** 產生唯一 id。 */
function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/**
 * 區域繪製編輯器。
 *
 * 支援：
 * - 新增/編輯/刪除區域（id + name）
 * - 在迷你地圖網格上點選格子，加入/移除該格的座標
 * - 目前選中的區域會以高亮標示
 */
function AreaEditorModal({ open, scenario, onClose, onUpdateAreas, ...rest }: AreaEditorModalProps) {
  const areas = scenario.areas ?? []
  // 目前編輯中的區域 id；null 代表尚未選取。
  const [editingId, setEditingId] = useState<string | null>(null)
  const activeArea = areas.find((area) => area.id === editingId) ?? null

  const rows = scenario.mapSize.rows
  const columns = scenario.mapSize.columns

  const updateArea = (areaId: string, patch: Partial<ScenarioArea>) => {
    onUpdateAreas(areas.map((area) => area.id === areaId ? { ...area, ...patch } : area))
  }

  const addArea = () => {
    const area: ScenarioArea = {
      id: genId('area'),
      name: '新區域',
      positions: [],
    }
    onUpdateAreas([...areas, area])
    setEditingId(area.id)
  }

  const removeArea = (areaId: string) => {
    onUpdateAreas(areas.filter((area) => area.id !== areaId))
    if (editingId === areaId) setEditingId(null)
  }

  const togglePosition = (row: number, column: number) => {
    if (!activeArea) return
    const posKey = `${row}-${column}`
    const exists = activeArea.positions.some((pos) => `${pos.row}-${pos.column}` === posKey)
    const nextPositions = exists
      ? activeArea.positions.filter((pos) => `${pos.row}-${pos.column}` !== posKey)
      : [...activeArea.positions, { row, column } as Position]
    updateArea(activeArea.id, { positions: nextPositions })
  }

  return (
    <Modal
      open={open}
      title="區域繪製"
      onCancel={onClose}
      footer={null}
      width={720}
      {...rest}
    >
      <Flex gap={16}>
        {/* 左側：區域清單 */}
        <Flex vertical gap={8} style={{ minWidth: 220, maxWidth: 260 }}>
          <Typography.Text strong>區域清單</Typography.Text>
          <Button size="small" icon={<PlusOutlined />} onClick={addArea}>新增區域</Button>
          {areas.map((area) => (
            <Flex
              key={area.id}
              align="center"
              justify="space-between"
              gap={6}
              style={{
                padding: 6,
                border: `1px solid ${editingId === area.id ? '#1677ff' : '#d9d9d9'}`,
                borderRadius: 4,
                cursor: 'pointer',
                background: editingId === area.id ? '#e6f4ff' : '#fff',
              }}
              onClick={() => setEditingId(area.id)}
            >
              <Typography.Text ellipsis style={{ fontSize: 13 }}>
                {area.name}（{area.positions.length} 格）
              </Typography.Text>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => { e.stopPropagation(); removeArea(area.id) }}
              />
            </Flex>
          ))}
          {areas.length === 0 && <Typography.Text type="secondary">尚無區域</Typography.Text>}
        </Flex>

        {/* 右側：區域編輯 + 迷你地圖 */}
        <Flex vertical gap={12} flex={1}>
          {activeArea ? (
            <>
              <Flex gap={8} align="center" wrap>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>區域 ID</Typography.Text>
                <Input
                  size="small"
                  style={{ width: 160 }}
                  value={activeArea.id}
                  onChange={(e) => updateArea(activeArea.id, { id: e.target.value })}
                />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>名稱</Typography.Text>
                <Input
                  size="small"
                  style={{ width: 120 }}
                  value={activeArea.name}
                  onChange={(e) => updateArea(activeArea.id, { name: e.target.value })}
                />
              </Flex>
              <Checkbox
                checked={activeArea.destroyWhenTriggered ?? false}
                onChange={(e) => updateArea(activeArea.id, { destroyWhenTriggered: e.target.checked })}
              >
                一次性區域（進入或離開觸發一次後即移除）
              </Checkbox>
              <Divider style={{ margin: '6px 0' }} />

              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                點擊格子切換加入/移除該格（已選中的格子會高亮）
              </Typography.Text>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 1,
                  background: '#d9d9d9',
                  border: '1px solid #d9d9d9',
                  maxWidth: '100%',
                }}
              >
                {Array.from({ length: rows * columns }).map((_, index) => {
                  const row = Math.floor(index / columns)
                  const column = index % columns
                  const cell = scenario.cells.find((c) => c.row === row && c.column === column)
                  const terrain = cell?.terrain ?? 'plain'
                  const isSelected = activeArea.positions.some((pos) => pos.row === row && pos.column === column)
                  const terrainStyle = TERRAIN_OPTIONS.find((t) => t.value === terrain)
                  return (
                    <div
                      key={`${row}-${column}`}
                      onClick={() => togglePosition(row, column)}
                      title={`${row},${column}`}
                      style={{
                        aspectRatio: '1 / 1',
                        background: isSelected ? '#1677ff' : (terrainStyle?.color ?? '#c8c8c8'),
                        cursor: 'pointer',
                      }}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <Typography.Text type="secondary" style={{ padding: 24 }}>
              請先選取或新增一個區域，再於網格上繪製格子。
            </Typography.Text>
          )}
        </Flex>
      </Flex>
    </Modal>
  )
}

export default AreaEditorModal