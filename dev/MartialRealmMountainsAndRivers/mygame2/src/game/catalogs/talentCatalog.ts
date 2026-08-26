import type { BuffInstance } from '../types'

/**
 * 天賦目錄（Talent Catalog）。
 *
 * 天賦為跨對局角色（PersistentCharacter）的可選玩法模組，開局時隨角色注入對局。
 * 依設計文件 §6.3，每個天賦效果必須能分解為三類原語之一（passive-buff / resource-limit / hook）。
 * 本目錄為 MVP：先支援 `passive-buff` 原語（天賦 = 一個永遠啟用的被動 buff，複用 buffCatalog）；
 * `resource-limit` / `hook` 原語保留型別，供後續批次擴充。
 *
 * 新增天賦契約（設計 §6.4 R1–R5）：
 * - 每個天賦只能由三類原語組成，禁止無分類特例。
 * - 數值型一律走 buff field；缺欄位時擴充 `BuffDefinition`，不得在規則層寫 if(talentIds.includes(...))。
 */

/** 三類原語：resource-limit（上限修正）與 hook（鉤子）為保留型別，MVP 未實作效果。 */
export type TalentEffect =
  | { kind: 'passive-buff'; buffId: string }
  | { kind: 'resource-limit'; resource: 'health' | 'stamina' | 'innerPower'; multiplier: number }
  | { kind: 'hook'; hookPoint: TalentHookPoint; payload: unknown }

export type TalentHookPoint =
  | 'gather-convert'
  | 'equipment-slot'
  | 'action-stamina'
  | 'level-up-attribute'

export type TalentDefinition = {
  id: string
  name: string
  description: string
  /** 是否為 MVP 可用的原語效果（resource-limit / hook 尚未接入，標記為不可選）。 */
  available: boolean
  effects: TalentEffect[]
}

/** 天賦目錄（靜態資料，模組載入時固定）。 */
export const talentCatalog: TalentDefinition[] = [
  {
    id: 'cartographer',
    name: '製圖師',
    description: '視野遼闊，索敵半徑提升。',
    available: true,
    effects: [{ kind: 'passive-buff', buffId: 'talent-cartographer-vision' }],
  },
  {
    id: 'scavenger',
    name: '拾荒者',
    description: '蒐集物資時更容易一舉多得。',
    available: true,
    effects: [{ kind: 'passive-buff', buffId: 'talent-scavenger-gather' }],
  },
  {
    id: 'phantom-dodge',
    name: '幻影步',
    description: '身法飄忽，回避與暴擊皆有所長。',
    available: true,
    effects: [{ kind: 'passive-buff', buffId: 'talent-phantom-dodge' }],
  },
  {
    id: 'merchant-king',
    name: '商賈巨擘',
    description: '買賣精明，攻伐亦穩健。',
    available: true,
    effects: [{ kind: 'passive-buff', buffId: 'talent-merchant-king' }],
  },
]

/** 依 id 查天賦定義；不存在回傳 undefined。 */
export function getTalent(id: string): TalentDefinition | undefined {
  return talentCatalog.find((talent) => talent.id === id)
}

/** 回傳「已可選用」的天賦清單（effect 已在 MVP 實際生效者）。 */
export function getAvailableTalents(): TalentDefinition[] {
  return talentCatalog.filter((talent) => talent.available)
}

/**
 * 彙整角色已選天賦，轉出為對局中「常駐 Buff」清單。
 *
 * 僅處理 MVP 支援的 `passive-buff` 原語：每個效果產生一個永久（remainingRounds: null）
 * 的 BuffInstance，開局可注入 PlayerState.buffs。`resource-limit` / `hook` 原語
 * 尚未接入，予以忽略（其天賦已於 catalog 標記 available: false）。
 *
 * 產出的 BuffInstance 以 `sourceId` 標記所屬天賦，供排程與除錯識別。
 */
export function getTalentBuffs(talentIds: string[]): BuffInstance[] {
  const buffs: BuffInstance[] = []
  for (const talentId of talentIds) {
    const talent = getTalent(talentId)
    if (!talent) continue
    for (const effect of talent.effects) {
      if (effect.kind !== 'passive-buff') continue
      buffs.push({
        id: `talent:${talentId}:${effect.buffId}`,
        definitionId: effect.buffId,
        sourceId: talentId,
        remainingRounds: null,
      })
    }
  }
  return buffs
}