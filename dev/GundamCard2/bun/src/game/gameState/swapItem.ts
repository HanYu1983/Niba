import { TableFns } from "../../tool/table";
import { getCard, mapCard, setCard } from "./CardTableComponent";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { isCard } from "./ItemTableComponent";

export function swapItem(ctx: GameState, itemId1: string, itemId2: string): GameState {
    // 置換(p77)
    if (isCard(ctx, itemId1) && isCard(ctx, itemId2)) {
        const card1 = getCard(ctx, itemId1)
        const card2 = getCard(ctx, itemId2)
        ctx = setCard(ctx, card1.id, { ...card2, id: card1.id }) as GameState
        ctx = setCard(ctx, card2.id, { ...card1, id: card2.id }) as GameState

        const is1 = getItemState(ctx, itemId1)
        const is2 = getItemState(ctx, itemId2)
        ctx = setItemState(ctx, is1.id, { ...is2, id: is1.id }) as GameState
        ctx = setItemState(ctx, is2.id, { ...is1, id: is2.id }) as GameState

        // const b1 = TableFns.getCardPosition(ctx.table, itemId1)
        // const b2 = TableFns.getCardPosition(ctx.table, itemId2)
        // if (b1 == null) {
        //     throw new Error()
        // }
        // if (b2 == null) {
        //     throw new Error()
        // }
        // let table = ctx.table
        // table = TableFns.moveCard(table, b1, b2, itemId1)
        // table = TableFns.moveCard(table, b2, b1, itemId2)
        // ctx = {
        //     ...ctx,
        //     table: table
        // }
        return ctx
    }
    throw new Error(`swapCard not yet support`)
}