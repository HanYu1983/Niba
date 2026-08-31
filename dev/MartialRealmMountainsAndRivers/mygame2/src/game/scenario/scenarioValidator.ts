import type { ScenarioDefinition, ScenarioEntityPlacement } from '../contracts/scenario'

/** 驗證結果：單一問題。 */
export type ScenarioValidationIssue = {
  severity: 'error' | 'warning'
  message: string
  /** 關聯的實體 id（若有）。 */
  entityId?: string
}

/** 驗證結果。 */
export type ScenarioValidationResult = {
  valid: boolean
  issues: ScenarioValidationIssue[]
}

/** 依 kind 取得實體清單。 */
function getEntitiesByKind(scenario: ScenarioDefinition, kind: ScenarioEntityPlacement['kind']): ScenarioEntityPlacement[] {
  return scenario.entities.filter((entity) => entity.kind === kind)
}

/**
 * 驗證關卡合法性。
 *
 * 檢查項目：
 * - 至少 1 名玩家起點
 * - 勝利目標不可為空
 * - 目標關聯的物件存在（defeat-creature / destroy-nest 的 targetId）
 * - 實體座標在地圖範圍內
 * - 據點/巢穴等不可重疊物件不衝突
 */
export function validateScenario(scenario: ScenarioDefinition): ScenarioValidationResult {
  const issues: ScenarioValidationIssue[] = []
  const { rows, columns } = scenario.mapSize

  // 1. 玩家起點
  const players = getEntitiesByKind(scenario, 'player')
  if (players.length === 0) {
    issues.push({ severity: 'error', message: '關卡必須至少放置 1 名玩家起點。' })
  }

  // 2. 勝利目標
  if (scenario.quests.victoryObjectives.length === 0) {
    issues.push({ severity: 'error', message: '關卡必須至少設定 1 個勝利目標。' })
  }

  // 3. 目標關聯物件存在性
  const allEntities = scenario.entities
  for (const objective of scenario.quests.victoryObjectives) {
    if (objective.targetId) {
      const exists = allEntities.some((entity) => entity.id === objective.targetId)
      if (!exists) {
        issues.push({
          severity: 'warning',
          message: `勝利目標「${objective.title}」關聯的物件「${objective.targetId}」已不存在。`,
        })
      }
    }
    // reach-position：需提供目標座標且在地圖範圍內。
    if (objective.type === 'reach-position') {
      if (objective.targetRow === undefined || objective.targetColumn === undefined) {
        issues.push({
          severity: 'error',
          message: `勝利目標「${objective.title}」為「到達指定位置」，需設定目標列與目標欄。`,
        })
      } else if (
        objective.targetRow < 0 || objective.targetRow >= rows ||
        objective.targetColumn < 0 || objective.targetColumn >= columns
      ) {
        issues.push({
          severity: 'error',
          message: `勝利目標「${objective.title}」的目標座標 (${objective.targetRow}, ${objective.targetColumn}) 超出地圖範圍 (${rows}×${columns})。`,
        })
      }
    }
    // interact-object：需提供 targetId。
    if (objective.type === 'interact-object' && !objective.targetId) {
      issues.push({
        severity: 'error',
        message: `勝利目標「${objective.title}」為「與物件互動」，需設定物件 ID。`,
      })
    }
  }

  // 4. 座標範圍檢查
  for (const entity of scenario.entities) {
    const { row, column } = entity.position
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      issues.push({
        severity: 'error',
        message: `實體「${entity.id}」座標 (${row}, ${column}) 超出地圖範圍 (${rows}×${columns})。`,
        entityId: entity.id,
      })
    }
  }

  // 5. 不可重疊物件衝突檢查（據點、巢穴、玩家、門派據點、防禦設施）
  const blockingKinds: ScenarioEntityPlacement['kind'][] = ['base', 'nest', 'player', 'sectGate', 'defenseStructure']
  const seen = new Map<string, ScenarioEntityPlacement>()
  for (const entity of scenario.entities) {
    if (!blockingKinds.includes(entity.kind)) continue
    const key = `${entity.position.row},${entity.position.column}`
    const existing = seen.get(key)
    if (existing) {
      issues.push({
        severity: 'error',
        message: `實體「${entity.id}」與「${existing.id}」位於同一格 (${entity.position.row}, ${entity.position.column})，不可重疊。`,
        entityId: entity.id,
      })
    } else {
      seen.set(key, entity)
    }
  }

  // 6. 自定義事件驗證
  for (const entity of scenario.entities) {
    if (entity.kind !== 'event') continue
    const data = entity.data as Record<string, unknown>
    if (data.type !== 'custom') continue
    if (!data.name || String(data.name).trim() === '') {
      issues.push({ severity: 'error', message: `自定義事件「${entity.id}」缺少名稱。`, entityId: entity.id })
    }
    const choices = (data.choices as Array<{ label?: string; effects?: unknown[] }> | undefined) ?? []
    if (choices.length === 0) {
      issues.push({ severity: 'error', message: `自定義事件「${entity.id}」至少需要一個選項。`, entityId: entity.id })
    }
    choices.forEach((choice, index) => {
      if (!choice.label || String(choice.label).trim() === '') {
        issues.push({ severity: 'error', message: `自定義事件「${entity.id}」的第 ${index + 1} 個選項缺少文字。`, entityId: entity.id })
      }
      if (!choice.effects || choice.effects.length === 0) {
        issues.push({ severity: 'error', message: `自定義事件「${entity.id}」的第 ${index + 1} 個選項缺少效果。`, entityId: entity.id })
      }
    })
  }

  return {
    valid: issues.every((issue) => issue.severity !== 'error'),
    issues,
  }
}