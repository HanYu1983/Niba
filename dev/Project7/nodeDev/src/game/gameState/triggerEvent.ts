import { pipe, always, map, concat, reduce } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { CardText } from "../define/CardText"
import { Effect } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ToolFn } from "../tool"
import { getCardTexts } from "./card"
import { getCardIds } from "./CardTableComponent"
import { getOnEventTitleFn } from "./effect"
import { GameState } from "./GameState"
import { getItemPrototype } from "./ItemTableComponent"

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerEvent(
    ctx: GameState,
    evt: GameEvent
): GameState {
    const bridge = createBridge()
    // command
    const commands = pipe(
        always(getCardIds(ctx)),
        map(cardId => {
            const proto = getItemPrototype(ctx, cardId)
            if (proto.commandText?.onEvent) {
                return { cardId: cardId, texts: getCardTexts(ctx, cardId) }
            }
        }),
        infos => infos.filter(v => v) as { cardId: string, texts: CardText[] }[],
    )()
    return pipe(
        always(getCardIds(ctx)),
        map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
        concat(commands),
        reduce((ctx, { cardId, texts }) => {
            return pipe(
                always(texts),
                reduce((ctx, text) => {
                    const effect: Effect = {
                        id: ToolFn.getUUID("triggerTextEvent"),
                        reason: ["Event", cardId, evt],
                        text: text
                    }
                    return getOnEventTitleFn(text)(ctx, effect, bridge)
                }, ctx)
            )()
        }, ctx)
    )()
}