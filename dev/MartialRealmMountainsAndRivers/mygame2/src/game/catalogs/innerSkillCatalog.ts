import type { PlayerAttributes } from "../types"

export type InnerSkill = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightRequirement: number
  requiredHallLevel: number
  school?: string
  schoolId?: string
  element?: 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
  level?: number
  buffIds?: string[]
  /** 標記該內功不會從怪物/巢穴掉落（僅透過武館等指定途徑學習）。 */
  lootExcluded?: boolean
  /** 官方角色專屬：僅該 characterId 可學（事件掉落池、武館進度皆跳過）。 */
  exclusiveCharacterId?: string
  calculateDamage: (attributes: PlayerAttributes) => number
}

export const innerSkillCatalog: InnerSkill[] = [
  {
    id: 'tuna-gong',
    name: '吐納功',
    description: '調息養氣，均衡運轉五臟六腑。',
    formulaDescription: '五項基本屬性總和 ÷ 8（最低 1）',
    insightRequirement: 5,
    requiredHallLevel: 1,
    buffIds: ['tuna-gong-focus'],
    calculateDamage: (attributes) => Math.max(
      1,
      Math.floor(
        (attributes.armStrength +
          attributes.constitution +
          attributes.agility +
          attributes.innerEnergy +
          attributes.insight) / 8,
      ),
    ),
  },
]
