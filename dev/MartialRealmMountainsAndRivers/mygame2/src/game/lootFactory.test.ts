import { describe, expect, it } from 'vitest'
import { equipmentCatalog } from './catalogs/equipmentCatalog'
import { itemCatalog } from './catalogs/itemCatalog'
import { itemPointLootCatalog, lootCatalog } from './types'
import { createItemPointLootForPlayer, createLootForPlayer, getLearnableSkill, getTierWeight } from './lootFactory'
import { allExternalSkillCatalog, allInnerSkillCatalog } from './catalogs/martialHallSkillCatalog'
import { jianghuExternalSkills } from './catalogs/jianghuExternalSkillCatalog'
import { terrainItemPointLootCatalog } from './catalogs/terrainLootCatalog'

function getSkillLootRoll(player: { innerSkillIds: string[]; externalSkillIds: string[] }, level: number): number {
  const itemWeight = itemCatalog
    .filter((item) => (item.requiredShopLevel ?? 1) <= level)
    .reduce((total, item) => total + getTierWeight(item.requiredShopLevel ?? 1), 0)
  const learnedInnerIds = new Set(player.innerSkillIds)
  const learnedExternalIds = new Set(player.externalSkillIds)
  const skillWeight = [
    ...allInnerSkillCatalog.filter((skill) => !learnedInnerIds.has(skill.id)),
    ...allExternalSkillCatalog.filter((skill) => !learnedExternalIds.has(skill.id)),
  ]
    .filter((skill) => !(skill as { lootExcluded?: boolean }).lootExcluded && (skill.requiredHallLevel ?? 1) <= level)
    .reduce((total, skill) => total + getTierWeight(skill.requiredHallLevel ?? 1), 0)
  const equipmentWeight = equipmentCatalog
    .filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel <= level)
    .reduce((total, equipment) => total + getTierWeight(equipment.requiredShopLevel), 0)
  const totalWeight = itemWeight + skillWeight + equipmentWeight
  return (itemWeight + skillWeight / 2) / totalWeight
}

describe('loot catalogs', () => {
  it('保留可擴充的額外怪物掉落池', () => {
    expect(lootCatalog).toHaveLength(0)
  })

  it('道具點掉落池包含 1~2 級道具與裝備且不包含功法', () => {
    const itemIds = new Set(itemPointLootCatalog.filter((loot) => loot.kind === 'item').map((loot) => loot.itemId))
    const equipmentIds = new Set(itemPointLootCatalog.filter((loot) => loot.kind === 'equipment').map((loot) => loot.equipmentId))

    // 道具點只掉落 1~2 級道具
    const lowLevelItems = itemCatalog.filter((item) => (item.requiredShopLevel ?? 1) <= 2)
    expect(itemIds).toEqual(new Set(lowLevelItems.map((item) => item.id)))
    expect(itemIds.size).toBeGreaterThan(0)
    expect(itemCatalog.filter((item) => (item.requiredShopLevel ?? 1) > 2).every((item) => !itemIds.has(item.id))).toBe(true)
    // 道具點只掉落 1~2 級裝備
    const lowLevelEquipment = equipmentCatalog.filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel <= 2)
    expect(equipmentIds).toEqual(new Set(lowLevelEquipment.map((equipment) => equipment.id)))
    expect(equipmentIds.size).toBeGreaterThan(0)
    expect(equipmentCatalog.filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel > 2).every((equipment) => !equipmentIds.has(equipment.id))).toBe(true)
    expect(itemPointLootCatalog.every((loot) => loot.kind !== 'skill')).toBe(true)
  })

  it('所有有屬性的道具與裝備都歸入且只歸入一個地形分類', () => {
    const assigned = Object.values(terrainItemPointLootCatalog).flat()
      .filter((loot) => loot.kind !== 'skill')
      .map((loot) => loot.kind === 'item' ? `item:${loot.itemId}` : `equipment:${loot.equipmentId}`)
    const expected = [
      ...itemCatalog.filter((item) => !(item.effect === 'element-burst' && item.element === 'none')).map((item) => `item:${item.id}`),
      ...equipmentCatalog.filter((equipment) => !equipment.schoolId).map((equipment) => `equipment:${equipment.id}`),
    ]
    expect(new Set(assigned)).toEqual(new Set(expected))
    expect(assigned).toHaveLength(expected.length)
  })

  it('元素爆發道具依五行分配到唯一地形', () => {
    const terrainByElement = {
      plain: ['earth'],
      forest: ['wood'],
      water: ['water'],
      desert: ['fire'],
      mountain: ['metal'],
    } as const
    const elementItems = itemCatalog.filter((item) => item.effect === 'element-burst' && item.element !== 'none')
    for (const item of elementItems) {
      const assignedTerrains = Object.entries(terrainItemPointLootCatalog)
        .filter(([, loot]) => loot.some((entry) => entry.kind === 'item' && entry.itemId === item.id))
        .map(([terrain]) => terrain as keyof typeof terrainByElement)
      expect(assignedTerrains).toHaveLength(1)
      expect(terrainByElement[assignedTerrains[0]]).toContain(item.element)
    }
    const neutralItems = itemCatalog.filter((item) => item.effect === 'element-burst' && item.element === 'none')
    for (const item of neutralItems) {
      expect(Object.values(terrainItemPointLootCatalog).flat().some((loot) => loot.kind === 'item' && loot.itemId === item.id)).toBe(false)
    }
  })

  it('道具點可依地形抽取地形特產', () => {
    const originalRandom = Math.random
    Math.random = () => 0.999
    try {
      const loot = createItemPointLootForPlayer({ id: 'p1' } as never, 'forest')
      expect(['recover-qi-pill', 'gather-qi-talisman', 'hobble-rope', 'swift-boots', 'bamboo-staff', 'insight-talisman', 'spirit-bracelet', 'celestial-robe']).toContain(
        loot.kind === 'item' ? loot.itemId : loot.kind === 'equipment' ? loot.equipment.id : '',
      )
    } finally {
      Math.random = originalRandom
    }
  })

  it('怪物擊殺時會從所有道具與尚未學會的功法中隨機掉落', () => {
    const player = {
      innerSkillIds: allInnerSkillCatalog.slice(0, -1).map((skill) => skill.id),
      externalSkillIds: allExternalSkillCatalog.slice(0, -1).map((skill) => skill.id),
    } as never

    const originalRandom = Math.random
    Math.random = () => 0
    try {
      const loot = createLootForPlayer(player, 1)
      // 掉落池同時包含道具與功法；Math.random=0 會選中第一個（道具）。
      expect(loot?.kind).toBe('item')
      if (loot?.kind === 'item') {
        expect(itemCatalog.some((item) => item.id === loot.itemId)).toBe(true)
      }
    } finally {
      Math.random = originalRandom
    }
  })

  it('怪物擊殺時可掉落尚未學會的功法', () => {
    const player = {
      innerSkillIds: allInnerSkillCatalog.slice(0, -1).map((skill) => skill.id),
      externalSkillIds: allExternalSkillCatalog.slice(0, -1).map((skill) => skill.id),
    } as never

    const originalRandom = Math.random
    // 讓 roll 穩定落在功法區段（道具之後、裝備之前）。
    Math.random = () => getSkillLootRoll(player, 1)
    try {
      const loot = createLootForPlayer(player, 1)
      expect(loot?.kind).toBe('skill')
      if (loot?.kind === 'skill') {
        expect([...allInnerSkillCatalog, ...allExternalSkillCatalog].some((skill) => skill.id === loot.skill.id)).toBe(true)
      }
    } finally {
      Math.random = originalRandom
    }
  })

  it('高等級怪物可掉落尚未學會的江湖外功功法', () => {
    // 玩家已學會除江湖功法外的所有功法，只可掉江湖功法。
    const player = {
      innerSkillIds: allInnerSkillCatalog.map((skill) => skill.id),
      externalSkillIds: allExternalSkillCatalog.filter((skill) => !jianghuExternalSkills.some((jianghu) => jianghu.id === skill.id)).map((skill) => skill.id),
    } as never

    const originalRandom = Math.random
    // 讓 roll 穩定落在功法區段（道具之後、裝備之前）。
    Math.random = () => getSkillLootRoll(player, 6)
    try {
      const loot = createLootForPlayer(player, 6)
      expect(loot?.kind).toBe('skill')
      if (loot?.kind === 'skill') {
        expect(jianghuExternalSkills.some((skill) => skill.id === loot.skill.id)).toBe(true)
      }
    } finally {
      Math.random = originalRandom
    }
  })

  it('怪物擊殺時可掉落非門派專屬裝備', () => {
    const player = {
      innerSkillIds: allInnerSkillCatalog.map((skill) => skill.id),
      externalSkillIds: allExternalSkillCatalog.map((skill) => skill.id),
    } as never

    const originalRandom = Math.random
    // 讓 roll 落在裝備區段（道具＋功法總權重之後）
    Math.random = () => 0.999
    try {
      const loot = createLootForPlayer(player, 1)
      expect(loot?.kind).toBe('equipment')
      if (loot?.kind === 'equipment') {
        // 掉落的裝備必須是非門派專屬（無 schoolId）
        const equipment = equipmentCatalog.find((candidate) => candidate.id === loot.equipment.id)
        expect(equipment?.schoolId).toBeUndefined()
      }
    } finally {
      Math.random = originalRandom
    }
  })
})

describe('巢穴傳授功法（getLearnableSkill）', () => {
  it('玩家尚未學會任何江湖功法時，傳授一個江湖外功', () => {
    const player = {
      externalSkillIds: [],
    } as never
    const skill = getLearnableSkill(player)
    expect(skill?.type).toBe('external')
    if (skill?.type === 'external') {
      expect(jianghuExternalSkills.some((candidate) => candidate.id === skill.skill.id)).toBe(true)
    }
  })

  it('玩家已學會全部江湖功法時，回傳 undefined', () => {
    const player = {
      externalSkillIds: jianghuExternalSkills.map((skill) => skill.id),
    } as never
    expect(getLearnableSkill(player)).toBeUndefined()
  })
})
