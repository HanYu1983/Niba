import { assoc, dissoc } from "ramda";
import { ItemState, ItemStateFn } from "../define/ItemState";
import { EventCenterFn } from "./EventCenter";

export type ItemStateComponent = {
  itemStates: { [key: string]: ItemState }
}

export function getItemState(ctx: ItemStateComponent, cardID: string): ItemState {
  return ctx.itemStates[cardID] || { ...ItemStateFn.identity(), id: cardID };
}

export function setItemState(ctx: ItemStateComponent, cardID: string, cardState: ItemState): ItemStateComponent {
  const old = getItemState(ctx, cardID)
  ctx = { ...ctx, itemStates: assoc(cardID, cardState, ctx.itemStates) }
  ctx = EventCenterFn.onItemStateChange(ctx, old, getItemState(ctx, cardID))
  return ctx
}

export function getItemStateValues(ctx: ItemStateComponent): ItemState[] {
  return Object.values(ctx.itemStates)
}

export function mapItemStateValues(ctx: ItemStateComponent, fn: (itemState: ItemState) => ItemState): ItemStateComponent {
  for (const k in ctx.itemStates) {
    ctx = mapItemState(ctx, k, fn)
  }
  return ctx
}
export function mapItemState(ctx: ItemStateComponent, k: string, fn: (itemState: ItemState) => ItemState): ItemStateComponent {
  const old = getItemState(ctx, k)
  const curr = fn(old)
  ctx = setItemState(ctx, k, curr)
  return ctx
}