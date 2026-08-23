import type { PlayerAttributes } from "../types"
import type { FunctionalExternalSkillEffect } from "./functionalSkillRegistry"

export type ExternalSkillTarget = 'self' | 'target' | 'nest'

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
