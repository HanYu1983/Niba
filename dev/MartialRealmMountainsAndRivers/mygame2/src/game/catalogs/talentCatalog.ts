import type { BuffInstance } from '../types'
import type { ResourceLimit, ResourceLimitModifiers } from '../rules/playerStatsRules'

/**
 * 天賦目錄（Talent Catalog）。
 *
 * 天賦為跨對局角色（PersistentCharacter）的可選玩法模組，開局時隨角色注入對局。
 * 依設計文件 §6.3，每個天賦效果必須能分解為三類原語之一（passive-buff / resource-limit / hook）。
 * 本目錄支援 `passive-buff`（天賦 = 一個永遠啟用的被動 buff，複用 buffCatalog）與
 * `resource-limit`（透過 getResourceLimit 統一入口修正資源上限）；`hook` 原語保留型別，供後續批次擴充。
 *
 * 新增天賦契約（設計 §6.4 R1–R5）：
 * - 每個天賦只能由三類原語組成，禁止無分類特例。
 * - 數值型一律走 buff field；缺欄位時擴充 `BuffDefinition`，不得在規則層寫 if(talentIds.includes(...))。
 */

/** 三類原語：resource-limit（上限修正）與 hook（鉤子）為保留型別。 */
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
    description: '身法飄忽，回避率 +6%、暴擊率 -3%。',
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
  {
    id: 'qi-master',
    name: '內息調度',
    description: '擅長操縱炁機：內力上限提升、體力稍降。',
    available: true,
    effects: [{ kind: 'passive-buff', buffId: 'talent-qi-master' }],
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
 * 處理 `passive-buff` 原語：每個效果產生一個永久（remainingRounds: null）
 * 的 BuffInstance，開局可注入 PlayerState.buffs。`resource-limit` 效果不產生 buff
 * （改由 getResourceLimitModifiers 彙整，見下）；`hook` 原語尚未接入，予以忽略。
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

/**
 * 彙整角色已選天賦的 resource-limit 修正量。
 *
 * 遍歷 `resource-limit` 原語，把相同資源的 multiplier 疊乘；回傳的 modifiers 可傳入
 * `getPlayerResourceLimit` / `getResourceLimit` 對資源上限做倍率修正。
 * （MVP 中的 resource-limit 天賦 multiplier 作用在 effective 五維的資源基礎公式上。）
 */
export function getResourceLimitModifiers(talentIds: string[]): ResourceLimitModifiers {
  const multiplier: Partial<Record<ResourceLimit, number>> = {}
  for (const talentId of talentIds) {
    const talent = getTalent(talentId)
    if (!talent) continue
    for (const effect of talent.effects) {
      if (effect.kind !== 'resource-limit') continue
      multiplier[effect.resource] = (multiplier[effect.resource] ?? 1) * effect.multiplier
    }
  }
  return { multiplier }
}