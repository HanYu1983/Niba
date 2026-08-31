import { Button, Collapse, Empty, List, Modal, Space, Spin, Tag, Typography, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
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
import {
  groupScenariosByChapter,
  buildChapterProgressView,
} from './campaignScenarioView'

type CampaignScenarioTabProps = {
  /** 開始一個劇本關卡（載入完整劇本：任務 + 對話）。 */
  onStartScenario: (scenario: ScenarioDefinition) => void
}

type OutdatedEntry = { official: ScenarioDefinition; stored: StoredScenario }

/**
 * 將儲存中的關卡依「篇章 = 守護者 = 一位官方角色」分組。
 * （實作已移至 campaignScenarioView.ts，此處僅供元件使用。）
 */
/**
 * 劇本地圖 Tab：列出官方副本與自訂關卡，處理「官方已更新」提示，
 * 並提供開始劇本、刪除自訂關卡等功能。
 */
function CampaignScenarioTab({ onStartScenario }: CampaignScenarioTabProps) {
  const [scenarios, setScenarios] = useState<StoredScenarioMap>({})
  const [loading, setLoading] = useState(true)
  const [outdated, setOutdated] = useState<OutdatedEntry | null>(null)
  // 通關狀態在 mount 時讀取一次即可（本 Tab 生命週期內不會變動）。
  const [clearances] = useState<Record<string, boolean>>(() => getScenarioClearances())

  useEffect(() => {
    let cancelled = false
    // 非同步載入：setState 皆發生在 await 之後（微任務），非同步同步呼叫。
    void (async () => {
      try {
        const result = await syncOfficialScenarios()
        if (cancelled) return
        setScenarios(result.scenarios)
        if (result.outdated.length > 0) {
          setOutdated(result.outdated[0])
        }
      } catch (error) {
        if (!cancelled) {
          message.error(`讀取官方關卡失敗：${error instanceof Error ? error.message : '未知錯誤'}`)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const entries = Object.values(scenarios)
  const groups = useMemo(() => groupScenariosByChapter(entries), [entries])
  // 「未分類」預設展開（自訂關卡通常在這），其他群組預設摺疊。
  const defaultActiveKeys = groups
    .filter((group) => group.key === 'uncategorized' || group.character === null)
    .map((group) => group.key)

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
        <Collapse
          accordion={false}
          defaultActiveKey={defaultActiveKeys}
          items={groups.map((group) => {
            // 為有官方角色的群組建立進度視圖。
            const progressView = group.character
              ? buildChapterProgressView(group.character, clearances)
              : null

            return {
              key: group.key,
              label: (
                <Space size="small" wrap>
                  <Typography.Text strong>{group.header}</Typography.Text>
                  {group.subtitle && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {group.subtitle}
                    </Typography.Text>
                  )}
                  <Tag style={{ marginInlineEnd: 0 }}>{group.entries.length} 個關卡</Tag>
                </Space>
              ),
              children: (
                <>
                  {/* 篇章進度 + 解鎖項目（僅官方角色群組顯示，位於關卡列表上方） */}
                  {progressView && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                      <Typography.Title level={5} style={{ marginTop: 12, marginBottom: 8 }}>✅ 名冊角色已解鎖功法&天賦</Typography.Title>
                      {progressView.totalUnlocked.length === 0 ? (
                        <Typography.Text type="secondary">尚無已解鎖項目。</Typography.Text>
                      ) : (
                        <Space wrap>
                          {progressView.totalUnlocked.map((item) => (
                            <Tag key={item.id} color="green" title={item.description}>
                              {item.name}
                            </Tag>
                          ))}
                        </Space>
                      )}

                      {progressView.totalPending.length > 0 && (
                        <>
                          <Typography.Title level={5} style={{ marginTop: 12, marginBottom: 8 }}>⏳ 已通關但待套用</Typography.Title>
                          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                            對應篇章已通關，但解鎖合併流程尚未串接（將在後續 hook 補上）。
                          </Typography.Paragraph>
                          <Space wrap>
                            {progressView.totalPending.map((item) => (
                              <Tag key={item.id} color="orange" title={item.description}>
                                {item.name}
                              </Tag>
                            ))}
                          </Space>
                        </>
                      )}

                      {!progressView.rosterSnapshot && (
                        <Typography.Paragraph type="warning" style={{ marginTop: 12 }}>
                          尚未在「俠客名冊」建立此角色；請進入名冊頁以建立預建角色。
                        </Typography.Paragraph>
                      )}
                    </div>
                  )}

                  {/* 關卡列表 */}
                  <List
                    dataSource={group.entries}
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
                </>
              ),
            }
          })}
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
