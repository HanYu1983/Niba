import { assoc, dissoc } from "ramda";
import { ItemState, ItemStateFn } from "../define/ItemState";

export type ItemStateComponent = {
  itemStates: { [key: string]: ItemState }
}

export function getItemState(ctx: ItemStateComponent, cardID: string): ItemState {
  return ctx.itemStates[cardID] || { ...ItemStateFn.identity(), id: cardID };
}

export function setItemState(ctx: ItemStateComponent, cardID: string, cardState: ItemState): ItemStateComponent {
  return { ...ctx, itemStates: assoc(cardID, cardState, ctx.itemStates) }
}

export function getItemStateValues(ctx: ItemStateComponent): ItemState[] {
  return Object.values(ctx.itemStates)
}
