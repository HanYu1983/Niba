import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, mapCard, setCard } from "./CardTableComponent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { mapItemState } from "./ItemStateComponent"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError } from "./ItemTableComponent"
import { getSetGroupChildren, removeSetGroupParent } from "./SetGroupComponent"
import { doTriggerEvent } from "./doTriggerEvent"
import { getCoinIdsByCardId, removeCoinIds } from "./CoinTableComponent"
import { getCutInDestroyEffects, removeEffect } from "./EffectStackComponent"
import { EffectFn } from "../define/Effect"

export function doItemMove(ctx: GameState, to: AbsoluteBaSyou, [itemId, from]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean, insertId?: number }): GameState {
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
        itemIds.forEach(itemId => {
            const from = getItemBaSyou(ctx, itemId)
            ctx = {
                ...ctx,
                table: TableFns.moveCard(ctx.table, AbsoluteBaSyouFn.toString(from), AbsoluteBaSyouFn.toString(to), itemId, { insertId: options?.insertId })
            }
            ctx = onMoveItem(ctx, to, [itemId, from])
        })
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
            ctx = doTriggerEvent(ctx, {
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
                isFirstTurn: true,
            }
        }) as GameState
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isFaceDown: false,
            }
        }) as GameState
        ctx = doTriggerEvent(ctx, {
            title: ["このカードが場に出た場合"],
            cardIds: [cardId]
        } as GameEvent)
    }
    // 相反從場所到非場所
    if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == true && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to)) == false) {
        // 剛出場的回合
        ctx = mapItemState(ctx, cardId, is => {
            return {
                ...is,
                damage: 0,
                destroyReason: null,
            }
        }) as GameState
        // 清掉coin
        ctx = removeCoinIds(ctx, getCoinIdsByCardId(ctx, cardId)) as GameState
        // 移除SetGroup
        ctx = removeSetGroupParent(ctx, cardId) as GameState
        // 移除堆疊中的破壞效果
        for (const effect of getCutInDestroyEffects(ctx)) {
            if (EffectFn.getCardID(effect) == cardId) {
                ctx = removeEffect(ctx, effect.id) as GameState
            }
        }
    }
    // 到以下的場所
    if ((["捨て山", "本国", "手札"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isRoll: false,
                isFaceDown: true,
            }
        }) as GameState
    } else if ((["ジャンクヤード", "ハンガー", "プレイされているカード", "取り除かれたカード"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isRoll: false,
                isFaceDown: false,
            }
        }) as GameState
    } else if ((["Gゾーン"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isFaceDown: false,
            }
        }) as GameState
    }
    ctx = doTriggerEvent(ctx, {
        title: ["GameEventOnMove", from, to],
        cardIds: [cardId]
    })
    return ctx
}
