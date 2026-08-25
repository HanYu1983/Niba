import { describe, expect, it } from 'vitest'
import {
  BUILTIN_POLICY_IDS,
  DEFAULT_PLAYER_POLICY_ID,
  getAiJsonPolicy,
  getCreatureAiParameters,
  getCreaturePolicyId,
  getPlayerAiEmergency,
  loadAiPolicyRegistry,
} from './aiPolicyRegistry'
import { CREATURE_AGGRO_RANGES, getCreatureAggroRange } from '../../rules/creatureBehaviorRules'

/**
 * 切片 H：內建 policy 載入與 fallback（重構文件 §6.6／§6.8）。
 * 內建 config 必須通過驗證；查無 ID／actorKind 不符時使用同類預設，不得讓 AI 回合卡死。
 */
describe('aiPolicyRegistry', () => {
  it('內建 defensive-guardian／creature-sieger／creature-scavenger 皆已載入且驗證通過', () => {
    expect(BUILTIN_POLICY_IDS).toEqual(['defensive-guardian', 'creature-sieger', 'creature-scavenger'])

    const guardian = getAiJsonPolicy('defensive-guardian', 'player')
    expect(guardian.id).toBe('defensive-guardian')
    expect(guardian.actorKind).toBe('player')
    expect(guardian.emergency?.minimumHealthPercent).toBe(10)

    const sieger = getAiJsonPolicy('creature-sieger', 'creature')
    expect(sieger.priorities.map((item) => item.action)).toContain('intercept-threat')

    const scavenger = getAiJsonPolicy('creature-scavenger', 'creature')
    expect(scavenger.priorities.map((item) => item.action)).toContain('collect-resource')
  })

  it('未知 ID → 使用同 actorKind 的預設 fallback', () => {
    const fallbackPlayer = getAiJsonPolicy('no-such-policy', 'player')
    expect(fallbackPlayer.id).toBe('default-player')
    expect(fallbackPlayer.actorKind).toBe('player')

    const fallbackCreature = getAiJsonPolicy(undefined, 'creature')
    expect(fallbackCreature.id).toBe('default-creature')
    // fallback 也必須有可執行的優先序（自保最高）。
    expect(fallbackCreature.priorities[0].condition).toBe('self-preservation-needed')
  })

  it('actorKind 不符（拿 creature policy 給 player）→ fallback，不跨型別套用', () => {
    const policy = getAiJsonPolicy('creature-sieger', 'player')
    expect(policy.id).toBe('default-player')
  })

  it('getCreaturePolicyId：sieger／scavenger 對應內建 config，其他行為回傳 null（fallback）', () => {
    expect(getCreaturePolicyId('sieger')).toBe('creature-sieger')
    expect(getCreaturePolicyId('scavenger')).toBe('creature-scavenger')
    for (const behaviorType of ['hunter', 'wanderer', 'roamer'] as const) {
      expect(getCreaturePolicyId(behaviorType)).toBeNull()
    }
  })

  it('載入失敗路徑：非法 config 與重複 id 會被略過並回報錯誤，合法項目照常註冊', () => {
    const { policies, errors } = loadAiPolicyRegistry([
      { id: 'broken', version: 99, actorKind: 'player', priorities: [{ condition: 'bad', action: 'worse', priority: 1 }] },
      {
        id: 'custom-guardian',
        version: 1,
        actorKind: 'player',
        priorities: [{ condition: 'no-threat', action: 'hold-position', priority: 10 }],
      },
      {
        id: 'custom-guardian',
        version: 1,
        actorKind: 'creature',
        priorities: [{ condition: 'no-target', action: 'wander', priority: 5 }],
      },
    ])
    // 非法與重複者被拒；唯一合法的 custom-guardian（先註冊者）保留。
    expect([...policies.keys()]).toEqual(['custom-guardian'])
    expect(errors).toHaveLength(2)
    expect(errors[0]).toContain('驗證失敗')
    expect(errors[1]).toContain('id 重複')
    expect(policies.get('custom-guardian')?.actorKind).toBe('player')
  })

  it('玩家 AI 預設 policy id 常數指向內建 defensive-guardian', () => {
    expect(DEFAULT_PLAYER_POLICY_ID).toBe('defensive-guardian')
    expect(getAiJsonPolicy(DEFAULT_PLAYER_POLICY_ID, 'player').id).toBe('defensive-guardian')
  })
})

describe('切片 K：policy 消費 resolvers', () => {
  it('getPlayerAiEmergency 回 defensive-guardian 的 emergency（與既有常數一致）', () => {
    expect(getPlayerAiEmergency()).toEqual({ minimumHealthPercent: 10, surroundedEnemyCount: 2, avoidFatalAttack: true })
  })

  it('getCreatureAiParameters：scavenger 讀內建 parameters；sieger 走 fallback 無參數', () => {
    expect(getCreatureAiParameters('scavenger')).toEqual({ aggroRange: 5 })
    expect(getCreatureAiParameters('sieger')).toBeUndefined()
  })

  it('getCreatureAggroRange：policy parameters 優先、fallback 人格退回常數表（零行為變化）', () => {
    // scavenger 的 aggroRange 來自 creature-scavenger.json parameters（=5，與常數一致）。
    expect(getCreatureAggroRange('scavenger')).toBe(5)
    // hunter 沒有對應 policy → default-creature 無 parameters → 常數表。
    expect(getCreatureAggroRange('hunter')).toBe(CREATURE_AGGRO_RANGES.hunter)
    expect(getCreatureAggroRange('sieger')).toBe(CREATURE_AGGRO_RANGES.sieger)
  })
})
