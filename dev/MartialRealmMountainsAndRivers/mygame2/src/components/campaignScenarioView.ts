import type { StoredScenario } from '../game/scenarioStorage'
import type { ScenarioClearanceMap } from '../game/campaignClearance'
import { officialCharacterCatalog, getOfficialCharacterChapters, type OfficialCharacterDefinition } from '../game/catalogs/officialCharacterCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import { getTalent } from '../game/catalogs/talentCatalog'
import { getCharacter as getRosterCharacter } from '../game/characterRoster'

/** 一個篇章（一位守護者）的群組視圖資料。 */
export type ChapterGroup = {
  /** 群組 id：官方角色用 characterId；未分類為 'uncategorized'。 */
  key: string
  /** 篇章的「主角標題」，用於群組 header。 */
  header: string
  /** 副標題：篇章名稱 / 範圍說明。 */
  subtitle: string
  /** 對應的官方角色（未分類為 null）。 */
  character: OfficialCharacterDefinition | null
  /** 群組內的關卡（已依 chapterIndex 排序）。 */
  entries: StoredScenario[]
}

/**
 * 將儲存中的關卡依「篇章 = 守護者 = 一位官方角色」分組。
 *
 * 規則：
 * 1. 每位官方角色 = 一個群組（按 `officialCharacterCatalog` 順序輸出）。
 * 2. 群組內的關卡 = `entry.scenario.id === character.chapterId`（官方角色透過 chapterId 綁定篇章）。
 * 3. 自訂關卡、找不到對應官方角色的官方關卡 → 統一歸入「未分類」群組（置於最後）。
 * 4. 群組內依 `chapterIndex` 升冪排序；缺欄位者排到群組尾。
 *
 * 純函式，便於單元測試。
 */
export function groupScenariosByChapter(entries: StoredScenario[]): ChapterGroup[] {
  const sorted = [...entries].sort((a, b) => {
    const ai = a.scenario.chapterIndex ?? Number.POSITIVE_INFINITY
    const bi = b.scenario.chapterIndex ?? Number.POSITIVE_INFINITY
    if (ai !== bi) return ai - bi
    // 同章節內：官方優先，再依 id 排序穩定顯示。
    if (a.source !== b.source) return a.source === 'official' ? -1 : 1
    return a.scenario.id.localeCompare(b.scenario.id)
  })

  const byChapterId = new Map<string, StoredScenario[]>()
  const uncategorized: StoredScenario[] = []

  for (const entry of sorted) {
    const owner = officialCharacterCatalog.find((character) =>
      getOfficialCharacterChapters(character).includes(entry.scenario.id),
    )
    if (!owner) {
      uncategorized.push(entry)
      continue
    }
    const bucket = byChapterId.get(owner.characterId) ?? []
    bucket.push(entry)
    byChapterId.set(owner.characterId, bucket)
  }

  const groups: ChapterGroup[] = officialCharacterCatalog.map((character) => {
    const bucket = byChapterId.get(character.characterId) ?? []
    // 副標彙整：若群組涵蓋多個篇章，顯示「第 X~Y 章 · 章名1 / 章名2 / …」；
    // 單一章節則保留「第 X 章 · 章名」。
    const chapterScenarios = bucket.map((entry) => entry.scenario)
    const indexes = chapterScenarios
      .map((scenario) => scenario.chapterIndex)
      .filter((index): index is number => typeof index === 'number')
    const indexLabel = indexes.length > 0
      ? indexes.length === 1
        ? `第 ${indexes[0] + 1} 章`
        : `第 ${Math.min(...indexes) + 1}～${Math.max(...indexes) + 1} 章`
      : ''
    const titleLabel = chapterScenarios.length > 0
      ? chapterScenarios.map((scenario) => scenario.title).join(' / ')
      : character.title
    return {
      key: character.characterId,
      header: `${character.portrait} ${character.name}`,
      subtitle: [indexLabel, titleLabel].filter(Boolean).join(' · '),
      character,
      entries: bucket,
    }
  })

  // 群組內若無對應關卡，不顯示該群組（避免空章節佔位）。
  const populated = groups.filter((group) => group.entries.length > 0)

  if (uncategorized.length > 0) {
    populated.push({
      key: 'uncategorized',
      header: '📦 未分類',
      subtitle: '自訂關卡或未綁定守護者的官方關卡',
      character: null,
      entries: uncategorized,
    })
  }

  return populated
}

/** 單一解鎖項目的狀態。 */
export type UnlockItemStatus = 'unlocked' | 'pending-apply' | 'locked'

/** 一個解鎖項目（功法 / 天賦），含顯示名稱與狀態。 */
export type UnlockItem = {
  id: string
  name: string
  description?: string
  status: UnlockItemStatus
}

/** 一個篇章的通關 + 解鎖彙整。 */
export type ChapterProgressEntry = {
  scenarioId: string
  scenarioTitle: string
  chapterIndex: number | undefined
  /** 通關狀態：true 通關 / false 失敗 / undefined 未挑戰。 */
  cleared: boolean | undefined
  /** 此篇章通關後會帶來的解鎖項目（已過濾為「此時此刻可呈現的狀態」）。 */
  unlocks: {
    innerSkillIds: string[]
    externalSkillIds: string[]
    talentIds: string[]
  }
}

/** 攻略進度檢視（Collapse 群組內嵌顯示的資料源）。 */
export type ChapterProgressView = {
  character: OfficialCharacterDefinition
  characterName: string
  characterTitle: string
  /** 名册中該角色的快照（若尚未建檔則為 null，例如首次安裝時）。 */
  rosterSnapshot: {
    unlockedSkillIds: string[]
    learnedSkillIds: string[]
    unlockedTalentIds: string[]
    talentIds: string[]
  } | null
  chapters: ChapterProgressEntry[]
  /** 累積已實際納入名册的解鎖清單（用於群組內「已解鎖」摘要）。 */
  totalUnlocked: UnlockItem[]
  /** 條件已達成但因尚未實作 hook 而「待套用」的項目。 */
  totalPending: UnlockItem[]
}

/**
 * 嚴格查找功法定義（無 fallback）：找不到回傳 undefined。
 *
 * 為何不用 getInnerSkill / getExternalSkill：它們找不到時會 fallback 回目錄第一個項目，
 * 無法用於「這個 id 是否真實存在」的判斷。
 */
function findInnerSkillStrict(skillId: string): { name: string; description?: string } | undefined {
  return allInnerSkillCatalog.find((skill) => skill.id === skillId)
}

function findExternalSkillStrict(skillId: string): { name: string; description?: string } | undefined {
  return allExternalSkillCatalog.find((skill) => skill.id === skillId)
}

/**
 * 為某位官方角色建立「攻略進度」視圖資料。
 *
 * 規則：
 * - 列出該角色綁定的所有篇章（含通關狀態）。
 * - 累積每個通關篇章會帶來的解鎖（innerSkillIds / externalSkillIds / talentIds）。
 * - 與名册中的官方角色快照比對：
 *   - 已實際出現在 `unlockedSkillIds` / `unlockedTalentIds` → 'unlocked'
 *   - 對應劇本已通關但名册內未含 → 'pending-apply'（待 applyEndGameRewards hook 串接）
 *   - 對應劇本未通關 → 'locked'
 *
 * 純函式；不觸發任何 IO、不修改狀態。
 */
export function buildChapterProgressView(
  character: OfficialCharacterDefinition,
  clearances: ScenarioClearanceMap,
): ChapterProgressView {
  const roster = getRosterCharacter(character.characterId)
  const rosterSnapshot = roster
    ? {
        unlockedSkillIds: [...roster.unlockedSkillIds],
        learnedSkillIds: [...roster.learnedSkillIds],
        unlockedTalentIds: [...roster.unlockedTalentIds],
        talentIds: [...roster.talentIds],
      }
    : null

  const clearedScenarioIds = new Set(
    Object.entries(clearances)
      .filter(([, cleared]) => cleared)
      .map(([id]) => id),
  )

  const chapters: ChapterProgressEntry[] = getOfficialCharacterChapters(character).map((scenarioId) => {
    // 從官方劇本目錄找對應 scenario（用 chapterId 比對）。
    // 注意：這裡的 `campaignScenarioCatalog` 不在 import 範圍（避免循環），
    // 所以僅以 scenarioId 呈現；詳細標題由呼叫端以 stored scenarios 覆寫。
    const storyUnlock = character.storyUnlocks.find((unlock) => unlock.scenarioId === scenarioId)
    return {
      scenarioId,
      scenarioTitle: scenarioId, // 真實標題由呼叫端以 stored scenarios 覆寫
      chapterIndex: undefined,
      cleared: clearances[scenarioId],
      unlocks: {
        innerSkillIds: storyUnlock?.skillIds?.filter((id) => findInnerSkillStrict(id) !== undefined) ?? [],
        externalSkillIds: storyUnlock?.skillIds?.filter((id) => findExternalSkillStrict(id) !== undefined) ?? [],
        talentIds: storyUnlock?.talentIds ?? [],
      },
    }
  })

  // 已知有「未實作 hook」的情形：當某篇章已通關，但對應 storyUnlocks 的 skillId/talentId
  // 仍未在名册快照中出現，標記為 pending-apply（這是 applyEndGameRewards 對官方角色尚未
  // 串接 storyUnlocks 的設計缺口，由 UI 提前呈現給玩家）。
  const totalUnlocked: UnlockItem[] = []
  const totalPending: UnlockItem[] = []

  // 先把「已解鎖」與「待套用」項目依狀態分桶。
  const bucket = (id: string, fallbackKind: 'inner' | 'external' | 'talent') => {
    const inRoster = rosterSnapshot
      ? fallbackKind === 'talent'
        ? rosterSnapshot.unlockedTalentIds.includes(id)
        : rosterSnapshot.unlockedSkillIds.includes(id)
      : false
    const owner = fallbackKind === 'talent'
      ? getTalent(id)
      : fallbackKind === 'inner'
        ? findInnerSkillStrict(id)
        : findExternalSkillStrict(id)
    const name = owner?.name ?? id
    const description = owner && 'description' in owner ? owner.description : undefined
    const item: UnlockItem = { id, name, description, status: inRoster ? 'unlocked' : 'pending-apply' }
    if (inRoster) totalUnlocked.push(item)
    else totalPending.push(item)
  }

  // 名册初始帶入的功法（四件套）一律算已解鎖（即使沒通關）。
  if (rosterSnapshot) {
    for (const id of character.exclusiveExternalSkillIds) {
      if (rosterSnapshot.unlockedSkillIds.includes(id)) {
        const skill = findExternalSkillStrict(id)
        totalUnlocked.push({ id, name: skill?.name ?? id, description: skill?.description, status: 'unlocked' })
      }
    }
    if (rosterSnapshot.unlockedSkillIds.includes(character.exclusiveInnerSkillId)) {
      const skill = findInnerSkillStrict(character.exclusiveInnerSkillId)
      totalUnlocked.push({ id: character.exclusiveInnerSkillId, name: skill?.name ?? character.exclusiveInnerSkillId, description: skill?.description, status: 'unlocked' })
    }
  }

  // 通關章節帶來的解鎖：若條件已達成，依實際是否在名册分桶。
  for (const entry of chapters) {
    if (!entry.cleared) continue
    for (const id of entry.unlocks.innerSkillIds) bucket(id, 'inner')
    for (const id of entry.unlocks.externalSkillIds) bucket(id, 'external')
    for (const id of entry.unlocks.talentIds) bucket(id, 'talent')
  }

  // pending-apply 中只保留「條件已達成」者；其餘屬於 locked 類別，於群組內章節列表呈現。
  // 這裡若全無 cleared 篇章，totalPending 維持空陣列。
  void clearedScenarioIds // 為將來擴充預留（e.g. 跨篇章累計解鎖）

  return {
    character,
    characterName: character.name,
    characterTitle: character.title,
    rosterSnapshot,
    chapters,
    totalUnlocked,
    totalPending,
  }
}
