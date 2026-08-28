import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  isCharacterNameTaken,
  ensureOfficialCharacters,
  applyStoryUnlocks,
  DEFAULT_ATTRIBUTE_BONUSES,
  computeScrollReward,
  applyEndGameRewards,
  addScrolls,
  getAttributeUpgradeCost,
  spendScrollsOnAttribute,
  learnSkill,
  setInitialExternalSkill,
  setInitialInternalSkill,
} from './characterRoster'
import { lingyuan } from './catalogs/officialCharacterCatalog'
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
    // 模擬 Phase C 之前建立的舊角色（無 scrolls/unlockedSkillIds 等欄位）。
    localStorage.setItem('mygame2.character-roster', JSON.stringify({
      version: 1,
      characters: [{ id: 'old-1', name: '舊角色', attributeBonuses: { armStrength: 2 }, gamesPlayed: 0, createdAt: 0 }],
    }))
    const character = getCharacter('old-1')!
    expect(character.scrolls).toBe(20)
    // 預設解鎖吐納功與破空掌。
    expect(character.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
    // 舊版遷移視舊 learnedSkillIds 為「已解鎖」，學習狀態清空（吐納功仍解鎖但遷移後未學）。
    expect(character.learnedSkillIds).toEqual([])
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

    it('新角色預設解鎖所有功法，持有 20 武學殘卷，吐納功為初始武學', () => {
    const character = createCharacter({ name: '戊' })!
    expect(character.scrolls).toBe(20)
    // 預設解鎖吐納功與破空掌（可培養）。
    expect(character.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
    // 吐納功為初始武學，預設已學會並開啟。
    expect(character.learnedSkillIds).toEqual(['tuna-gong'])
    expect(character.initialExternalSkillIds).toEqual([])
    expect(character.initialInternalSkillId).toBe('tuna-gong')
  })
})

describe('computeScrollReward', () => {
  it('勝利基礎卷 + 等級 + 擊殺 + 新功法', () => {
    const stats = { ...createEmptyRunStats(), maxLevelReached: 5, creaturesDefeated: 3 }
    expect(computeScrollReward(stats, true, 2)).toBe(6 + 5 * 1 + 3 * 1 + 2 * 2)
  })

  it('敗退基礎卷較低', () => {
    const stats = createEmptyRunStats()
    expect(computeScrollReward(stats, false)).toBe(3)
  })

  it('無新功法時不計功法加成', () => {
    const stats = { ...createEmptyRunStats(), maxLevelReached: 1 }
    expect(computeScrollReward(stats, true, 0)).toBe(6 + 1)
  })
})

describe('applyEndGameRewards', () => {
  it('累加卷、併入可培養清單並增加對局次數', () => {
    const character = createCharacter({ name: '己' })!
    const stats = { ...createEmptyRunStats(), maxLevelReached: 2 }
    const updated = applyEndGameRewards(character.id, stats, true, ['skill-a', 'skill-b'])!
    expect(updated.scrolls).toBe(20 + computeScrollReward(stats, true, 2))
    // 局末獲得併入可培養清單；skill-a/b 為新增，故 newSkillCount = 2。
    expect(updated.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm', 'skill-a', 'skill-b'])
    // 局末獲得不算已學習（吐納功為初始武學已學會）。
    expect(updated.learnedSkillIds).toEqual(['tuna-gong'])
    expect(updated.gamesPlayed).toBe(1)
  })

  it('功法去重：重複功法不重複計卷', () => {
    const character = createCharacter({ name: '庚' })!
    const first = applyEndGameRewards(character.id, createEmptyRunStats(), true, ['skill-a'])!
    const stats = { ...createEmptyRunStats(), maxLevelReached: 1 }
    const updated = applyEndGameRewards(character.id, stats, true, ['skill-a', 'skill-b'])!
    expect(updated.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm', 'skill-a', 'skill-b'])
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

describe('花卷：學習功法', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('學習需先獲得（在可培養清單）且扣卷，越學越貴', () => {
    const character = createCharacter({ name: '丙' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 100)
    const result = learnSkill(character.id, 'sky-breaking-palm') // 破空掌預設已解鎖
    expect(result.ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.learnedSkillIds).toContain('sky-breaking-palm')
    // 已解鎖但仍須花卷學習；吐納功已學會故成本 = 30 + 20 × 1 = 50
    expect(updated.scrolls).toBe(50)
  })

  it('學習成本隨已學習功法數增加', () => {
    const character = createCharacter({ name: '丙二' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 200)
    // 第一門新功法（已有吐納功）：50
    expect(learnSkill(character.id, 'sky-breaking-palm').ok).toBe(true)
    expect(getCharacter(character.id)!.scrolls).toBe(150)
    // 第二門新功法（learnedCount = 2）：70。先記錄當下卷數再學，避免受局末獎勵影響。
    applyEndGameRewards(character.id, createEmptyRunStats(), true, ['skill-a'])
    const before = getCharacter(character.id)!.scrolls
    expect(learnSkill(character.id, 'skill-a').ok).toBe(true)
    expect(getCharacter(character.id)!.scrolls).toBe(before - 70)
  })

  it('未獲得的功法無法學習', () => {
    const character = createCharacter({ name: '丁' })!
    addScrolls(character.id, 100)
    const result = learnSkill(character.id, 'never-gained-skill')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('尚未獲得')
  })

  it('已學習的功法不能重複學習', () => {
    const character = createCharacter({ name: '戊' })!
    addScrolls(character.id, 100)
    learnSkill(character.id, 'sky-breaking-palm')
    const again = learnSkill(character.id, 'sky-breaking-palm')
    expect(again.ok).toBe(false)
    expect(again.reason).toContain('已學習')
  })

  it('卷不足時無法學習', () => {
    const character = createCharacter({ name: '己' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 10)
    const result = learnSkill(character.id, 'sky-breaking-palm')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('卷不足')
  })
})

describe('花卷：開啟初始功法', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('開啟外功需先學習；開啟免費不扣卷', () => {
    const character = createCharacter({ name: '庚' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 200)
    expect(learnSkill(character.id, 'sky-breaking-palm').ok).toBe(true) // 花 50 學習（吐納功已學會）
    expect(getCharacter(character.id)!.scrolls).toBe(150)
    const result = setInitialExternalSkill(character.id, 'sky-breaking-palm') // 開啟免費
    expect(result.ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.initialExternalSkillIds).toContain('sky-breaking-palm')
    expect(updated.scrolls).toBe(150)
  })

  it('未學習的功法不能開啟為初始外功', () => {
    const character = createCharacter({ name: '辛' })!
    addScrolls(character.id, 100)
    // 破空掌已解鎖但未學習
    const result = setInitialExternalSkill(character.id, 'sky-breaking-palm')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('未學習')
  })

  it('外功開啟無數量上限（取消原上限）', () => {
    const character = createCharacter({ name: '壬' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 1000)
    applyEndGameRewards(character.id, createEmptyRunStats(), true, ['skill-a', 'skill-b', 'skill-c'])
    learnSkill(character.id, 'skill-a')
    learnSkill(character.id, 'skill-b')
    learnSkill(character.id, 'skill-c')
    expect(setInitialExternalSkill(character.id, 'skill-a').ok).toBe(true)
    expect(setInitialExternalSkill(character.id, 'skill-b').ok).toBe(true)
    // 第三個外功不再受上限阻擋，可正常開啟。
    const third = setInitialExternalSkill(character.id, 'skill-c')
    expect(third.ok).toBe(true)
    expect(getCharacter(character.id)!.initialExternalSkillIds).toEqual(['skill-a', 'skill-b', 'skill-c'])
  })

  it('開啟內功需先學習；開免費不扣卷', () => {
    const character = createCharacter({ name: '癸' })!
    addScrolls(character.id, -100) // 歸零
    addScrolls(character.id, 200)
    // 吐納功為初始武學預設已學會，開啟免費。
    const result = setInitialInternalSkill(character.id, 'tuna-gong')
    expect(result.ok).toBe(true)
    expect(getCharacter(character.id)!.initialInternalSkillId).toBe('tuna-gong')
    expect(getCharacter(character.id)!.scrolls).toBe(200)
  })

  it('未學習的內功不能開啟', () => {
    const character = createCharacter({ name: '子' })!
    addScrolls(character.id, 100)
    // 吐納功雖已解鎖，但新增未學習的功法後再試開。
    applyEndGameRewards(character.id, createEmptyRunStats(), true, ['some-inner'])
    const result = setInitialInternalSkill(character.id, 'some-inner')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('未學習')
  })
})

describe('官方角色預建（ensureOfficialCharacters）', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('空名册呼叫後，凌淵會以預建狀態出現（不預學專屬功法，靠章節解鎖）', () => {
    const added = ensureOfficialCharacters()
    expect(added).toBeGreaterThanOrEqual(1)
    const lingyuanFromRoster = getCharacter(lingyuan.characterId)
    expect(lingyuanFromRoster).toBeDefined()
    expect(lingyuanFromRoster!.name).toBe(lingyuan.name)
    expect(lingyuanFromRoster!.title).toBe(lingyuan.title)
    expect(lingyuanFromRoster!.isOfficial).toBe(true)
    expect(lingyuanFromRoster!.chapterId).toBe(lingyuan.chapterId)
    // 專屬功法不預學：維持標準新角狀態（吐納功），四件套靠章節通關解鎖。
    expect(lingyuanFromRoster!.learnedSkillIds).toEqual(['tuna-gong'])
    expect(lingyuanFromRoster!.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
    expect(lingyuanFromRoster!.initialInternalSkillId).toBe('tuna-gong')
    expect(lingyuanFromRoster!.initialExternalSkillIds).toEqual([])
    expect(lingyuanFromRoster!.unlockedTalentIds).toEqual([])
    // 五維加成包含 initialAttributes 設定
    expect(lingyuanFromRoster!.attributeBonuses.armStrength).toBe(lingyuan.initialAttributes.armStrength)
  })

  it('重複呼叫不覆蓋玩家已培養的進度（冪等）', () => {
    ensureOfficialCharacters()
    addScrolls(lingyuan.characterId, 50)
    spendScrollsOnAttribute(lingyuan.characterId, 'armStrength')
    const before = getCharacter(lingyuan.characterId)!
    const added = ensureOfficialCharacters()
    expect(added).toBe(0)
    const after = getCharacter(lingyuan.characterId)!
    expect(after.scrolls).toBe(before.scrolls)
    expect(after.attributeBonuses.armStrength).toBe(before.attributeBonuses.armStrength)
  })

  it('舊存檔若缺 isOfficial 旗標，會回補；既有資料保留', () => {
    // 模擬只有基本欄位的舊存檔（isOfficial 為 undefined）
    localStorage.setItem('mygame2.character-roster', JSON.stringify({
      version: 1,
      characters: [{
        id: lingyuan.characterId,
        name: lingyuan.name,
        attributeBonuses: { ...DEFAULT_ATTRIBUTE_BONUSES, armStrength: 5 },
        scrolls: 30,
        unlockedSkillIds: ['tuna-gong', 'sky-breaking-palm'],
        learnedSkillIds: ['tuna-gong'],
        initialExternalSkillIds: [],
        initialInternalSkillId: 'tuna-gong',
        unlockedTalentIds: [],
        talentIds: [],
        gamesPlayed: 2,
        createdAt: 0,
      }],
    }))
    ensureOfficialCharacters()
    const restored = getCharacter(lingyuan.characterId)!
    expect(restored.isOfficial).toBe(true)
    expect(restored.chapterId).toBe(lingyuan.chapterId)
    // 既有進度不應被覆蓋
    expect(restored.scrolls).toBe(30)
    expect(restored.attributeBonuses.armStrength).toBe(5)
    expect(restored.gamesPlayed).toBe(2)
  })

  it('官方角色禁止改名', () => {
    ensureOfficialCharacters()
    expect(updateCharacter(lingyuan.characterId, { name: '凌淵改名' })).toBe(false)
    expect(getCharacter(lingyuan.characterId)!.name).toBe(lingyuan.name)
  })

  it('官方角色禁止改外觀／稱號', () => {
    ensureOfficialCharacters()
    expect(updateCharacter(lingyuan.characterId, { portrait: '🌊', title: '水神' })).toBe(false)
    const c = getCharacter(lingyuan.characterId)!
    expect(c.portrait).toBe(lingyuan.portrait)
    expect(c.title).toBe(lingyuan.title)
  })

  it('官方角色允許花卷培養（attributeBonuses）', () => {
    ensureOfficialCharacters()
    addScrolls(lingyuan.characterId, 200)
    expect(spendScrollsOnAttribute(lingyuan.characterId, 'insight')).toBe(true)
    expect(getCharacter(lingyuan.characterId)!.attributeBonuses.insight).toBe(
      lingyuan.initialAttributes.insight! + 1,
    )
  })

  it('官方角色禁止刪除', () => {
    ensureOfficialCharacters()
    expect(deleteCharacter(lingyuan.characterId)).toBe(false)
    expect(getCharacter(lingyuan.characterId)).toBeDefined()
  })

  it('自建角色仍可正常刪除', () => {
    const custom = createCharacter({ name: '凡人' })!
    expect(deleteCharacter(custom.id)).toBe(true)
    expect(getCharacter(custom.id)).toBeUndefined()
  })
})

describe('劇本通關解鎖（applyStoryUnlocks）', () => {
  beforeEach(() => {
    stubLocalStorage()
    ensureOfficialCharacters()
  })

  it('通關序章：山河歸藏併入 unlocked + learned（免花卷學習）', () => {
    const changed = applyStoryUnlocks('prologue-village', true)
    expect(changed).toEqual([lingyuan.characterId])
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds).toContain('lingyuan-shelter-breath')
    expect(character.learnedSkillIds).toContain('lingyuan-shelter-breath')
    // 天賦不受影響
    expect(character.unlockedTalentIds).toEqual([])
  })

  it('通關第二章：山河脈動併入功法、金剛體魄併入天賦並自動啟用', () => {
    applyStoryUnlocks('forest-hunt', true)
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds).toContain('lingyuan-mountain-pulse')
    expect(character.learnedSkillIds).toContain('lingyuan-mountain-pulse')
    expect(character.unlockedTalentIds).toContain('vital-body')
    // 劇情解鎖的天賦自動啟用
    expect(character.talentIds).toContain('vital-body')
  })

  it('通關第三章：兩個外功 + 丹田凝息全部套用', () => {
    applyStoryUnlocks('frost-water-lament', true)
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds).toEqual(expect.arrayContaining([
      'lingyuan-rivers-sustain',
      'lingyuan-five-elements-mend',
    ]))
    expect(character.learnedSkillIds).toEqual(expect.arrayContaining([
      'lingyuan-rivers-sustain',
      'lingyuan-five-elements-mend',
    ]))
    expect(character.unlockedTalentIds).toContain('deep-dantian')
    expect(character.talentIds).toContain('deep-dantian')
  })

  it('失敗（cleared: false）不套用任何解鎖', () => {
    const changed = applyStoryUnlocks('prologue-village', false)
    expect(changed).toEqual([])
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds).not.toContain('lingyuan-shelter-breath')
  })

  it('冪等：重複套用同一章節不產生重複項目', () => {
    applyStoryUnlocks('prologue-village', true)
    applyStoryUnlocks('prologue-village', true)
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds.filter((id) => id === 'lingyuan-shelter-breath')).toHaveLength(1)
    expect(character.learnedSkillIds.filter((id) => id === 'lingyuan-shelter-breath')).toHaveLength(1)
  })

  it('三章全通關：四件套 + 兩天賦全部到位', () => {
    applyStoryUnlocks('prologue-village', true)
    applyStoryUnlocks('forest-hunt', true)
    applyStoryUnlocks('frost-water-lament', true)
    const character = getCharacter(lingyuan.characterId)!
    expect(character.unlockedSkillIds).toEqual(expect.arrayContaining([
      'lingyuan-shelter-breath',
      'lingyuan-mountain-pulse',
      'lingyuan-rivers-sustain',
      'lingyuan-five-elements-mend',
    ]))
    expect(character.unlockedTalentIds).toEqual(expect.arrayContaining(['vital-body', 'deep-dantian']))
    expect(character.talentIds).toEqual(expect.arrayContaining(['vital-body', 'deep-dantian']))
  })

  it('非官方角色不受影響；未綁定章節的官方角色也不受影響', () => {
    const custom = createCharacter({ name: '凡人' })!
    const changed = applyStoryUnlocks('prologue-village', true)
    // 只有凌淵被變更
    expect(changed).toEqual([lingyuan.characterId])
    // 自建角色資料不變
    expect(getCharacter(custom.id)!.unlockedSkillIds).toEqual(['tuna-gong', 'sky-breaking-palm'])
  })

  it('沙盒局末獎勵與劇本解鎖可並存：applyEndGameRewards 不會洗掉劇本解鎖', () => {
    applyStoryUnlocks('prologue-village', true)
    applyEndGameRewards(lingyuan.characterId, createEmptyRunStats(), true, ['some-sandbox-skill'])
    const character = getCharacter(lingyuan.characterId)!
    // 劇本解鎖保留
    expect(character.unlockedSkillIds).toContain('lingyuan-shelter-breath')
    // 沙盒獎勵也併入
    expect(character.unlockedSkillIds).toContain('some-sandbox-skill')
  })
})
