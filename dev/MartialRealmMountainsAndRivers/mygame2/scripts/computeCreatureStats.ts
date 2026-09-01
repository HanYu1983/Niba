import { getCreatureAttributes, CREATURE_SCHOOL_ATTRIBUTE_MODIFIERS } from '../src/game/rules/creatureBehaviorRules'
import type { MartialSchoolId } from '../src/game/catalogs/martialSchoolCatalog'

const base = { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 4 }

const order: MartialSchoolId[] = Object.keys(CREATURE_SCHOOL_ATTRIBUTE_MODIFIERS) as MartialSchoolId[]

for (const id of order) {
  console.log(`\n=== ${id} ===`)
  console.log('LV | 臂力 | 根骨 | 身法 | 內息 | 悟性')
  for (let level = 1; level <= 10; level++) {
    const a = getCreatureAttributes(base, { schoolId: id, behaviorType: 'hunter' }, level)
    console.log(`${String(level).padStart(2)} | ${a.armStrength} | ${a.constitution} | ${a.agility} | ${a.innerEnergy} | ${a.insight}`)
  }
}