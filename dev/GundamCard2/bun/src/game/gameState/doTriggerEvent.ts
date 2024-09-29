import { pipe, always, map, concat, reduce, flatten } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { CardText } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ToolFn } from "../tool"
import { getCardTexts } from "./card"
import { getCardIds } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getCardLikeItemIds, getItemController, getItemPrototype } from "./ItemTableComponent"
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

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function doTriggerEvent(
    ctx: GameState,
    event: GameEvent
): GameState {
    logCategory("doTriggerEvent", event.title, event.cardIds)
    const bridge = createBridge()
    // command
    const commands = pipe(
        always(getCardLikeItemIds(ctx)),
        map(cardId => {
            const proto = getItemPrototype(ctx, cardId)
            if (proto.commandText?.onEvent) {
                return { cardId: cardId, texts: [proto.commandText] }
            }
            return null
        }),
        infos => infos.filter(v => v) as { cardId: string, texts: CardText[] }[],
    )()
    ctx = pipe(
        always(getCardLikeItemIds(ctx)),
        map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
        concat(commands),
        reduce((ctx, { cardId, texts }) => {
            logCategory("triggerEvent", "找到卡和內文", cardId, texts)
            return texts
                .flatMap(text => text.title[0] == "特殊型" ? createTextsFromSpecialEffect(ctx, text) : [text])
                .reduce((ctx, text) => {
                    logCategory("triggerEvent", "處理單個內文", text.title, text.description)
                    const effect: Effect = {
                        id: ToolFn.getUUID("triggerTextEvent"),
                        reason: ["Event", getItemController(ctx, cardId), cardId, event],
                        text: text
                    }
                    return createOnEventTitleFn(text)(ctx, effect, bridge)
                }, ctx)
        }, ctx)
    )()
    // 使用了卡牌後, 同一個切入不能再使用. 以下記錄使用過的卡片, 會在切入結束後清除
    // if (event.effect != null && (event.effect.reason[0] == "PlayCard" || event.effect.reason[0] == "PlayText")) {
    //     const cardId = EffectFn.getCardID(event.effect)
    //     const textId = event.effect.text.id
    //     ctx = mapItemState(ctx, cardId, cs => {
    //         return {
    //             ...cs,
    //             textIdsUseThisCut: {
    //                 ...cs,
    //                 [textId]: true
    //             }
    //         }
    //     }) as GameState
    // }
    if (event.title[0] == "カット終了時") {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onCutEnd(cs)
        }) as GameState

    }
    if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], PhaseFn.getLast())) {
        const activePlayerId = getActivePlayerID(ctx)
        // BaSyouKeywordFn.getAll()
        //     .map(kw => AbsoluteBaSyouFn.of(activePlayerId, kw))
        //     .flatMap(basyou => getCardLikeItemIdsByBasyou(ctx, basyou))
        //     .reduce((ctx, itemId) => {
        //         return mapItemState(ctx, itemId, cs => {
        //             return ItemStateFn.onTurnEnd(cs)
        //         }) as GameState
        //     }, ctx);
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