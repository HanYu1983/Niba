import type { TerrainType } from '../types'
import type { SchoolElement } from './skillProgressionCatalog'

export type MartialSchoolId = 'golden-body' | 'swift-wind' | 'scarlet-flame' | 'frost-water' | 'earth-mountain' | 'void-spirit' | 'hundred-poison' | 'sharp-edge' | 'misty-rain' | 'blazing-sun' | 'yellow-earth' | 'ghost-shadow'

export type MartialSchoolDefinition = {
  id: MartialSchoolId
  name: string
}

// export type SchoolElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'

/** 將功法流派映射到五行元素；無對應（太虛流／幽影流）回傳 'none'。 */
// export function getSchoolElement(schoolId?: string): SchoolElement {
//   switch (schoolId) {
//     case 'golden-body': return 'metal'
//     case 'swift-wind': return 'wood'
//     case 'scarlet-flame': return 'fire'
//     case 'frost-water': return 'water'
//     case 'earth-mountain': return 'earth'
//     case 'hundred-poison': return 'wood'
//     case 'sharp-edge': return 'metal'
//     case 'misty-rain': return 'water'
//     case 'blazing-sun': return 'fire'
//     case 'yellow-earth': return 'earth'
//     default: return 'none'
//   }
// }

/**
 * 五行「怪物主場」對應：依五行屬性（而非流派）決定主場地形與主場 Buff。
 * 新增流派只要屬五行即自動獲得對應主場，無需逐一註冊。金、土皆歸山嶽。
 */
export const elementHomeTurfBuffs: Partial<Record<SchoolElement, { terrain: TerrainType; definitionId: string }>> = {
  wood: { terrain: 'forest', definitionId: 'home-turf-forest' },
  water: { terrain: 'water', definitionId: 'home-turf-water' },
  fire: { terrain: 'desert', definitionId: 'home-turf-desert' },
  metal: { terrain: 'mountain', definitionId: 'home-turf-mountain' },
  earth: { terrain: 'mountain', definitionId: 'home-turf-mountain' },
}

export const martialSchoolCatalog: MartialSchoolDefinition[] = [
  { id: 'void-spirit', name: '太虛流' },
  { id: 'golden-body', name: '金剛流' },
  { id: 'swift-wind', name: '追風流' },
  { id: 'scarlet-flame', name: '赤炎流' },
  { id: 'frost-water', name: '寒水流' },
  { id: 'earth-mountain', name: '厚土流' },
  { id: 'hundred-poison', name: '百毒流' },
  { id: 'sharp-edge', name: '銳鋒流' },
  { id: 'misty-rain', name: '煙雨流' },
  { id: 'blazing-sun', name: '烈陽流' },
  { id: 'yellow-earth', name: '黃土流' },
  { id: 'ghost-shadow', name: '幽影流' },
]
