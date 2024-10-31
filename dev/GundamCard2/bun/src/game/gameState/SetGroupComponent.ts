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

export function getSetGroup(ctx: SetGroupComponent, itemId: string): string[] {
  return ItemGroupFn.getItemGroupFromRoot(ctx.setGroup, itemId)
}

export function getSetGroupChildren(ctx: SetGroupComponent, itemId: string): string[] {
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

export function removeSetGroupParent(ctx: SetGroupComponent, cardId: string): SetGroupComponent {
  ctx = {
    ...ctx,
    setGroup: ItemGroupFn.deleteItemGroup(ctx.setGroup, cardId)
  }
  return ctx
}

// TODO
// P67 SetGroup的破壞和移動
// SetGroup移到本國或捨山時, 使用者可以決定順序

// P56 關於不能被指為對象
// 效果解決時, 對象被變成不能被指定的話, 就失去對象

// p53 傷害的重置效果也有不發生的可能

// p68 起動效果1回合只能1次, 除非有寫"每"


// 179009_03B_C_RD019U_red
// U
// クロスボーン
// 海賊襲来
// 破壊　リンク
// （防御ステップ）：戦闘エリアにいる敵軍ユニット１枚にXダメージを与える。Xの値は、「クロスウェポン」を持つ自軍カードの枚数とする。本来の名称が「宇宙海賊」であるカードが、自軍G、または自軍ジャンクヤードにある場合、この効果のタイミング部分は（戦闘フェイズ）に変更される。

// 179007_02A_C_RD008C_red
// C
// ZZ
// 感情の暴走
// 対抗
// （戦闘フェイズ）：敵軍カードのテキストのプレイ１つを無効にする。
// （注：無効となった効果は、新たにコストを払う事で再プレイできる）
// 把同切上限和同回合上限的旗標也刪除