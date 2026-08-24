import { Button, Empty, List, Modal, Space, Spin, Tag, Typography, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import type { ScenarioDefinition } from '../editor/editorTypes'
import {
  deleteStoredScenario,
  getStoredScenarios,
  resetStoredScenarioToOfficial,
  saveAsCustomScenario,
  syncOfficialScenarios,
  type StoredScenario,
  type StoredScenarioMap,
} from '../game/scenarioStorage'
import { getScenarioClearances } from '../game/campaignClearance'

type CampaignScenarioTabProps = {
  /** 開始一個劇本關卡（載入完整劇本：任務 + 對話）。 */
  onStartScenario: (scenario: ScenarioDefinition) => void
}

type OutdatedEntry = { official: ScenarioDefinition; stored: StoredScenario }

/**
 * 劇本地圖 Tab：列出官方副本與自訂關卡，處理「官方已更新」提示，
 * 並提供開始劇本、刪除自訂關卡等功能。
 */
function CampaignScenarioTab({ onStartScenario }: CampaignScenarioTabProps) {
  const [scenarios, setScenarios] = useState<StoredScenarioMap>({})
  const [loading, setLoading] = useState(true)
  const [outdated, setOutdated] = useState<OutdatedEntry | null>(null)
  const [clearances, setClearances] = useState<Record<string, boolean>>({})

  const refreshClearances = () => setClearances(getScenarioClearances())

  const refresh = async () => {
    setLoading(true)
    refreshClearances()
    try {
      const result = await syncOfficialScenarios()
      setScenarios(result.scenarios)
      if (result.outdated.length > 0) {
        setOutdated(result.outdated[0])
      }
    } catch (error) {
      message.error(`讀取官方關卡失敗：${error instanceof Error ? error.message : '未知錯誤'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const entries = Object.values(scenarios)

  const handleStart = (entry: StoredScenario) => {
    onStartScenario(entry.scenario)
  }

  const handleDelete = (id: string) => {
    deleteStoredScenario(id)
    setScenarios(getStoredScenarios())
    message.success('關卡已刪除。')
  }

  const handleOutdatedChoice = (choice: 'keep' | 'reset' | 'save-as-custom') => {
    if (!outdated) return
    if (choice === 'reset') {
      resetStoredScenarioToOfficial(outdated.stored, outdated.official)
      message.success('已重置為官方新版。')
    } else if (choice === 'save-as-custom') {
      saveAsCustomScenario(outdated.stored)
      resetStoredScenarioToOfficial(outdated.stored, outdated.official)
      message.success('已另存為自訂關卡，並重置官方副本。')
    }
    // 'keep'：保留修改，不更新。
    setOutdated(null)
    setScenarios(getStoredScenarios())
  }

  return (
    <div>
      <Typography.Paragraph type="secondary">
        從編輯器產出的關卡中選擇一張開始。劇本關卡包含任務與對話，等同於戰役模式。
      </Typography.Paragraph>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Spin />
        </div>
      ) : entries.length === 0 ? (
        <Empty description="尚無可用關卡。請先到場景編輯器建立並儲存關卡。" />
      ) : (
        <List
          dataSource={entries}
          renderItem={(entry) => (
            <List.Item
              actions={[
                <Button
                  key="start"
                  type="primary"
                  size="small"
                  disabled={entry.inDevelopment ?? false}
                  onClick={() => handleStart(entry)}
                >
                  {entry.inDevelopment ? '開發中' : '開始'}
                </Button>,
                entry.source === 'custom' ? (
                  <Button key="delete" size="small" danger onClick={() => handleDelete(entry.id)}>
                    刪除
                  </Button>
                ) : null,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Typography.Text>{entry.scenario.title}</Typography.Text>
                    {entry.inDevelopment ? (
                      <Tag color="warning" style={{ marginInlineEnd: 0 }}>開發中</Tag>
                    ) : null}
                    {clearances[entry.id] === true ? (
                      <Tag icon={<CheckCircleOutlined />} color="success" style={{ marginInlineEnd: 0 }}>已通關</Tag>
                    ) : clearances[entry.id] === false ? (
                      <Tag icon={<CloseCircleOutlined />} color="error" style={{ marginInlineEnd: 0 }}>未通過</Tag>
                    ) : null}
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {entry.source === 'official' ? '官方' : '自訂'}
                      {entry.modified ? ' · 已修改' : ''}
                    </Typography.Text>
                  </Space>
                }
                description={`${entry.scenario.mapSize.rows}×${entry.scenario.mapSize.columns} · ${entry.scenario.quests.victoryObjectives.length} 個勝利目標 · ${Object.keys(entry.scenario.dialogues).length} 組對話`}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={!!outdated}
        title="官方關卡已更新"
        onCancel={() => setOutdated(null)}
        footer={null}
      >
        <Typography.Paragraph>
          「{outdated?.stored.scenario.title}」的官方版本已更新（{outdated?.stored.sourceVersion} → {outdated?.official.version}）。
          你希望如何處理？
        </Typography.Paragraph>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block onClick={() => handleOutdatedChoice('keep')}>保留我的修改</Button>
          <Button block onClick={() => handleOutdatedChoice('reset')}>重置為官方新版</Button>
          <Button block onClick={() => handleOutdatedChoice('save-as-custom')}>另存為自訂關卡，並重置官方副本</Button>
        </Space>
      </Modal>
    </div>
  )
}

export default CampaignScenarioTab
