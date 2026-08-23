import { Button, Empty, List, Modal, Space, Typography, message } from 'antd'
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import type { ScenarioDefinition } from '../editorTypes'
import {
  deleteStoredScenario,
  getStoredScenarios,
  saveStoredScenario,
  type StoredScenario,
} from '../../game/scenarioStorage'

type ScenarioManagerModalProps = {
  open: boolean
  /** 目前編輯中的 scenario（用於「儲存」）。 */
  currentScenario: ScenarioDefinition
  onClose: () => void
  /** 載入一個副本到編輯器。 */
  onLoad: (scenario: ScenarioDefinition) => void
  /** 從零新建一個空白關卡。 */
  onNew: () => void
}

/**
 * 關卡管理彈窗：列出 localStorage 中的官方副本與自訂關卡，
 * 支援載入、儲存目前編輯內容、刪除自訂關卡，以及從零新建。
 */
function ScenarioManagerModal({
  open,
  currentScenario,
  onClose,
  onLoad,
  onNew,
}: ScenarioManagerModalProps) {
  const [scenarios, setScenarios] = useState<Record<string, StoredScenario>>({})

  // 每次開啟時重新讀取 localStorage，確保列表是最新的。
  useEffect(() => {
    if (open) {
      setScenarios(getStoredScenarios())
    }
  }, [open])

  const entries = Object.values(scenarios)

  const handleSaveCurrent = () => {
    const existing = scenarios[currentScenario.id]
    const entry: StoredScenario = {
      id: currentScenario.id,
      source: existing?.source ?? 'custom',
      sourceVersion: existing?.sourceVersion,
      modified: true,
      scenario: currentScenario,
    }
    saveStoredScenario(entry)
    setScenarios(getStoredScenarios())
    message.success('關卡已儲存。')
    onClose()
  }

  const handleDelete = (id: string) => {
    deleteStoredScenario(id)
    setScenarios(getStoredScenarios())
    message.success('關卡已刪除。')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="關卡管理"
      onCancel={onClose}
      footer={null}
      width={520}
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Button icon={<PlusOutlined />} onClick={onNew}>從零新建</Button>
        <Button icon={<SaveOutlined />} onClick={handleSaveCurrent}>儲存目前關卡</Button>
      </Space>

      {entries.length === 0 ? (
        <Empty description="尚無已儲存的關卡" />
      ) : (
        <List
          dataSource={entries}
          renderItem={(entry) => (
            <List.Item
              actions={[
                <Button key="load" size="small" type="primary" onClick={() => { onLoad(entry.scenario); onClose() }}>
                  載入
                </Button>,
                entry.source === 'custom' ? (
                  <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(entry.id)}>
                    刪除
                  </Button>
                ) : null,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Typography.Text>{entry.scenario.title}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {entry.source === 'official' ? '官方' : '自訂'}
                      {entry.modified ? ' · 已修改' : ''}
                    </Typography.Text>
                  </Space>
                }
                description={`${entry.scenario.mapSize.rows}×${entry.scenario.mapSize.columns} · ${entry.scenario.quests.victoryObjectives.length} 個勝利目標`}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}

export default ScenarioManagerModal
