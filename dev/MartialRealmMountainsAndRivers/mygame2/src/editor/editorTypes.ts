import type { TerrainType } from '../game/types'
import type { EventEffect, EventRequirement } from '../game/events/eventCatalog'
import type {
  ScenarioArea,
  ScenarioCell,
  ScenarioDefinition,
  ScenarioDialogueGroup,
  ScenarioEntityKind,
  ScenarioEntityPlacement,
  ScenarioTrigger,
} from '../game/contracts/scenario'
import { createEmptyScenario } from '../game/contracts/scenario'

/**
 * 編輯器專屬型別定義。
 * ScenarioDefinition 是編輯器的核心資料結構，可透過 scenarioCompiler
 * 轉化為標準 GameState。
 */

// 劇本契約型別已下沉至 game/contracts/scenario，此處 re-export 供既有引用相容。
export type {
  ScenarioArea,
  ScenarioCell,
  ScenarioDefinition,
  ScenarioDialogueGroup,
  ScenarioEntityKind,
  ScenarioEntityPlacement,
  ScenarioTrigger,
}
export { createEmptyScenario }

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
