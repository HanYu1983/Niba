import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou"
import { StrBaSyouPair } from "../define/Tip"
import { onMoveItem } from "./effect"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { getGlobalEffects } from "./globalEffects"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError } from "./ItemTableComponent"
import { getSetGroupChildren } from "./SetGroupComponent"

export function moveItem(ctx: GameState, to: AbsoluteBaSyou, [itemId, from]: StrBaSyouPair): GameState {
    assertTargetMissingError(ctx, [itemId, from])
    if (isCoin(ctx, itemId)) {
        throw new Error(`moveCardLike`)
    } if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const oldTable = ctx.table
        {
            const redirectEs = getGlobalEffects(ctx, null)
                .filter(ge => ge.title[0] == "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる")
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