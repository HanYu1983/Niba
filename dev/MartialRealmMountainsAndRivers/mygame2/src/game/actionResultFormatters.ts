import type {
  ActionResult,
  AttackExecutionResult,
  ExternalDamageExecutionResult,
  ItemBurstExecutionResult,
  LootResult,
  Position,
  RepairPreview,
} from './types'
import type { ItemDefinition } from './catalogs/itemCatalog'
import { getMissionReward } from './rules/buildingProgressionRules'
import type { DefenseStructureDefinition } from './catalogs/defenseStructureCatalog'
import { explorationEventCatalog } from './events/eventCatalog'
import { itemCatalog, type MartialElement } from './catalogs/itemCatalog'
import { getElementName } from './rules/skillRules'

export function formatRepairResult(result: RepairPreview): ActionResult {
  return {
    title: '修理完成',
    message: `已修理 ${result.equipmentCount} 件裝備，全部恢復至最大耐久。`,
    rewards: [
      `恢復耐久 ${result.durabilityRestored} 點`,
      '體力 -2',
      '金錢消耗 0（免費修理）',
      ...(result.repairedEquipment ?? []).map((equipment) =>
        `${equipment.icon} ${equipment.name}：${equipment.beforeDurability}/${equipment.maxDurability} → ${equipment.maxDurability}/${equipment.maxDurability}`,
      ),
    ],
  }
}

export function formatAttackResult(result: AttackExecutionResult): ActionResult {
  return {
    title: '攻擊結果',
    message: `${result.playerName} 攻擊 ${result.targetName}。`,
    rewards: [
      `造成傷害 ${result.damage}`,
      ...(result.terrainResonance ? [`天地共鳴：${result.terrainResonance}`] : []),
      ...(result.criticalHit ? ['暴擊！造成 1.5 倍傷害。'] : []),
      ...(result.criticalRate > 0 ? [`普通攻擊暴擊率 ${result.criticalRate}%`] : []),
      result.defeated
        ? result.targetType === 'nest' ? '巢穴已摧毀' : '目標已被擊敗'
        : `目標剩餘血量 ${result.nextHealth} / ${result.maxHealth}`,
      ...(result.experienceReward ? [`玩家經驗 +${result.experienceReward}`] : []),
      ...(result.moneyReward ? [`獲得金錢 +${result.moneyReward}`] : []),
      ...(result.levelsGained && result.levelsGained > 0
        ? [`🎉 玩家升級！目前等級 Lv.${result.newLevel}，獲得屬性點 +${result.attributePointsGained}`]
        : []),
      ...(result.learnedSkill
        ? [`學會${result.learnedSkill.type === 'inner' ? '內功' : '外功'}：${result.learnedSkill.skill.name}`]
        : []),
      ...(result.loot ? [`掉落：${formatLootLabel(result.loot)}`] : []),
      ...(result.equipmentDurabilityChanges ?? []).map((change) =>
        `${change.equipmentName} 耐久 ${change.before} → ${change.after}`,
      ),
    ],
  }
}

export function formatExternalSkillResult(result: ExternalDamageExecutionResult): ActionResult {
  const selfCast = result.targetMode === 'self'
  const isArea = Boolean(result.areaTargets && result.areaTargets.length > 0)
  return {
    title: isArea ? '範圍外功結果' : '外功結果',
    message: selfCast
      ? `${result.playerName} 施放 ${result.skillName}，效果作用於自身。`
      : isArea
        ? `${result.playerName} 施放範圍外功 ${result.skillName}，命中 ${result.areaTargets?.length} 個目標。`
        : `${result.playerName} 施放 ${result.skillName} 於 ${result.targetName}。`,
    rewards: [
      ...(selfCast ? [result.skillName.includes('悟道') ? '已增加目前裝備功法經驗' : '技能效果已生效'] : [
        ...(isArea
          ? (result.areaTargets ?? []).map((target) => {
            const isNest = target.targetType === 'nest'
            return `${target.targetName}：造成傷害 ${target.damage}${target.defeated
              ? (isNest ? '｜巢穴已摧毀' : '｜目標已被擊敗')
              : `｜剩餘 ${target.nextHealth} / ${target.maxHealth}`}`
          })
          : [`造成傷害 ${result.damage}`]),
        ...(result.terrainResonance ? [`天地共鳴：${result.terrainResonance}`] : []),
        ...(result.synergy ? ['五行相生連攜：內功生外功｜傷害 ×1.25'] : []),
        ...(result.tripleResonance ? ['⚡ 三重共振！目標震懾一回合'] : []),
        ...(result.criticalHit ? ['暴擊！造成 1.5 倍傷害。'] : []),
        ...(result.criticalRate !== undefined && result.criticalRate > 0 ? [`外功暴擊率 ${result.criticalRate}%`] : []),
        ...(result.appliedBuffs ?? []).map((buff) => `施加 Buff：${buff.name}（${buff.description}，持續 ${buff.remainingRounds === null ? '持續生效' : `${buff.remainingRounds} 回合`}）`),
        !isArea && result.defeated
          ? result.targetType === 'nest' ? '巢穴已摧毀' : '目標已被擊敗'
          : undefined,
        ...(result.experienceReward ? [`玩家經驗 +${result.experienceReward}`] : []),
        ...(result.loot ? [`掉落：${formatLootLabel(result.loot)}`] : []),
      ]),
      `內力 -${result.innerPowerCost}`,
      ...(result.equipmentDurabilityChanges ?? []).map((change) =>
        `${change.equipmentName} 耐久 ${change.before} → ${change.after}`,
      ),
      ...(result.moneyReward ? [`獲得金錢 +${result.moneyReward}`] : []),
      ...(result.levelsGained && result.levelsGained > 0
        ? [`🎉 玩家升級！目前等級 Lv.${result.newLevel}，獲得屬性點 +${result.attributePointsGained}`]
        : []),
      ...(result.learnedSkill
        ? [`學會${result.learnedSkill.type === 'inner' ? '內功' : '外功'}：${result.learnedSkill.skill.name}`]
        : []),
    ].filter((line): line is string => Boolean(line)),
  }
}

/** 元素爆發道具（element-burst）的執行結果彈窗。 */
export function formatItemBurstResult(result: ItemBurstExecutionResult): ActionResult {
  return {
    title: '道具攻擊結果',
    message: `${result.playerName} 使用 ${result.itemName} 攻擊 ${result.targetName}。`,
    rewards: [
      `造成傷害 ${result.damage}`,
      ...(result.element && result.targetType === 'creature' ? [`屬性：${getElementName(result.element as MartialElement | undefined)}`] : []),
      result.defeated
        ? result.targetType === 'nest' ? '巢穴已摧毀' : '目標已被擊敗'
        : `目標剩餘血量 ${result.nextHealth} / ${result.maxHealth}`,
      ...(result.experienceReward ? [`玩家經驗 +${result.experienceReward}`] : []),
      ...(result.loot ? [`掉落：${formatLootLabel(result.loot)}`] : []),
      ...(result.moneyReward ? [`獲得金錢 +${result.moneyReward}`] : []),
      ...(result.levelsGained && result.levelsGained > 0
        ? [`🎉 玩家升級！目前等級 Lv.${result.newLevel}，獲得屬性點 +${result.attributePointsGained}`]
        : []),
      ...(result.learnedSkill
        ? [`學會${result.learnedSkill.type === 'inner' ? '內功' : '外攻'}：${result.learnedSkill.skill.name}`]
        : []),
    ],
  }
}

export function formatLootLabel(loot: LootResult): string {
  if (loot.kind === 'item') return `${loot.itemIcon} ${loot.itemName}`
  if (loot.kind === 'equipment') return `${loot.equipment.icon} ${loot.equipment.name}（耐久 ${loot.instance.durability} / ${loot.instance.maxDurability}）`
  return `${loot.skillType === 'inner' ? '☯' : '⚡'} ${loot.skill.name}`
}

export function formatResourceCollectionResult(resourcePointName: string, baseName: string, materialIncome: number): ActionResult {
  return {
    title: '採集結果',
    message: `已完成「${resourcePointName}」的採集。`,
    rewards: [`${baseName} 建料 +${materialIncome}`, '玩家聲望 +5'],
  }
}

export function formatMissionResult(baseName: string, boardLevel = 1): ActionResult {
  const reward = getMissionReward(boardLevel)
  return {
    title: '任務結果',
    message: `已完成「${baseName}」的告示牌任務。`,
    rewards: [`玩家金錢 +${reward.money}`, `玩家聲望 +${reward.prestige}`],
  }
}

export function formatDefenseStructureBuildResult(
  definition: DefenseStructureDefinition,
  position: Position,
): ActionResult {
  return {
    title: '防禦建築建造完成',
    message: `已在 (${position.row + 1}, ${position.column + 1}) 建造設施。`,
    rewards: [`消耗 ${definition.constructionCost} 建料`, '玩家聲望 +5'],
  }
}

export function formatItemUseResult(item: ItemDefinition): ActionResult {
  return {
    title: '道具使用結果',
    message: `已使用「${item.name}」。`,
    rewards: [item.effectLabel],
  }
}

export function formatItemPointPickupResult(loot: LootResult | LootResult[], terrain?: string): ActionResult {
  const terrainLabel: Record<string, string> = {
    plain: '🌾 草地物產',
    forest: '🌲 森林物產',
    mountain: '⛰️ 山嶽礦藏',
    water: '🌊 水澤珍品',
    desert: '🏜️ 荒漠秘寶',
  }
  const sourceLabel = terrain ? terrainLabel[terrain] : undefined
  const loots = Array.isArray(loot) ? loot : [loot]
  const messages = loots.map((l) => l.kind === 'item'
    ? `撿取成功，獲得 ${l.itemIcon} ${l.itemName}。`
    : l.kind === 'equipment'
      ? `撿取成功，獲得 ${l.equipment.icon} ${l.equipment.name}。`
      : `撿取成功，獲得${l.skillType === 'inner' ? '內功' : '外功'}「${l.skill.name}」。`)
  const rewards = loots.map((l) => l.kind === 'item'
    ? `${l.itemName} ×1`
    : l.kind === 'equipment'
      ? `${l.equipment.name}（耐久 ${l.instance.durability} / ${l.instance.maxDurability}）`
      : `${l.skillType === 'inner' ? '內功' : '外功'}：${l.skill.name}`)

  return {
    title: '撿取結果',
    message: sourceLabel ? `${sourceLabel}｜${messages.join(' ')}` : messages.join(' '),
    rewards: [...rewards, '目前玩家回合結束'],
  }
}

export function formatExplorationEventResult(eventName: string, choiceId: string, learnedSkillName?: string, customResultMessage?: string): ActionResult {
  const definition = explorationEventCatalog.find((event) => event.name === eventName)
  const choice = definition?.choices.find((candidate) => candidate.id === choiceId)
  const rewards = choice?.effects.map((effect) => {
    if (effect.type === 'money') return `${effect.amount >= 0 ? '金錢 +' : '金錢 '}${effect.amount}`
    if (effect.type === 'prestige') return `${effect.amount >= 0 ? '聲望 +' : '聲望 '}${effect.amount}`
    if (effect.type === 'learn-skill') {
      return learnedSkillName
        ? `學會${effect.skillType === 'inner' ? '內功' : '外功'}：${learnedSkillName}`
        : `學會一項未習得的${effect.skillType === 'inner' ? '內功' : '外功'}`
    }
    if (effect.type === 'spawn-creature') return `怪物出現：${effect.creatureId}`
    if (effect.type === 'spawn-event') return `事件出現：${effect.eventId}`
    if (effect.type === 'spawn-base') return `據點出現：${effect.baseId}`
    if (effect.type === 'spawn-nest') return `巢穴出現：${effect.nestId}`
    if (effect.type === 'start-dialogue') return `觸發對話：${effect.dialogueId}`
    const item = itemCatalog.find((candidate) => candidate.id === effect.itemId)
    return `${item?.name ?? effect.itemId} ${effect.quantity >= 0 ? '+' : ''}${effect.quantity}`
  }) ?? []

  return {
    title: '探索事件結果',
    // 自定義事件可提供自訂結果訊息；否則自動由事件名與選項生成。
    message: customResultMessage || `${eventName}：${choice?.label ?? choiceId}。`,
    rewards,
  }
}
