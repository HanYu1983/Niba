import { describe, expect, it } from 'vitest'
import { getCommandPanelSkills } from './commandPanelSkills'
import type { PlayerState } from '../types'
import type { ExternalSkill } from '../catalogs/externalSkillCatalog'

const makeSkill = (id: string, category: ExternalSkill['category']): ExternalSkill => ({
  id,
  name: id,
  description: '',
  formulaDescription: '',
  insightCost: 2,
  requiredHallLevel: 1,
  innerPowerCost: 4,
  target: 'target',
  category,
  calculateDamage: () => 1,
})

const makePlayer = (equippedExternalSkillIds: string[]): PlayerState => ({
  id: 'player-1',
  name: '測試',
  position: { row: 0, column: 0 },
  attributes: { armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 },
  baseAttributes: { armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 },
  health: 10,
  maxHealth: 10,
  maxStamina: 10,
  stamina: 10,
  maxInnerPower: 10,
  innerPower: 10,
  innerSkillId: 'tuna-gong',
  innerSkillIds: ['tuna-gong'],
  externalSkillIds: [],
  equippedExternalSkillIds,
  inventory: [],
  equipmentInventory: [],
  equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
  money: 0,
  prestige: 0,
  experience: 0,
  level: 1,
  turnEnded: false,
})

describe('getCommandPanelSkills', () => {
  const catalog: ExternalSkill[] = [
    makeSkill('damage-1', 'damage'),
    makeSkill('aura-1', 'aura'),
    makeSkill('damage-2', 'damage'),
    makeSkill('enhance-1', 'enhancement'),
  ]

  it('依裝備順序回傳非 aura 外功，排除靈氣型', () => {
    const player = makePlayer(['damage-1', 'aura-1', 'damage-2', 'enhance-1'])
    const result = getCommandPanelSkills(player, catalog)
    expect(result.map((skill) => skill.id)).toEqual(['damage-1', 'damage-2', 'enhance-1'])
  })

  it('無玩家時回傳空陣列', () => {
    expect(getCommandPanelSkills(null, catalog)).toEqual([])
  })

  it('未裝備任何外功時回傳空陣列', () => {
    expect(getCommandPanelSkills(makePlayer([]), catalog)).toEqual([])
  })
})