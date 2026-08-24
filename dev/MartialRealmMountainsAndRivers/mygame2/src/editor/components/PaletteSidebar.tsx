import { Button, Flex, Space, Tooltip, Typography } from 'antd'
import type { TerrainType } from '../../game/types'
import type { BrushTool, ScenarioEntityKind } from '../editorTypes'
import { TERRAIN_OPTIONS } from '../terrainStyles'

const ENTITY_OPTIONS: Array<{ kind: ScenarioEntityKind; label: string; icon: string }> = [
  { kind: 'player', label: '玩家', icon: '🧙' },
  { kind: 'base', label: '據點', icon: '🏯' },
  { kind: 'creature', label: '怪物', icon: '🐺' },
  { kind: 'nest', label: '巢穴', icon: '🕳️' },
  { kind: 'ruin', label: '廢墟', icon: '🏚️' },
  { kind: 'resourcePoint', label: '資源點', icon: '💎' },
  { kind: 'itemPoint', label: '道具點', icon: '🎁' },
  { kind: 'event', label: '事件', icon: '🧭' },
  { kind: 'sectGate', label: '門派據點', icon: '⛩️' },
  { kind: 'defenseStructure', label: '防禦設施', icon: '🛡️' },
]

type PaletteSidebarProps = {
  brush: BrushTool
  onSelectTerrain: (terrain: TerrainType) => void
  onSetBrushSize: (size: 1 | 2 | 3) => void
  onSelectEntity: (kind: ScenarioEntityKind) => void
  onSelectEraser: () => void
  onSelectSelectTool: () => void
  onOpenQuest: () => void
  onOpenDialogue: () => void
  onOpenTrigger: () => void
}

function PaletteSidebar({
  brush,
  onSelectTerrain,
  onSetBrushSize,
  onSelectEntity,
  onSelectEraser,
  onSelectSelectTool,
  onOpenQuest,
  onOpenDialogue,
  onOpenTrigger,
}: PaletteSidebarProps) {
  const isTerrainBrush = brush.kind === 'terrain'
  const currentTerrain = isTerrainBrush ? brush.terrain : null
  const currentSize = isTerrainBrush ? brush.size : 1
  const currentEntityKind = brush.kind === 'entity' ? brush.entityKind : null

  return (
    <Flex vertical gap={12} style={{ padding: 12, minWidth: 180, maxHeight: '100%', overflowY: 'auto' }}>
      <Typography.Text strong>🛠️ 工具</Typography.Text>
      <Space wrap>
        <Button
          type={brush.kind === 'select' ? 'primary' : 'default'}
          size="small"
          onClick={onSelectSelectTool}
        >
          🖐️ 選取
        </Button>
        <Button
          type={brush.kind === 'eraser' ? 'primary' : 'default'}
          size="small"
          onClick={onSelectEraser}
        >
          🧹 橡皮擦
        </Button>
      </Space>

      <Typography.Text strong>🎨 地形筆刷</Typography.Text>
      <Flex wrap gap={6}>
        {TERRAIN_OPTIONS.map((option) => (
          <Tooltip key={option.value} title={option.label}>
            <Button
              type={currentTerrain === option.value ? 'primary' : 'default'}
              size="small"
              onClick={() => onSelectTerrain(option.value)}
              style={{ fontSize: 14, background: currentTerrain === option.value ? undefined : option.color }}
            >
              {option.label}
            </Button>
          </Tooltip>
        ))}
      </Flex>
      {isTerrainBrush && (
        <Space>
          <Typography.Text type="secondary">筆刷大小</Typography.Text>
          {([1, 2, 3] as const).map((size) => (
            <Button
              key={size}
              type={currentSize === size ? 'primary' : 'default'}
              size="small"
              onClick={() => onSetBrushSize(size)}
            >
              {size}×{size}
            </Button>
          ))}
        </Space>
      )}

      <Typography.Text strong>📍 物件圖章</Typography.Text>
      <Flex wrap gap={6}>
        {ENTITY_OPTIONS.map((option) => (
          <Tooltip key={option.kind} title={option.label}>
            <Button
              type={currentEntityKind === option.kind ? 'primary' : 'default'}
              size="small"
              onClick={() => onSelectEntity(option.kind)}
              style={{ fontSize: 18 }}
            >
              {option.icon}
            </Button>
          </Tooltip>
        ))}
      </Flex>

      <Typography.Text strong>📋 關卡編排</Typography.Text>
      <Flex vertical gap={6}>
        <Button size="small" onClick={onOpenQuest}>🎯 任務與勝敗條件</Button>
        <Button size="small" onClick={onOpenDialogue}>💬 劇情對話</Button>
        <Button size="small" onClick={onOpenTrigger}>⚡ 事件觸發器</Button>
      </Flex>
    </Flex>
  )
}

export default PaletteSidebar
