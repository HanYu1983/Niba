import { describe, expect, it } from 'vitest'
import { explorationEventCatalog } from './eventCatalog'
import { itemCatalog } from '../catalogs/itemCatalog'

describe('explorationEventCatalog', () => {
  it('至少包含十個事件類型且每個事件都有選項', () => {
    expect(explorationEventCatalog.length).toBeGreaterThanOrEqual(10)
    expect(explorationEventCatalog.every((event) => event.choices.length > 0)).toBe(true)
  })

  it('事件選項的物品效果使用有效道具 ID', () => {
    const itemIds = new Set(itemCatalog.map((item) => item.id))
    for (const event of explorationEventCatalog) {
      for (const choice of event.choices) {
        for (const effect of choice.effects) {
          if (effect.type === 'item') expect(itemIds.has(effect.itemId)).toBe(true)
        }
      }
    }
  })

  it('支付山賊贖金時會獲得補給', () => {
    const event = explorationEventCatalog.find((currentEvent) => currentEvent.type === 'bandit-ransom')
    const payChoice = event?.choices.find((choice) => choice.id === 'pay')

    expect(payChoice?.effects).toEqual(expect.arrayContaining([
      { type: 'money', amount: -20 },
      { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 },
      { type: 'item', itemId: 'recover-qi-pill', quantity: 1 },
    ]))
  })
})
