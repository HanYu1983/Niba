import { pipe, always, map, concat, reduce, flatten } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { CardText } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ToolFn } from "../tool"
import { getCardTexts } from "./card"
import { getCard, getCardIds } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getCardLikeItemIds, getItem, getItemController, getItemIdsByBasyou, getItemPrototype, isCard, isChip, Item } from "./ItemTableComponent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { getItemState, mapItemState, mapItemStateValues, setItemState } from "./ItemStateComponent"
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect"
import { logCategory } from "../../tool/logger"
import { mapPlayerState } from "./PlayerStateComponent"
import { PlayerStateFn } from "../define/PlayerState"
import { getActivePlayerID } from "./ActivePlayerComponent"
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou"
import { createOnEventTitleFn } from "./createOnEventTitleFn"
import { EventCenterFn } from "./EventCenter"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { clearGlobalEffects, createAllCardTexts, getGlobalEffects, setGlobalEffects, updateGlobalEffects } from "./globalEffects"
import { addImmediateEffect } from "./EffectStackComponent"
import { createAttackPhaseRuleEffect } from "./createAttackPhaseRuleEffect"
import { GameExtParams } from "../define/GameExtParams"

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function doTriggerEvent(
    ctx: GameState,
    event: GameEvent,
    options: GameExtParams
): GameState {
    logCategory("doTriggerEvent", event.title, event.cardIds)
    createAllCardTexts(ctx).forEach(info => {
        const [item, texts] = info
        texts.forEach(text => {
            const effect: Effect = {
                id: `doTriggerEvent_${item.id}_${text.id}`,
                reason: ["Event", getItemController(ctx, item.id), item.id, event],
                text: text
            }
            logCategory("doTriggerEvent", "eventTitle", text.onEvent)
            const ges = options.ges || []
            ctx = createOnEventTitleFn(text)(ctx, effect, createBridge({ ges: ges }))
        })
    })
    ctx = EventCenterFn.onEvent(ctx, event, options)
    return ctx
}