/**
 * Data-Driven AI JSON Policy（重構文件 §6.3／§6.7）：
 * - JSON 只描述條件、參數、優先級與行為順序；感知、路徑、驗證與執行仍留在 TypeScript。
 * - `condition`／`action` 必須屬於白名單，非法項目一律拒絕，不得執行任意內容。
 * - 驗證失敗回傳錯誤清單，交由呼叫端記錄並使用 fallback（§6.8）。
 */

export const SUPPORTED_AI_POLICY_VERSION = 1

export type AiConditionId =
  | 'self-preservation-needed'
  | 'adjacent-hostile'
  | 'protect-base-threatened'
  | 'outside-defense-radius'
  | 'support-target-too-far'
  | 'no-threat'
  | 'no-target'

export type AiActionId =
  | 'retreat'
  | 'attack-adjacent-hostile'
  | 'intercept-threat'
  | 'return-to-base-radius'
  | 'follow-support-target'
  | 'collect-resource'
  | 'wander'
  | 'hold-position'
  | 'end-turn'

export type AiPolicyActorKind = 'player' | 'creature'

export type AiPolicyPriority = Readonly<{
  condition: AiConditionId
  action: AiActionId
  priority: number
}>

export type AiJsonPolicy = {
  id: string
  version: number
  actorKind: AiPolicyActorKind
  emergency?: {
    minimumHealthPercent?: number
    surroundedEnemyCount?: number
    avoidFatalAttack?: boolean
  }
  priorities: ReadonlyArray<AiPolicyPriority>
  parameters?: Record<string, number | boolean | string>
}

export const AI_CONDITION_IDS: readonly AiConditionId[] = [
  'self-preservation-needed',
  'adjacent-hostile',
  'protect-base-threatened',
  'outside-defense-radius',
  'support-target-too-far',
  'no-threat',
  'no-target',
]

export const AI_ACTION_IDS: readonly AiActionId[] = [
  'retreat',
  'attack-adjacent-hostile',
  'intercept-threat',
  'return-to-base-radius',
  'follow-support-target',
  'collect-resource',
  'wander',
  'hold-position',
  'end-turn',
]

export type AiPolicyValidationResult =
  | { ok: true; policy: AiJsonPolicy }
  | { ok: false; errors: string[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** 白名單與 Schema 驗證（§6.7 全部規則）；通過後凍結為不可變 Policy。 */
export function validateAiJsonPolicy(raw: unknown): AiPolicyValidationResult {
  const errors: string[] = []
  if (!isRecord(raw)) {
    return { ok: false, errors: ['policy 必須是物件。'] }
  }

  if (typeof raw.id !== 'string' || raw.id.trim() === '') {
    errors.push('id 必須為非空字串。')
  }
  if (typeof raw.version !== 'number' || raw.version !== SUPPORTED_AI_POLICY_VERSION) {
    errors.push(`version 必須是目前支援的版本 ${SUPPORTED_AI_POLICY_VERSION}。`)
  }
  if (raw.actorKind !== 'player' && raw.actorKind !== 'creature') {
    errors.push('actorKind 必須是 player 或 creature。')
  }

  let emergency: AiJsonPolicy['emergency']
  if (raw.emergency !== undefined) {
    if (!isRecord(raw.emergency)) {
      errors.push('emergency 必須是物件。')
    } else {
      emergency = {}
      const minimumHealthPercent = raw.emergency.minimumHealthPercent
      if (minimumHealthPercent !== undefined) {
        if (typeof minimumHealthPercent !== 'number' || !Number.isFinite(minimumHealthPercent) || minimumHealthPercent < 0 || minimumHealthPercent > 100) {
          errors.push('emergency.minimumHealthPercent 必須是 0～100 的數值。')
        } else {
          emergency.minimumHealthPercent = minimumHealthPercent
        }
      }
      const surroundedEnemyCount = raw.emergency.surroundedEnemyCount
      if (surroundedEnemyCount !== undefined) {
        if (typeof surroundedEnemyCount !== 'number' || !Number.isFinite(surroundedEnemyCount) || surroundedEnemyCount < 0) {
          errors.push('emergency.surroundedEnemyCount 不得為負數。')
        } else {
          emergency.surroundedEnemyCount = surroundedEnemyCount
        }
      }
      const avoidFatalAttack = raw.emergency.avoidFatalAttack
      if (avoidFatalAttack !== undefined) {
        if (typeof avoidFatalAttack !== 'boolean') {
          errors.push('emergency.avoidFatalAttack 必須是布林值。')
        } else {
          emergency.avoidFatalAttack = avoidFatalAttack
        }
      }
    }
  }

  const priorities: AiPolicyPriority[] = []
  if (!Array.isArray(raw.priorities)) {
    errors.push('priorities 必須是陣列。')
  } else if (raw.priorities.length === 0) {
    errors.push('priorities 不得為空陣列。')
  } else {
    raw.priorities.forEach((item, index) => {
      if (!isRecord(item)) {
        errors.push(`priorities[${index}] 必須是物件。`)
        return
      }
      if (!AI_CONDITION_IDS.includes(item.condition as AiConditionId)) {
        errors.push(`priorities[${index}].condition「${String(item.condition)}」不在白名單。`)
        return
      }
      if (!AI_ACTION_IDS.includes(item.action as AiActionId)) {
        errors.push(`priorities[${index}].action「${String(item.action)}」不在白名單。`)
        return
      }
      if (typeof item.priority !== 'number' || !Number.isFinite(item.priority)) {
        errors.push(`priorities[${index}].priority 必須是有限數值。`)
        return
      }
      priorities.push({
        condition: item.condition as AiConditionId,
        action: item.action as AiActionId,
        priority: item.priority,
      })
    })
  }

  let parameters: AiJsonPolicy['parameters']
  if (raw.parameters !== undefined) {
    if (!isRecord(raw.parameters)) {
      errors.push('parameters 必須是物件。')
    } else {
      parameters = {}
      for (const [key, value] of Object.entries(raw.parameters)) {
        if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
          parameters[key] = value
        } else {
          errors.push(`parameters.${key} 必須是 number、boolean 或 string。`)
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const policy: AiJsonPolicy = Object.freeze({
    id: raw.id as string,
    version: raw.version as number,
    actorKind: raw.actorKind as AiPolicyActorKind,
    ...(emergency ? { emergency: Object.freeze(emergency) } : {}),
    priorities: Object.freeze(priorities.map((item) => Object.freeze(item))),
    ...(parameters ? { parameters: Object.freeze(parameters) } : {}),
  })
  return { ok: true, policy }
}
