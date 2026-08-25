import type { PlayerAttributes } from "../types"
import type { FunctionalExternalSkillEffect } from "./functionalSkillRegistry"
import type { AuraEffect, EnhancementActivationEffect } from "./skillFactory"
import type { SelectionMode, TargetingShape } from "../types"

export type ExternalSkillTarget = 'self' | 'target' | 'nest'
export type ExternalSkillCategory = 'damage' | 'aura' | 'enhancement'

export type ExternalSkill = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightCost: number
  requiredHallLevel: number
  school?: string
  schoolId?: string
  element?: 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
  level?: number
  innerPowerCost: number
  functionalEffect?: FunctionalExternalSkillEffect
  /** 靈氣型外功常駐 Buff；開啟功法即生效。 */
  passiveBuffIds?: string[]
  /** 靈氣型外功的結構化靈氣效果（地形、經驗增益等非純 Buff 效果）。 */
  auraEffect?: AuraEffect
  /** 強化型外功的主動效果；直接施放、立即完成，無冷卻、不消耗體力。 */
  activationEffect?: EnhancementActivationEffect
  category?: ExternalSkillCategory
  /** 指定目標的最遠曼哈頓距離；未設定時沿用相鄰目標規則（簡寫，等同 shape = radius(range)）。 */
  range?: number
  /** 範圍形狀（新框架）；未設定時依 range 推導 radius 形狀。 */
  shape?: TargetingShape
  /** 選取模式（新框架）；未設定時預設 single。 */
  selectionMode?: SelectionMode
  target: ExternalSkillTarget
  /** 標記該功法不會從怪物/巢穴掉落（僅透過武館等指定途徑學習）。 */
  lootExcluded?: boolean
  calculateDamage: (attributes: PlayerAttributes) => number
}

export const externalSkillCatalog: ExternalSkill[] = [
  {
    id: 'sky-breaking-palm',
    name: '破空掌',
    description: '凝聚內力打出掌勁，對相鄰單一敵人造成傷害。',
    formulaDescription: '臂力 × 0.6 + 內息 × 0.4（最低 1）',
    insightCost: 2,
    requiredHallLevel: 1,
    innerPowerCost: 3,
    target: 'target',
    calculateDamage: (attributes) => Math.max(1, attributes.armStrength * .6 + attributes.innerEnergy * .4) * .8,
  },
]