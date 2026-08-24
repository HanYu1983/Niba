import type { ItemEffectType } from '../game/catalogs/itemCatalog'

/**
 * 道具依效果分組（商店與背包共用）。
 * 用於 Collapse 分組顯示，依賴 itemCatalog 的 effect 欄位。
 */
export const ITEM_EFFECT_GROUPS: Array<{ effect: ItemEffectType; label: string; icon: string }> = [
  { effect: 'health', label: '生命恢復', icon: '❤️' },
  { effect: 'inner-power', label: '內力恢復', icon: '🔮' },
  { effect: 'stamina', label: '體力恢復', icon: '💪' },
  { effect: 'buff', label: '增益效果', icon: '✨' },
  { effect: 'attribute-up', label: '屬性提升', icon: '📈' },
  { effect: 'trap', label: '陷阱道具', icon: '🪤' },
  { effect: 'scout', label: '探索道具', icon: '🔍' },
  { effect: 'reveal-creatures', label: '偵察道具', icon: '👁️' },
  { effect: 'recall-base', label: '撤退道具', icon: '🏠' },
  { effect: 'element-burst', label: '元素爆發', icon: '💥' },
]