export type MartialSchoolId = 'golden-body' | 'swift-wind' | 'scarlet-flame' | 'frost-water' | 'earth-mountain' | 'void-spirit' | 'hundred-poison'

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
]
