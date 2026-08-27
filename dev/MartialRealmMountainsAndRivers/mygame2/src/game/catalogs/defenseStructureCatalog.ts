export type DefenseStructureType = 'barricade' | 'strong-barricade' | 'watchtower' | 'advanced-watchtower' | 'arrow-tower' | 'advanced-arrow-tower' | 'small-watchtower' | 'small-arrow-tower' | 'small-waystation' | 'supply-depot' | 'warcamp-bastion' | 'warning-beacon' | 'bombard-cannon'

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
  /** 視野範圍（曼哈頓距離）；0 = 無視野。所有防禦建築至少 1（自身一格）。 */
  visionRange: number
  attackRange: number
  attackDamage: number
  /** 道路等不佔格的設施：建造時改寫地形，而非新增防禦設施。 */
  changesTerrain?: boolean
  /** 轟城砲等範圍砲擊設施的冷卻回合數（0 = 無冷卻）。 */
  cooldownRounds?: number
  /** 輜重庫等設施，建造時於自身位置生成大型資源點，採集量為一般資源點的多倍。 */
  resourceIncomeMultiplier?: number
}

export const defenseStructureCatalog: DefenseStructureDefinition[] = [
  { type: 'barricade', name: '木柵', description: '阻擋 Creature 通行。', icon: '🪵', constructionCost: 20, requiredRank: 1, maxHealth: 25, healthBonus: 0, blocksMovement: true, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0 },
  { type: 'strong-barricade', name: '堅壘', description: '木柵高級版，更堅固，大幅阻擋 Creature。', icon: '🧱', constructionCost: 50, requiredRank: 2, maxHealth: 120, healthBonus: 0, blocksMovement: true, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0 },
  { type: 'watchtower', name: '瞭望塔', description: '增加據點周圍視野。', icon: '🗼', constructionCost: 30, requiredRank: 2, maxHealth: 40, healthBonus: 0, blocksMovement: false, providesVision: true, visionRange: 3, attackRange: 0, attackDamage: 0 },
  { type: 'advanced-watchtower', name: '進階瞭望塔', description: '提供更廣的視野。', icon: '🗼', constructionCost: 60, requiredRank: 4, maxHealth: 60, healthBonus: 0, blocksMovement: false, providesVision: true, visionRange: 5, attackRange: 0, attackDamage: 0 },
  { type: 'arrow-tower', name: '箭塔', description: 'Creature 回合自動攻擊周遭兩格內的怪物。', icon: '🏹', constructionCost: 40, requiredRank: 1, maxHealth: 50, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 2, attackDamage: 10 },
  { type: 'advanced-arrow-tower', name: '進階箭塔', description: 'Creature 回合自動攻擊周遭三格內的怪物。', icon: '🏹', constructionCost: 80, requiredRank: 3, maxHealth: 70, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 3, attackDamage: 18 },
  
  { type: 'supply-depot', name: '輜重庫', description: '於原位生成一座大型資源點，資源採集量 ×3。', icon: '📦', constructionCost: 120, requiredRank: 3, maxHealth: 160, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0, resourceIncomeMultiplier: 3 },
  { type: 'warcamp-bastion', name: '軍壘', description: '強化 3 格內箭塔／瞭望塔，HP ×2、箭塔攻擊 ×2。', icon: '🏰', constructionCost: 150, requiredRank: 4, maxHealth: 100, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0 },
  { type: 'warning-beacon', name: '烽燧臺', description: '每回合 50% 機率揭示全圖敵軍；剛建完立即揭示一次。', icon: '🔔', constructionCost: 100, requiredRank: 6, maxHealth: 140, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0 },
  { type: 'bombard-cannon', name: '轟城砲', description: '遠距範圍砲擊，冷卻 2 回合。', icon: '🛢️', constructionCost: 200, requiredRank: 5, maxHealth: 180, healthBonus: 0, blocksMovement: false, providesVision: false, visionRange: 1, attackRange: 4, attackDamage: 35, cooldownRounds: 2 },
  // 小型設施：由廢墟修復產生，不透過據點建造，故 constructionCost / requiredRank 為 0。
  { type: 'small-watchtower', name: '小型瞭望臺', description: '由廢墟修復而成，提供 2 格視野。', icon: '🗼', constructionCost: 0, requiredRank: 0, maxHealth: 15, healthBonus: 0, blocksMovement: true, providesVision: true, visionRange: 2, attackRange: 0, attackDamage: 0 },
  { type: 'small-arrow-tower', name: '小型箭塔', description: '由廢墟修復而成，提供 1 格視野與 1 格射程。', icon: '🏹', constructionCost: 0, requiredRank: 0, maxHealth: 20, healthBonus: 0, blocksMovement: true, providesVision: true, visionRange: 1, attackRange: 1, attackDamage: 5 },
  { type: 'small-waystation', name: '小型驛站', description: '由廢墟修復而成，可傳送至其他已修復的廢墟點。', icon: '🐎', constructionCost: 0, requiredRank: 0, maxHealth: 15, healthBonus: 0, blocksMovement: true, providesVision: false, visionRange: 1, attackRange: 0, attackDamage: 0 },
]

/** 玩家可透過據點建造的防禦設施（排除廢墟專屬的小型設施）。 */
export const buildableDefenseStructureCatalog: DefenseStructureDefinition[] =
  defenseStructureCatalog.filter((definition) =>
    definition.type !== 'small-watchtower' && definition.type !== 'small-arrow-tower' && definition.type !== 'small-waystation',
  )