import { describe, expect, it } from 'vitest'
import {
  AI_ACTION_IDS,
  AI_CONDITION_IDS,
  SUPPORTED_AI_POLICY_VERSION,
  validateAiJsonPolicy,
} from './aiJsonPolicy'

/**
 * 切片 H：JSON policy 白名單與 Schema 驗證（重構文件 §6.7）。
 * 非法 condition／action 一律拒絕；數值範圍與型別不符必須回報錯誤。
 */
describe('validateAiJsonPolicy', () => {
  const validPolicy = {
    id: 'defensive-guardian',
    version: 1,
    actorKind: 'player',
    emergency: { minimumHealthPercent: 10, surroundedEnemyCount: 2, avoidFatalAttack: true },
    priorities: [
      { condition: 'self-preservation-needed', action: 'retreat', priority: 100 },
      { condition: 'no-threat', action: 'hold-position', priority: 10 },
    ],
  }

  it('合法 policy 通過驗證並凍結為不可變物件', () => {
    const result = validateAiJsonPolicy(validPolicy)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.policy.id).toBe('defensive-guardian')
      expect(Object.isFrozen(result.policy)).toBe(true)
      expect(Object.isFrozen(result.policy.priorities)).toBe(true)
      expect(Object.isFrozen(result.policy.priorities[0])).toBe(true)
      expect(Object.isFrozen(result.policy.emergency)).toBe(true)
    }
  })

  it('非物件輸入被拒', () => {
    for (const raw of [null, undefined, 'policy', 42, []]) {
      expect(validateAiJsonPolicy(raw).ok).toBe(false)
    }
  })

  it.each([
    ['id 缺失', { ...validPolicy, id: undefined }],
    ['id 空字串', { ...validPolicy, id: '   ' }],
    ['版本不支援', { ...validPolicy, version: SUPPORTED_AI_POLICY_VERSION + 1 }],
    ['actorKind 非法', { ...validPolicy, actorKind: 'npc' }],
  ])('%s → 拒絕且錯誤訊息對應欄位', (_name, raw) => {
    const result = validateAiJsonPolicy(raw)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.length).toBeGreaterThan(0)
  })

  it('condition 不在白名單 → 該項目被拒', () => {
    const result = validateAiJsonPolicy({
      ...validPolicy,
      priorities: [{ condition: 'destroy-everything', action: 'retreat', priority: 99 }],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]).toContain('condition')
  })

  it('action 不在白名單 → 該項目被拒', () => {
    const result = validateAiJsonPolicy({
      ...validPolicy,
      priorities: [{ condition: 'no-threat', action: 'eval("alert(1)")', priority: 10 }],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]).toContain('action')
  })

  it('priority 非有限數值（NaN／Infinity／字串）→ 拒絕', () => {
    for (const priority of [Number.NaN, Number.POSITIVE_INFINITY, 'high']) {
      const result = validateAiJsonPolicy({
        ...validPolicy,
        priorities: [{ condition: 'no-threat', action: 'hold-position', priority }],
      })
      expect(result.ok).toBe(false)
    }
  })

  it('emergency 數值範圍驗證：生命百分比限 0～100、包圍數不得為負、avoidFatalAttack 必為布林', () => {
    expect(validateAiJsonPolicy({ ...validPolicy, emergency: { minimumHealthPercent: 101 } }).ok).toBe(false)
    expect(validateAiJsonPolicy({ ...validPolicy, emergency: { minimumHealthPercent: -1 } }).ok).toBe(false)
    expect(validateAiJsonPolicy({ ...validPolicy, emergency: { surroundedEnemyCount: -2 } }).ok).toBe(false)
    expect(validateAiJsonPolicy({ ...validPolicy, emergency: { avoidFatalAttack: 'yes' } }).ok).toBe(false)
    expect(validateAiJsonPolicy({ ...validPolicy, emergency: { minimumHealthPercent: 0, surroundedEnemyCount: 0 } }).ok).toBe(true)
  })

  it('priorities 缺失或空陣列 → 拒絕；單一壞項目不影響其他項目判斷（全部彙報）', () => {
    expect(validateAiJsonPolicy({ ...validPolicy, priorities: [] }).ok).toBe(false)
    expect(validateAiJsonPolicy({ ...validPolicy, priorities: undefined }).ok).toBe(false)
    const result = validateAiJsonPolicy({
      ...validPolicy,
      priorities: [
        { condition: 'bad-condition', action: 'retreat', priority: 100 },
        { condition: 'no-threat', action: 'hold-position', priority: 10 },
      ],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors).toHaveLength(1)
  })

  it('parameters 僅接受 number／boolean／string（巢狀結構被拒，無法夾帶任意內容）', () => {
    expect(validateAiJsonPolicy({ ...validPolicy, parameters: { aggroRange: 5, aggressive: true, label: '守衛' } }).ok).toBe(true)
    const result = validateAiJsonPolicy({ ...validPolicy, parameters: { nested: { deep: 1 } } })
    expect(result.ok).toBe(false)
  })

  it('白名單常數與設計文件 §6.3 一致（防手滑改動）', () => {
    expect(AI_CONDITION_IDS).toHaveLength(7)
    expect(AI_ACTION_IDS).toHaveLength(9)
    expect(AI_CONDITION_IDS).toContain('self-preservation-needed')
    expect(AI_ACTION_IDS).toContain('collect-resource')
  })
})
