import { logCategory } from "../../tool/logger"
import { Table, TableFns } from "../../tool/table"
import { Card } from "../define/Card"
import { Action } from "../define/CardText"
import { Effect } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ItemState } from "../define/ItemState"
import { PlayerState } from "../define/PlayerState"
import { Phase } from "../define/Timing"
import { GameState } from "./GameState"
import { addMessage, getMessageCurrentEffect, setMessageCurrentEffect } from "./MessageComponent"

function assertIsGameState(ctx: any) {
    if (ctx.isGameState != true) {
        throw new Error(`must is gameState`)
    }
}

export const EventCenterFn = {
    onAddImmediateEffect(ctx: any, effect: Effect): any {
        logCategory(`onAddImmediateEffect`, `${effect.description}`, effect)
        assertIsGameState(ctx)
        return ctx
    },
    onEvent(ctx: any, evt: GameEvent): any {
        logCategory(`onEvent`, `${JSON.stringify(evt.title)} ${JSON.stringify(evt.cardIds)}`, evt.title, evt.cardIds)
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onEvent: ${evt.title[0]} ${JSON.stringify(evt.cardIds)}` })
        return ctx
    },
    onEffectStart(ctx: any, effect: Effect): any {
        logCategory(`onEffectStart`, `${effect.text.description}`)
        assertIsGameState(ctx)
        ctx = setMessageCurrentEffect(ctx, effect) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectStart: ${effect.text.description}` })
        return ctx
    },
    onEffectEnd(ctx: any, effect: Effect): any {
        logCategory(`onEffectEnd`, `${effect.text.description}`)
        assertIsGameState(ctx)
        ctx = setMessageCurrentEffect(ctx, null) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectEnd: ${effect.text.description}` })
        return ctx
    },
    onActionStart(ctx: any, effect: Effect, action: Action): any {
        logCategory(`onActionStart`, `${action.description}`)
        assertIsGameState(ctx)
        return ctx
    },
    onActionEnd(ctx: any, effect: Effect, action: Action): any {
        logCategory(`onActionEnd`, `${action.description}`)
        assertIsGameState(ctx)
        return ctx
    },
    onItemStateDestroyReasonChange(ctx: any, old: ItemState, curr: ItemState): any {
        if (old.destroyReason == null && curr.destroyReason) {
            logCategory("onItemStateDestroyReasonChange", `被破壞尚未進入堆疊:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `被破壞尚未進入堆疊:${curr.id}` })
        } else if (old.destroyReason && curr.destroyReason == null) {
            logCategory("onItemStateDestroyReasonChange", `破壞被取消:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `破壞被取消:${curr.id}` })
        }
        return ctx
    },
    onItemStateChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        let effect = getMessageCurrentEffect(ctx)
        logCategory(`onItemStateChange`, old, curr)
        if (old.destroyReason != curr.destroyReason) {
            ctx = EventCenterFn.onItemStateDestroyReasonChange(ctx, old, curr)
        }
        return ctx
    },
    onCardChange(ctx: any, old: Card, curr: Card): any {
        assertIsGameState(ctx)
        let effect = getMessageCurrentEffect(ctx)
        logCategory(`onCardChange`, old, curr)
        ctx = addMessage(ctx, { id: 0, description: `onCardChange:${curr.id}` })
        return ctx
    },
    onPlayerStateChange(ctx: any, old: PlayerState, curr: PlayerState): any {
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onPlayerStateChange:${curr.id}` })
        return ctx
    },
    onSetSetGroupParent(ctx: any, parentId: string, itemId: string): any {
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onSetSetGroupParent:${parentId} ${itemId}` })
        return ctx
    },
    onSetPhase(ctx: any, old: Phase, curr: Phase): any {
        logCategory(`onSetPhase`, `${curr}`)
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onSetPhase:${curr}` })
        return ctx
    },
    onItemAdd(ctx: any, itemId: string): any {
        logCategory(`onItemAdd`, `${itemId}`)
        assertIsGameState(ctx)
        return ctx
    },
    onItemMove(ctx: any, from: string, to: string, itemId: string): any {
        logCategory(`onItemMove`, `${itemId} = ${from} => ${to}`)
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onItemMove:${itemId} = ${from} => ${to}` })
        return ctx
    },
    onItemDelete(ctx: any, itemId: string): any {
        logCategory(`onItemDelete`, `${itemId}`)
        assertIsGameState(ctx)
        return ctx
    },
    onTableChange(ctx: any, old: Table, curr: Table): any {
        for (const oldBasyouStr in old.cardStack) {
            for (const itemId of old.cardStack[oldBasyouStr]) {
                const newBasyouStr = TableFns.getCardPosition(curr, itemId)
                if (newBasyouStr == null) {
                    ctx = EventCenterFn.onItemDelete(ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {

                }
            }
        }
        for (const newBasyouStr in curr.cardStack) {
            for (const itemId of curr.cardStack[newBasyouStr]) {
                const oldBasyouStr = TableFns.getCardPosition(old, itemId)
                if (oldBasyouStr == null) {
                    ctx = EventCenterFn.onItemAdd(ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {
                    ctx = EventCenterFn.onItemMove(ctx, oldBasyouStr, newBasyouStr, itemId)
                }
            }
        }
        return ctx
    },
}