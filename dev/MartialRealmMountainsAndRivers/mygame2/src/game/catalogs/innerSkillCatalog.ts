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
