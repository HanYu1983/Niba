import { CardColor } from "./CardPrototype";
import { BattleBonus, CardText, TextSpeicalEffect } from "./CardText";
import { TipTitleTextRef } from "./Tip";

export type GlobalEffectTitle =
    | ["合計国力＋(１)してプレイできる", number]
    | ["合計国力＋(１)", number]
    | ["AddText", CardText]
    | ["AddTextRef", TipTitleTextRef]
    | ["自軍Gとしてロール"]
    | ["＋x／＋x／＋xを得る", BattleBonus]
    | ["發生國力", CardColor[]]
    | ["SpecialEffectBonus", TextSpeicalEffect, number]

export type GlobalEffect = {
    title: GlobalEffectTitle,
    cardIds: string[],
}
