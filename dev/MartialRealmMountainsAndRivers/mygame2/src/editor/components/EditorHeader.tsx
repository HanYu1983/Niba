import { Button, Flex, InputNumber, Space, Tooltip, Typography } from 'antd'
import { UndoOutlined, RedoOutlined, ExportOutlined, ImportOutlined, ThunderboltOutlined, ArrowLeftOutlined, SaveOutlined, FolderOpenOutlined } from '@ant-design/icons'

type EditorHeaderProps = {
  title: string
  onTitleChange: (title: string) => void
  rows: number
  columns: number
  onSizeChange: (rows: number, columns: number) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onPlaytest: () => void
  onExport: () => void
  onImport: () => void
  onSave: () => void
  onOpenScenarioManager: () => void
  onBack: () => void
}

function EditorHeader({
  title,
  onTitleChange,
  rows,
  columns,
  onSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onPlaytest,
  onExport,
  onImport,
  onSave,
  onOpenScenarioManager,
  onBack,
}: EditorHeaderProps) {
  return (
    <Flex
      align="center"
      gap={12}
      style={{
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #d9d9d9',
        flexShrink: 0,
      }}
    >
      <Typography.Text strong>🗺️ 場景編輯器</Typography.Text>

      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        style={{
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          padding: '4px 8px',
          color: '#333',
          width: 200,
        }}
      />

      <Space>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>尺寸</Typography.Text>
        <InputNumber
          min={10}
          max={40}
          value={rows}
          size="small"
          style={{ width: 60 }}
          onChange={(value) => value && onSizeChange(value, columns)}
        />
        <Typography.Text type="secondary">×</Typography.Text>
        <InputNumber
          min={10}
          max={40}
          value={columns}
          size="small"
          style={{ width: 60 }}
          onChange={(value) => value && onSizeChange(rows, value)}
        />
      </Space>

      <Space>
        <Tooltip title="撤銷 (Ctrl+Z)">
          <Button
            size="small"
            icon={<UndoOutlined />}
            disabled={!canUndo}
            onClick={onUndo}
          />
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)">
          <Button
            size="small"
            icon={<RedoOutlined />}
            disabled={!canRedo}
            onClick={onRedo}
          />
        </Tooltip>
      </Space>

      <div style={{ flex: 1 }} />

      <Space>
        <Button size="small" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
        <Button size="small" icon={<FolderOpenOutlined />} onClick={onOpenScenarioManager}>開啟</Button>
        <Button size="small" icon={<SaveOutlined />} onClick={onSave}>儲存</Button>
        <Button size="small" icon={<ImportOutlined />} onClick={onImport}>匯入</Button>
        <Button size="small" icon={<ExportOutlined />} onClick={onExport}>匯出</Button>
        <Button type="primary" size="small" icon={<ThunderboltOutlined />} onClick={onPlaytest}>試玩</Button>
      </Space>
    </Flex>
  )
}

export default EditorHeader
