import { Button, Card, Divider, Flex, Input, InputNumber, Modal, Select, Space, Tabs, Typography } from 'antd'
import { useState } from 'react'
import type { GameSettings, TerrainWeights } from '../game/types'
import {
  BUILTIN_TEMPLATES,
  deleteCustomTemplate,
  getCustomTemplates,
  getSelectedTemplateId,
  isTemplateNameTaken,
  randomSeed,
  saveCustomTemplate,
  saveSelectedTemplateId,
  type MapTemplate,
} from '../game/mapTemplates'
import CampaignScenarioTab from './CampaignScenarioTab'
import type { ScenarioDefinition } from '../editor/editorTypes'

type GameStartScreenProps = {
  onStart: (settings: GameSettings) => void
  onDebug: () => void
  onOpenSkillTest: () => void
  onOpenEditor: () => void
  /** 開始一個劇本關卡（載入完整劇本）。 */
  onStartScenario: (scenario: ScenarioDefinition) => void
}

function GameStartScreen({ onStart, onDebug, onOpenSkillTest, onOpenEditor, onStartScenario }: GameStartScreenProps) {
  // 每次進入地圖設定頁，套用上次選擇的模板（若無記錄則用「入門地圖」）。
  // 地圖設定不再自動寫入 localStorage，僅「儲存為模板」與「所選模板」會持久化。
  const [customTemplates, setCustomTemplates] = useState<MapTemplate[]>(() => getCustomTemplates())
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    const savedId = getSelectedTemplateId()
    const allTemplates = [...BUILTIN_TEMPLATES, ...getCustomTemplates()]
    return allTemplates.some((t) => t.id === savedId) ? savedId! : BUILTIN_TEMPLATES[0].id
  })
  const [settings, setSettings] = useState<GameSettings>(() => {
    const savedId = getSelectedTemplateId()
    const allTemplates = [...BUILTIN_TEMPLATES, ...getCustomTemplates()]
    const template = allTemplates.find((t) => t.id === savedId) ?? BUILTIN_TEMPLATES[0]
    return {
      ...template.settings,
      seed: randomSeed(),
    }
  })
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')

  const update = (key: keyof GameSettings, value: number | null) => {
    if (value === null) return
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const updateTerrainWeight = (key: keyof TerrainWeights, value: number | null) => {
    if (value === null) return
    setSettings((current) => ({
      ...current,
      terrainWeights: { ...(current.terrainWeights ?? {}), [key]: value } as TerrainWeights,
    }))
  }

  const randomizeTerrainWeights = () => {
    const randomWeight = () => Math.floor(Math.random() * 100) + 1
    setSettings((current) => ({
      ...current,
      terrainWeights: {
        plain: randomWeight(),
        forest: randomWeight(),
        water: randomWeight(),
        mountain: randomWeight(),
        desert: randomWeight(),
      },
    }))
  }

  const applyTemplate = (templateId: string) => {
    const template = [...BUILTIN_TEMPLATES, ...customTemplates].find((t) => t.id === templateId)
    if (!template) return
    setSelectedTemplateId(templateId)
    saveSelectedTemplateId(templateId)
    setSettings((current) => ({ ...current, ...template.settings, seed: randomSeed() }))
  }

  const handleSaveTemplate = () => {
    const name = templateName.trim()
    if (!name || isTemplateNameTaken(name)) return
    const { seed: _seed, ...settingsWithoutSeed } = settings
    const template: MapTemplate = {
      id: `custom-${Date.now()}`,
      name,
      builtin: false,
      settings: settingsWithoutSeed,
    }
    if (saveCustomTemplate(template)) {
      setCustomTemplates((current) => [...current, template])
      setSelectedTemplateId(template.id)
      saveSelectedTemplateId(template.id)
      setSaveModalOpen(false)
      setTemplateName('')
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    deleteCustomTemplate(templateId)
    setCustomTemplates((current) => current.filter((t) => t.id !== templateId))
    setSelectedTemplateId(BUILTIN_TEMPLATES[0].id)
    saveSelectedTemplateId(BUILTIN_TEMPLATES[0].id)
  }

  const selectedTemplate = [...BUILTIN_TEMPLATES, ...customTemplates].find((t) => t.id === selectedTemplateId)
  const invalid = settings.rows < 15 || settings.columns < 15 || settings.baseCount < 1 || settings.nestCount < 0

  return (
    <main className="start-screen">
      <Card className="start-screen__card" bordered={false}>
        <Typography.Text className="start-screen__eyebrow">武行山河 · WORLD SETUP</Typography.Text>
        <Typography.Title>開始遊戲</Typography.Title>
        <Typography.Paragraph>
          選擇沙盒地圖（隨機生成）或劇本地圖（編輯器產出關卡）。
        </Typography.Paragraph>

        <Tabs
          defaultActiveKey="sandbox"
          items={[
            {
              key: 'sandbox',
              label: '🏜️ 沙盒地圖',
              children: (
                <>
                  <Divider>開局模板</Divider>
        <Flex className="game-settings__grid" gap={16} wrap align="center">
          <label className="game-settings__template">
            開局模板
            <Select
              style={{ minWidth: 200 }}
              value={selectedTemplateId}
              onChange={applyTemplate}
              options={[
                {
                  label: '⚔️ 挑戰關卡',
                  options: BUILTIN_TEMPLATES.filter((t) => t.id.startsWith('challenge-')).map((t) => ({ label: t.name, value: t.id })),
                },
                {
                  label: '內建模板',
                  options: BUILTIN_TEMPLATES.filter((t) => !t.id.startsWith('challenge-')).map((t) => ({ label: t.name, value: t.id })),
                },
                {
                  label: '我的模板',
                  options: customTemplates.map((t) => ({ label: t.name, value: t.id })),
                },
              ]}
            />
          </label>
          <Button onClick={() => setSaveModalOpen(true)}>💾 儲存目前設定為模板</Button>
          {selectedTemplate && !selectedTemplate.builtin && (
            <Button danger onClick={() => handleDeleteTemplate(selectedTemplate.id)}>🗑 刪除此模板</Button>
          )}
        </Flex>

        <Divider>地圖設定</Divider>
        <Flex className="game-settings__grid" gap={16} wrap>
          <label>地圖行數<InputNumber min={15} max={80} value={settings.rows} onChange={(value) => update('rows', value)} /></label>
          <label>地圖列數<InputNumber min={15} max={80} value={settings.columns} onChange={(value) => update('columns', value)} /></label>
          <label>隨機種子<InputNumber min={0} max={999999999} value={settings.seed} onChange={(value) => update('seed', value)} /></label>
          <Button onClick={randomizeTerrainWeights}>🎲 隨機生成地形權重</Button>
        </Flex>

        <Divider>地形權重</Divider>
        <Typography.Paragraph type="secondary">
          調整各可通行地形的生成權重，權重越高出現越多。邊界牆壁不受影響。
        </Typography.Paragraph>
        <Flex className="game-settings__grid" gap={16} wrap>
          <label>草地<InputNumber min={0} max={100} value={settings.terrainWeights?.plain} onChange={(value) => updateTerrainWeight('plain', value)} /></label>
          <label>森林<InputNumber min={0} max={100} value={settings.terrainWeights?.forest} onChange={(value) => updateTerrainWeight('forest', value)} /></label>
          <label>水域<InputNumber min={0} max={100} value={settings.terrainWeights?.water} onChange={(value) => updateTerrainWeight('water', value)} /></label>
          <label>山嶽<InputNumber min={0} max={100} value={settings.terrainWeights?.mountain} onChange={(value) => updateTerrainWeight('mountain', value)} /></label>
          <label>荒漠<InputNumber min={0} max={100} value={settings.terrainWeights?.desert} onChange={(value) => updateTerrainWeight('desert', value)} /></label>
        </Flex>

        <Divider>世界內容</Divider>
        <Flex className="game-settings__grid" gap={16} wrap>
          <label>據點數量<InputNumber min={1} max={12} value={settings.baseCount} onChange={(value) => update('baseCount', value)} /></label>
          <label>巢穴數量<InputNumber min={0} max={30} value={settings.nestCount} onChange={(value) => update('nestCount', value)} /></label>
          <label>資源點數量<InputNumber min={0} max={60} value={settings.resourcePointCount} onChange={(value) => update('resourcePointCount', value)} /></label>
          <label>道具點數量<InputNumber min={0} max={60} value={settings.itemPointCount} onChange={(value) => update('itemPointCount', value)} /></label>
          <label>人類玩家數量<InputNumber min={1} max={4} value={settings.playerCount} onChange={(value) => update('playerCount', value)} /></label>
          <label>探索點數量<InputNumber min={0} max={60} value={settings.explorationEventCount} onChange={(value) => update('explorationEventCount', value)} /></label>
          <label>回合結束事件機率<InputNumber min={0} max={1} step={0.05} value={settings.explorationTriggerChance ?? 0.2} onChange={(value) => update('explorationTriggerChance', value)} /></label>
          <label>門派據點<InputNumber min={0} max={30} value={settings.sectGateCount} onChange={(value) => update('sectGateCount', value)} /></label>
          <label>初始生物數量<InputNumber min={0} max={60} value={settings.creatureCount} onChange={(value) => update('creatureCount', value)} /></label>
          <label>廢墟數量<InputNumber min={0} max={60} value={settings.ruinCount} onChange={(value) => update('ruinCount', value)} /></label>
        </Flex>

        {invalid && <Typography.Text type="danger">地圖至少需要 15 x 15，且至少要有一個據點。</Typography.Text>}
        <Space className="start-screen__actions" wrap>
          <Button type="primary" size="large" disabled={invalid} onClick={() => onStart(settings)}>開始新遊戲</Button>
        </Space>
                </>
              ),
            },
            {
              key: 'campaign',
              label: '📜 劇本地圖',
              children: (
                <CampaignScenarioTab onStartScenario={onStartScenario} />
              ),
            },
            {
              key: 'developer',
              label: '🛠️ 開發者模式',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Typography.Paragraph type="secondary">
                    開發與測試用工具。
                  </Typography.Paragraph>
                  <Space wrap>
                    <Button size="large" onClick={onDebug}>開啟 Debug 地圖</Button>
                    <Button size="large" onClick={onOpenSkillTest}>功法測試頁</Button>
                    <Button size="large" onClick={onOpenEditor}>🗺️ 場景編輯器</Button>
                  </Space>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="儲存為模板"
        open={saveModalOpen}
        onOk={handleSaveTemplate}
        onCancel={() => { setSaveModalOpen(false); setTemplateName('') }}
        okButtonProps={{ disabled: !templateName.trim() || isTemplateNameTaken(templateName) }}
      >
        <Input
          placeholder="輸入模板名稱"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          onPressEnter={handleSaveTemplate}
        />
        {isTemplateNameTaken(templateName) && templateName.trim() && (
          <Typography.Text type="danger">此名稱已存在，請換一個。</Typography.Text>
        )}
      </Modal>
    </main>
  )
}

export default GameStartScreen
