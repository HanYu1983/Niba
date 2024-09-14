import { BattleBonus, Text } from "./Text";

export type GlobalEffectAddText = {
    type: "AddText",
    cardIds: string[],
    text: Text
}

export type GlobalEffectRollAsG = {
    type: "自軍Gとしてロール",
    cardIds: string[],
}

export type GlobalEffectBattleBonus = {
    type: "＋x／＋x／＋xを得る",
    cardIds: string[],
    value: BattleBonus,
}

export type GlobalEffect = GlobalEffectAddText | GlobalEffectRollAsG | GlobalEffectBattleBonus;
