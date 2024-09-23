import { ItemGroup, ItemGroupFn } from "../../tool/ItemGroup";
import { EventCenterFn } from "./EventCenter";

export type SetGroupComponent = {
  setGroup: ItemGroup
}

export function createSetGroupComponent(): SetGroupComponent {
  return {
    setGroup: ItemGroupFn.createItemGroup(),
  };
}

export function getSetGroupCards(ctx: SetGroupComponent, itemId: string): string[] {
  return ItemGroupFn.getItemGroup(ctx.setGroup, itemId)
}

export function getSetGroupRoot(
  ctx: SetGroupComponent,
  cardID: string
): string {
  return ItemGroupFn.getItemGroupParentRoot(ctx.setGroup, cardID)
}

export function setSetGroupParent(ctx: SetGroupComponent, parentCardId: string, cardId: string): SetGroupComponent {
  ctx = {
    ...ctx,
    setGroup: ItemGroupFn.setItemGroupParent(ctx.setGroup, cardId, parentCardId)
  }
  ctx = EventCenterFn.onSetSetGroupParent(ctx, parentCardId, cardId)
  return ctx
}