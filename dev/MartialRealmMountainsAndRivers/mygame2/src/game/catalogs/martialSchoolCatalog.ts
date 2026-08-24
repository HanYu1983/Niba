export type MartialSchoolId = 'golden-body' | 'swift-wind' | 'scarlet-flame' | 'frost-water' | 'earth-mountain' | 'void-spirit' | 'hundred-poison' | 'sharp-edge' | 'misty-rain' | 'blazing-sun' | 'yellow-earth' | 'ghost-shadow'

export type MartialSchoolDefinition = {
  id: MartialSchoolId
  name: string
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
