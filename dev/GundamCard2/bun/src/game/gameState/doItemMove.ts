import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { StrBaSyouPair } from "../define/Tip"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError, getItem } from "./ItemTableComponent"
import { getSetGroupChildren, removeSetGroupParent } from "./SetGroupComponent"
import { logCategory } from "../../tool/logger"
import { GameExtParams } from "../define/GameExtParams"

export function doItemMove(ctx: ItemTableComponent, to: AbsoluteBaSyou, [itemId, from]: StrBaSyouPair, options: GameExtParams & { isSkipTargetMissing?: boolean, insertId?: number }): ItemTableComponent {
    logCategory("doItemMove", "")
    const ges = options.ges || []
    if (options?.isSkipTargetMissing) {

    } else {
        assertTargetMissingError(ctx, [itemId, from])
    }
    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const oldTable = ctx.table
        {
            const redirectEs = ges.filter(ge => ge.title[0] == "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる") || []
            if (redirectEs.length) {
                // 取得效果的擁有者
                const textControllers = redirectEs.flatMap(e => e.cardIds).map(id => getItemController(ctx, id))
                // 如果是從場或手裡移到擁有者的墓地
                if (BaSyouKeywordFn.getBaAll().concat(["手札"]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(from)) &&
                    AbsoluteBaSyouFn.getBaSyouKeyword(to) == "ジャンクヤード" &&
                    textControllers.includes(AbsoluteBaSyouFn.getPlayerID(to))) {
                    // 修改目的地
                    to = AbsoluteBaSyouFn.setBaSyouKeyword(to, "取り除かれたカード")
                }
            }
        }
        // 移動子樹 (p66)
        const itemIds = getSetGroupChildren(ctx, itemId)
        itemIds.forEach(itemId => {
            const from = getItemBaSyou(ctx, itemId)
            ctx = {
                ...ctx,
                table: TableFns.moveCard(ctx.table, AbsoluteBaSyouFn.toString(from), AbsoluteBaSyouFn.toString(to), itemId, { insertId: options?.insertId })
            }
            ctx = EventCenterFn.onItemMove(ctx, from, to, itemId, options)
        })
        ctx = EventCenterFn.onTableChange(ctx, oldTable, ctx.table)
        return ctx
    }
    if (isCoin(ctx, itemId)) {
        throw new Error(`coin can not move: ${itemId}`)
    }
    throw new Error(`moveItem unknown item: ${itemId}`)
}

