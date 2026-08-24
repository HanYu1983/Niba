import { useCallback, useEffect, useState } from 'react'
import { Flex, message } from 'antd'
import type { Position, TerrainType } from '../game/types'
import {
  type ScenarioCell,
  type ScenarioDefinition,
  type ScenarioEntityPlacement,
  type ScenarioEntityKind,
  createEmptyScenario,
} from './editorTypes'
import { useEditorHistory } from './hooks/useEditorHistory'
import { useEditorSelection } from './hooks/useEditorSelection'
import EditorHeader from './components/EditorHeader'
import EditorCanvas from './components/EditorCanvas'
import PaletteSidebar from './components/PaletteSidebar'
import InspectorSidebar from './components/InspectorSidebar'
import QuestSequencerModal from './components/QuestSequencerModal'
import DialogueEditorModal from './components/DialogueEditorModal'
import TriggerEditorModal from './components/TriggerEditorModal'
import AreaEditorModal from './components/AreaEditorModal'
import ScenarioManagerModal from './components/ScenarioManagerModal'
import CustomEventEditorModal from './components/CustomEventEditorModal'
import type { CustomEventData } from './editorTypes'
import { gameStore } from '../game/gameStore'
import { saveStoredScenario, getStoredScenarios, type StoredScenario } from '../game/scenarioStorage'

type EditorAppProps = {
  onBack: () => void
  /** 一鍵試玩成功載入後，通知上層切換至遊戲畫面。 */
  onPlaytest: () => void
  /** 受控的 scenario 狀態（由上層持有，試玩後保留編輯結果）。 */
  scenario: ScenarioDefinition
  /** 更新 scenario；支援直接值或函式更新（由上層以 setState 實作）。 */
  onScenarioChange: (scenario: ScenarioDefinition | ((prev: ScenarioDefinition) => ScenarioDefinition)) => void
}

function EditorApp({ onBack, onPlaytest, scenario, onScenarioChange }: EditorAppProps) {
  const [questModalOpen, setQuestModalOpen] = useState(false)
  const [dialogueModalOpen, setDialogueModalOpen] = useState(false)
  const [triggerModalOpen, setTriggerModalOpen] = useState(false)
  const [areaModalOpen, setAreaModalOpen] = useState(false)
  const [scenarioManagerOpen, setScenarioManagerOpen] = useState(false)
  const [customEventEntityId, setCustomEventEntityId] = useState<string | null>(null)
  const { brush, selectedEntityId, setSelectedEntityId, selectTerrainBrush, setBrushSize, selectEntityBrush, selectEraser, selectSelectTool, toggleSelectTool, toggleEraser } = useEditorSelection()
  const { push, undo, redo, canUndo, canRedo } = useEditorHistory()

  const selectedEntity = scenario.entities.find((e) => e.id === selectedEntityId) ?? null

  const takeSnapshot = useCallback((s: ScenarioDefinition) => ({
    cells: s.cells.map((c) => ({ ...c })),
    entities: s.entities.map((e) => ({ ...e, data: { ...e.data } })),
  }), [])

  const handlePaintCells = useCallback((paints: Array<{ row: number; column: number; terrain: TerrainType }>) => {
    if (paints.length === 0) return
    const snapshot = takeSnapshot(scenario)
    push(snapshot)
    onScenarioChange((prev) => {
      const paintSet = new Set(paints.map((p) => `${p.row}-${p.column}`))
      const terrainMap = new Map(paints.map((p) => [`${p.row}-${p.column}`, p.terrain]))
      const cells = prev.cells.map((c) =>
        paintSet.has(`${c.row}-${c.column}`)
          ? { ...c, terrain: terrainMap.get(`${c.row}-${c.column}`)! }
          : c
      )
      return { ...prev, cells }
    })
  }, [scenario, push, takeSnapshot, onScenarioChange])

  const generateEntityId = useCallback((kind: ScenarioEntityKind, position: Position) => {
    return `${kind}-${position.row}-${position.column}-${Date.now().toString(36)}`
  }, [])

  const handlePlaceEntity = useCallback((position: Position) => {
    if (brush.kind !== 'entity') return
    const existing = scenario.entities.find((e) => e.position.row === position.row && e.position.column === position.column)
    if (existing) return
    const snapshot = takeSnapshot(scenario)
    push(snapshot)
    const newEntity: ScenarioEntityPlacement = {
      id: generateEntityId(brush.entityKind, position),
      kind: brush.entityKind,
      position,
      data: { position, name: `${brush.entityKind}` },
    }
    onScenarioChange((prev) => ({ ...prev, entities: [...prev.entities, newEntity] }))
  }, [scenario, brush, push, takeSnapshot, generateEntityId, onScenarioChange])

  const handleEraseEntity = useCallback((position: Position) => {
    const existing = scenario.entities.find((e) => e.position.row === position.row && e.position.column === position.column)
    if (!existing) return
    const snapshot = takeSnapshot(scenario)
    push(snapshot)
    onScenarioChange((prev) => ({ ...prev, entities: prev.entities.filter((e) => e.id !== existing.id) }))
  }, [scenario, push, takeSnapshot, onScenarioChange])

  /** 將已選取的實體移動到指定位置（若該格為空）。 */
  const handleMoveEntity = useCallback((entityId: string, position: Position) => {
    const target = scenario.entities.find((e) => e.position.row === position.row && e.position.column === position.column)
    if (target) return
    const snapshot = takeSnapshot(scenario)
    push(snapshot)
    onScenarioChange((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => e.id === entityId ? { ...e, position } : e),
    }))
  }, [scenario, push, takeSnapshot, onScenarioChange])

  const handleUpdateEntity = useCallback((entityId: string, data: Record<string, unknown>) => {
    onScenarioChange((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => e.id === entityId ? { ...e, data: { ...e.data, ...data } } : e),
    }))
  }, [onScenarioChange])

  const handleUndo = useCallback(() => {
    const currentSnapshot = takeSnapshot(scenario)
    const snapshot = undo(currentSnapshot)
    if (!snapshot) return
    onScenarioChange((prev) => ({ ...prev, cells: snapshot.cells, entities: snapshot.entities }))
  }, [scenario, undo, takeSnapshot, onScenarioChange])

  const handleRedo = useCallback(() => {
    const currentSnapshot = takeSnapshot(scenario)
    const snapshot = redo(currentSnapshot)
    if (!snapshot) return
    onScenarioChange((prev) => ({ ...prev, cells: snapshot.cells, entities: snapshot.entities }))
  }, [scenario, redo, takeSnapshot, onScenarioChange])

  // 鍵盤快捷鍵：Ctrl+Z 撤銷、Ctrl+Y 或 Ctrl+Shift+Z 重做、S 選取、E 橡皮擦
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 若正在輸入文字（input/textarea），不觸發工具快捷鍵。
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      } else if (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault()
          toggleSelectTool()
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault()
          toggleEraser()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo, toggleSelectTool, toggleEraser])

  const handleSizeChange = useCallback((rows: number, columns: number) => {
    const snapshot = takeSnapshot(scenario)
    push(snapshot)
    onScenarioChange((prev) => {
      const cells: ScenarioCell[] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const existing = prev.cells.find((c) => c.row === row && c.column === column)
          cells.push(existing ?? { row, column, terrain: 'plain' as TerrainType })
        }
      }
      const entities = prev.entities.filter((e) => e.position.row < rows && e.position.column < columns)
      return { ...prev, mapSize: { rows, columns }, cells, entities }
    })
  }, [scenario, push, takeSnapshot, onScenarioChange])

  const handleTitleChange = useCallback((title: string) => {
    onScenarioChange((prev) => ({ ...prev, title }))
  }, [])

  // M1-4 預留：匯入匯出與試玩按鈕（目前先帶 placeholder）
  const handleExport = useCallback(() => {
    const json = JSON.stringify(scenario, null, 2)
    navigator.clipboard?.writeText(json).then(() => {
      alert('JSON 已複製到剪貼簿！')
    }).catch(() => {
      console.info('[編輯器] Scenario JSON', json)
      alert('請查看 Console 中的 JSON 輸出。')
    })
  }, [scenario])

  const handleImport = useCallback(() => {
    const input = prompt('貼上 Scenario JSON：')
    if (!input) return
    try {
      const parsed = JSON.parse(input) as ScenarioDefinition
      onScenarioChange(parsed)
      alert('匯入成功！')
    } catch {
      alert('JSON 格式錯式錯誤，匯入失敗。')
    }
  }, [])

  const handlePlaytest = useCallback(() => {
    const result = gameStore.loadScenario(scenario)
    if (result.ok) {
      message.success('關卡驗證通過，進入試玩！')
      onPlaytest()
    } else {
      message.error(result.reason ?? '關卡驗證失敗。')
    }
  }, [scenario, onPlaytest])

  // 儲存目前關卡：驗證至少一個勝利條件，寫回 localStorage。
  const handleSave = useCallback(() => {
    if (scenario.quests.victoryObjectives.length < 1) {
      message.error('關卡至少需要設定一個勝利條件才能儲存。')
      return
    }
    const existing = getStoredScenarios()[scenario.id]
    const entry: StoredScenario = {
      id: scenario.id,
      source: existing?.source ?? 'custom',
      sourceVersion: existing?.sourceVersion,
      modified: true,
      scenario,
    }
    saveStoredScenario(entry)
    message.success('關卡已儲存。')
  }, [scenario])

  // 從零新建：產生空白關卡並載入編輯器。
  const handleNew = useCallback(() => {
    const fresh = createEmptyScenario(15, 15)
    onScenarioChange(fresh)
    message.success('已建立新關卡。')
  }, [onScenarioChange])

  // 載入一個副本到編輯器。
  const handleLoadScenario = useCallback((loaded: ScenarioDefinition) => {
    onScenarioChange(loaded)
    message.success(`已載入「${loaded.title}」。`)
  }, [onScenarioChange])

  // 目前編輯中的自定義事件實體。
  const customEventEntity = customEventEntityId
    ? scenario.entities.find((e) => e.id === customEventEntityId) ?? null
    : null
  const customEventData = customEventEntity?.data.type === 'custom'
    ? customEventEntity.data as unknown as CustomEventData
    : null

  // 儲存自定義事件資料。
  const handleSaveCustomEvent = useCallback((data: CustomEventData) => {
    if (!customEventEntityId) return
    onScenarioChange((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => e.id === customEventEntityId ? { ...e, data: { ...data } } : e),
    }))
  }, [customEventEntityId, onScenarioChange])

  return (
    <Flex vertical style={{ height: '100vh', background: '#f0f2f5' }}>
      <EditorHeader
        title={scenario.title}
        onTitleChange={handleTitleChange}
        rows={scenario.mapSize.rows}
        columns={scenario.mapSize.columns}
        onSizeChange={handleSizeChange}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPlaytest={handlePlaytest}
        onExport={handleExport}
        onImport={handleImport}
        onSave={handleSave}
        onOpenScenarioManager={() => setScenarioManagerOpen(true)}
        onBack={onBack}
      />
      <Flex style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid #d9d9d9', overflowY: 'auto', background: '#fff' }}>
          <PaletteSidebar
            brush={brush}
            onSelectTerrain={selectTerrainBrush}
            onSetBrushSize={setBrushSize}
            onSelectEntity={selectEntityBrush}
            onSelectEraser={selectEraser}
            onSelectSelectTool={selectSelectTool}
            onOpenQuest={() => setQuestModalOpen(true)}
            onOpenDialogue={() => setDialogueModalOpen(true)}
            onOpenTrigger={() => setTriggerModalOpen(true)}
            onOpenArea={() => setAreaModalOpen(true)}
          />
        </div>
        <EditorCanvas
          cells={scenario.cells}
          rows={scenario.mapSize.rows}
          columns={scenario.mapSize.columns}
          entities={scenario.entities}
          brush={brush}
          selectedEntityId={selectedEntityId}
          onPaintCells={handlePaintCells}
          onPlaceEntity={handlePlaceEntity}
          onEraseEntity={handleEraseEntity}
          onMoveEntity={handleMoveEntity}
          onSelectEntity={setSelectedEntityId}
        />
        <div style={{ borderLeft: '1px solid #d9d9d9', overflowY: 'auto', background: '#fff' }}>
          <InspectorSidebar
            selectedEntity={selectedEntity}
            onUpdateEntity={handleUpdateEntity}
            onEditCustomEvent={(entityId) => setCustomEventEntityId(entityId)}
            bases={scenario.entities.filter((e) => e.kind === 'base')}
          />
        </div>
      </Flex>

      <QuestSequencerModal
        open={questModalOpen}
        scenario={scenario}
        onClose={() => setQuestModalOpen(false)}
        onUpdateQuests={(quests) => onScenarioChange((prev) => ({ ...prev, quests }))}
        onUpdateScenario={(patch) => onScenarioChange((prev) => ({ ...prev, ...patch }))}
      />
      <DialogueEditorModal
        open={dialogueModalOpen}
        scenario={scenario}
        onClose={() => setDialogueModalOpen(false)}
        onUpdateDialogues={(dialogues) => onScenarioChange((prev) => ({ ...prev, dialogues }))}
      />
      <TriggerEditorModal
        open={triggerModalOpen}
        scenario={scenario}
        onClose={() => setTriggerModalOpen(false)}
        onUpdateTriggers={(triggers) => onScenarioChange((prev) => ({ ...prev, triggers }))}
      />
      <AreaEditorModal
        open={areaModalOpen}
        scenario={scenario}
        onClose={() => setAreaModalOpen(false)}
        onUpdateAreas={(areas) => onScenarioChange((prev) => ({ ...prev, areas }))}
      />
      <ScenarioManagerModal
        open={scenarioManagerOpen}
        currentScenario={scenario}
        onClose={() => setScenarioManagerOpen(false)}
        onLoad={handleLoadScenario}
        onNew={handleNew}
      />
      <CustomEventEditorModal
        open={!!customEventEntityId}
        data={customEventData}
        onClose={() => setCustomEventEntityId(null)}
        onSave={handleSaveCustomEvent}
      />
    </Flex>
  )
}

export default EditorApp
