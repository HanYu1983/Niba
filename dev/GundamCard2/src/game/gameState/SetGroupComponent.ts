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

// TODO
// P67 SetGroup的破壞和移動
// SetGroup移到本國或捨山時, 使用者可以決定順序

// P56 關於不能被指為對象
// 效果解決時, 對象被變成不能被指定的話, 就失去對象

// p53 傷害的重置效果也有不發生的可能

// p68 起動效果1回合只能1次, 除非有寫"每"