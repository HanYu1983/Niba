export type DefenseStructureType = 'barricade' | 'watchtower' | 'advanced-watchtower' | 'arrow-tower' | 'advanced-arrow-tower' | 'small-watchtower' | 'small-arrow-tower' | 'small-waystation' | 'road'

export type DefenseStructureDefinition = {
  type: DefenseStructureType
  name: string
  description: string
  icon: string
  constructionCost: number
  requiredRank: number
  maxHealth: number
  healthBonus: number
  blocksMovement: boolean
  providesVision: boolean
  attackRange: number
  attackDamage: number
  /** 道路等不佔格子的設施：建造時改寫地形，而非新增防禦設施。 */
  changesTerrain?: boolean
}

export const defenseStructureCatalog: DefenseStructureDefinition[] = [
  { type: 'barricade', name: '木柵', description: '阻擋 Creature 通行。', icon: '🪵', constructionCost: 20, requiredRank: 1, maxHealth: 25, healthBonus: 0, blocksMovement: true, providesVision: false, attackRange: 0, attackDamage: 0 },
{ type: 'watchtower', name: '瞭望塔', description: '增加據點周圍視野。', icon: '🗼', constructionCost: 30, requiredRank: 2, maxHealth: 40, healthBonus: 0, blocksMovement: false, providesVision: true, attackRange: 0, attackDamage: 0 },
  { type: 'advanced-watchtower', name: '進階瞭望塔', description: '提供更廣的視野。', icon: '🗼', constructionCost: 60, requiredRank: 4, maxHealth: 60, healthBonus: 0, blocksMovement: false, providesVision: true, attackRange: 0, attackDamage: 0 },
  { type: 'arrow-tower', name: '箭塔', description: 'Creature 回合自動攻擊周遭兩格內的怪物。', icon: '🏹', constructionCost: 40, requiredRank: 1, maxHealth: 50, healthBonus: 0, blocksMovement: false, providesVision: false, attackRange: 2, attackDamage: 10 },
  { type: 'advanced-arrow-tower', name: '進階箭塔', description: 'Creature 回合自動攻擊周遭三格內的怪物。', icon: '🏹', constructionCost: 80, requiredRank: 3, maxHealth: 70, healthBonus: 0, blocksMovement: false, providesVision: false, attackRange: 3, attackDamage: 18 },
  { type: 'road', name: '道路', description: '鋪設道路，將地形改為道路，移動阻力降為 1。', icon: '🛤️', constructionCost: 5, requiredRank: 1, maxHealth: 0, healthBonus: 0, blocksMovement: false, providesVision: false, attackRange: 0, attackDamage: 0, changesTerrain: true },
  // 小型設施：由廢墟修復產生，不透過據點建造，故 constructionCost / requiredRank 為 0。
  { type: 'small-watchtower', name: '小型瞭望臺', description: '由廢墟修復而成，提供 2 格視野。', icon: '🗼', constructionCost: 0, requiredRank: 0, maxHealth: 15, healthBonus: 0, blocksMovement: true, providesVision: true, attackRange: 0, attackDamage: 0 },
  { type: 'small-arrow-tower', name: '小型箭塔', description: '由廢墟修復而成，提供 1 格視野與 1 格射程。', icon: '🏹', constructionCost: 0, requiredRank: 0, maxHealth: 20, healthBonus: 0, blocksMovement: true, providesVision: true, attackRange: 1, attackDamage: 5 },
  { type: 'small-waystation', name: '小型驛站', description: '由廢墟修復而成，可傳送至其他已修復的廢墟點。', icon: '🐎', constructionCost: 0, requiredRank: 0, maxHealth: 15, healthBonus: 0, blocksMovement: true, providesVision: false, attackRange: 0, attackDamage: 0 },
]

/** 玩家可透過據點建造的防禦設施（排除廢墟專屬的小型設施）。 */
export const buildableDefenseStructureCatalog: DefenseStructureDefinition[] =
  defenseStructureCatalog.filter((definition) =>
    definition.type !== 'small-watchtower' && definition.type !== 'small-arrow-tower' && definition.type !== 'small-waystation',
  )