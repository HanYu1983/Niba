import { assoc, dissoc } from "ramda";
import { DestroyReason } from "./Effect";
import { Tip } from "./Tip";
import { GlobalEffect } from "./GlobalEffect";
import { ToolFn } from "../tool";
import { TipError, TargetMissingError } from "./GameError";

export type ItemState = {
    id: string;
    damage: number;
    destroyReason: DestroyReason | null;
    flags: { [key: string]: any };
    tips: { [key: string]: Tip },
    isAttack?: boolean,
    isDefence?: boolean,
    globalEffects: { [key: string]: GlobalEffect },
    varNamesRemoveOnTurnEnd: { [key: string]: any },
    varNamesRemoveOnStepEnd: { [key: string]: any },
    isOpenForGain?: boolean,
    isCheat?: boolean,
    isFirstTurn?: boolean,
    //textIdsUseThisCut?: { [key: string]: any },
    textIdsUseThisTurn?: string[]
};

function clearTip(ctx: ItemState, key: string): ItemState {
    ctx = {
        ...ctx,
        tips: dissoc(key, ctx.tips)
    }
    return ctx
}

export const ItemStateFn = {
    identity(): ItemState {
        return {
            id: "",
            damage: 0,
            destroyReason: null,
            flags: {},
            tips: {},
            globalEffects: {},
            varNamesRemoveOnTurnEnd: {},
            varNamesRemoveOnStepEnd: {}
        }
    },
    setFlag(ctx: ItemState, name: string, v: any, options?: { isRemoveOnTurnEnd?: boolean, isRemoveOnStepEnd?: boolean }): ItemState {
        ctx = {
            ...ctx,
            flags: assoc(name, v, ctx.flags)
        }
        if (options?.isRemoveOnTurnEnd) {
            ctx = {
                ...ctx,
                varNamesRemoveOnTurnEnd: assoc(name, true, ctx.varNamesRemoveOnTurnEnd)
            }
        }
        if (options?.isRemoveOnStepEnd) {
            ctx = {
                ...ctx,
                varNamesRemoveOnStepEnd: assoc(name, true, ctx.varNamesRemoveOnStepEnd)
            }
        }
        return ctx
    },
    removeFlag(ctx: ItemState, k: string): ItemState {
        return {
            ...ctx,
            flags: dissoc(k, ctx.flags),
        }
    },
    getTip(ctx: ItemState, k: string): Tip {
        if (ctx.tips[k] == null) {
            throw new TipError(`cardId: ${ctx.id} target not set yet: ${k}`)
        }
        return ctx.tips[k]
    },
    hasTip(ctx: ItemState, k: string): boolean {
        return ctx.tips[k] != null
    },
    setTip(ctx: ItemState, k: string, tip: Tip): ItemState {
        ctx = {
            ...ctx,
            tips: assoc(k, tip, ctx.tips)
        }
        return ctx
    },
    clearTip: clearTip,
    damage(ctx: ItemState, v: number): ItemState {
        return {
            ...ctx,
            damage: ctx.damage + v
        }
    },
    setMoreTotalRollCostLengthPlay(ctx: ItemState, x: number): ItemState {
        ctx = ItemStateFn.setFlag(ctx, "合計国力_＋１してプレイ", x)
        ctx = {
            ...ctx,
            varNamesRemoveOnTurnEnd: assoc("合計国力_＋１してプレイ", true, ctx.varNamesRemoveOnTurnEnd)
        }
        return ctx
    },
    getMoreTotalRollCostLengthPlay(ctx: ItemState): number {
        return ctx.flags["合計国力_＋１してプレイ"] || 0
    },
    getGlobalEffects(ctx: ItemState): GlobalEffect[] {
        return Object.values(ctx.globalEffects)
    },
    setGlobalEffect(ctx: ItemState, name: string | null, ge: GlobalEffect, options?: { isRemoveOnTurnEnd?: boolean, isRemoveOnStepEnd?: boolean }) {
        if (name == null) {
            name = ToolFn.getUUID("setGlobalEffect")
        }
        ctx = {
            ...ctx,
            globalEffects: assoc(name, ge, ctx.globalEffects),
        }
        if (options?.isRemoveOnTurnEnd) {
            ctx = {
                ...ctx,
                varNamesRemoveOnTurnEnd: assoc(name, true, ctx.varNamesRemoveOnTurnEnd)
            }
        }
        if (options?.isRemoveOnStepEnd) {
            ctx = {
                ...ctx,
                varNamesRemoveOnStepEnd: assoc(name, true, ctx.varNamesRemoveOnStepEnd)
            }
        }
        return ctx
    },
    onCutEnd(ctx: ItemState): ItemState {
        // ctx = {
        //     ...ctx,
        //     textIdsUseThisCut: {},
        // }
        return ctx
    },
    onDamageReset(ctx: ItemState): ItemState {
        return {
            ...ctx,
            damage: 0,
        }
    },
    onTurnEnd(ctx: ItemState): ItemState {
        for (const varName in ctx.varNamesRemoveOnTurnEnd) {
            ctx = {
                ...ctx,
                flags: dissoc(varName, ctx.flags),
                globalEffects: dissoc(varName, ctx.globalEffects),
            }
        }
        ctx = {
            ...ctx,
            varNamesRemoveOnTurnEnd: {},
            isOpenForGain: false,
            isCheat: false,
            isFirstTurn: false,
            //textIdsUseThisCut: {},
            textIdsUseThisTurn: [],
            isAttack: false,
            isDefence: false,
        }
        return ctx
    },
    onStepEnd(ctx: ItemState): ItemState {
        for (const varName in ctx.varNamesRemoveOnStepEnd) {
            ctx = {
                ...ctx,
                flags: dissoc(varName, ctx.flags),
                globalEffects: dissoc(varName, ctx.globalEffects),
                varNamesRemoveOnStepEnd: {}
            }
        }
        return ctx
    }
}