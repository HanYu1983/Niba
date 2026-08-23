import { describe, expect, it } from 'vitest'
import { getBaseBuildingIcon } from './buildingViewData'
import type { BaseBuilding } from './catalogs/buildingCatalog'

function makeBuilding(type: string): BaseBuilding {
  return {
    id: `building-${type}`,
    type,
    name: type,
    description: type,
    constructionCost: 0,
  }
}

describe('building view data', () => {
  it('已知建築使用集中管理的 icon', () => {
    expect(getBaseBuildingIcon(makeBuilding('board'))).toBe('📜')
    expect(getBaseBuildingIcon(makeBuilding('workshop'))).toBe('🔧')
  })

  it('未知建築使用通用 fallback icon', () => {
    expect(getBaseBuildingIcon(makeBuilding('future-building'))).toBe('🏗️')
  })
})