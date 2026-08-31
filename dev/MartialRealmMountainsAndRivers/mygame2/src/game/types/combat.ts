import type { Position } from './geometry'
import type { PlayerAttributes } from './entities'
import type { LootResult, LearnedSkillResult } from './entities'

export type AttackTargetType = 'creature' | 'nest' | 'player'

export type AttackPreview = {
  playerId: string
  targetType: AttackTargetType
  targetId: string
  playerName: string
  targetName: string
  expectedDamage: number
  criticalRate: number
  targetHealth: number
  targetMaxHealth: number
  elementInteraction?: string
  terrainResonance?: string
  /** 敵方目標的減傷率（百分比；僅生物有）。 */
  targetReduction?: number
  /** 敵方目標的回避率（百分比；僅生物有）。 */
  targetEvasion?: number
}

/** 元素爆發道具（element-burst）的預期結果預覽。 */
export type ItemBurstPreview = {
  playerId: string
  playerName: string
  itemId: string
  itemName: string
  itemIcon: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  expectedDamage: number
  targetHealth: number
  targetMaxHealth: number
  elementInteraction?: string
}

export type AttackExecutionResult = {
  playerId: string
  playerName: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  damage: number
  nextHealth: number
  maxHealth: number
  criticalRate: number
  criticalHit: boolean
  /** 目標生物的防禦判定結果：`evaded`＝被回避（傷害為 0），`reduced`＝根骨減傷（傷害減半）。 */
  targetDefense?: 'evaded' | 'reduced'
  terrainResonance?: string
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
  equipmentDurabilityChanges?: EquipmentDurabilityChange[]
}

export type EquipmentDurabilityChange = {
  slot: 'weapon' | 'armor' | 'accessory'
  equipmentName: string
  before: number
  after: number
  amount: number
}

export type ExternalDamageExecutionResult = {
  playerId: string
  playerName: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  /** 目標被擊殺前的格子位置（供震動動畫在被移除後仍能定位）。 */
  targetPosition?: Position
  skillId: string
  skillName: string
  damage: number
  nextHealth: number
  maxHealth: number
  innerPowerCost: number
  /** 目標生物的防禦判定結果：`evaded`＝被回避（傷害為 0），`reduced`＝根骨減傷（傷害減半）。 */
  targetDefense?: 'evaded' | 'reduced'
  /** 範圍攻擊（selectionMode = all）：各目標的傷害結果；單體攻擊時為 undefined。 */
  areaTargets?: Array<{
    targetType: AttackTargetType
    targetId: string
    targetName: string
    targetPosition?: Position
    damage: number
    nextHealth: number
    maxHealth: number
    defeated: boolean
    /** 單一目標的防禦判定結果。 */
    targetDefense?: 'evaded' | 'reduced'
  }>
  /** 傷害型外功的暴擊率（內息每 1 點提供 2%）。 */
  criticalRate?: number
  /** 本次外功是否觸發暴擊。 */
  criticalHit?: boolean
  /** 本次外功是否觸發五行相生連攜。 */
  synergy?: boolean
  /** 本次外功是否觸發三重共振（連攜＋共鳴＋相剋）。 */
  tripleResonance?: boolean
  targetMode?: 'self' | 'target' | 'nest'
  terrainResonance?: string
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
  equipmentDurabilityChanges?: EquipmentDurabilityChange[]
  appliedBuffs?: Array<{
    name: string
    description: string
    remainingRounds: number | null
  }>
}

/** 元素爆發道具（element-burst）的執行結果，與普通攻擊/外功共用擊殺結算。 */
export type ItemBurstExecutionResult = {
  playerId: string
  playerName: string
  itemId: string
  itemName: string
  itemIcon: string
  element?: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  damage: number
  nextHealth: number
  maxHealth: number
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
}

export type RepairEquipmentPreview = {
  instanceId: string
  equipmentId: string
  name: string
  icon: string
  slot: 'weapon' | 'armor' | 'accessory'
  beforeDurability: number
  maxDurability: number
  durabilityRestored: number
}

export type RepairPreview = {
  playerId: string
  baseId: string
  equipmentCount: number
  durabilityRestored: number
  moneyCost: number
  repairedEquipment?: RepairEquipmentPreview[]
  /** 因工坊等級不足而無法修理的裝備數量。 */
  lockedEquipmentCount?: number
}

export type ExternalSkillPreview = {
  playerId: string
  targetType: AttackTargetType
  targetId: string
  skillId: string
  playerName: string
  targetName: string
  skillName: string
  innerPowerCost: number
  expectedDamage: number
  /** 傷害型外功的暴擊率（內息每 1 點提供 2%）。 */
  criticalRate?: number
  /** 是否觸發五行相生連攜（內功生外功）。 */
  synergy?: boolean
  /** 是否觸發三重共振（連攜＋天地共鳴＋五行相剋）。 */
  tripleResonance?: boolean
  /** 連攜共振狀態：single 僅連攜、dual 連攜＋共鳴、triple 三重共振。 */
  synergyResonanceState?: 'single' | 'dual' | 'triple'
  targetHealth?: number
  targetMaxHealth?: number
  targetMode?: 'self' | 'target' | 'nest'
  effectSummary?: string
  elementInteraction?: string
  terrainResonance?: string
  /** 敵方目標的減傷率（百分比；僅生物有）。 */
  targetReduction?: number
  /** 敵方目標的回避率（百分比；僅生物有）。 */
  targetEvasion?: number
}

/** 普通攻擊的暴擊率：臂力每 1 點提供 2%，最高 50%。 */
export function getCriticalRate(attributes: PlayerAttributes): number {
  return attributes.armStrength * 2
}