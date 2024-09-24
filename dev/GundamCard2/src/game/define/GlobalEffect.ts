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
    | ["場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"]

export type GlobalEffect = {
    title: GlobalEffectTitle,
    cardIds: string[],
}