import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { mapItemState } from "./ItemStateComponent"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError } from "./ItemTableComponent"
import { getSetGroupChildren } from "./SetGroupComponent"
import { triggerEvent } from "./triggerEvent"

export function doItemMove(ctx: GameState, to: AbsoluteBaSyou, [itemId, from]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
    if (options?.isSkipTargetMissing) {

    } else {
        assertTargetMissingError(ctx, [itemId, from])
    }
    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const oldTable = ctx.table
        {
            const ges = getGlobalEffects(ctx, null)
            ctx = setGlobalEffects(ctx, null, ges)
            const redirectEs = ges.filter(ge => ge.title[0] == "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる")
            if (redirectEs.length) {
                // 取得效果的擁有者
                const textControllers = redirectEs.flatMap(e => e.cardIds).map(id => getItemController(ctx, id))
                // 如果是從場或手裡移到擁有者的墓地
                if (BaSyouKeywordFn.getBaAll().concat(["ハンガー"]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(from)) &&
                    AbsoluteBaSyouFn.getBaSyouKeyword(to) == "ジャンクヤード" &&
                    textControllers.includes(AbsoluteBaSyouFn.getPlayerID(to))) {
                    // 修改目的地
                    to = AbsoluteBaSyouFn.setBaSyouKeyword(to, "取り除かれたカード")
                }
            }
        }
        // 移動子樹
        const itemIds = getSetGroupChildren(ctx, itemId)
        const table = itemIds.reduce((table, itemId) => {
            return TableFns.moveCard(table, AbsoluteBaSyouFn.toString(from), AbsoluteBaSyouFn.toString(to), itemId)
        }, ctx.table)
        ctx = {
            ...ctx,
            table: table
        }
        ctx = onMoveItem(ctx, to, [itemId, from])
        ctx = EventCenterFn.onTableChange(ctx, oldTable, ctx.table)
        return ctx
    }
    if (isCoin(ctx, itemId)) {
        throw new Error(`coin can not move: ${itemId}`)
    }
    throw new Error(`moveItem unknown item: ${itemId}`)
}

export function onMoveItem(ctx: GameState, to: AbsoluteBaSyou, [cardId, from]: StrBaSyouPair): GameState {
    ctx = clearGlobalEffects(ctx)
    if (AbsoluteBaSyouFn.getBaSyouKeyword(from) == "手札") {
        if (AbsoluteBaSyouFn.getBaSyouKeyword(to) == "プレイされているカード") {
            ctx = triggerEvent(ctx, {
                title: ["プレイした場合"],
                cardIds: [cardId]
            } as GameEvent)
        }
    }
    // 從非場所到場所=出場
    if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == false && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        // 剛出場的回合
        ctx = mapItemState(ctx, cardId, is => {
            return {
                ...is,
                isFirstTurn: true
            }
        }) as GameState
        ctx = triggerEvent(ctx, {
            title: ["場に出た場合"],
            cardIds: [cardId]
        } as GameEvent)
    }
    if ((["捨て山", "本国", "手札"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        let card = getCard(ctx, cardId)
        card = {
            ...card,
            isRoll: false,
            isFaceDown: true,
        }
        ctx = setCard(ctx, cardId, card) as GameState
    } else if ((["ジャンクヤード", "Gゾーン", "ハンガー", "プレイされているカード", "取り除かれたカード"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        let card = getCard(ctx, cardId)
        card = {
            ...card,
            isRoll: false,
            isFaceDown: false,
        }
        ctx = setCard(ctx, cardId, card) as GameState
    }
    ctx = triggerEvent(ctx, {
        title: ["GameEventOnMove", from, to],
        cardIds: [cardId]
    })
    return ctx
}
