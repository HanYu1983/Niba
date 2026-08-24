import type { PlayerAttributes, TerrainType } from '../types'
import type { InnerSkill } from './innerSkillCatalog'
import type { ExternalSkill } from './externalSkillCatalog'
import type { FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import { getFunctionalSkillBuffIds } from './functionalSkillRegistry'

/**
 * 功法統一創建入口（Skill Factory）。
 *
 * 重構目標：讓所有功法（內功、傷害型外功、靈氣型外功、強化型外功）都透過
 * 具名 Factory 建立，由 Factory 集中套用「類型預設值」與「類型驗證」，
 * 避免各目錄重複撰寫預設欄位，也避免 `target`/`category`/`innerPowerCost`/
 * 效果欄位互相矛盾。
 *
 * 邊界：本模組只負責資料建立與靜態驗證，不做任何戰鬥、治療、裝備或回合結算。
 *
 * 依賴方向：本模組被 catalog 依賴，不依賴 action / React / store 模組。
 */

/* ------------------------------------------------------------------ */
/* 共用基本資料                                                        */
/* ------------------------------------------------------------------ */

type SkillElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'

/* ------------------------------------------------------------------ */
/* 強化型外功主動效果模型                                             */
/* ------------------------------------------------------------------ */

export type EnhancementActivationEffect =
  | { kind: 'heal-self-percent'; percent: number }
  | { kind: 'heal-self-flat'; amount: number }
  | { kind: 'apply-self-buff'; buffIds: string[] }
  | { kind: 'cleanse-self' }

/* ------------------------------------------------------------------ */
/* 靈氣型外功結構化效果模型                                           */
/* ------------------------------------------------------------------ */

export type AuraEffect =
  | { kind: 'terrain-cost-reduction'; terrain: TerrainType; amount: number; minimumCost: number }
  | { kind: 'passive-buff'; buffIds: string[] }
  | { kind: 'skill-exp-gain'; percent: number }

/* ------------------------------------------------------------------ */
/* 輸入型別（四個具名入口各自有明確必要欄位）                         */
/* ------------------------------------------------------------------ */

// ---- 內功 ----
export type CreateInnerSkillInput = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightRequirement: number
  requiredHallLevel?: number
  school?: string
  schoolId?: string
  element?: SkillElement
  level?: number
  buffIds?: string[]
  calculateDamage: (attributes: PlayerAttributes) => number
}

// ---- 傷害型外功 ----
export type CreateDamageExternalSkillInput = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightCost: number
  requiredHallLevel?: number
  school?: string
  schoolId?: string
  element?: SkillElement
  level?: number
  innerPowerCost: number
  range?: number
  functionalEffect?: FunctionalExternalSkillEffect
  calculateDamage?: (attributes: PlayerAttributes) => number
}

// ---- 靈氣型外功 ----
export type CreateAuraExternalSkillInput = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightCost: number
  requiredHallLevel?: number
  school?: string
  schoolId?: string
  element?: SkillElement
  level?: number
  functionalEffect?: FunctionalExternalSkillEffect
  passiveBuffIds?: string[]
  auraEffect?: AuraEffect
}

// ---- 強化型外功 ----
export type CreateEnhancementExternalSkillInput = {
  id: string
  name: string
  description: string
  formulaDescription: string
  insightCost: number
  requiredHallLevel?: number
  school?: string
  schoolId?: string
  element?: SkillElement
  level?: number
  innerPowerCost: number
  activationEffect: EnhancementActivationEffect
  functionalEffect?: FunctionalExternalSkillEffect
  calculateDamage?: (attributes: PlayerAttributes) => number
}

/* ------------------------------------------------------------------ */
/* 建立階段錯誤                                                        */
/* ------------------------------------------------------------------ */

function createError(factoryName: string, id: string, field: string, message: string): Error {
  return new Error(`[${factoryName}] 功法「${id}」欄位「${field}」違反規則：${message}`)
}

function zeroDamage(): number {
  return 0
}

/* ------------------------------------------------------------------ */
/* 1. 內功                                                            */
/* ------------------------------------------------------------------ */

export function createInnerSkill(input: CreateInnerSkillInput): InnerSkill {
  // 必要欄位
  if (typeof input.calculateDamage !== 'function') {
    throw createError('createInnerSkill', input.id, 'calculateDamage', '內功必須提供普攻傷害公式。')
  }
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    formulaDescription: input.formulaDescription,
    insightRequirement: input.insightRequirement,
    requiredHallLevel: input.requiredHallLevel ?? 1,
    school: input.school,
    schoolId: input.schoolId,
    element: input.element,
    level: input.level,
    buffIds: input.buffIds,
    calculateDamage: input.calculateDamage,
  }
}

/* ------------------------------------------------------------------ */
/* 2. 傷害型外功                                                      */
/* ------------------------------------------------------------------ */

export function createDamageExternalSkill(input: CreateDamageExternalSkillInput): ExternalSkill {
  // 驗證
  if (input.innerPowerCost <= 0) {
    throw createError('createDamageExternalSkill', input.id, 'innerPowerCost', '傷害型外功內力消耗必須大於 0。')
  }
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    formulaDescription: input.formulaDescription,
    insightCost: input.insightCost,
    requiredHallLevel: input.requiredHallLevel ?? 1,
    school: input.school,
    schoolId: input.schoolId,
    element: input.element,
    level: input.level,
    category: 'damage',
    target: 'target',
    innerPowerCost: input.innerPowerCost,
    range: input.range,
    functionalEffect: input.functionalEffect,
    calculateDamage: input.calculateDamage ?? zeroDamage,
  }
}

/* ------------------------------------------------------------------ */
/* 3. 靈氣型外功                                                      */
/* ------------------------------------------------------------------ */

function resolveAuraBuffIds(input: CreateAuraExternalSkillInput): string[] {
  const fromFunctional = input.functionalEffect ? getFunctionalSkillBuffIds(input.functionalEffect) : []
  const fromExplicit = input.passiveBuffIds ?? []
  const fromAuraEffect = input.auraEffect?.kind === 'passive-buff' ? input.auraEffect.buffIds : []
  return [...new Set([...fromExplicit, ...fromFunctional, ...fromAuraEffect])]
}

export function createAuraExternalSkill(input: CreateAuraExternalSkillInput): ExternalSkill {
  const buffIds = resolveAuraBuffIds(input)
  const hasTerrainEffect = input.auraEffect?.kind === 'terrain-cost-reduction'
  const hasExpEffect = input.auraEffect?.kind === 'skill-exp-gain'

  // 驗證：至少需要一個常駐效果來源
  if (buffIds.length === 0 && !hasTerrainEffect && !hasExpEffect) {
    throw createError('createAuraExternalSkill', input.id, 'auraEffect/passiveBuffIds', '靈氣型外功必須至少提供一個常駐效果來源（passiveBuffIds、functionalEffect 或 auraEffect）。')
  }

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    formulaDescription: input.formulaDescription,
    insightCost: input.insightCost,
    requiredHallLevel: input.requiredHallLevel ?? 1,
    school: input.school,
    schoolId: input.schoolId,
    element: input.element,
    level: input.level,
    category: 'aura',
    target: 'self',
    innerPowerCost: 0,
    functionalEffect: input.functionalEffect,
    passiveBuffIds: buffIds.length > 0 ? buffIds : undefined,
    auraEffect: input.auraEffect,
    calculateDamage: zeroDamage,
  }
}

/* ------------------------------------------------------------------ */
/* 4. 強化型外功                                                      */
/* ------------------------------------------------------------------ */

export function createEnhancementExternalSkill(input: CreateEnhancementExternalSkillInput): ExternalSkill {
  // 驗證
  if (!input.activationEffect) {
    throw createError('createEnhancementExternalSkill', input.id, 'activationEffect', '強化型外功必須提供主動效果。')
  }
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    formulaDescription: input.formulaDescription,
    insightCost: input.insightCost,
    requiredHallLevel: input.requiredHallLevel ?? 1,
    school: input.school,
    schoolId: input.schoolId,
    element: input.element,
    level: input.level,
    category: 'enhancement',
    target: 'self',
    innerPowerCost: input.innerPowerCost,
    functionalEffect: input.functionalEffect,
    activationEffect: input.activationEffect,
    calculateDamage: input.calculateDamage ?? zeroDamage,
  }
}