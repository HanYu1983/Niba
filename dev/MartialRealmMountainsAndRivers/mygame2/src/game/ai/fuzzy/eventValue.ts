import type { EventEffect } from '../../events/eventCatalog'
import type { AiPersonalityId } from '../../types/ai'
import { clampValue, computeUnifiedValue, evaluateUnifiedValue, type ValueEvaluation } from './valueContext'

export type EventValueContext = {
  effects: EventEffect[]
  playerMoney: number
  personality?: AiPersonalityId
}

/** 估算事件選項的直接收益；需求合法性仍由事件規則層負責。 */
export function evaluateEventChoiceValue(context: EventValueContext): ValueEvaluation {
  const score = context.effects.reduce((total, effect) => {
    switch (effect.type) {
      case 'money':
        return total + (effect.amount >= 0 ? effect.amount / 50 : effect.amount / Math.max(1, context.playerMoney))
      case 'prestige':
        return total + effect.amount / 30
      case 'item':
        return total + Math.max(0, effect.quantity) * 0.35
      case 'learn-skill':
        return total + 0.9
      case 'spawn-creature':
      case 'spawn-nest':
        return total - 0.5
      case 'spawn-event':
      case 'spawn-base':
      case 'start-dialogue':
        return total + 0.05
    }
  }, 0)

  return evaluateUnifiedValue({
    need: 1,
    benefit: clampValue(score),
    urgency: 1,
    risk: clampValue(-score),
    cost: 0,
    distance: 0,
    personalityWeight: context.personality === 'economist' ? 1.1
      : context.personality === 'scholar' && context.effects.some((effect) => effect.type === 'learn-skill') ? 1.15
        : context.personality === 'cautious' ? 0.95
          : 1,
  })
}

export function computeEventChoiceValue(context: EventValueContext): number {
  return computeUnifiedValue(evaluateEventChoiceValue(context).context)
}