export type GovernancePolicyId = 'basic' | 'economic' | 'military' | 'civilian'

export type GovernancePolicyDefinition = {
  id: GovernancePolicyId
  name: string
  description: string
}

export const governancePolicyCatalog: GovernancePolicyDefinition[] = [
  { id: 'basic', name: '基本政策', description: '不提供任何額外效果。' },
  { id: 'economic', name: '經濟政策', description: '商店購買價格降低 5%。' },
  { id: 'military', name: '軍事政策', description: '據點承受的傷害降低 5%。' },
  { id: 'civilian', name: '民生政策', description: '資源點採集與每回合被動建料收入增加 5%。' },
]
