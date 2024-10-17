import { logCategory } from "../../tool/logger"
import { Table, TableFns } from "../../tool/table"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { Card } from "../define/Card"
import { Action } from "../define/CardText"
import { CommandEffectTip } from "../define/CommandEffectTip"
import { Effect } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { ItemState } from "../define/ItemState"
import { PlayerID } from "../define/PlayerID"
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
    onTargetMessingError(ctx: any, effect: Effect, e: TargetMissingError): any {
        assertIsGameState(ctx)
        const msg = `對象遺失: ${e.message}:${effect.text.description}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        console.warn(`=======================`)
        console.warn(msg)
        return ctx
    },
    onAddImmediateEffectButConditionFail(ctx: any, effect: Effect, cets: CommandEffectTip[]): any {
        assertIsGameState(ctx)
        const msg = `將發動起動效果但條件不足: ${cets.flatMap(cet => cet.tipOrErrors.flatMap(toe => toe.errors)).join("|")}: ${effect.text.description}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        console.warn(`=======================`)
        console.warn(msg)
        return ctx
    },
    onAddImmediateEffect(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onAddImmediateEffect`, `${effect.description}`, effect)
        return ctx
    },
    onEvent(ctx: any, evt: GameEvent): any {
        assertIsGameState(ctx)
        logCategory(`onEvent`, `${JSON.stringify(evt.title)} ${JSON.stringify(evt.cardIds)}`, evt.title, evt.cardIds)
        ctx = addMessage(ctx, { id: 0, description: `onEvent: ${evt.title[0]} ${JSON.stringify(evt.cardIds)}` })
        return ctx
    },
    onEffectStart(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onEffectStart`, `${effect.text.description}`)
        ctx = setMessageCurrentEffect(ctx, effect) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectStart: ${effect.text.description}` })
        return ctx
    },
    onEffectEnd(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onEffectEnd`, `${effect.text.description}`)
        ctx = setMessageCurrentEffect(ctx, null) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectEnd: ${effect.text.description}` })
        return ctx
    },
    onActionStart(ctx: any, effect: Effect, action: Action): any {
        assertIsGameState(ctx)
        logCategory(`onActionStart`, `${action.description}`)
        return ctx
    },
    onActionEnd(ctx: any, effect: Effect, action: Action): any {
        assertIsGameState(ctx)
        logCategory(`onActionEnd`, `${action.description}`)
        return ctx
    },
    onItemStateDestroyReasonChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        if (old.destroyReason == null && curr.destroyReason) {
            logCategory("onItemStateDestroyReasonChange", `被破壞尚未進入堆疊:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `被破壞尚未進入堆疊:${curr.id}` })
        } else if (old.destroyReason && curr.destroyReason == null) {
            logCategory("onItemStateDestroyReasonChange", `破壞被取消:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `破壞被取消:${curr.id}` })
        }
        return ctx
    },
    onItemDamageChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        const msg = `傷害變化: ${curr.id} ${old.damage} => ${curr.damage}`
        logCategory(`onItemDamageChange`, msg)
        ctx = addMessage(ctx, { id: 0, description: msg })
        return ctx
    },
    onItemStateChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        if (old.destroyReason != curr.destroyReason) {
            ctx = EventCenterFn.onItemStateDestroyReasonChange(ctx, old, curr)
        }
        if (old.damage != curr.damage) {
            ctx = EventCenterFn.onItemDamageChange(ctx, old, curr)
        }
        let msg: string | null = null
        if (old.globalEffects.length != curr.globalEffects.length) {
            msg = `${curr.id}.globalEffects.length ${old.globalEffects.length} => ${curr.globalEffects.length}`
        }
        if (msg) {
            ctx = addMessage(ctx, { id: 0, description: msg })
            logCategory(`onItemStateChange`, msg)
        }
        return ctx
    },
    onCardChange(ctx: any, old: Card, curr: Card): any {
        assertIsGameState(ctx)
        let msg: string | null = null
        if (old.isFaceDown != curr.isFaceDown) {
            msg = `${curr.id}.isFaceDown ${old.isFaceDown} => ${curr.isFaceDown}`
        }
        if (old.isRoll != curr.isRoll) {
            msg = `${curr.id}.isRoll ${old.isRoll} => ${curr.isRoll}`
        }
        if (old.protoID != curr.protoID) {
            msg = `${curr.id}.protoID ${old.protoID} => ${curr.protoID}`
        }
        if (msg) {
            ctx = addMessage(ctx, { id: 0, description: msg })
            logCategory(`onCardChange`, msg)
        }
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
        assertIsGameState(ctx)
        logCategory(`onSetPhase`, `${curr}`)
        ctx = addMessage(ctx, { id: 0, description: `onSetPhase:${curr}` })
        return ctx
    },
    onItemAdd(ctx: any, itemId: string): any {
        assertIsGameState(ctx)
        logCategory(`onItemAdd`, `${itemId}`)
        return ctx
    },
    onCountryHeal(ctx: any, playerId: PlayerID, value: number): any {
        assertIsGameState(ctx)
        const msg = `本國回血: ${playerId} => ${value}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        logCategory(`onCountryHeal`, msg)
        return ctx
    },
    onCountryDamage(ctx: any, playerId: PlayerID, damage: number): any {
        assertIsGameState(ctx)
        const msg = `本國受到傷害: ${playerId} => ${damage} damage`
        ctx = addMessage(ctx, { id: 0, description: msg })
        logCategory(`onCountryDamage`, msg)
        return ctx
    },
    onItemMove(ctx: any, from: string, to: string, itemId: string): any {
        assertIsGameState(ctx)
        logCategory(`onItemMove`, `${itemId} = ${from} => ${to}`)
        ctx = addMessage(ctx, { id: 0, description: `onItemMove:${itemId} = ${from} => ${to}` })
        return ctx
    },
    onItemDelete(ctx: any, itemId: string): any {
        assertIsGameState(ctx)
        logCategory(`onItemDelete`, `${itemId}`)
        return ctx
    },
    onTableChange(ctx: any, old: Table, curr: Table): any {
        assertIsGameState(ctx)
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