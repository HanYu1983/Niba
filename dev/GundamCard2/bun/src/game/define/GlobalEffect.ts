import { RelatedPlayerSideKeyword } from ".";
import { CardCategory, CardColor } from "./CardPrototype";
import { BattleBonus, CardText, TextSpeicalEffect } from "./CardText";
import { TipTitleTextRef } from "./Tip";

export type GlobalEffectTitle =
    | ["合計国力＋(１)してプレイできる", number]
    | ["合計国力＋_、ロールコスト＋_してプレイできる", number, number]
    | ["合計国力＋(１)", number]
    | ["AddText", CardText]
    | ["AddTextRef", TipTitleTextRef]
    | ["このカードを自軍Gとしてロールできる"]
    | ["＋x／＋x／＋xを得る", BattleBonus]
    | ["發生國力", CardColor[]]
    | ["SpecialEffectBonus", TextSpeicalEffect]
    | ["場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"]
    | ["自軍手札にあるかのようにプレイできる"]
    | ["3以下の合計国力を持つ敵軍コマンドの効果では無効にならない"]
    | ["このカードの部隊の部隊戦闘力を_＋３する", number]
    | ["このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する", number]
    | ["_白のGサインを持つ_自軍_Gとして扱う事ができる", CardColor[], RelatedPlayerSideKeyword, CardCategory]

export type GlobalEffect = {
    title: GlobalEffectTitle,
    cardIds: string[],
    // 保留, 暫時沒有用到
    textIds?: {[key:string]: string}
}
