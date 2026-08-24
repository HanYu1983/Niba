import defensiveGuardianConfig from '../configs/defensive-guardian.json'
import creatureSiegerConfig from '../configs/creature-sieger.json'
import creatureScavengerConfig from '../configs/creature-scavenger.json'
import type { CreatureBehaviorType } from '../../rules/creatureBehaviorRules'
import {
  validateAiJsonPolicy,
  type AiJsonPolicy,
  type AiPolicyActorKind,
} from './aiJsonPolicy'

/**
 * 內建 AI Policy Registry（重構文件 §6.6／§6.8）：
 * - 第一階段只使用內建 JSON；載入時即執行 Schema＋白名單驗證。
 * - 查無 Policy 或設定無效時，使用同 actorKind 的預設 fallback，AI 回合不得卡死。
 * - 設定內容不寫入 GameState；存檔只需保存 Policy ID。
 */

const BUILTIN_CONFIGS: unknown[] = [
  defensiveGuardianConfig,
  creatureSiegerConfig,
  creatureScavengerConfig,
]

/** 載入並驗證一組 policy 設定：非法或重複 id 的項目被略過並回報錯誤（§6.7／§6.8）。 */
export function loadAiPolicyRegistry(rawConfigs: readonly unknown[]): {
  policies: Map<string, AiJsonPolicy>
  errors: string[]
} {
  const policies = new Map<string, AiJsonPolicy>()
  const errors: string[] = []
  for (const raw of rawConfigs) {
    const result = validateAiJsonPolicy(raw)
    if (!result.ok) {
      errors.push(`內建 policy 驗證失敗，已略過：${result.errors.join('；')}`)
      continue
    }
    if (policies.has(result.policy.id)) {
      errors.push(`內建 policy id 重複：${result.policy.id}，已略過後者。`)
      continue
    }
    policies.set(result.policy.id, result.policy)
  }
  return { policies, errors }
}

const loaded = loadAiPolicyRegistry(BUILTIN_CONFIGS)
const builtinPolicies = loaded.policies
for (const message of loaded.errors) {
  console.error(`[aiPolicyRegistry] ${message}`)
}

/** 驗證失敗時的預設人格：自保 → 反擊 → 待命（與既有行為門檻一致的最小集合）。 */
function makeDefaultPolicy(actorKind: AiPolicyActorKind): AiJsonPolicy {
  const result = validateAiJsonPolicy({
    id: actorKind === 'player' ? 'default-player' : 'default-creature',
    version: 1,
    actorKind,
    priorities: [
      { condition: 'self-preservation-needed', action: 'retreat', priority: 100 },
      { condition: 'adjacent-hostile', action: 'attack-adjacent-hostile', priority: 90 },
      { condition: 'no-threat', action: 'hold-position', priority: 10 },
    ],
  })
  if (!result.ok) {
    throw new Error(`預設 AI policy 驗證失敗：${result.errors.join('；')}`)
  }
  return result.policy
}

const defaultPolicies: Record<AiPolicyActorKind, AiJsonPolicy> = {
  player: makeDefaultPolicy('player'),
  creature: makeDefaultPolicy('creature'),
}

export const BUILTIN_POLICY_IDS: readonly string[] = [...builtinPolicies.keys()]
export const DEFAULT_PLAYER_POLICY_ID = 'defensive-guardian'

/** Creature 行為型別 → 內建 policy id；未對應的型別回傳 null（使用 fallback）。 */
export function getCreaturePolicyId(behaviorType: CreatureBehaviorType): string | null {
  if (behaviorType === 'sieger') return 'creature-sieger'
  if (behaviorType === 'scavenger') return 'creature-scavenger'
  return null
}

/**
 * 依 ID 取得已驗證的不可變 Policy；查無、ID 為空或 actorKind 不符時回傳
 * 同 actorKind 的預設 fallback（§6.8 Exception Handling）。
 */
export function getAiJsonPolicy(policyId: string | null | undefined, actorKind: AiPolicyActorKind): AiJsonPolicy {
  if (policyId) {
    const found = builtinPolicies.get(policyId)
    if (found && found.actorKind === actorKind) return found
  }
  return defaultPolicies[actorKind]
}
