import { DestroyReason, EffectFn } from "../define/Effect"
import { getEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { doTriggerEvent } from "./doTriggerEvent"

// 移除破壞效果，全部移到堆疊
export function doCutInDestroyEffectsAndClear(ctx: GameState, ordered?: string[]): GameState {
    const destryEffectIds = ordered || ctx.destroyEffect
    ctx = {
        ...ctx,
        destroyEffect: [],
        stackEffect: [...destryEffectIds, ...ctx.stackEffect]
    }
    // 破壊されている場合
    destryEffectIds.map(i => getEffect(ctx, i)).forEach(e => {
        if (e.reason[0] != "Destroy") {
            throw new Error()
        }
        const reason: DestroyReason = e.reason[3]
        const itemId = EffectFn.getCardID(e)
        ctx = doTriggerEvent(ctx, { title: ["破壊された場合", reason], cardIds: [itemId] })
    })
    return ctx
}