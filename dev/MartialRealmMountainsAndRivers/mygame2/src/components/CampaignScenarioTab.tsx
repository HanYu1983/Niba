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
import { officialCharacterCatalog, getOfficialCharacterChapters, type OfficialCharacterDefinition } from '../game/catalogs/officialCharacterCatalog'

type CampaignScenarioTabProps = {
  /** 開始一個劇本關卡（載入完整劇本：任務 + 對話）。 */
  onStartScenario: (scenario: ScenarioDefinition) => void
}

type OutdatedEntry = { official: ScenarioDefinition; stored: StoredScenario }

/** 一個篇章（一位守護者）的群組視圖資料。 */
export type ChapterGroup = {
  /** 群組 id：官方角色用 characterId；未分類為 'uncategorized'。 */
  key: string
  /** 篇章的「主角標題」，用於群組 header。 */
  header: string
  /** 副標題：篇章名稱 / 範圍說明。 */
  subtitle: string
  /** 對應的官方角色（未分類為 null）。 */
  character: OfficialCharacterDefinition | null
  /** 群組內的關卡（已依 chapterIndex 排序）。 */
  entries: StoredScenario[]
}

/**
 * 將儲存中的關卡依「篇章 = 守護者 = 一位官方角色」分組。
 *
 * 規則：
 * 1. 每位官方角色 = 一個群組（按 `officialCharacterCatalog` 順序輸出）。
 * 2. 群組內的關卡 = `entry.scenario.id === character.chapterId`（官方角色透過 chapterId 綁定篇章）。
 * 3. 自訂關卡、找不到對應官方角色的官方關卡 → 統一歸入「未分類」群組（置於最後）。
 * 4. 群組內依 `chapterIndex` 升冪排序；缺欄位者排到群組尾。
 *
 * 純函式，便於單元測試。
 */
export function groupScenariosByChapter(entries: StoredScenario[]): ChapterGroup[] {
  const sorted = [...entries].sort((a, b) => {
    const ai = a.scenario.chapterIndex ?? Number.POSITIVE_INFINITY
    const bi = b.scenario.chapterIndex ?? Number.POSITIVE_INFINITY
    if (ai !== bi) return ai - bi
    // 同章節內：官方優先，再依 id 排序穩定顯示。
    if (a.source !== b.source) return a.source === 'official' ? -1 : 1
    return a.scenario.id.localeCompare(b.scenario.id)
  })

  const byChapterId = new Map<string, StoredScenario[]>()
  const uncategorized: StoredScenario[] = []

  for (const entry of sorted) {
    const owner = officialCharacterCatalog.find((character) =>
      getOfficialCharacterChapters(character).includes(entry.scenario.id),
    )
    if (!owner) {
      uncategorized.push(entry)
      continue
    }
    const bucket = byChapterId.get(owner.characterId) ?? []
    bucket.push(entry)
    byChapterId.set(owner.characterId, bucket)
  }

  const groups: ChapterGroup[] = officialCharacterCatalog.map((character) => {
    const bucket = byChapterId.get(character.characterId) ?? []
    // 副標彙整：若群組涵蓋多個篇章，顯示「第 X~Y 章 · 章名1 / 章名2 / …」；
    // 單一章節則保留「第 X 章 · 章名」。
    const chapterScenarios = bucket.map((entry) => entry.scenario)
    const indexes = chapterScenarios
      .map((scenario) => scenario.chapterIndex)
      .filter((index): index is number => typeof index === 'number')
    const indexLabel = indexes.length > 0
      ? indexes.length === 1
        ? `第 ${indexes[0] + 1} 章`
        : `第 ${Math.min(...indexes) + 1}～${Math.max(...indexes) + 1} 章`
      : ''
    const titleLabel = chapterScenarios.length > 0
      ? chapterScenarios.map((scenario) => scenario.title).join(' / ')
      : character.title
    return {
      key: character.characterId,
      header: `${character.portrait} ${character.name}`,
      subtitle: [indexLabel, titleLabel].filter(Boolean).join(' · '),
      character,
      entries: bucket,
    }
  })

  // 群組內若無對應關卡，不顯示該群組（避免空章節佔位）。
  const populated = groups.filter((group) => group.entries.length > 0)

  if (uncategorized.length > 0) {
    populated.push({
      key: 'uncategorized',
      header: '📦 未分類',
      subtitle: '自訂關卡或未綁定守護者的官方關卡',
      character: null,
      entries: uncategorized,
    })
  }

  return populated
}

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
          items={groups.map((group) => ({
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
            ),
          }))}
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
