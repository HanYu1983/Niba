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
import { createAllCardTexts } from "./globalEffects"

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function doTriggerEvent(
    ctx: GameState,
    event: GameEvent
): GameState {
    logCategory("doTriggerEvent", event.title, event.cardIds)
    const bridge = createBridge()
    createAllCardTexts(ctx, null).forEach(info => {
        const [item, texts] = info
        texts.forEach(text => {
            const effect: Effect = {
                id: ToolFn.getUUID("triggerTextEvent"),
                reason: ["Event", getItemController(ctx, item.id), item.id, event],
                text: text
            }
            ctx = createOnEventTitleFn(text)(ctx, effect, bridge)
        })
    })

    //const bridge = createBridge()
    // command
    // const commands = pipe(
    //     always(getCardLikeItemIds(ctx)),
    //     map(cardId => {
    //         const proto = getItemPrototype(ctx, cardId)
    //         if (proto.commandText?.onEvent) {
    //             return { cardId: cardId, texts: [proto.commandText] }
    //         }
    //         return null
    //     }),
    //     infos => infos.filter(v => v) as { cardId: string, texts: CardText[] }[],
    // )()
    // ctx = pipe(
    //     always(getCardLikeItemIds(ctx)),
    //     map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
    //     concat(commands),
    //     reduce((ctx, { cardId, texts }) => {
    //         logCategory("triggerEvent", "找到卡和內文", cardId, texts)
    //         return texts
    //             .flatMap(text => text.title[0] == "特殊型" ? createTextsFromSpecialEffect(ctx, text) : [text])
    //             .reduce((ctx, text) => {
    //                 logCategory("triggerEvent", "處理單個內文", text.title, text.description)
    //                 const effect: Effect = {
    //                     id: ToolFn.getUUID("triggerTextEvent"),
    //                     reason: ["Event", getItemController(ctx, cardId), cardId, event],
    //                     text: text
    //                 }
    //                 return createOnEventTitleFn(text)(ctx, effect, bridge)
    //             }, ctx)
    //     }, ctx)
    // )()
    if (event.title[0] == "カット終了時") {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onCutEnd(cs)
        }) as GameState

    }
    if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], PhaseFn.getLast())) {
        const activePlayerId = getActivePlayerID(ctx)
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onTurnEnd(cs)
        }) as GameState
        ctx = mapPlayerState(ctx, activePlayerId, ps => {
            return PlayerStateFn.onTurnEnd(ps)
        }) as GameState
    }
    ctx = EventCenterFn.onEvent(ctx, event)
    return ctx
}