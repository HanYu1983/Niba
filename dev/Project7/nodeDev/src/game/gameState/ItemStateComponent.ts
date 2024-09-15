import { assoc, dissoc } from "ramda";
import { DestroyReason } from "../define/Effect";
import { Tip } from "../define/Tip";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";

export type ItemState = {
  id: string;
  damage: number;
  destroyReason: DestroyReason | null;
  flags: { [key: string]: any };
  tips: { [key: string]: Tip }
};

const DEFAULT_ITEM_STATE: ItemState = {
  id: "",
  damage: 0,
  destroyReason: null,
  flags: {},
  tips: {},
};

export const ItemStateFn = {
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

export type ItemStateComponent = {
  itemStates: { [key: string]: ItemState }
}

export function getItemState(ctx: ItemStateComponent, cardID: string): ItemState {
  return ctx.itemStates[cardID] || { ...DEFAULT_ITEM_STATE, id: cardID };
}

export function setItemState(ctx: ItemStateComponent, cardID: string, cardState: ItemState): ItemStateComponent {
  return { ...ctx, itemStates: assoc(cardID, cardState, ctx.itemStates) }
}

export function getItemStateValues(ctx: ItemStateComponent): ItemState[] {
  return Object.values(ctx.itemStates)
}
