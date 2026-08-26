import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  isCharacterNameTaken,
  DEFAULT_ATTRIBUTE_BONUSES,
  computeScrollReward,
  applyEndGameRewards,
  addScrolls,
  getAttributeUpgradeCost,
  spendScrollsOnAttribute,
  setInitialExternalSkill,
  setInitialInternalSkill,
} from './characterRoster'
import { createEmptyRunStats } from './runStats'

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

describe('characterRoster', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('預設名册為空', () => {
    expect(getCharacters()).toEqual([])
    expect(getCharacter('any')).toBeUndefined()
  })

  it('建立角色後可讀取，五維加成預設全 0', () => {
    const character = createCharacter({ name: '張三' })
    expect(character).not.toBeNull()
    expect(character!.name).toBe('張三')
    expect(character!.attributeBonuses).toEqual(DEFAULT_ATTRIBUTE_BONUSES)
    expect(character!.gamesPlayed).toBe(0)
    expect(getCharacters()).toHaveLength(1)
    expect(getCharacter(character!.id)?.name).toBe('張三')
  })

  it('舊存檔角色缺養成欄位時補上預設值', () => {
    // 模擬 Phase C 之前建立的舊角色（無 scrolls/learnedSkillIds 等欄位）。
    localStorage.setItem('mygame2.character-roster', JSON.stringify({
      version: 1,
      characters: [{ id: 'old-1', name: '舊角色', attributeBonuses: { armStrength: 2 }, gamesPlayed: 0, createdAt: 0 }],
    }))
    const character = getCharacter('old-1')!
    expect(character.scrolls).toBe(20)
    expect(character.learnedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
    expect(character.initialExternalSkillIds).toEqual([])
    expect(character.initialInternalSkillId).toBe('tuna-gong')
    // 缺省的五維加成補 0。
    expect(character.attributeBonuses.constitution).toBe(0)
    expect(character.attributeBonuses.armStrength).toBe(2)
  })

  it('建立角色可帶入五維加成與外觀', () => {
    const character = createCharacter({
      name: '李四',
      portrait: 'sword',
      title: '劍客',
      attributeBonuses: { armStrength: 2, agility: 1 },
    })
    expect(character!.portrait).toBe('sword')
    expect(character!.title).toBe('劍客')
    expect(character!.attributeBonuses.armStrength).toBe(2)
    expect(character!.attributeBonuses.agility).toBe(1)
    expect(character!.attributeBonuses.constitution).toBe(0)
  })

  it('空白名稱或重複名稱不建立', () => {
    expect(createCharacter({ name: '   ' })).toBeNull()
    createCharacter({ name: '王五' })
    expect(createCharacter({ name: '王五' })).toBeNull()
    expect(getCharacters()).toHaveLength(1)
  })

  it('可更新名稱、外觀與五維加成', () => {
    const character = createCharacter({ name: '趙六' })!
    const ok = updateCharacter(character.id, {
      name: '趙六改',
      title: '大俠',
      attributeBonuses: { insight: 3 },
    })
    expect(ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.name).toBe('趙六改')
    expect(updated.title).toBe('大俠')
    expect(updated.attributeBonuses.insight).toBe(3)
  })

  it('改名為重複名稱時失敗且不變更', () => {
    const a = createCharacter({ name: '甲' })!
    createCharacter({ name: '乙' })
    expect(updateCharacter(a.id, { name: '乙' })).toBe(false)
    expect(getCharacter(a.id)!.name).toBe('甲')
  })

  it('更新不存在的角色回傳 false', () => {
    expect(updateCharacter('missing', { name: 'x' })).toBe(false)
  })

  it('可刪除角色', () => {
    const character = createCharacter({ name: '丙' })!
    expect(deleteCharacter(character.id)).toBe(true)
    expect(getCharacters()).toHaveLength(0)
    expect(deleteCharacter(character.id)).toBe(false)
  })

  it('isCharacterNameTaken 排除自身 id', () => {
    const character = createCharacter({ name: '丁' })!
    expect(isCharacterNameTaken('丁')).toBe(true)
    expect(isCharacterNameTaken('丁', character.id)).toBe(false)
  })

  it('新角色預設開啟吐納功與破空掌且持有 20 武學殘卷', () => {
    const character = createCharacter({ name: '戊' })!
    expect(character.scrolls).toBe(20)
    expect(character.learnedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
    expect(character.initialExternalSkillIds).toEqual([])
    expect(character.initialInternalSkillId).toBe('tuna-gong')
  })
})

describe('computeScrollReward', () => {
  it('勝利基礎卷 + 等級 + 擊殺 + 新功法', () => {
    const stats = { ...createEmptyRunStats(), maxLevelReached: 5, creaturesDefeated: 3 }
    expect(computeScrollReward(stats, true, 2)).toBe(20 + 5 * 3 + 3 * 2 + 2 * 5)
  })

  it('敗退基礎卷較低', () => {
    const stats = createEmptyRunStats()
    expect(computeScrollReward(stats, false)).toBe(8)
  })

  it('無新功法時不計功法加成', () => {
    const stats = { ...createEmptyRunStats(), maxLevelReached: 1 }
    expect(computeScrollReward(stats, true, 0)).toBe(20 + 3)
  })
})

describe('applyEndGameRewards', () => {
  it('累加卷、併入功法庫並增加對局次數', () => {
    const character = createCharacter({ name: '己' })!
    const stats = { ...createEmptyRunStats(), maxLevelReached: 2 }
    const updated = applyEndGameRewards(character.id, stats, true, ['skill-a', 'skill-b'])!
    expect(updated.scrolls).toBe(20 + computeScrollReward(stats, true, 2))
    expect(updated.learnedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm', 'skill-a', 'skill-b'])
    expect(updated.gamesPlayed).toBe(1)
  })

  it('功法去重：重複功法不重複計卷', () => {
    const character = createCharacter({ name: '庚' })!
    const first = applyEndGameRewards(character.id, createEmptyRunStats(), true, ['skill-a'])!
    const stats = { ...createEmptyRunStats(), maxLevelReached: 1 }
    const updated = applyEndGameRewards(character.id, stats, true, ['skill-a', 'skill-b'])!
    expect(updated.learnedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm', 'skill-a', 'skill-b'])
    // 第二次只有 skill-b 是新增，故只計 1 個新功法；卷為累加（含第一次）。
    expect(updated.scrolls).toBe(first.scrolls + computeScrollReward(stats, true, 1))
  })

  it('角色不存在回傳 undefined', () => {
    expect(applyEndGameRewards('missing', createEmptyRunStats(), true, [])).toBeUndefined()
  })
})

describe('addScrolls', () => {
  it('累加卷數且不低於 0', () => {
    const character = createCharacter({ name: '辛' })!
    addScrolls(character.id, -100) // 先歸零（新角預設 20）
    expect(addScrolls(character.id, 30)).toBe(true)
    expect(getCharacter(character.id)!.scrolls).toBe(30)
    expect(addScrolls(character.id, -100)).toBe(true)
    expect(getCharacter(character.id)!.scrolls).toBe(0)
  })

  it('角色不存在回傳 false', () => {
    expect(addScrolls('missing', 10)).toBe(false)
  })
})

describe('花卷：五維永久加成', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('成本增加：10 + 5 × 已投點數', () => {
    expect(getAttributeUpgradeCost(0)).toBe(10)
    expect(getAttributeUpgradeCost(1)).toBe(15)
    expect(getAttributeUpgradeCost(2)).toBe(20)
  })

  it('花卷提升五維並扣卷', () => {
    const character = createCharacter({ name: '甲' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 100)
    expect(spendScrollsOnAttribute(character.id, 'armStrength')).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.attributeBonuses.armStrength).toBe(1)
    expect(updated.scrolls).toBe(100 - 10)
  })

  it('卷不足時不提升', () => {
    const character = createCharacter({ name: '乙' })!
    addScrolls(character.id, -100) // 先歸零（新角預設 20）
    addScrolls(character.id, 5)
    expect(spendScrollsOnAttribute(character.id, 'agility')).toBe(false)
    expect(getCharacter(character.id)!.attributeBonuses.agility).toBe(0)
  })

  it('角色不存在回傳 false', () => {
    expect(spendScrollsOnAttribute('missing', 'insight')).toBe(false)
  })
})

describe('花卷：初始功法設定', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('設定初始外功需先學過且扣卷', () => {
    const character = createCharacter({ name: '丙' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 100)
    const result = setInitialExternalSkill(character.id, 'sky-breaking-palm') // 破空掌預設已學
    expect(result.ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.initialExternalSkillIds).toContain('sky-breaking-palm')
    // 100 - 30 = 70
    expect(updated.scrolls).toBe(70)
  })

  it('未學過的功法不能設為初始外功', () => {
    const character = createCharacter({ name: '丁' })!
    addScrolls(character.id, 100)
    const result = setInitialExternalSkill(character.id, 'not-learned-external')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('尚未學過')
  })

  it('初始外功達上限後無法再設', () => {
    const character = createCharacter({ name: '戊' })!
    addScrolls(character.id, 1000)
    applyEndGameRewards(character.id, createEmptyRunStats(), true, ['skill-a', 'skill-b', 'skill-c'])
    expect(setInitialExternalSkill(character.id, 'skill-a').ok).toBe(true)
    expect(setInitialExternalSkill(character.id, 'skill-b').ok).toBe(true)
    const third = setInitialExternalSkill(character.id, 'skill-c')
    expect(third.ok).toBe(false)
    expect(third.reason).toContain('上限')
  })

  it('設定初始內功需先學過且扣卷', () => {
    const character = createCharacter({ name: '己' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 100)
    const result = setInitialInternalSkill(character.id, 'tuna-gong')
    expect(result.ok).toBe(true)
    expect(getCharacter(character.id)!.initialInternalSkillId).toBe('tuna-gong')
    // tuna-gong 已預設學過；100 卷 - 30 = 70
    expect(getCharacter(character.id)!.scrolls).toBe(70)
  })

  it('未學過的內功不能設為初始', () => {
    const character = createCharacter({ name: '庚' })!
    addScrolls(character.id, 100)
    const result = setInitialInternalSkill(character.id, 'not-learned-inner')
    expect(result.ok).toBe(false)
  })
})
