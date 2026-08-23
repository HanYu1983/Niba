import type { TerrainType, Position } from '../game/types'
import type { EventEffect, EventRequirement } from '../game/events/eventCatalog'

/**
 * 編輯器專屬型別定義。
 * ScenarioDefinition 是編輯器的核心資料結構，可透過 scenarioCompiler
 * 轉化為標準 GameState。
 */

/** 自定義探索事件的選項。 */
export type CustomEventChoice = {
  id: string
  label: string
  description: string
  endsPlayerTurn: boolean
  requirements: EventRequirement[]
  effects: EventEffect[]
  /** 自訂結果彈窗訊息（可選；未填時自動由效果生成）。 */
  resultMessage?: string
}

/** 自定義探索事件的完整定義（data.type === 'custom'）。 */
export type CustomEventData = {
  type: 'custom'
  name: string
  description: string
  icon: string
  choices: CustomEventChoice[]
}

export type ScenarioCell = {
  row: number
  column: number
  terrain: TerrainType
  customMetadata?: Record<string, unknown>
}

export type ScenarioEntityKind =
  | 'player'
  | 'base'
  | 'creature'
  | 'nest'
  | 'ruin'
  | 'resourcePoint'
  | 'itemPoint'
  | 'event'
  | 'sectGate'
  | 'defenseStructure'

export type ScenarioEntityPlacement = {
  id: string
  kind: ScenarioEntityKind
  position: Position
  data: Record<string, unknown>
}

export type ScenarioDefinition = {
  version: string
  id: string
  title: string
  description: string
  chapterIndex: number
  mapSize: { rows: number; columns: number }
  cells: ScenarioCell[]
  entities: ScenarioEntityPlacement[]
  /** 是否啟用回合結束隨機探索事件（劇本地圖預設關閉）。 */
  enableRandomEvents?: boolean
  /** 探索點消失後是否補充新探索點（劇本模式預設關閉）。 */
  replenishExplorationEvents?: boolean
  quests: {
    victoryObjectives: Array<{
      id: string
      title: string
      type: string
      targetId?: string
      targetValue: number
      isOptional?: boolean
      /** 目標指定的到達位置列（reach-position 目標用）。 */
      targetRow?: number
      /** 目標指定的到達位置欄（reach-position 目標用）。 */
      targetColumn?: number
      /** 目標指定的建築類型（build-building 目標用，如 'infirmary'）。 */
      buildingType?: string
      /** 目標指定的建築等級（build-building 目標用，如 3 表示三級）。 */
      buildingLevel?: number
      /** 目標指定的防禦設施類型（build-defense-structure 目標用）。 */
      structureType?: string
      customMetadata?: Record<string, unknown>
    }>
    failConditions: {
      maxRounds?: number
      baseMustSurvive?: boolean
      playerMustSurvive?: boolean
      criticalBases?: string[]
      maxLostBasesCount?: number
      customConditions?: Array<{ type: string; param?: unknown }>
    }
  }
  /** 對話組：以對話組 id 為鍵，每個組有 name 與 steps（純腳本，不含觸發條件）。 */
  dialogues: Record<string, ScenarioDialogueGroup>
  /** 事件觸發器：以「時機 → 行為 → id」統一管理觸發。 */
  triggers?: ScenarioTrigger[]
  customMetadata?: Record<string, unknown>
}

/** 對話組：一組對話腳本，觸發時機由觸發器（triggers）統一設定。 */
export type ScenarioDialogueGroup = {
  /** 對話組名稱（顯示用）。 */
  name: string
  /** 對話步驟（純腳本，不含觸發條件）。 */
  steps: Array<{
    id: string
    speakerName: string
    speakerIcon: string
    content: string
    customMetadata?: Record<string, unknown>
  }>
}

/** 事件觸發器：時機（condition）→ 行為（action）→ 參數（actionParam）。 */
export type ScenarioTrigger = {
  id: string
  /** 觸發時機（沿用 DialogueTriggerCondition）。 */
  condition: string
  /** 時機參數（如擊敗的 boss id、進入區域座標、回合數）。 */
  conditionParam?: string
  /** 行為類型。 */
  action: 'start-dialogue' | 'spawn-creature'
  /** 行為參數（對話組 id / 怪物 id）。 */
  actionParam: string
}

/** 筆刷工具類型。 */
export type BrushTool =
  | { kind: 'terrain'; terrain: TerrainType; size: 1 | 2 | 3 }
  | { kind: 'entity'; entityKind: ScenarioEntityKind }
  | { kind: 'eraser' }
  | { kind: 'select' }

/** 編輯器操作歷史記錄的快照。 */
export type EditorSnapshot = {
  cells: ScenarioCell[]
  entities: ScenarioEntityPlacement[]
}

/** 建立一個空白 ScenarioDefinition。 */
export function createEmptyScenario(rows = 15, columns = 15): ScenarioDefinition {
  const cells: ScenarioCell[] = []
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      cells.push({ row, column, terrain: 'plain' })
    }
  }
  return {
    version: '1.0.0',
    id: `scenario-${Date.now()}`,
    title: '未命名關卡',
    description: '',
    chapterIndex: 0,
    mapSize: { rows, columns },
    cells,
    entities: [],
    quests: {
      victoryObjectives: [],
      failConditions: {
        baseMustSurvive: true,
        playerMustSurvive: true,
      },
    },
    dialogues: {},
    triggers: [],
  }
}
