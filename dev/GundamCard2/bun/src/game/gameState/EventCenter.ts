import { Table, TableFns } from "../../tool/table"
import { Card } from "../define/Card"
import { Effect } from "../define/Effect"
import { ItemState } from "../define/ItemState"
import { PlayerState } from "../define/PlayerState"
import { Phase } from "../define/Timing"
import { GameState } from "./GameState"
import { getMessageCurrentEffect, setMessageCurrentEffect } from "./MessageComponent"

function getGameStateAndAssert(ctx: any): GameState {
    if (ctx.isGameState != true) {
        throw new Error(`must is gameState`)
    }
    return ctx as GameState
}

export const EventCenterFn = {
    onEffectStart(_ctx: any, effect: Effect): any {
        let ctx = getGameStateAndAssert(_ctx)
        ctx = setMessageCurrentEffect(ctx, effect) as GameState
        return ctx
    },
    onEffectEnd(_ctx: any, effect: Effect): any {
        let ctx = getGameStateAndAssert(_ctx)
        ctx = setMessageCurrentEffect(ctx, null) as GameState
        return ctx
    },
    onItemStateChange(_ctx: any, old: ItemState, curr: ItemState): any {
        let ctx = getGameStateAndAssert(_ctx)
        let effect = getMessageCurrentEffect(ctx)
        return ctx
    },
    onCardChange(_ctx: any, old: Card, curr: Card): any {
        let ctx = getGameStateAndAssert(_ctx)
        let effect = getMessageCurrentEffect(ctx)
        return ctx
    },
    onPlayerStateChange(_ctx: any, old: PlayerState, curr: PlayerState): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onSetSetGroupParent(_ctx: any, parentId: string, itemId: string): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onSetPhase(_ctx: any, old: Phase, curr: Phase): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onItemAdd(_ctx: any, itemId: string): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onItemMove(_ctx: any, from: string, to: string, itemId: string): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onItemDelete(_ctx: any, itemId: string): any {
        let ctx = getGameStateAndAssert(_ctx)
        return ctx
    },
    onTableChange(_ctx: any, old: Table, curr: Table): any {
        for (const oldBasyouStr in old.cardStack) {
            for (const itemId of old.cardStack[oldBasyouStr]) {
                const newBasyouStr = TableFns.getCardPosition(curr, itemId)
                if (newBasyouStr == null) {
                    _ctx = this.onItemDelete(_ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {
                    _ctx = this.onItemMove(_ctx, oldBasyouStr, newBasyouStr, itemId)
                }
            }
        }
        for (const newBasyouStr in curr.cardStack) {
            for (const itemId of curr.cardStack[newBasyouStr]) {
                const oldBasyouStr = TableFns.getCardPosition(curr, itemId)
                if (oldBasyouStr == null) {
                    _ctx = this.onItemAdd(_ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {
                    _ctx = this.onItemMove(_ctx, oldBasyouStr, newBasyouStr, itemId)
                }
            }
        }
        return _ctx
    },
}