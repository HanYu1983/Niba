import { assoc, dissoc } from "ramda";
import { DestroyReason } from "./Effect";
import { Tip } from "./Tip";
import { GlobalEffect } from "./GlobalEffect";
import { ToolFn } from "../tool";

export type ItemState = {
    id: string;
    damage: number;
    destroyReason: DestroyReason | null;
    flags: { [key: string]: any };
    tips: { [key: string]: Tip },
    globalEffects: { [key: string]: GlobalEffect },
    varNamesRemoveOnTurnEnd: { [key: string]: any },
    forceFaceUp?: boolean
};

export const ItemStateFn = {
    identity(): ItemState {
        return {
            id: "",
            damage: 0,
            destroyReason: null,
            flags: {},
            tips: {},
            globalEffects: {},
            varNamesRemoveOnTurnEnd: {}
        }
    },
    setFlag(ctx: ItemState, k: string, v: any): ItemState {
        return {
            ...ctx,
            flags: assoc(k, v, ctx.flags)
        }
    },
    removeFlag(ctx: ItemState, k: string): ItemState {
        return {
            ...ctx,
            flags: dissoc(k, ctx.flags),
        }
    },
    getTip(ctx: ItemState, k: string): Tip {
        if (ctx.tips[k] == null) {
            throw new Error(`cardId: ${ctx.id} target not set yet: ${k}`)
        }
        return ctx.tips[k]
    },
    setTip(ctx: ItemState, k: string, tip: Tip): ItemState {
        ctx = {
            ...ctx,
            tips: assoc(k, tip, ctx.tips)
        }
        return ctx
    },
    damage(ctx: ItemState, v: number): ItemState {
        return {
            ...ctx,
            damage: ctx.damage + v
        }
    },
    setMoreTotalRollCostLengthPlay(ctx: ItemState, x: number) {
        return this.setFlag(ctx, "合計国力＋(１)してプレイ", x)
    },
    getMoreTotalRollCostLengthPlay(ctx: ItemState): number {
        return ctx.flags["合計国力＋(１)してプレイ"] || 0
    },
    getGlobalEffects(ctx: ItemState): GlobalEffect[] {
        return Object.values(ctx.globalEffects)
    },
    setGlobalEffect(ctx: ItemState, name: string | null, isRemoveOnTurnEnd: boolean, ge: GlobalEffect) {
        if (name == null) {
            name = ToolFn.getUUID("setGlobalEffect")
        }
        ctx = {
            ...ctx,
            globalEffects: assoc(name, ge, ctx.globalEffects),
        }
        if (isRemoveOnTurnEnd) {
            ctx = {
                ...ctx,
                varNamesRemoveOnTurnEnd: assoc(name, true, ctx.varNamesRemoveOnTurnEnd)
            }
        }
        return ctx
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
            forceFaceUp: false
        }
        return ctx
    }
}