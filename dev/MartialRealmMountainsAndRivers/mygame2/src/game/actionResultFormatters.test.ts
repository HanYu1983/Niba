import { describe, expect, it } from 'vitest'
import {
  formatAttackResult,
  formatDefenseStructureBuildResult,
  formatExplorationEventResult,
  formatExternalSkillResult,
  formatItemPointPickupResult,
  formatItemUseResult,
  formatMissionResult,
  formatRepairResult,
} from './actionResultFormatters'
import { defenseStructureCatalog } from './catalogs/defenseStructureCatalog'

describe('action result formatters', () => {
  it('格式化修理結果', () => {
    expect(formatRepairResult({
      playerId: 'player-1',
      baseId: 'base-1',
      equipmentCount: 1,
      durabilityRestored: 3,
      moneyCost: 0,
      lockedEquipmentCount: 0,
      repairedEquipment: [{
        instanceId: 'sword-1',
        equipmentId: 'iron-sword',
        name: '精鐵劍',
        icon: '🗡️',
        slot: 'weapon',
        beforeDurability: 17,
        maxDurability: 20,
        durabilityRestored: 3,
      }],
    })).toEqual({
      title: '修理完成',
      message: '已修理 1 件裝備，全部恢復至最大耐久。',
      rewards: ['恢復耐久 3 點', '體力 -2', '金錢消耗 0（免費修理）', '🗡️ 精鐵劍：17/20 → 20/20'],
    })
  })

  it('格式化攻擊結果與掉落資訊', () => {
    const result = formatAttackResult({
      playerId: 'player-1', playerName: '玩家 1', targetType: 'creature', targetId: 'creature-1', targetName: 'Creature',
      damage: 5, nextHealth: 0, maxHealth: 10, criticalRate: 25, criticalHit: false, terrainResonance: '厚土共鳴', defeated: true,
      experienceReward: 25,
      loot: { kind: 'item', itemId: 'heal-wound-medicine', itemName: '療傷藥', itemIcon: '🧪' },
    })
    expect(result.rewards).toEqual(['造成傷害 5', '天地共鳴：厚土共鳴', '普通攻擊暴擊率 25%', '目標已被擊敗', '玩家經驗 +25', '掉落：🧪 療傷藥'])
  })

  it('格式化外功與任務結果', () => {
    expect(formatExternalSkillResult({
      playerId: 'player-1', playerName: '玩家 1', targetType: 'nest', targetId: 'nest-1', targetName: '巢穴',
      skillId: 'skill-1', skillName: '破空掌', damage: 8, nextHealth: 0, maxHealth: 8, innerPowerCost: 3, defeated: true, terrainResonance: '赤焰共鳴',
    }).rewards).toEqual(['造成傷害 8', '天地共鳴：赤焰共鳴', '巢穴已摧毀', '內力 -3'])
    expect(formatMissionResult('測試據點').rewards).toEqual(['玩家金錢 +10', '玩家聲望 +5'])
    expect(formatMissionResult('測試據點', 3).rewards).toEqual(['玩家金錢 +30', '玩家聲望 +15'])
  })

  it('格式化防禦建造、道具使用與道具點撿取結果', () => {
    const definition = defenseStructureCatalog.find((candidate) => candidate.type === 'arrow-tower')
    expect(definition).toBeDefined()
    expect(formatDefenseStructureBuildResult(definition!, { row: 2, column: 3 })).toEqual({
      title: '防禦建築建造完成',
      message: '已在 (3, 4) 建造設施。',
      rewards: ['消耗 40 建料', '玩家聲望 +5'],
    })
    expect(formatItemUseResult({
      id: 'heal-wound-medicine', name: '療傷藥', description: '恢復生命', icon: '🧪',
      effectLabel: '生命值 +20', effect: 'health', effectValue: 20, buyPrice: 20, requiredShopLevel: 1,
    }).rewards).toEqual(['生命值 +20'])
    expect(formatItemPointPickupResult({
      kind: 'item', itemId: 'heal-wound-medicine', itemName: '療傷藥', itemIcon: '🧪',
    }).rewards).toEqual(['療傷藥 ×1', '目前玩家回合結束'])
  })

  it('格式化探索事件選項結果', () => {
    expect(formatExplorationEventResult('失散商隊', 'trade')).toEqual({
      title: '探索事件結果',
      message: '失散商隊：交易。',
      rewards: ['金錢 -10', '回氣丹 +1'],
    })
    expect(formatExplorationEventResult('失散商隊', 'escort').rewards).toEqual(['聲望 +5'])
  })
})
