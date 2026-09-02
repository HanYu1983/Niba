import type { AiPersonalityId } from '../../types/ai'
import { clampValue, computeUnifiedValue, evaluateUnifiedValue, type ValueEvaluation } from './valueContext'

/**
 * 戰鬥候選的輸入情境。
 *
 * 每個欄位都是「評估一個可見生物是否值得攻擊」所需的連續狀態，
 * 由 `fuzzyInputs.ts` 的 `computeFuzzyInputs` 對每個可見生物計算後填入。
 */
export type CombatValueContext = {
  /** 玩家到該生物的曼哈頓距離（格數）。 */
  distance: number
  /** 該生物目前血量 / 最大血量（0~1）。血量越低越容易擊殺。 */
  healthRatio: number
  /** 玩家一回合總傷害 / 該生物最大血量（0~1）。越高代表越可能快速擊殺。 */
  damageRatio: number
  /** 玩家能扛住該生物幾次攻擊（玩家血量 / 敵方單次傷害）。越高越安全。 */
  hitsSurvivable: number
  /** 玩家目前體力 / 最大體力（0~1）。體力越高越有餘裕戰鬥。 */
  staminaRatio: number
  /** 該生物等級。等級越高擊殺後經驗獎勵越高。 */
  level: number
  /** AI 性格（影響攻擊傾向的加權）。 */
  personality?: AiPersonalityId
}

/**
 * 計算「可見生物的相對攻擊價值」。
 *
 * 這是模糊決策中「選哪隻怪打」的候選排序核心：對每個可見生物算出一個 0~1 的價值分數，
 * 分數越高代表「這隻怪越值得現在打」。目標的合法性（距離、體力、目標存活）由 action validation 另行把關，
 * 此函式只負責「相對優劣」的量化。
 *
 * 價值由五個面向合成（見下方各變數），最後交給 `evaluateUnifiedValue` 做統一聚合。
 */
export function evaluateCombatCandidateValue(context: CombatValueContext): ValueEvaluation {
  // ── 擊殺機會（killOpportunity）────────────────────────────
  // 一回合總傷 / 敵方血量 越高，越可能快速擊殺 → 機會越大。
  // 乘 1.5 放大差異，再 clamp 到 0~1。damageRatio=1（一回殺）→ 1.0；damageRatio=0.5 → 0.75。
  const killOpportunity = clampValue(context.damageRatio * 1.5)

  // ── 脆弱度（vulnerability）───────────────────────────────
  // 敵方血量越低越脆弱、越容易補刀。1 - healthRatio：滿血 → 0，殘血 → 接近 1。
  const vulnerability = clampValue(1 - context.healthRatio)

  // ── 生存餘裕（survival）──────────────────────────────────
  // 玩家能扛幾次攻擊。扛 5 次以上視為安全（clamp 到 1），扛得越少越危險。
  const survival = clampValue(context.hitsSurvivable / 5)

  // ── 等級獎勵（levelReward）───────────────────────────────
  // 敵方等級越高，擊殺後經驗/掉落獎勵越好。Lv.10 以上視為滿獎勵（clamp 到 1）。
  const levelReward = clampValue(context.level / 10)

  // ── 風險（risk）──────────────────────────────────────────
  // 依「能扛幾次攻擊」分級懲罰：
  //   hitsSurvivable < 1 → 扛不住一次 → 風險 1（最高懲罰）
  //   hitsSurvivable < 2 → 只能扛一次 → 風險 0.5（中等懲罰）
  //   否則 → 風險 0（無懲罰）
  // 此值會轉成 riskPenalty = 1 - risk*0.5，最多扣 50% 價值。
  const risk = context.hitsSurvivable < 1 ? 1 : context.hitsSurvivable < 2 ? 0.5 : 0

  // ── 性格加權（personalityMultiplier）─────────────────────
  // 好戰型（aggressive）攻擊傾向 ×1.15；謹慎型（cautious）/護衛型（guardian）×0.85；其餘 ×1。
  const personalityMultiplier = context.personality === 'aggressive' ? 1.15
    : context.personality === 'cautious' || context.personality === 'guardian' ? 0.85
      : 1

  // ── 統一聚合 ──────────────────────────────────────────────
  // 五個面向餵給 evaluateUnifiedValue，最終價值 = need × benefit × urgency × riskPenalty × costPenalty × distanceDecay × personalityWeight。
  return evaluateUnifiedValue({
    // need（需求）：體力越充足越有餘裕戰鬥。0.5 + staminaRatio*0.5 → 體力滿時 1.0、體力 0 時 0.5。
    need: clampValue(0.5 + context.staminaRatio * 0.5),
    // benefit（效益）：擊殺機會佔 45%、脆弱度 20%、生存餘裕 15%、等級獎勵 20%。
    benefit: killOpportunity * 0.45 + vulnerability * 0.2 + survival * 0.15 + levelReward * 0.2,
    // urgency（急迫）：直接以擊殺機會為急迫度——越能快速擊殺越該現在打。
    urgency: killOpportunity,
    // risk（風險）：見上方 risk 變數，轉成 riskPenalty 扣分。
    risk,
    // cost（成本）：體力越低成本越高。1 - staminaRatio → 體力滿時 0、體力 0 時 1。
    cost: clampValue(1 - context.staminaRatio),
    // distance（距離）：交給 distanceDecay 做距離衰減（每格扣 5%，10 格以上歸零）。
    distance: context.distance,
    // personalityWeight（性格權重）：見上方 personalityMultiplier。
    personalityWeight: personalityMultiplier,
  })
}

/** 直接回傳 0~1 的戰鬥候選價值數值（供排序用）。 */
export function computeCombatCandidateValue(context: CombatValueContext): number {
  return computeUnifiedValue(evaluateCombatCandidateValue(context).context)
}