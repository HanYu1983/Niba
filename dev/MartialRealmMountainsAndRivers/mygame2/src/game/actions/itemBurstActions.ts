import type {
  GameState,
  PlayerState,
  ItemBurstExecutionResult,
  ActionExecutionResult,
} from '../types'
import { itemCatalog, type ItemEffectType } from '../catalogs/itemCatalog'
import { getActionablePlayer } from '../rules/actionCostRules'
import { getElementDamageMultiplier } from '../rules/skillRules'
import { getSchoolElement } from '../catalogs/skillProgressionCatalog'
import { applyTargetDefeat, resolveCreatureDefeatRewards } from './combatActions'
import { recordDamageDealt } from '../runStats'
import { defaultRandomSource } from '../rules/randomRules'
import type { CombatActionDependencies } from './combatActions'

/**
 * 執行元素爆發道具（element-burst）對指定目標的傷害。
 *
 * 從 gameStore 抽離的純領域函式：validate → 計算傷害 → 統一擊殺流程 → 回傳結果。
 * 呼叫端負責以 updateGameState 套用回傳的 state。
 */
export function executeItemBurstAction(
  state: GameState,
  combatDeps: CombatActionDependencies,
): { state: GameState; result: ActionExecutionResult<ItemBurstExecutionResult> } {
  const preview = state.itemBurstPreview
  if (!preview) {
    return { state, result: { ok: false, reason: '目前沒有待執行的元素爆發道具。' } }
  }
  const item = itemCatalog.find((candidate) => candidate.id === preview.itemId)
  const player = getActionablePlayer(state, state.activePlayerId)
  const inventoryEntry = player?.inventory.find((entry) => entry.itemId === preview.itemId)
  if (!item || item.effect !== 'element-burst' || !player || !inventoryEntry || inventoryEntry.quantity <= 0) {
    return { state, result: { ok: false, reason: '道具不存在或數量不足。' } }
  }
  if (player.itemEffectsUsedThisTurn?.includes('element-burst')) {
    return { state, result: { ok: false, reason: '本回合已使用過元素爆發道具。' } }
  }

  const targetType = preview.targetType
  const targetId = preview.targetId
  const target = targetType === 'creature'
    ? state.creatures.find((creature) => creature.id === targetId && creature.health > 0)
    : state.creatureNests.find((nest) => nest.id === targetId && nest.health > 0)
  if (!target) {
    return { state, result: { ok: false, reason: '目標不存在或已被擊敗。' } }
  }

  const attackerElement = item.element
  const defenderElement = getSchoolElement(target.schoolId)
  const multiplier = getElementDamageMultiplier(attackerElement, defenderElement)
  const damage = Math.max(1, Math.floor((item.effectValue ?? 0) * multiplier))
  const nextHealth = Math.max(0, target.health - damage)
  const defeated = nextHealth === 0

  const consumeItem = (currentPlayer: PlayerState): PlayerState => ({
    ...currentPlayer,
    inventory: currentPlayer.inventory
      .map((entry) =>
        entry.itemId === preview.itemId
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry,
      )
      .filter((entry) => entry.quantity > 0),
  })

  // 統一擊殺流程：擊殺生物時與普通攻擊/外功一致，結算經驗、金錢與掉落。
  const creatureRewards = targetType === 'creature'
    ? resolveCreatureDefeatRewards(player, target as { level?: number }, defeated, combatDeps, defaultRandomSource)
    : null
  // 擊殺巢穴時與普通攻擊/外功一致，結算可學會的功法。
  const learnedSkill = targetType === 'nest' && defeated
    ? combatDeps.getLearnableSkill(player)
    : undefined

  const resultData: ItemBurstExecutionResult = {
    playerId: player.id,
    playerName: player.name,
    itemId: item.id,
    itemName: item.name,
    itemIcon: item.icon ?? '',
    element: item.element,
    targetType,
    targetId,
    targetName: target.name,
    damage,
    nextHealth,
    maxHealth: target.maxHealth,
    defeated,
    experienceReward: creatureRewards?.experienceGain || undefined,
    moneyReward: creatureRewards?.moneyReward || undefined,
    loot: creatureRewards?.loot,
    learnedSkill,
    levelsGained: creatureRewards
      ? (creatureRewards.progressedPlayer.level ?? 1) - (player.level ?? 1)
      : undefined,
    newLevel: creatureRewards?.progressedPlayer.level,
    attributePointsGained: creatureRewards
      ? (creatureRewards.progressedPlayer.availableAttributePoints ?? 0) - (player.availableAttributePoints ?? 0)
      : undefined,
  }

  // 統一死亡流程：血量歸零時由 applyTargetDefeat 移除目標（生物/巢穴）並處理勝利。
  const baseState: GameState = {
    // 元素爆發傷害計入「單回合最高傷害」戰績（僅人類玩家）。
    ...(player.isAI ? state : recordDamageDealt(state, damage)),
    operation: { type: 'idle' },
    itemBurstPreview: null,
    creatures: targetType === 'creature'
      ? state.creatures.map((creature) => creature.id === targetId ? { ...creature, health: nextHealth } : creature)
      : state.creatures,
    creatureNests: targetType === 'nest'
      ? state.creatureNests.map((nest) => nest.id === targetId ? { ...nest, health: nextHealth } : nest)
      : state.creatureNests,
    players: state.players.map((currentPlayer) =>
      currentPlayer.id === player.id
        ? (() => {
          const used: ItemEffectType[] = currentPlayer.itemEffectsUsedThisTurn?.includes('element-burst')
            ? currentPlayer.itemEffectsUsedThisTurn
            : [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'element-burst']
          const consumed = { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: used }
          if (!creatureRewards && !learnedSkill) return consumed
          const withLoot = creatureRewards?.loot
            ? combatDeps.addLootToPlayer(consumed, creatureRewards.loot)
            : consumed
          const withSkill = learnedSkill
            ? learnedSkill.type === 'inner'
              ? { ...withLoot, innerSkillIds: [...withLoot.innerSkillIds, learnedSkill.skill.id] }
              : { ...withLoot, externalSkillIds: [...withLoot.externalSkillIds, learnedSkill.skill.id] }
            : withLoot
          return {
            ...withSkill,
            level: creatureRewards?.progressedPlayer.level ?? withSkill.level,
            availableAttributePoints: creatureRewards?.progressedPlayer.availableAttributePoints ?? withSkill.availableAttributePoints,
            experience: creatureRewards?.progressedPlayer.experience ?? withSkill.experience,
            health: creatureRewards?.progressedPlayer.health ?? withSkill.health,
            innerPower: creatureRewards?.progressedPlayer.innerPower ?? withSkill.innerPower,
            money: withLoot.money + (creatureRewards?.moneyReward ?? 0),
          }
        })()
        : currentPlayer,
    ),
  }
  return { state: applyTargetDefeat(baseState, targetType, targetId, nextHealth), result: { ok: true, data: resultData } }
}