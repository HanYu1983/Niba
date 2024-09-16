import { assoc, dissoc } from "ramda";
import { DestroyReason } from "./Effect";
import { Tip } from "./Tip";

export type ItemState = {
    id: string;
    damage: number;
    destroyReason: DestroyReason | null;
    flags: { [key: string]: any };
    tips: { [key: string]: Tip }
};

export const ItemStateFn = {
    identity(): ItemState {
        return {
            id: "",
            damage: 0,
            destroyReason: null,
            flags: {},
            tips: {},
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
}