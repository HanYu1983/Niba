import { pipe, always, map, concat, reduce, flatten } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { CardText } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ToolFn } from "../tool"
import { getCardTexts } from "./card"
import { getCardIds } from "./CardTableComponent"
import { getOnEventTitleFn } from "./effect"
import { GameState } from "./GameState"
import { getCardLikeItemIds, getItemIds, getItemPrototype } from "./ItemTableComponent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { getItemState, mapItemState, mapItemStateValues, setItemState } from "./ItemStateComponent"
import { getTextsFromSpecialEffect } from "./getTextsFromSpecialEffect"
import { log } from "../../tool/logger"

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerEvent(
    ctx: GameState,
    event: GameEvent
): GameState {
    log("triggerEvent", event.title, event.cardIds)
    const bridge = createBridge()
    // command
    const commands = pipe(
        always(getCardLikeItemIds(ctx)),
        map(cardId => {
            const proto = getItemPrototype(ctx, cardId)
            if (proto.commandText?.onEvent) {
                return { cardId: cardId, texts: [proto.commandText] }
            }
        }),
        infos => infos.filter(v => v) as { cardId: string, texts: CardText[] }[],
    )()
    ctx = pipe(
        always(getCardLikeItemIds(ctx)),
        map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
        concat(commands),
        reduce((ctx, { cardId, texts }) => {
            log("triggerEvent", "找到卡和內文", cardId, texts)
            return texts
                .flatMap(text => text.title[0] == "特殊型" ? getTextsFromSpecialEffect(ctx, text) : [text])
                .reduce((ctx, text) => {
                    log("triggerEvent", "處理單個內文", text.title, text.description)
                    const effect: Effect = {
                        id: ToolFn.getUUID("triggerTextEvent"),
                        reason: ["Event", cardId, event],
                        text: text
                    }
                    return getOnEventTitleFn(text)(ctx, effect, bridge)
                }, ctx)
        }, ctx)
    )()
    // 使用了卡牌後, 同一個切入不能再使用. 以下記錄使用過的卡片, 會在切入結束後清除
    if (event.effect != null && (event.effect.reason[0] == "PlayCard" || event.effect.reason[0] == "PlayText")) {
        const cardId = EffectFn.getCardID(event.effect)
        const textId = event.effect.text.id
        ctx = mapItemState(ctx, cardId, cs => {
            return {
                ...cs,
                textIdsUseThisCut: {
                    ...cs,
                    [textId]: true
                }
            }
        }) as GameState
    }
    if (event.title[0] == "カット終了時") {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onCutEnd(cs)
        }) as GameState
    }
    if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], PhaseFn.getLast())) {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onTurnEnd(cs)
        }) as GameState
    }
    return ctx
}