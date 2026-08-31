import type { PlayerAttributes } from './entities'

/** 本局累積戰績；由各行動模組在事件發生時累加，供結局彈窗結算顯示。 */
export type RunStats = {
  creaturesDefeated: number
  nestsDestroyed: number
  buildingsBuilt: number
  buildingsUpgraded: number
  buildingsRepaired: number
  eventsResolved: number
  itemsCollected: number
  skillsLearned: number
  defenseStructuresBuilt: number
  maxNormalAttackDamage: number
  maxExternalSkillDamage: number
  /** 單回合最高傷害：人類玩家在單一回內行造成的總傷害（含普攻/外功/元素爆發，跨目標累加）。 */
  maxDamageInSingleRound: number
  maxLevelReached: number
  attributesAtMaxLevel: PlayerAttributes | null
  moneySpent: number
}