import { BattleBonus, CardText } from "./CardText";

export type GlobalEffectTitle =
    | ["合計国力＋(１)してプレイできる", number]
    | ["合計国力＋(１)", number]
    | ["AddText", CardText]
    | ["自軍Gとしてロール"]
    | ["＋x／＋x／＋xを得る", BattleBonus]

export type GlobalEffect = {
    title: GlobalEffectTitle,
    cardIds: string[],
}
