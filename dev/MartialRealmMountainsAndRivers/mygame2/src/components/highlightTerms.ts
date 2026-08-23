import { itemCatalog } from '../game/catalogs/itemCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import { buildingCatalog } from '../game/catalogs/buildingCatalog'
import { defenseStructureCatalog } from '../game/catalogs/defenseStructureCatalog'

/**
 * 專有名詞 → 類別 對照表，供 <HighlightText> 把出現的名詞套上對應顏色。
 * 資料來源為各 catalog，避免手寫字典與實際內容產生資料漂移。
 */
export type TermCategory = 'item' | 'skill' | 'building' | 'base' | 'buff' | 'attribute' | 'creature'

export type HighlightTerm = {
  name: string
  category: TermCategory
}

function buildDictionary(): HighlightTerm[] {
  const entries: HighlightTerm[] = []

  for (const item of itemCatalog) {
    entries.push({ name: item.name, category: 'item' })
  }
  for (const skill of allInnerSkillCatalog) {
    entries.push({ name: skill.name, category: 'skill' })
  }
  for (const skill of allExternalSkillCatalog) {
    entries.push({ name: skill.name, category: 'skill' })
  }
  for (const building of buildingCatalog) {
    entries.push({ name: building.name, category: 'building' })
  }
  for (const structure of defenseStructureCatalog) {
    entries.push({ name: structure.name, category: 'building' })
  }

  // 固定常見專有名詞（據點、市場等）。
  const genericTerms: HighlightTerm[] = [
    { name: '據點', category: 'base' },
    { name: '貿易市場', category: 'building' },
    { name: '告示牌', category: 'building' },
  ]
  entries.push(...genericTerms)

  // 依名稱長度由長到短排序，避免短名稱（如「丹」）誤切長名稱。
  return entries.sort((first, second) => second.name.length - first.name.length)
}

/** 快取字典，避免每次渲染重建。 */
export const HIGHLIGHT_TERMS: HighlightTerm[] = buildDictionary()